from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class BatchOut(BaseModel):
    id: int
    faculty_id: int
    jd_id: int

    batch_name: str | None = None
    total_resumes: int
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class BatchDetailOut(BatchOut):
    resume_ids: list[int] = Field(default_factory=list)