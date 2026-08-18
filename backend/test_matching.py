from app.db.session import SessionLocal
from app.models.user import User          # ← ye add karo
from app.models.resume import Resume
from app.models.jd import JD
from app.services.matching_service import analyze_match

db = SessionLocal()

resume = db.query(Resume).filter(Resume.id == 8).first()
jd = db.query(JD).filter(JD.id == 6).first()

if not resume or not jd:
    print("Resume or JD not found — check the IDs match what's in your DB")
else:
    result = analyze_match(resume, jd)
    import json
    print(json.dumps(result, indent=2))

db.close()