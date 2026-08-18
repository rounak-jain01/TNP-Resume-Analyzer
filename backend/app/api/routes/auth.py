from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.user import UserSignup, UserOut, UserLogin, Token
from app.services.user_service import get_user_by_email, create_student_user
from app.core.security import verify_password, create_access_token

from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/signup", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def signup(user_in: UserSignup, db: Session = Depends(get_db)):
    existing_user = get_user_by_email(db, user_in.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = create_student_user(db, user_in)
    return new_user


@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = get_user_by_email(db, credentials.email)

    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(data={"user_id": user.id, "role": user.role})
    return Token(access_token=token)

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user