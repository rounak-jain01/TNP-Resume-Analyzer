from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON, func
from sqlalchemy.orm import relationship
from app.db.base import Base


class JD(Base):
    __tablename__ = "jds"

    id = Column(Integer, primary_key=True, index=True)
    uploaded_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    company_name = Column(String, nullable=True)
    role_title = Column(String, nullable=True)

    raw_file_path = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    raw_text = Column(Text, nullable=True)

    must_have_skills = Column(JSON, nullable=True)
    nice_to_have_skills = Column(JSON, nullable=True)
    soft_skills_mentioned = Column(JSON, nullable=True)   # ← naya
    eligibility_criteria = Column(JSON, nullable=True)

    source = Column(String, nullable=False, default="faculty_upload")

    parsed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    uploaded_by = relationship("User")