from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime


class AnalysisResultOut(BaseModel):
    id: int
    resume_id: int
    jd_id: int
    overall_score: float
    must_have_match_pct: float
    nice_to_have_match_pct: float
    matched_skills: Optional[Any] = None
    missing_must_have_skills: Optional[Any] = None
    missing_nice_to_have_skills: Optional[Any] = None
    eligibility_status: str
    eligibility_reasons: Optional[Any] = None
    suggestions: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class AnalysisResultWithResumeOut(AnalysisResultOut):
    resume_summary: Optional[str] = None