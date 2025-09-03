from pydantic import BaseModel

class LoginData(BaseModel):
    login: str
    password: str

class RegisterData(BaseModel):
    login: str
    name: str
    email: str
    monthly_income: float
    password: str

class TokenResponse(BaseModel):
    token: str
    user: dict

class UserResponse(BaseModel):
    login: str
    name: str
    email: str
    monthly_income: float
