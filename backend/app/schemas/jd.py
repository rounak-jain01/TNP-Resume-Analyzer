from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict


class JDOut(BaseModel):
    id: int
    uploaded_by_id: int

    company_name: str | None = None
    role_title: str | None = None

    must_have_skills: list[str] | None = None
    nice_to_have_skills: list[str] | None = None
    soft_skills_mentioned: list[str] | None = None
    eligibility_criteria: Any | None = None

    source: str
    parsed_at: datetime | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)