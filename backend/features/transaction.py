from fastapi import APIRouter, Depends, HTTPException, Body
from pydantic import BaseModel, Field
from database import connect_to_db
from auth import get_current_user
import mysql.connector
from typing import List


class Transaction(BaseModel):
    id: int
    amount: float
    category: str
    date: str
    description: str
    type: str


class AddTransaction(BaseModel):
    amount: float
    category_id: int
    date: str
    description: str
    type: str


class TransactionsResponse(BaseModel):
    transactions: List[Transaction]


class IncomeData(BaseModel):
    amount: float = Field(..., gt=0)


router = APIRouter()


@router.put("/add-income")
def add_income(income: IncomeData, current_user: dict = Depends(get_current_user)):
    try:
        with connect_to_db() as conn:
            with conn.cursor() as cursor:
                # Увеличиваем доход
                cursor.execute(
                    "UPDATE users SET income = income + %s WHERE login = %s",
                    (income.amount, current_user["login"]),
                )
                if cursor.rowcount == 0:
                    raise HTTPException(
                        status_code=404, detail="Пользователь не найден"
                    )
                # Получаем user_id
                cursor.execute(
                    "SELECT id FROM users WHERE login = %s", (current_user["login"],)
                )
                user_row = cursor.fetchone()
                if not user_row:
                    raise HTTPException(
                        status_code=404, detail="Пользователь не найден"
                    )
                user_id = user_row[0] if isinstance(user_row, tuple) else user_row["id"]
                # Добавляем запись о доходе в transactions
                cursor.execute(
                    """
                    INSERT INTO transactions (user_id, amount, category_id, date, description, type)
                    VALUES (%s, %s, %s, NOW(), %s, %s)
                    """,
                    (
                        user_id,
                        income.amount,
                        8,  # id категории для дохода
                        "Пополнение дохода",
                        "income",
                    ),
                )
                conn.commit()
                return {"message": "Доход добавлен успешно"}
    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Ошибка базы данных: {str(e)}")


@router.get("/get-categories")
def get_categories():
    try:
        with connect_to_db() as conn:
            with conn.cursor(dictionary=True) as cursor:
                cursor.execute("SELECT id, name FROM categories")
                categories = cursor.fetchall()
                return categories
    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Ошибка базы данных: {str(e)}")


@router.put("/add-transaction", response_model=TransactionsResponse)
def add_transaction(
    transaction: AddTransaction, current_user: dict = Depends(get_current_user)
):
    try:
        with connect_to_db() as conn:
            with conn.cursor() as cursor:
                # Получаем user_id по login
                cursor.execute(
                    "SELECT id FROM users WHERE login = %s", (current_user["login"],)
                )
                user_row = cursor.fetchone()
                if not user_row:
                    raise HTTPException(
                        status_code=404, detail="Пользователь не найден"
                    )
                user_id = user_row[0] if isinstance(user_row, tuple) else user_row["id"]

                # Вставляем транзакцию
                cursor.execute(
                    "INSERT INTO transactions (user_id, amount, category_id, date, description, type) VALUES (%s, %s, %s, %s, %s, %s)",
                    (
                        user_id,
                        transaction.amount,
                        transaction.category_id,
                        transaction.date,
                        transaction.description,
                        transaction.type,
                    ),
                )
                # Если категория доход (8), увеличиваем users.income
                if transaction.category_id == 8:
                    cursor.execute(
                        "UPDATE users SET income = income + %s WHERE id = %s",
                        (transaction.amount, user_id),
                    )
                conn.commit()
                # Получаем все транзакции пользователя
                cursor.execute(
                    "SELECT t.id, t.amount, c.name AS category, t.date, t.description, t.type FROM transactions t JOIN categories c ON t.category_id = c.id WHERE t.user_id = %s ORDER BY t.id DESC",
                    (user_id,),
                )
                transactions = [
                    {
                        "id": row[0],
                        "amount": float(row[1]),
                        "category": row[2],  # теперь это строка-имя
                        "date": str(row[3]),
                        "description": row[4],
                        "type": row[5],
                    }
                    for row in cursor.fetchall()
                ]
                return {"transactions": transactions}
    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Ошибка базы данных: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка сервера: {str(e)}")


@router.get("/get-transactions", response_model=TransactionsResponse)
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

                # Все сделки пользователя (транзакции)
                cursor.execute(
                    """
                    SELECT t.id, t.amount, c.name AS category, t.date, t.description, t.type
                    FROM transactions t
                    JOIN categories c ON t.category_id = c.id
                    WHERE t.user_id = %s
                    ORDER BY t.date DESC
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
