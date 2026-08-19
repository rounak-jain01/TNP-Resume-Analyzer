import re

from app.services.skill_normalizer import normalize_skill_list


def calculate_skill_match(
    resume_skills: list,
    jd_must_have: list,
    jd_nice_to_have: list,
) -> dict:
    norm_resume = normalize_skill_list(resume_skills or [])
    norm_must_have = normalize_skill_list(jd_must_have or [])
    norm_nice_to_have = normalize_skill_list(jd_nice_to_have or [])

    matched_must_have = norm_resume & norm_must_have
    missing_must_have = norm_must_have - norm_resume

    matched_nice_to_have = norm_resume & norm_nice_to_have
    missing_nice_to_have = norm_nice_to_have - norm_resume

    must_have_pct = (
        len(matched_must_have) / len(norm_must_have) * 100
        if norm_must_have
        else 100.0
    )

    nice_to_have_pct = (
        len(matched_nice_to_have) / len(norm_nice_to_have) * 100
        if norm_nice_to_have
        else 100.0
    )

    return {
        "must_have_pct": round(must_have_pct, 2),
        "nice_to_have_pct": round(nice_to_have_pct, 2),
        "matched_skills": sorted(
            matched_must_have | matched_nice_to_have
        ),
        "missing_must_have": sorted(missing_must_have),
        "missing_nice_to_have": sorted(missing_nice_to_have),
    }


def extract_cgpa_from_education(
    education: list,
) -> float | None:
    """Extract CGPA from education entries."""

    if not education:
        return None

    for entry in education:
        score = entry.get("score", "")

        match = re.search(
            r"(\d+\.?\d*)\s*/?\s*10?",
            str(score),
        )

        if match:
            value = float(match.group(1))

            if value <= 10:
                return value

    return None


def extract_branch_from_education(
    education: list,
) -> str | None:
    """Extract branch/degree from education entries."""

    if not education:
        return None

    for entry in education:
        degree = entry.get("degree", "")

        if degree and any(
            keyword in degree.lower()
            for keyword in [
                "b.tech",
                "btech",
                "b.e",
                "bachelor",
            ]
        ):
            return degree

    return education[0].get("degree")


def check_eligibility(
    cgpa: float | None,
    branch: str | None,
    education: list,
    eligibility_criteria: dict | None,
) -> dict:

    if not eligibility_criteria:
        return {
            "status": "unknown",
            "reasons": [
                "No eligibility criteria parsed from JD"
            ],
        }

    student_cgpa = (
        cgpa
        if cgpa is not None
        else extract_cgpa_from_education(education)
    )

    student_branch = (
        branch
        if branch
        else extract_branch_from_education(education)
    )

    reasons = []
    passed = True
    cgpa_undetermined = False

    min_cgpa_raw = eligibility_criteria.get("min_cgpa")

    if min_cgpa_raw and student_cgpa is not None:
        match = re.search(
            r"(\d+\.?\d*)",
            str(min_cgpa_raw),
        )

        if match:
            min_cgpa = float(match.group(1))

            if student_cgpa < min_cgpa:
                passed = False

                reasons.append(
                    f"CGPA {student_cgpa} is below required {min_cgpa}"
                )

    elif min_cgpa_raw and student_cgpa is None:
        cgpa_undetermined = True

        reasons.append(
            "Could not determine student's CGPA from resume"
        )

    branches_allowed = eligibility_criteria.get(
        "branches_allowed"
    )

    if branches_allowed and student_branch:
        branch_match = any(
            keyword.lower() in student_branch.lower()
            for allowed in branches_allowed
            for keyword in allowed.split()
            if len(keyword) > 3
        )

        if not branch_match:
            passed = False

            reasons.append(
                f"Branch '{student_branch}' may not match allowed list"
            )

    if not passed:
        status = "fail"

    elif cgpa_undetermined:
        status = "unknown"

    else:
        status = "pass"

        if not reasons:
            reasons.append(
                "Meets CGPA and branch criteria"
            )

    return {
        "status": status,
        "reasons": reasons,
    }


def generate_suggestions(
    missing_must_have: list,
    missing_nice_to_have: list,
) -> str:

    if not missing_must_have and not missing_nice_to_have:
        return (
            "Strong match! Your profile aligns well "
            "with this role's requirements."
        )

    suggestions = []

    if missing_must_have:
        suggestions.append(
            "Focus on gaining these critical skills: "
            f"{', '.join(missing_must_have[:5])}."
        )

    if missing_nice_to_have:
        suggestions.append(
            "Consider also learning: "
            f"{', '.join(missing_nice_to_have[:5])}."
        )

    return " ".join(suggestions)


def calculate_overall_score(
    must_have_pct: float,
    nice_to_have_pct: float,
) -> float:

    score = (
        must_have_pct * 0.7
        + nice_to_have_pct * 0.3
    )

    return round(score, 2)


def analyze_match(
    resume,
    jd,
) -> dict:

    skill_result = calculate_skill_match(
        resume.skills or [],
        jd.must_have_skills or [],
        jd.nice_to_have_skills or [],
    )

    overall_score = calculate_overall_score(
        skill_result["must_have_pct"],
        skill_result["nice_to_have_pct"],
    )

    eligibility = check_eligibility(
        cgpa=getattr(resume, "cgpa", None),
        branch=getattr(resume, "branch", None),
        education=resume.education or [],
        eligibility_criteria=jd.eligibility_criteria,
    )

    suggestions = generate_suggestions(
        skill_result["missing_must_have"],
        skill_result["missing_nice_to_have"],
    )

    return {
        "overall_score": overall_score,
        "must_have_match_pct": skill_result["must_have_pct"],
        "nice_to_have_match_pct": skill_result["nice_to_have_pct"],
        "matched_skills": skill_result["matched_skills"],
        "missing_must_have_skills": skill_result[
            "missing_must_have"
        ],
        "missing_nice_to_have_skills": skill_result[
            "missing_nice_to_have"
        ],
        "eligibility_status": eligibility["status"],
        "eligibility_reasons": eligibility["reasons"],
        "suggestions": suggestions,
    }