import os
import re
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.resume import Resume
from app.services.llm_service import analyze_resume
from app.services.skill_normalizer import normalize_skill_list
from datetime import datetime, timezone

# Two resumes are considered the "same person" if the candidate name matches
# AND at least this fraction of their (normalized) skills overlap.
# Tune this if you get false positives/negatives:
#   - raise it (e.g. 0.7) if unrelated people with similar names+skills get merged
#   - lower it (e.g. 0.3) if the same person's updated resume isn't being caught
DUPLICATE_SKILL_SIMILARITY_THRESHOLD = 0.5


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


def _normalize_name(name: str | None) -> str:
    if not name:
        return ""
    return re.sub(r"\s+", " ", name.strip().lower())


def _delete_file_if_exists(path: str | None):
    if path and os.path.exists(path):
        try:
            os.remove(path)
        except OSError:
            pass


def find_duplicate_resume(
    db: Session, candidate_name: str | None, skills: list | None, exclude_resume_id: int
) -> Resume | None:
    """
    Looks for an existing resume belonging to the same person.

    There's no reliable foreign key to a real student account in the
    faculty batch-upload flow, so identity is inferred from the LLM-parsed
    candidate name plus how similar the skill set is (Jaccard similarity on
    normalized skills). Returns the best-matching existing Resume, or None.
    """
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

    incoming_skills = normalize_skill_list(skills or [])

    best_match, best_score = None, -1.0
    for candidate in candidates:
        existing_skills = normalize_skill_list(candidate.skills or [])
        union = incoming_skills | existing_skills
        # If neither resume has any parsed skills, fall back to a pure name match.
        score = (len(incoming_skills & existing_skills) / len(union)) if union else 1.0
        if score > best_score:
            best_score, best_match = score, candidate

    return best_match if best_score >= DUPLICATE_SKILL_SIMILARITY_THRESHOLD else None


def parse_and_save_resume(db: Session, resume: Resume) -> Resume:
    """
    Parses the resume via the LLM. If it belongs to someone who already has
    a resume on file (same name + similar skills), the existing record is
    updated in place (new file, new parsed data, version bumped) and this
    placeholder row is discarded — otherwise this row is saved normally.

    Returns the Resume row that should be used downstream (batch linking,
    scoring, etc.) — this may NOT be the same row that was passed in.
    """
    parsed = analyze_resume(resume.raw_text)

    duplicate = find_duplicate_resume(
        db,
        candidate_name=parsed.get("candidate_name"),
        skills=parsed.get("skills"),
        exclude_resume_id=resume.id,
    )

    if duplicate:
        old_file_path = duplicate.raw_file_path

        duplicate.raw_file_path = resume.raw_file_path
        duplicate.file_type = resume.file_type
        duplicate.raw_text = resume.raw_text
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

        db.delete(resume)  # discard the placeholder row created for this upload
        db.commit()
        db.refresh(duplicate)

        _delete_file_if_exists(old_file_path)  # old file is now superseded

        return duplicate

    # No existing record for this person — save normally
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