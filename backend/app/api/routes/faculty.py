from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.jd import JD
from app.services.batch_service import (
    get_faculty_batches,
    get_batch_by_id,
    get_batch_results,
    delete_batch,
)
from app.db.session import get_db
from app.api.deps import require_role
from app.schemas.jd import JDOut
from app.schemas.batch import BatchOut
from app.services.file_service import save_upload_file
from app.services.jd_service import create_jd
from app.services.resume_service import create_resume
from app.services.batch_service import create_batch, add_resume_to_batch, finalize_batch
from app.models.user import User
from app.services.extraction_service import extract_text
from app.services.jd_service import create_jd, parse_and_save_jd
from app.services.resume_service import create_resume, parse_and_save_resume
from app.services.analysis_result_service import create_analysis_result
from app.services.batch_service import get_faculty_batches, get_batch_by_id, get_batch_results
from app.models.resume import Resume
from app.services.batch_service import get_batch_insights
from app.services.batch_service import increment_batch_total


router = APIRouter(prefix="/faculty", tags=["Faculty"])

MAX_BATCH_SIZE = 30


@router.post("/jd/upload", response_model=JDOut, status_code=201)
def upload_jd(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("faculty")),
):
    file_path, file_type = save_upload_file(file, subfolder="jds")
    raw_text = extract_text(file_path, file_type)

    jd = create_jd(db, current_user.id, file_path, file_type, source="faculty_upload")
    jd.raw_text = raw_text
    db.commit()
    db.refresh(jd)

    jd = parse_and_save_jd(db, jd)
    return jd


@router.post("/batch/upload", response_model=BatchOut, status_code=201)
def upload_batch(
    jd_id: int = Form(...),
    batch_name: Optional[str] = Form(None),
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("faculty")),
):
    if len(files) == 0:
        raise HTTPException(status_code=400, detail="At least 1 resume is required")
    if len(files) > MAX_BATCH_SIZE:
        raise HTTPException(status_code=400, detail=f"Maximum {MAX_BATCH_SIZE} resumes allowed per batch")

    jd = db.query(JD).filter(JD.id == jd_id).first()
    if not jd:
        raise HTTPException(status_code=404, detail="JD not found")

    batch = create_batch(db, current_user.id, jd_id, batch_name)

    for file in files:
        file_path, file_type = save_upload_file(file, subfolder="resumes")
        raw_text = extract_text(file_path, file_type)

        resume = create_resume(db, current_user.id, file_path, file_type)
        resume.raw_text = raw_text
        db.commit()
        db.refresh(resume)

        resume = parse_and_save_resume(db, resume)
        add_resume_to_batch(db, batch.id, resume.id)

        create_analysis_result(db, resume, jd)

    batch = finalize_batch(db, batch, len(files))
    return batch



@router.get("/batches", response_model=List[BatchOut])
def list_batches(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("faculty")),
):
    return get_faculty_batches(db, current_user.id)


@router.delete("/batch/{batch_id}")
def delete_faculty_batch(
    batch_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("faculty")),
):
    deleted = delete_batch(
        db,
        batch_id,
        current_user.id
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Batch not found"
        )

    return {
        "message": "Batch deleted successfully",
        "batch_id": batch_id,
    }


@router.get("/batch/{batch_id}/results")
def get_batch_result_details(
    batch_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("faculty")),
):
    batch = get_batch_by_id(db, batch_id, current_user.id)
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    results = get_batch_results(db, batch_id)

    output = []
    for result in results:
        resume = db.query(Resume).filter(Resume.id == result.resume_id).first()
        output.append({
    "resume_id": result.resume_id,
    "candidate_name": resume.candidate_name if resume else None,   # ← naya
    "resume_summary": resume.summary if resume else None,
    "overall_score": result.overall_score,
    "must_have_match_pct": result.must_have_match_pct,
    "nice_to_have_match_pct": result.nice_to_have_match_pct,
    "matched_skills": result.matched_skills,
    "missing_must_have_skills": result.missing_must_have_skills,
    "missing_nice_to_have_skills": result.missing_nice_to_have_skills,
    "eligibility_status": result.eligibility_status,
    "eligibility_reasons": result.eligibility_reasons,
    "suggestions": result.suggestions,
})

    # Sort by score descending — best matches first
    output.sort(key=lambda x: x["overall_score"], reverse=True)

    return {
        "batch_id": batch.id,
        "batch_name": batch.batch_name,
        "jd_id": batch.jd_id,
        "total_resumes": batch.total_resumes,
        "results": output,
    }

@router.get("/batch/{batch_id}/insights")
def get_batch_insight_summary(
    batch_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("faculty")),
):
    batch = get_batch_by_id(db, batch_id, current_user.id)
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    insights = get_batch_insights(db, batch_id)
    if insights is None:
        raise HTTPException(status_code=404, detail="No analysis results found for this batch")

    return {
        "batch_id": batch.id,
        "batch_name": batch.batch_name,
        "jd_id": batch.jd_id,
        **insights,
    }


@router.post("/batch/{batch_id}/add-resumes", response_model=BatchOut)
def add_resumes_to_batch(
    batch_id: int,
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("faculty")),
):
    batch = get_batch_by_id(db, batch_id, current_user.id)
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    if len(files) == 0:
        raise HTTPException(status_code=400, detail="At least 1 resume is required")
    if batch.total_resumes + len(files) > MAX_BATCH_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"Batch would exceed {MAX_BATCH_SIZE} resumes (currently {batch.total_resumes})",
        )

    jd = db.query(JD).filter(JD.id == batch.jd_id).first()

    for file in files:
        file_path, file_type = save_upload_file(file, subfolder="resumes")
        raw_text = extract_text(file_path, file_type)

        resume = create_resume(db, current_user.id, file_path, file_type)
        resume.raw_text = raw_text
        db.commit()
        db.refresh(resume)

        resume = parse_and_save_resume(db, resume)
        add_resume_to_batch(db, batch.id, resume.id)

        create_analysis_result(db, resume, jd)

    batch = increment_batch_total(db, batch, len(files))
    return batch