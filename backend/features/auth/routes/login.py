from fastapi import APIRouter, HTTPException, Response
import mysql.connector
import os
from database import connect_to_db

from features.auth.models import LoginData, TokenResponse
from shared.utils.auth import create_token, verify_password

router = APIRouter()

@router.post("/login", response_model=TokenResponse)
def login(data: LoginData, response: Response):
    conn = None
    try:
        conn = connect_to_db()
        cursor = conn.cursor()
        cursor.execute("SELECT login, name, email, monthly_income, password_hash FROM users WHERE login = %s", (data.login,))
        user = cursor.fetchone()
        
        if not user or not verify_password(data.password, user[4]):  # password на 4-й позиции
            raise HTTPException(
                status_code=401,
                detail="Wrong login or password"
            )

        token = create_token(user[0])
        # Устанавливаем cookie с HttpOnly
        response.set_cookie(
            key="token",
            value=token,
            httponly=True,
            secure=os.getenv("ENV", "development") == "production",
            samesite="Strict",
            max_age=24 * 3600,
            path="/",
        )
        return {
            "token": token,
            "user": {
                "login": user[0], 
                "name": user[1],
                "email": user[2],
                "monthly_income": user[3]
            }
        }
        
    except mysql.connector.Error as e:
        raise HTTPException(
            status_code=500,
            detail="Database error"
        )
    finally:
        if conn:
            cursor.close()
            conn.close()