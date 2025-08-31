from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, Field
from database import connect_to_db
from auth import get_current_user
import mysql.connector
from typing import List
import logging

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()


class CategorySummary(BaseModel):
    id: int
    name: str
    total: float


class Transaction(BaseModel):
    id: int
    amount: float
    category: str
    date: str


class ExpensesFullResponse(BaseModel):
    expenses: float
    categories: List[CategorySummary]


@router.get("/get-expenses", response_model=ExpensesFullResponse)
def get_expenses(current_user: dict = Depends(get_current_user)):
    try:
        with connect_to_db() as conn:
            with conn.cursor(dictionary=True) as cursor:
                # Получаем user_id
                cursor.execute(
                    "SELECT id FROM users WHERE login = %s", (current_user["login"],)
                )
                user_row = cursor.fetchone()
                if not user_row:
                    raise HTTPException(
                        status_code=404, detail="Пользователь не найден"
                    )
                user_id = user_row["id"]
                logger.info(f"User ID: {user_id}")

                # Сумма всех расходов (только type = 'expense')
                cursor.execute(
                    "SELECT COALESCE(SUM(amount), 0) AS total FROM transactions WHERE user_id = %s AND type = 'expense'",
                    (user_id,),
                )
                total_expenses = float(cursor.fetchone()["total"])
                logger.info(f"Total expenses: {total_expenses}")

                # Сумма по категориям: для категории 8 (Доход) только type = 'income', для остальных только type = 'expense'
                cursor.execute(
                    """
                    SELECT c.id AS id, c.name AS name,
                        COALESCE(SUM(
                            CASE 
                                WHEN c.id = 8 AND t.type = 'income' THEN t.amount
                                WHEN c.id != 8 AND t.type = 'expense' THEN t.amount
                                ELSE 0
                            END
                        ), 0) AS total
                    FROM categories c
                    LEFT JOIN transactions t ON t.category_id = c.id AND t.user_id = %s
                    GROUP BY c.id, c.name
                    """,
                    (user_id,),
                )
                categories = [
                    CategorySummary(
                        id=row["id"], name=row["name"], total=float(row["total"])
                    )
                    for row in cursor.fetchall()
                ]
                logger.info(f"Categories fetched: {categories}")

                return {
                    "expenses": total_expenses,
                    "categories": categories,
                }
    except mysql.connector.Error as e:
        logger.error(f"Database error in get_expenses: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка базы данных: {str(e)}")
    except Exception as e:
        logger.error(f"Server error in get_expenses: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка сервера: {str(e)}")


@router.get("/get-transactions", response_model=Transaction)
def get_transactions(current_user: dict = Depends(get_current_user)):
    try:
        with connect_to_db() as conn:
            with conn.cursor(dictionary=True) as cursor:
                # Получаем user_id
                cursor.execute(
                    "SELECT id FROM users WHERE login = %s", (current_user["login"],)
                )
                user_row = cursor.fetchone()
                if not user_row:
                    raise HTTPException(
                        status_code=404, detail="Пользователь не найден"
                    )
                user_id = user_row["id"]

                # Запрос всех транзакций пользователя
                cursor.execute(
                    """
                    SELECT t.id, t.amount, c.name AS category, t.date, t.description, t.type
                    FROM transactions t
                    JOIN categories c ON t.category_id = c.id
                    WHERE t.user_id = %s
                    ORDER BY t.id DESC
                    """,
                    (user_id,),
                )
                transaction = [
                    {
                        "id": row["id"],
                        "amount": float(row["amount"]),
                        "category": row["category"],
                        "date": (
                            row["date"].isoformat()
                            if hasattr(row["date"], "isoformat")
                            else str(row["date"])
                        ),
                        "description": row["description"],
                        "type": row["type"],
                    }
                    for row in cursor.fetchall()
                ]

                return {"transactions": transaction}
    except mysql.connector.Error as e:
        print(f"DB ERROR: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        print(f"GENERAL ERROR: {e}")
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")
