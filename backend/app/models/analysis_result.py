from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Text,
    DateTime,
    ForeignKey,
    JSON,
    func,
)
from sqlalchemy.orm import relationship

from app.db.base import Base


class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    resume_id = Column(
        Integer,
        ForeignKey("resumes.id"),
        nullable=False,
    )

    jd_id = Column(
        Integer,
        ForeignKey("jds.id"),
        nullable=False,
    )

    overall_score = Column(
        Float,
        nullable=False,
    )

    must_have_match_pct = Column(
        Float,
        nullable=False,
    )

    nice_to_have_match_pct = Column(
        Float,
        nullable=False,
    )

    matched_skills = Column(
        JSON,
        nullable=True,
    )

    missing_must_have_skills = Column(
        JSON,
        nullable=True,
    )

    missing_nice_to_have_skills = Column(
        JSON,
        nullable=True,
    )

    eligibility_status = Column(
        String,
        nullable=False,
    )

    eligibility_reasons = Column(
        JSON,
        nullable=True,
    )

    suggestions = Column(
        Text,
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    resume = relationship("Resume")
    jd = relationship("JD")