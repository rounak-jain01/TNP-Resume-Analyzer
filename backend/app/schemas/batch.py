from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class BatchOut(BaseModel):
    id: int
    faculty_id: int
    jd_id: int
    batch_name: Optional[str] = None
    total_resumes: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class BatchDetailOut(BatchOut):
    resume_ids: List[int] = []