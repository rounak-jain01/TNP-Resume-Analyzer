from collections import Counter

from sqlalchemy.orm import Session

from app.models.batch import Batch, BatchResume
from app.models.resume import Resume
from app.models.analysis_result import AnalysisResult
from app.models.jd import JD


def create_batch(
    db: Session,
    faculty_id: int,
    jd_id: int,
    batch_name: str | None,
) -> Batch:

    batch = Batch(
        faculty_id=faculty_id,
        jd_id=jd_id,
        batch_name=batch_name,
        total_resumes=0,
        status="uploaded",
    )

    db.add(batch)
    db.commit()
    db.refresh(batch)

    return batch


def increment_batch_total(
    db: Session,
    batch: Batch,
    added_count: int,
) -> Batch:

    batch.total_resumes += added_count

    db.commit()
    db.refresh(batch)

    return batch


def add_resume_to_batch(
    db: Session,
    batch_id: int,
    resume_id: int,
) -> BatchResume:

    link = BatchResume(
        batch_id=batch_id,
        resume_id=resume_id,
    )

    db.add(link)
    db.flush()

    return link


def finalize_batch(
    db: Session,
    batch: Batch,
    resume_count: int,
) -> Batch:

    batch.total_resumes = resume_count
    batch.status = "completed"

    db.commit()
    db.refresh(batch)

    return batch


def get_faculty_batches(
    db: Session,
    faculty_id: int,
) -> list[Batch]:

    return (
        db.query(Batch)
        .filter(Batch.faculty_id == faculty_id)
        .order_by(Batch.created_at.desc())
        .all()
    )


def get_batch_by_id(
    db: Session,
    batch_id: int,
    faculty_id: int,
) -> Batch | None:

    return (
        db.query(Batch)
        .filter(
            Batch.id == batch_id,
            Batch.faculty_id == faculty_id,
        )
        .first()
    )


def get_batch_results(
    db: Session,
    batch_id: int,
) -> list[AnalysisResult] | None:

    batch = (
        db.query(Batch)
        .filter(Batch.id == batch_id)
        .first()
    )

    if not batch:
        return None

    resume_ids = [
        resume_id
        for (resume_id,) in (
            db.query(BatchResume.resume_id)
            .filter(BatchResume.batch_id == batch_id)
            .all()
        )
    ]

    if not resume_ids:
        return []

    return (
        db.query(AnalysisResult)
        .filter(
            AnalysisResult.resume_id.in_(resume_ids),
            AnalysisResult.jd_id == batch.jd_id,
        )
        .all()
    )


def get_batch_insights(
    db: Session,
    batch_id: int,
) -> dict | None:

    results = get_batch_results(
        db,
        batch_id,
    )

    if not results:
        return None

    total = len(results)

    strong_fit = sum(
        1 for result in results
        if result.overall_score >= 75
    )

    medium_fit = sum(
        1 for result in results
        if 50 <= result.overall_score < 75
    )

    weak_fit = sum(
        1 for result in results
        if result.overall_score < 50
    )

    eligible = sum(
        1 for result in results
        if result.eligibility_status == "pass"
    )

    ineligible = sum(
        1 for result in results
        if result.eligibility_status == "fail"
    )

    unknown_eligibility = sum(
        1 for result in results
        if result.eligibility_status == "unknown"
    )

    missing_skill_counter = Counter()

    for result in results:
        for skill in result.missing_must_have_skills or []:
            missing_skill_counter[skill] += 1

    skill_gap = [
        {
            "skill": skill,
            "missing_count": count,
            "missing_pct": round(
                (count / total) * 100,
                1,
            ),
        }
        for skill, count in missing_skill_counter.most_common()
    ]

    average_score = round(
        sum(
            result.overall_score
            for result in results
        ) / total,
        2,
    )

    return {
        "total_resumes": total,
        "average_score": average_score,
        "score_distribution": {
            "strong_fit": strong_fit,
            "medium_fit": medium_fit,
            "weak_fit": weak_fit,
        },
        "eligibility_funnel": {
            "eligible": eligible,
            "ineligible": ineligible,
            "unknown": unknown_eligibility,
        },
        "skill_gap": skill_gap,
    }


def delete_batch(
    db: Session,
    batch_id: int,
    faculty_id: int,
) -> bool | None:

    batch = (
        db.query(Batch)
        .filter(
            Batch.id == batch_id,
            Batch.faculty_id == faculty_id,
        )
        .first()
    )

    if not batch:
        return None

    jd_id = batch.jd_id

    resume_ids = [
        resume_id
        for (resume_id,) in (
            db.query(BatchResume.resume_id)
            .filter(BatchResume.batch_id == batch_id)
            .all()
        )
    ]

    # Delete analysis results belonging to this batch.
    if resume_ids:
        (
            db.query(AnalysisResult)
            .filter(
                AnalysisResult.resume_id.in_(resume_ids),
                AnalysisResult.jd_id == jd_id,
            )
            .delete(synchronize_session=False)
        )

    # Delete batch-resume mappings.
    (
        db.query(BatchResume)
        .filter(BatchResume.batch_id == batch_id)
        .delete(synchronize_session=False)
    )

    # Delete resumes that are not used by another batch.
    for resume_id in resume_ids:

        other_batch_link = (
            db.query(BatchResume)
            .filter(BatchResume.resume_id == resume_id)
            .first()
        )

        if not other_batch_link:
            (
                db.query(Resume)
                .filter(Resume.id == resume_id)
                .delete(synchronize_session=False)
            )

    # Delete the batch.
    db.delete(batch)
    db.flush()

    # Delete JD if no other batch uses it.
    other_batch_with_jd = (
        db.query(Batch)
        .filter(Batch.jd_id == jd_id)
        .first()
    )

    if not other_batch_with_jd:
        (
            db.query(JD)
            .filter(JD.id == jd_id)
            .delete(synchronize_session=False)
        )

    db.commit()

    return True