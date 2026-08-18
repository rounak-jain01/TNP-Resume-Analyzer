from app.services.llm_service import analyze_resume, analyze_jd

sample_resume_text = """
DEVENDRA SINGH
banad8628@gmail.com | +91 8719966101
EDUCATION
Sagar Institute of Science and Technology | Bhopal, MP 2023-2027
Bachelor of Technology in Computer Science & Engineering, AI & Data Science
CGPA = 7.96/10
TECHNICAL SKILLS
Languages: Python, C++, SQL, JavaScript
AI/ML: Machine Learning, Deep Learning, RAG, LangChain
PROJECTS
AI Resume Screening Platform - Django, NLP, Gemini API
"""

sample_jd_text = """
IBM - Associate System Engineer
CTC: Rs. 450000
Required: Programming (Java, C++, Python, Node.js), Software Development Life Cycle Concepts, No active backlogs.
Eligibility: BE/BTech CSE/AI&DS/IT with 6 CGPA/60%, Year of pass out 2026.
"""

print("=== RESUME ANALYSIS ===")
result1 = analyze_resume(sample_resume_text)
print(result1)

print("\n=== JD ANALYSIS ===")
result2 = analyze_jd(sample_jd_text)
print(result2)