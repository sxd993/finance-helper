from datetime import datetime, timedelta
import mysql.connector
from database import connect_to_db


def get_current_week():
    """Получить начало и конец текущей недели"""
    today = datetime.now().date()
    monday = today - timedelta(days=today.weekday())
    sunday = monday + timedelta(days=6)
    return {"start": monday, "end": sunday}


def check_and_update_expired_converts(user_id: int = None):
    """
    Простая функция: проверяет истекшие конверты и обновляет их
    Можно вызывать при каждом запросе или по расписанию
    """
    try:
        with connect_to_db() as conn:
            with conn.cursor(dictionary=True) as cursor:
                current_week = get_current_week()

                # Строим WHERE условие
                where_clause = "WHERE convert_type IN ('necessary', 'desire') AND limit_amount IS NOT NULL AND is_active = 1"
                params = []

                if user_id:
                    where_clause += " AND user_id = %s"
                    params.append(user_id)

                where_clause += " AND (period_end IS NULL OR period_end < CURDATE())"

                # Обновляем истекшие конверты
                update_query = f"""
                    UPDATE converts 
                    SET 
                        current_amount = limit_amount,
                        period_start = %s,
                        period_end = %s,
                        updated_at = NOW()
                    {where_clause}
                """

                cursor.execute(
                    update_query, [current_week["start"], current_week["end"]] + params
                )
                updated_count = cursor.rowcount

                conn.commit()

                return {
                    "updated_converts": updated_count,
                    "current_period": current_week,
                }

    except mysql.connector.Error as e:
        print(f"Ошибка обновления конвертов: {e}")
        return {"updated_converts": 0, "error": str(e)}


def create_convert_with_period(user_id: int, convert_data: dict):
    """Создает конверт с правильным периодом"""
    current_week = get_current_week()

    # Если это еженедельный конверт - устанавливаем период
    if convert_data.get("convert_type") in ["necessary", "desire"]:
        # Пропорциональное пополнение для нового конверта
        days_left = (current_week["end"] - datetime.now().date()).days + 1
        weekly_limit = convert_data.get("limit_amount", 0)
        current_amount = (weekly_limit / 7) * days_left

        convert_data.update(
            {
                "current_amount": round(current_amount, 2),
                "period_start": current_week["start"],
                "period_end": current_week["end"],
            }
        )

    return convert_data
