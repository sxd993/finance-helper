from fastapi import APIRouter
from .routes.login import router as login_router
from .routes.register import router as register_router
from .routes.check import router as check_router
from .routes.logout import router as logout_router

# Создаем главный router для аутентификации
router = APIRouter(prefix="", tags=["auth"])

# Включаем все дочерние роутеры
router.include_router(login_router)
router.include_router(register_router)
router.include_router(check_router)
router.include_router(logout_router)