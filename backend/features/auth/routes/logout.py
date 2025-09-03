from fastapi import APIRouter, Response

router = APIRouter()

@router.post("/logout")
def logout(response: Response):
    """
    Удаляет cookie с токеном.
    """
    response.delete_cookie(key="token", path="/")
    return {"message": "Successfully logged out"}