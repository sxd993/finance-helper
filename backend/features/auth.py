# auth.py
from fastapi import APIRouter, HTTPException, Depends, status, Request, Response
from fastapi.security import HTTPBearer
from pydantic import BaseModel
from database import connect_to_db
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta
import mysql.connector
import os

router = APIRouter()
security = HTTPBearer(auto_error=False)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

class LoginData(BaseModel):
    login: str
    password: str

class RegisterData(BaseModel):
    login: str
    name: str
    password: str

class TokenResponse(BaseModel):
    token: str
    user: dict

class UserResponse(BaseModel):
    login: str
    name: str
    income: float

def create_token(login: str):
    expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode = {"sub": login, "exp": expire}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(request: Request, token=Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Сначала проверяем Authorization header
    auth_token = None
    if token:
        auth_token = token.credentials
    
    # Если токена нет в header, проверяем cookies
    if not auth_token:
        auth_token = request.cookies.get("token")
    
    if not auth_token:
        raise credentials_exception
    
    try:
        payload = jwt.decode(auth_token, SECRET_KEY, algorithms=[ALGORITHM])
        login: str = payload.get("sub")
        if login is None:
            raise credentials_exception
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:
        raise credentials_exception

    # Получаем данные пользователя из БД
    conn = None
    try:
        conn = connect_to_db()
        cursor = conn.cursor()
        cursor.execute("SELECT login, name, income FROM users WHERE login = %s", (login,))
        user = cursor.fetchone()
        
        if not user:
            raise credentials_exception
            
        return {"login": user[0], "name": user[1], "income": user[2]}
        
    except mysql.connector.Error as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error"
        )
    finally:
        if conn:
            cursor.close()
            conn.close()

@router.post("/login", response_model=TokenResponse)
def login(data: LoginData, response: Response):
    conn = None
    try:
        conn = connect_to_db()
        cursor = conn.cursor()
        cursor.execute("SELECT login, name, password FROM users WHERE login = %s", (data.login,))
        user = cursor.fetchone()
        
        if not user or not pwd_context.verify(data.password, user[2]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Wrong login or password"
            )

        token = create_token(user[0])
        # Устанавливаем cookie с HttpOnly
        response.set_cookie(
            key="token",
            value=token,
            httponly=True,
            secure=os.getenv("ENV", "development") == "production",  # Secure только в продакшене
            samesite="Strict",  # Защита от CSRF
            max_age=ACCESS_TOKEN_EXPIRE_HOURS * 3600,  # Время жизни в секундах
            path="/",
        )
        return {
            "token": token,  # Оставляем для совместимости
            "user": {"login": user[0], "name": user[1]}
        }
        
    except mysql.connector.Error as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error"
        )
    finally:
        if conn:
            cursor.close()
            conn.close()

@router.post("/register", response_model=TokenResponse)
def register(data: RegisterData, response: Response):
    conn = None
    try:
        conn = connect_to_db()
        cursor = conn.cursor()
        
        cursor.execute("SELECT login FROM users WHERE login = %s", (data.login,))
        if cursor.fetchone():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Login already exists"
            )

        hashed_password = pwd_context.hash(data.password)
        cursor.execute(
            "INSERT INTO users (login, name, password) VALUES (%s, %s, %s)",
            (data.login, data.name, hashed_password)
        )
        conn.commit()

        token = create_token(data.login)
        # Устанавливаем cookie с HttpOnly
        response.set_cookie(
            key="token",
            value=token,
            httponly=True,
            secure=os.getenv("ENV", "development") == "production",
            samesite="Strict",
            max_age=ACCESS_TOKEN_EXPIRE_HOURS * 3600,
            path="/",
        )
        return {
            "token": token,  # Оставляем для совместимости
            "user": {"login": data.login, "name": data.name}
        }
        
    except mysql.connector.Error as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error"
        )
    finally:
        if conn:
            cursor.close()
            conn.close()

@router.get("/check", response_model=UserResponse)
def check_auth(current_user: dict = Depends(get_current_user)):
    """
    Проверяет валидность токена из Authorization header или cookies
    и возвращает данные текущего пользователя.
    """
    return current_user

@router.post("/logout")
def logout(response: Response):
    """
    Удаляет cookie с токеном.
    """
    response.delete_cookie(key="token", path="/")
    return {"message": "Successfully logged out"}