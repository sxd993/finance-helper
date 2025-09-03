from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from features.auth.main import router as auth_router
from features.dashboard import router as dashboard_router
from features.transaction import router as transaction_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth")
app.include_router(dashboard_router, prefix="/api/dashboard")
app.include_router(transaction_router, prefix="/api/transaction")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
