from fastapi import APIRouter, HTTPException, Response
import mysql.connector
import os
from database import connect_to_db
from features.auth.models import RegisterData, TokenResponse
from shared.utils.auth import create_token, hash_password

router = APIRouter()

@router.post("/register", response_model=TokenResponse)
def register(data: RegisterData, response: Response):
    conn = None
    try:
        conn = connect_to_db()
        cursor = conn.cursor()
        
        cursor.execute("SELECT login FROM users WHERE login = %s", (data.login,))
        if cursor.fetchone():
            raise HTTPException(
                status_code=400,
                detail="Login already exists"
            )

        hashed_password = hash_password(data.password)
        cursor.execute(
            "INSERT INTO users (login, name, email, monthly_income, password_hash) VALUES (%s, %s, %s, %s, %s)",
            (data.login, data.name, data.email, data.monthly_income, hashed_password)
        )
        conn.commit()

        token = create_token(data.login)
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
                "login": data.login, 
                "name": data.name,
                "email": data.email,
                "monthly_income": data.monthly_income
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