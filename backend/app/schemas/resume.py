from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict


class ResumeOut(BaseModel):
    id: int
    student_id: int
    version_no: int

    candidate_name: str | None = None
    summary: str | None = None
    cgpa: float | None = None
    branch: str | None = None

    skills: list[str] | None = None
    projects: Any | None = None
    certificates: Any | None = None
    education: Any | None = None

    parsed_at: datetime | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)