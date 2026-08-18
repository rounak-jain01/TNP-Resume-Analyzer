from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime


class JDOut(BaseModel):
    id: int
    uploaded_by_id: int
    company_name: Optional[str] = None
    role_title: Optional[str] = None
    file_type: str
    source: str
    must_have_skills: Optional[Any] = None
    nice_to_have_skills: Optional[Any] = None
    eligibility_criteria: Optional[Any] = None
    parsed_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True