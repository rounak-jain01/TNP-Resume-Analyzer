from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str
    branch: str | None = None
    cgpa: str | None = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    branch: str | None = None
    cgpa: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class FacultyCreate(BaseModel):
    name: str
    email: EmailStr
    password: str