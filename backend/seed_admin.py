from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import hash_password

db = SessionLocal()

admin_email = "rounakjain205@gmail.com"  # apna admin email daalo
admin_password = "123456"  # strong password rakho

existing = db.query(User).filter(User.email == admin_email).first()

if existing:
    print("Admin already exists!")
else:
    admin = User(
        name="Placement Admin",
        email=admin_email,
        hashed_password=hash_password(admin_password),
        role="admin",
    )
    db.add(admin)
    db.commit()
    print(f"Admin created: {admin_email}")

db.close()