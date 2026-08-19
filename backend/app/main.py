from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.api.routes import auth, admin, student, faculty


app = FastAPI(
    title="Placement Resume Analyzer API"
)


# CORS configuration
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "https://tnp-resume-analyzer.vercel.app",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(student.router)
app.include_router(faculty.router)


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "message": "Backend is running",
    }


@app.get("/health/db")
def health_check_db(
    db: Session = Depends(get_db),
):
    result = db.execute(
        text("SELECT 1")
    )

    return {
        "status": "ok",
        "message": "Database connected",
        "result": result.scalar(),
    }