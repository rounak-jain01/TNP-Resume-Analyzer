from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserSignup
from app.core.security import hash_password


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


def create_student_user(db: Session, user_in: UserSignup) -> User:
    new_user = User(
        name=user_in.name,
        email=user_in.email,
        hashed_password=hash_password(user_in.password),
        role="student",
        branch=user_in.branch,
        cgpa=user_in.cgpa,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def create_faculty_user(db: Session, name: str, email: str, password: str) -> User:
    new_user = User(
        name=name,
        email=email,
        hashed_password=hash_password(password),
        role="faculty",
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user