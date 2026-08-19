from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict


class AnalysisResultOut(BaseModel):
    id: int
    resume_id: int
    jd_id: int

    overall_score: float
    must_have_match_pct: float
    nice_to_have_match_pct: float

    matched_skills: list[str] | None = None
    missing_must_have_skills: list[str] | None = None
    missing_nice_to_have_skills: list[str] | None = None

    eligibility_status: str
    eligibility_reasons: Any | None = None

    suggestions: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AnalysisResultWithResumeOut(AnalysisResultOut):
    resume_summary: str | None = None