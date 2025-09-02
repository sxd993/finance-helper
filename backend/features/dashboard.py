from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, Field
from database import connect_to_db
from features.auth import get_current_user
import mysql.connector
from typing import List
import logging

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()


class BalanceResponse(BaseModel):
    income: float
    expenses: float
    balance: float


@router.get("/get-balance", response_model=BalanceResponse)
def get_balance(current_user: dict = Depends(get_current_user)):
    try:
        with connect_to_db() as conn:
            with conn.cursor(dictionary=True) as cursor:
                # Получаем user_id и income из таблицы users
                cursor.execute(
                    "SELECT id, income FROM users WHERE login = %s",
                    (current_user["login"],),
                )
                user_row = cursor.fetchone()
                if not user_row:
                    raise HTTPException(
                        status_code=404, detail="Пользователь не найден"
                    )

                user_id = user_row["id"]
                user_income = float(user_row["income"] or 0)
                logger.info(f"User ID: {user_id}, Income: {user_income}")

                # Сумма всех доходов (type = 'income')
                cursor.execute(
                    "SELECT COALESCE(SUM(amount), 0) AS total_income FROM transactions WHERE user_id = %s AND type = 'income'",
                    (user_id,),
                )
                total_income = float(cursor.fetchone()["total_income"])
                logger.info(f"Total income from transactions: {total_income}")

                # Сумма всех расходов (type = 'expense')
                cursor.execute(
                    "SELECT COALESCE(SUM(amount), 0) AS total_expenses FROM transactions WHERE user_id = %s AND type = 'expense'",
                    (user_id,),
                )
                total_expenses = float(cursor.fetchone()["total_expenses"])
                logger.info(f"Total expenses: {total_expenses}")

                # Рассчитываем баланс
                balance = (user_income + total_income) - total_expenses
                logger.info(f"Calculated balance: {balance}")

                return {
                    "income": user_income,
                    "expenses": total_expenses,
                    "balance": balance,
                }

    except mysql.connector.Error as e:
        logger.error(f"Database error in get_balance: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка базы данных: {str(e)}")
    except Exception as e:
        logger.error(f"Server error in get_balance: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка сервера: {str(e)}")



@router.get("/get-expenses-by-categories")
def get_expenses_by_categories(current_user: dict = Depends(get_current_user)):
    try:
        with connect_to_db() as conn:
            with conn.cursor(dictionary=True) as cursor:
                # Получаем user_id
                cursor.execute(
                    "SELECT id FROM users WHERE login = %s", 
                    (current_user["login"],)
                )
                user_row = cursor.fetchone()
                if not user_row:
                    raise HTTPException(
                        status_code=404, detail="Пользователь не найден"
                    )
                user_id = user_row["id"]
                
                # Получаем траты по категориям (только type = 'expense')
                cursor.execute("""
                    SELECT 
                        c.id as category_id,
                        c.name as category_name,
                        COALESCE(SUM(t.amount), 0) as total_amount,
                        COUNT(t.id) as transaction_count,
                        MAX(t.date) as last_transaction_date
                    FROM categories c
                    LEFT JOIN transactions t ON t.category_id = c.id 
                        AND t.user_id = %s 
                        AND t.type = 'expense'
                    GROUP BY c.id, c.name
                    ORDER BY total_amount DESC
                """, (user_id,))
                
                categories_expenses = cursor.fetchall()
                
                # Преобразуем Decimal в float и дату в строку для JSON сериализации
                for category in categories_expenses:
                    category['total_amount'] = float(category['total_amount'])
                    if category['last_transaction_date']:
                        category['last_transaction_date'] = category['last_transaction_date'].isoformat()
                
                return categories_expenses
                
    except mysql.connector.Error as e:
        logger.error(f"Database error in get_expenses_by_categories: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка базы данных: {str(e)}")
    except Exception as e:
        logger.error(f"Server error in get_expenses_by_categories: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка сервера: {str(e)}")