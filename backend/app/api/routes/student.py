import os

from fastapi import APIRouter, Depends, UploadFile, File
from app.api.deps import require_role
from app.db.session import get_db
from app.models.user import User
from app.services.extraction_service import extract_text
from app.services.file_service import save_temp_file
from app.services.llm_service import analyze_jd, analyze_resume
from app.services.matching_service import analyze_match


router = APIRouter(
    prefix="/student",
    tags=["Student"],
)


class TempResume:
    def __init__(
        self,
        skills,
        education,
        cgpa=None,
        branch=None,
    ):
        self.skills = skills or []
        self.education = education or []
        self.cgpa = cgpa
        self.branch = branch


class TempJD:
    def __init__(
        self,
        must_have_skills,
        nice_to_have_skills,
        eligibility_criteria,
    ):
        self.must_have_skills = must_have_skills or []
        self.nice_to_have_skills = nice_to_have_skills or []
        self.eligibility_criteria = eligibility_criteria


def _delete_temp_file(path: str) -> None:
    if path and os.path.exists(path):
        try:
            os.remove(path)
        except OSError:
            pass


@router.post("/analyze")
def analyze(
    resume_file: UploadFile = File(...),
    jd_file: UploadFile = File(...),
    current_user: User = Depends(
        require_role("student")
    ),
):
    resume_path, resume_type = save_temp_file(
        resume_file
    )

    jd_path, jd_type = save_temp_file(
        jd_file
    )

    try:
        resume_text = extract_text(
            resume_path,
            resume_type,
        )

        jd_text = extract_text(
            jd_path,
            jd_type,
        )

        parsed_resume = analyze_resume(
            resume_text
        )

        parsed_jd = analyze_jd(
            jd_text
        )

        temp_resume = TempResume(
            skills=parsed_resume.get("skills"),
            education=parsed_resume.get("education"),
            cgpa=parsed_resume.get("cgpa"),
            branch=parsed_resume.get("branch"),
        )

        temp_jd = TempJD(
            must_have_skills=parsed_jd.get(
                "must_have_skills"
            ),
            nice_to_have_skills=parsed_jd.get(
                "nice_to_have_skills"
            ),
            eligibility_criteria=parsed_jd.get(
                "eligibility_criteria"
            ),
        )

        match_result = analyze_match(
            temp_resume,
            temp_jd,
        )

        return {
            "resume_summary": parsed_resume.get(
                "summary"
            ),
            "jd_company": parsed_jd.get(
                "company_name"
            ),
            "jd_role": parsed_jd.get(
                "role_title"
            ),
            **match_result,
        }

    finally:
        _delete_temp_file(resume_path)
        _delete_temp_file(jd_path)