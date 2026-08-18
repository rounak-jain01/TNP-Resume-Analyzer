from sqlalchemy.orm import Session
from app.models.jd import JD
from app.services.llm_service import analyze_jd
from datetime import datetime, timezone


def create_jd(db: Session, uploaded_by_id: int, file_path: str, file_type: str, source: str) -> JD:
    jd = JD(
        uploaded_by_id=uploaded_by_id,
        raw_file_path=file_path,
        file_type=file_type,
        source=source,
    )
    db.add(jd)
    db.commit()
    db.refresh(jd)
    return jd

def parse_and_save_jd(db: Session, jd: JD):
    parsed = analyze_jd(jd.raw_text)

    jd.company_name = parsed.get("company_name")
    jd.role_title = parsed.get("role_title")
    jd.must_have_skills = parsed.get("must_have_skills")
    jd.nice_to_have_skills = parsed.get("nice_to_have_skills")
    jd.soft_skills_mentioned = parsed.get("soft_skills_mentioned")   # ← naya
    jd.eligibility_criteria = parsed.get("eligibility_criteria")
    jd.parsed_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(jd)
    return jd