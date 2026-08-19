import re
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.resume import Resume
from app.services.llm_service import analyze_resume
from app.services.skill_normalizer import normalize_skill_list
from datetime import datetime, timezone


DUPLICATE_SKILL_SIMILARITY_THRESHOLD = 0.5


def get_latest_version_no(db: Session, student_id: int) -> int:
    latest = (
        db.query(Resume)
        .filter(Resume.student_id == student_id)
        .order_by(Resume.version_no.desc())
        .first()
    )
    return latest.version_no + 1 if latest else 1


def create_resume(db: Session, student_id: int) -> Resume:
    version_no = get_latest_version_no(db, student_id)

    resume = Resume(
        student_id=student_id,
        version_no=version_no,
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)

    return resume


def _normalize_name(name: str | None) -> str:
    if not name:
        return ""

    return re.sub(
        r"\s+",
        " ",
        name.strip().lower()
    )


def find_duplicate_resume(
    db: Session,
    candidate_name: str | None,
    skills: list | None,
    exclude_resume_id: int,
) -> Resume | None:

    norm_name = _normalize_name(candidate_name)

    if not norm_name:
        return None

    candidates = (
        db.query(Resume)
        .filter(
            Resume.id != exclude_resume_id,
            func.lower(func.trim(Resume.candidate_name)) == norm_name,
        )
        .all()
    )

    if not candidates:
        return None

    incoming_skills = normalize_skill_list(
        skills or []
    )

    best_match = None
    best_score = -1.0

    for candidate in candidates:

        existing_skills = normalize_skill_list(
            candidate.skills or []
        )

        union = incoming_skills | existing_skills

        score = (
            len(incoming_skills & existing_skills) / len(union)
            if union
            else 1.0
        )

        if score > best_score:
            best_score = score
            best_match = candidate

    return (
        best_match
        if best_score >= DUPLICATE_SKILL_SIMILARITY_THRESHOLD
        else None
    )


def parse_and_save_resume(
    db: Session,
    resume: Resume,
    raw_text: str,
) -> Resume:

    parsed = analyze_resume(raw_text)

    duplicate = find_duplicate_resume(
        db,
        candidate_name=parsed.get("candidate_name"),
        skills=parsed.get("skills"),
        exclude_resume_id=resume.id,
    )

    if duplicate:

        duplicate.candidate_name = parsed.get("candidate_name")
        duplicate.summary = parsed.get("summary")
        duplicate.cgpa = parsed.get("cgpa")
        duplicate.branch = parsed.get("branch")
        duplicate.skills = parsed.get("skills")
        duplicate.projects = parsed.get("projects")
        duplicate.certificates = parsed.get("certificates")
        duplicate.education = parsed.get("education")
        duplicate.parsed_at = datetime.now(timezone.utc)

        duplicate.version_no += 1

        db.delete(resume)
        db.commit()
        db.refresh(duplicate)

        return duplicate

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