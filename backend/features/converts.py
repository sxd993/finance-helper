from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from database import connect_to_db
from shared.utils.auth import get_current_user
import mysql.connector
from typing import List, Optional
from shared.utils.simple_periods import (
    check_and_update_expired_converts,
    create_convert_with_period,
)

router = APIRouter()


class Convert(BaseModel):
    id: int
    convert_type: str
    convert_name: str
    current_amount: float
    limit_amount: Optional[float] = None
    target_amount: Optional[float] = None
    one_transfer: Optional[float] = None
    next_transfer: Optional[str] = None
    period_start: Optional[str] = None
    period_end: Optional[str] = None
    is_complete: Optional[bool] = None


class ConvertsInfo(BaseModel):
    weekly_budget: float
    current_budget: float
    percentage: Optional[float] = None
    period_start: str
    period_end: str


@router.get("/converts", response_model=List[Convert])
def get_converts(current_user: dict = Depends(get_current_user)):
    """Получить все конверты пользователя"""
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

                # АВТОМАТИЧЕСКИ ОБНОВЛЯЕМ ИСТЕКШИЕ КОНВЕРТЫ
                update_result = check_and_update_expired_converts(user_id)

                # Получаем все конверты
                cursor.execute(
                    """
                    SELECT 
                        id, convert_type, convert_name, current_amount,
                        limit_amount, target_amount, one_transfer, next_transfer,
                        period_start, period_end, is_complete
                    FROM converts 
                    WHERE user_id = %s AND is_active = 1
                    ORDER BY 
                        CASE convert_type 
                            WHEN 'necessary' THEN 1
                            WHEN 'desire' THEN 2  
                            WHEN 'saving' THEN 3
                            WHEN 'investment' THEN 4
                        END,
                        convert_name
                """,
                    (user_id,),
                )

                converts = cursor.fetchall()

                # Форматируем даты для JSON
                for convert in converts:
                    if convert.get("period_start"):
                        convert["period_start"] = convert["period_start"].strftime(
                            "%Y-%m-%d"
                        )
                    if convert.get("period_end"):
                        convert["period_end"] = convert["period_end"].strftime(
                            "%Y-%m-%d"
                        )
                    if convert.get("next_transfer"):
                        convert["next_transfer"] = convert["next_transfer"].strftime(
                            "%Y-%m-%d"
                        )

                return converts

    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Ошибка БД: {str(e)}")


@router.get("/converts-info", response_model=ConvertsInfo)
def get_converts_info(current_user: dict = Depends(get_current_user)):
    """Получить общую информацию о конвертах для главной страницы"""
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

                # Считаем общую информацию по еженедельным конвертам
                cursor.execute(
                    """
                    SELECT 
                        COALESCE(SUM(limit_amount), 0) as weekly_budget,
                        COALESCE(SUM(current_amount), 0) as current_budget,
                        MIN(period_start) as period_start,
                        MAX(period_end) as period_end
                    FROM converts 
                    WHERE user_id = %s 
                    AND convert_type IN ('necessary', 'desire')
                    AND is_active = 1
                    AND limit_amount IS NOT NULL
                """,
                    (user_id,),
                )

                budget_data = cursor.fetchone()

                weekly_budget = float(budget_data["weekly_budget"] or 0)
                current_budget = float(budget_data["current_budget"] or 0)

                # Рассчитываем процент использования бюджета
                if weekly_budget > 0:
                    percentage = round((current_budget / weekly_budget) * 100, 1)
                else:
                    percentage = 0

                # Форматируем даты в русском формате
                import locale

                try:
                    locale.setlocale(locale.LC_TIME, "ru_RU.UTF-8")
                except:
                    pass  # Если русская локаль недоступна

                period_start = budget_data["period_start"]
                period_end = budget_data["period_end"]

                if period_start and period_end:
                    # Преобразуем в русский формат: "1 сентября"
                    months_ru = {
                        1: "января",
                        2: "февраля",
                        3: "марта",
                        4: "апреля",
                        5: "мая",
                        6: "июня",
                        7: "июля",
                        8: "августа",
                        9: "сентября",
                        10: "октября",
                        11: "ноября",
                        12: "декабря",
                    }

                    period_start_str = f"{period_start.day} {months_ru.get(period_start.month, 'сентября')}"
                    period_end_str = f"{period_end.day} {months_ru.get(period_end.month, 'сентября')}"
                else:
                    # Fallback на текущую неделю
                    from datetime import datetime, timedelta

                    now = datetime.now()
                    monday = now - timedelta(days=now.weekday())
                    sunday = monday + timedelta(days=6)

                    months_ru = {
                        1: "января",
                        2: "февраля",
                        3: "марта",
                        4: "апреля",
                        5: "мая",
                        6: "июня",
                        7: "июля",
                        8: "августа",
                        9: "сентября",
                        10: "октября",
                        11: "ноября",
                        12: "декабря",
                    }

                    period_start_str = (
                        f"{monday.day} {months_ru.get(monday.month, 'сентября')}"
                    )
                    period_end_str = (
                        f"{sunday.day} {months_ru.get(sunday.month, 'сентября')}"
                    )

                return {
                    "weekly_budget": weekly_budget,
                    "current_budget": current_budget,
                    "percentage": percentage,
                    "period_start": period_start_str,
                    "period_end": period_end_str,
                }

    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Ошибка БД: {str(e)}")
