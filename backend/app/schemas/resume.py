from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime


class ResumeOut(BaseModel):
    id: int
    student_id: int
    file_type: str
    version_no: int
    summary: Optional[str] = None
    skills: Optional[Any] = None
    projects: Optional[Any] = None
    certificates: Optional[Any] = None
    education: Optional[Any] = None
    parsed_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True