from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.db.base import Base


class Batch(Base):
    __tablename__ = "batches"

    id = Column(Integer, primary_key=True, index=True)
    faculty_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    jd_id = Column(Integer, ForeignKey("jds.id"), nullable=False)

    batch_name = Column(String, nullable=True)
    total_resumes = Column(Integer, nullable=False, default=0)
    status = Column(String, nullable=False, default="uploaded")  # "uploaded" | "processing" | "completed"

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    faculty = relationship("User")
    jd = relationship("JD")


class BatchResume(Base):
    __tablename__ = "batch_resumes"

    id = Column(Integer, primary_key=True, index=True)
    batch_id = Column(Integer, ForeignKey("batches.id"), nullable=False)
    resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=False)

    batch = relationship("Batch")
    resume = relationship("Resume")