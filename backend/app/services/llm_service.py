import json
from google import genai
from app.core.config import settings

client = genai.Client(api_key=settings.GEMINI_API_KEY)

MODEL_NAME = "gemini-3.5-flash-lite"


def _call_gemini(prompt: str) -> dict:
    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
    )

    raw_output = response.text.strip()

    # Gemini sometimes wraps JSON in ```json ... ``` fences — strip them
    if raw_output.startswith("```"):
        raw_output = raw_output.split("```")[1]
        if raw_output.startswith("json"):
            raw_output = raw_output[4:]
        raw_output = raw_output.strip()

    try:
        return json.loads(raw_output)
    except json.JSONDecodeError:
        raise ValueError(f"LLM did not return valid JSON: {raw_output[:300]}")


def analyze_resume(raw_text: str) -> dict:
    prompt = f"""
You are a resume parsing engine. Extract structured information from the resume text below.

IMPORTANT RULES for skills:
- List EVERY skill as a SEPARATE, ATOMIC item — never group multiple technologies into one string.
- Keep each skill name short and standard.

IMPORTANT RULES for certificates vs education:
- "education" should ONLY contain formal degrees/schooling.
- "certificates" should ONLY contain professional certifications, courses, or achievements.

IMPORTANT RULES for cgpa and branch:
- "cgpa" normalized to 0-10 scale as a plain number. If not found, null.
- "branch" as plain text. If not found, null.

Return ONLY valid JSON (no markdown, no explanation) in this exact structure:
{{
  "candidate_name": "Full name of the candidate as it appears on the resume",
  "summary": "2-3 sentence professional summary of the candidate",
  "cgpa": 8.45,
  "branch": "...",
  "skills": ["skill1", "skill2", ...],
  "projects": [
    {{"title": "...", "description": "...", "technologies": ["...", "..."]}}
  ],
  "certificates": ["cert1", "cert2", ...],
  "education": [
    {{"degree": "...", "institution": "...", "year": "...", "score": "..."}}
  ]
}}

Resume text:
\"\"\"
{raw_text}
\"\"\"
"""
    return _call_gemini(prompt)


def analyze_jd(raw_text: str) -> dict:
    prompt = f"""
You are a job description parsing engine. Extract structured information from the JD text below.

IMPORTANT RULES for skills:
- List EVERY skill as a SEPARATE, ATOMIC item — never group multiple technologies into one string.
- WRONG: "Programming (Java, C++, Python, Node.js)"
- CORRECT: "Java", "C++", "Python", "Node.js" as four separate array items
- must_have_skills and nice_to_have_skills should ONLY contain TECHNICAL/HARD skills — programming languages, frameworks, libraries, tools, databases, domain knowledge (e.g. "Python", "React", "Docker", "Machine Learning"). These must be objectively verifiable from a resume.
- DO NOT include soft skills (communication, problem solving, teamwork, interpersonal skills, leadership, adaptability, etc.) in must_have_skills or nice_to_have_skills.
- Put any soft skills mentioned in the JD into a separate "soft_skills_mentioned" array instead.

Return ONLY valid JSON (no markdown, no explanation) in this exact structure:
{{
  "company_name": "...",
  "role_title": "...",
  "must_have_skills": ["skill1", "skill2", ...],
  "nice_to_have_skills": ["skill1", "skill2", ...],
  "soft_skills_mentioned": ["skill1", "skill2", ...],
  "eligibility_criteria": {{
    "min_cgpa": "... or null",
    "branches_allowed": ["...", "..."],
    "backlog_allowed": true,
    "other_notes": "..."
  }}
}}

Job description text:
\"\"\"
{raw_text}
\"\"\"
"""
    return _call_gemini(prompt)