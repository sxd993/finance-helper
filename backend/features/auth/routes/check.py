from fastapi import APIRouter, Depends
from features.auth.models import UserResponse
from shared.utils.auth import get_current_user

router = APIRouter()

@router.get("/check", response_model=UserResponse)
def check_auth(current_user: dict = Depends(get_current_user)):
    """
    Проверяет валидность токена и возвращает данные текущего пользователя.
    """
    return current_user