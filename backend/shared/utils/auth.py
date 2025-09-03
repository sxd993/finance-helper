import jwt
from datetime import datetime, timedelta
from fastapi import HTTPException, status, Request, Depends
from fastapi.security import HTTPBearer
from passlib.context import CryptContext
import os
from database import connect_to_db
import mysql.connector

security = HTTPBearer(auto_error=False)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24


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
        cursor.execute(
            "SELECT login, name, email, monthly_income FROM users WHERE login = %s",
            (login,),
        )
        user = cursor.fetchone()

        if not user:
            raise credentials_exception

        return {
            "login": user[0],
            "name": user[1],
            "email": user[2],
            "monthly_income": user[3],
        }

    except mysql.connector.Error as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error"
        )
    finally:
        if conn:
            cursor.close()
            conn.close()


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


def hash_password(password: str):
    return pwd_context.hash(password)
