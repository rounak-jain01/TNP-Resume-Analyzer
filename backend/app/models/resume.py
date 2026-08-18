from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON, func
from sqlalchemy.orm import relationship
from app.db.base import Base
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON, Float, func


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    raw_file_path = Column(String, nullable=False)
    file_type = Column(String, nullable=False)   # "pdf" | "docx"
    raw_text = Column(Text, nullable=True)

    version_no = Column(Integer, nullable=False, default=1)

    summary = Column(Text, nullable=True)
    skills = Column(JSON, nullable=True)          # normalized skills list
    projects = Column(JSON, nullable=True)
    certificates = Column(JSON, nullable=True)
    education = Column(JSON, nullable=True)
    cgpa = Column(Float, nullable=True)
    branch = Column(String, nullable=True)
    candidate_name = Column(String, nullable=True)

    parsed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    student = relationship("User")