from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# ---- Request Schemas ----

class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str
    branch: Optional[str] = None
    cgpa: Optional[str] = None
    # role yaha nahi liya — student signup hamesha role="student" hoga (Step 24 mein enforce karenge)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


# ---- Response Schemas ----

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    branch: Optional[str] = None
    cgpa: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True  # SQLAlchemy model se directly convert karne ke liye


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class FacultyCreate(BaseModel):
    name: str
    email: EmailStr
    password: str