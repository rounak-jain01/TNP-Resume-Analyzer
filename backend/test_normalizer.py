from app.services.skill_normalizer import normalize_skill, normalize_skill_list

# Individual tests
print(normalize_skill("React.js"))      # expected: react
print(normalize_skill("ReactJS"))       # expected: react
print(normalize_skill("  Node JS  "))   # expected: node.js
print(normalize_skill("ML"))            # expected: machine learning
print(normalize_skill("Python"))        # expected: python

print("\n--- List normalization ---")
resume_skills = ["Python", "React.js", "Node JS", "ML", "PostgreSQL", "Git and GitHub"]
jd_skills = ["python", "reactjs", "node.js", "Machine Learning", "Postgres", "Git & GitHub"]

norm_resume = normalize_skill_list(resume_skills)
norm_jd = normalize_skill_list(jd_skills)

print("Normalized Resume Skills:", norm_resume)
print("Normalized JD Skills:", norm_jd)

matched = norm_resume & norm_jd
missing = norm_jd - norm_resume

print("\nMatched:", matched)
print("Missing from resume:", missing)