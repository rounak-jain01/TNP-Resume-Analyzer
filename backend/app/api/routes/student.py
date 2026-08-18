from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
import os

from app.db.session import get_db
from app.api.deps import require_role
from app.services.file_service import save_upload_file
from app.services.extraction_service import extract_text
from app.services.llm_service import analyze_resume, analyze_jd
from app.services.matching_service import analyze_match
from app.models.user import User

router = APIRouter(prefix="/student", tags=["Student"])


class TempResume:
    def __init__(self, skills, education, cgpa=None, branch=None):
        self.skills = skills
        self.education = education
        self.cgpa = cgpa
        self.branch = branch


class TempJD:
    """Lightweight stand-in for a JD object, used only for in-memory analysis."""
    def __init__(self, must_have_skills, nice_to_have_skills, eligibility_criteria):
        self.must_have_skills = must_have_skills
        self.nice_to_have_skills = nice_to_have_skills
        self.eligibility_criteria = eligibility_criteria


@router.post("/analyze")
def analyze(
    resume_file: UploadFile = File(...),
    jd_file: UploadFile = File(...),
    current_user: User = Depends(require_role("student")),
):
    resume_path, resume_type = save_upload_file(resume_file, subfolder="temp")
    jd_path, jd_type = save_upload_file(jd_file, subfolder="temp")

    try:
        resume_text = extract_text(resume_path, resume_type)
        jd_text = extract_text(jd_path, jd_type)

        parsed_resume = analyze_resume(resume_text)
        parsed_jd = analyze_jd(jd_text)

        temp_resume = TempResume(
            skills=parsed_resume.get("skills"),
            education=parsed_resume.get("education"),
            cgpa=parsed_resume.get("cgpa"),        # ← ye do lines naye add karo
            branch=parsed_resume.get("branch"),    # ← 
        )
        temp_jd = TempJD(
            must_have_skills=parsed_jd.get("must_have_skills"),
            nice_to_have_skills=parsed_jd.get("nice_to_have_skills"),
            eligibility_criteria=parsed_jd.get("eligibility_criteria"),
        )

        match_result = analyze_match(temp_resume, temp_jd)

        return {
            "resume_summary": parsed_resume.get("summary"),
            "jd_company": parsed_jd.get("company_name"),
            "jd_role": parsed_jd.get("role_title"),
            **match_result,
        }
    finally:
        if os.path.exists(resume_path):
            os.remove(resume_path)
        if os.path.exists(jd_path):
            os.remove(jd_path)