from sqlalchemy.orm import Session
from app.models.analysis_result import AnalysisResult
from app.models.resume import Resume
from app.models.jd import JD
from app.services.matching_service import analyze_match


def create_analysis_result(db: Session, resume: Resume, jd: JD) -> AnalysisResult:
    result_data = analyze_match(resume, jd)

    analysis = AnalysisResult(
        resume_id=resume.id,
        jd_id=jd.id,
        overall_score=result_data["overall_score"],
        must_have_match_pct=result_data["must_have_match_pct"],
        nice_to_have_match_pct=result_data["nice_to_have_match_pct"],
        matched_skills=result_data["matched_skills"],
        missing_must_have_skills=result_data["missing_must_have_skills"],
        missing_nice_to_have_skills=result_data["missing_nice_to_have_skills"],
        eligibility_status=result_data["eligibility_status"],
        eligibility_reasons=result_data["eligibility_reasons"],
        suggestions=result_data["suggestions"],
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    return analysis