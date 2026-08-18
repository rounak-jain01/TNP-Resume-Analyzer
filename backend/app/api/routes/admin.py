from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.api.deps import require_role
from app.schemas.user import FacultyCreate, UserOut
from app.services.user_service import get_user_by_email, create_faculty_user
from app.models.user import User

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.post("/create-faculty", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_faculty(
    faculty_in: FacultyCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_role("admin")),
):
    existing_user = get_user_by_email(db, faculty_in.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_faculty = create_faculty_user(db, faculty_in.name, faculty_in.email, faculty_in.password)
    return new_faculty