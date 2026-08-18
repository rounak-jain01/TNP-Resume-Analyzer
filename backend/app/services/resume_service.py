from sqlalchemy.orm import Session
from app.models.resume import Resume
from app.services.llm_service import analyze_resume
from datetime import datetime, timezone


def get_latest_version_no(db: Session, student_id: int) -> int:
    latest = (
        db.query(Resume)
        .filter(Resume.student_id == student_id)
        .order_by(Resume.version_no.desc())
        .first()
    )
    return latest.version_no + 1 if latest else 1


def create_resume(db: Session, student_id: int, file_path: str, file_type: str) -> Resume:
    version_no = get_latest_version_no(db, student_id)
    resume = Resume(
        student_id=student_id,
        raw_file_path=file_path,
        file_type=file_type,
        version_no=version_no,
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume

def parse_and_save_resume(db: Session, resume: Resume):
    parsed = analyze_resume(resume.raw_text)
    resume.candidate_name = parsed.get("candidate_name")
    resume.summary = parsed.get("summary")
    resume.cgpa = parsed.get("cgpa")
    resume.branch = parsed.get("branch")
    resume.skills = parsed.get("skills")
    resume.projects = parsed.get("projects")
    resume.certificates = parsed.get("certificates")
    resume.education = parsed.get("education")
    resume.parsed_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(resume)
    return resume