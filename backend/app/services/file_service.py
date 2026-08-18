import os
import shutil
import uuid
from fastapi import UploadFile, HTTPException

UPLOAD_BASE_DIR = "uploads"
ALLOWED_EXTENSIONS = {"pdf", "docx"}
MAX_FILE_SIZE_MB = 5
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024


def get_file_extension(filename: str) -> str:
    return filename.rsplit(".", 1)[-1].lower() if "." in filename else ""


def save_upload_file(file: UploadFile, subfolder: str) -> tuple[str, str]:
    """
    Saves uploaded file to disk. Returns (file_path, file_type).
    subfolder: "jds" or "resumes"
    """
    ext = get_file_extension(file.filename)
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are allowed")

    # Read file into memory once to check size, then write it
    file_bytes = file.file.read()
    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=400, detail=f"File size must not exceed {MAX_FILE_SIZE_MB}MB")

    # Generate unique filename to avoid collisions
    unique_name = f"{uuid.uuid4().hex}.{ext}"
    folder_path = os.path.join(UPLOAD_BASE_DIR, subfolder)
    os.makedirs(folder_path, exist_ok=True)
    file_path = os.path.join(folder_path, unique_name)

    with open(file_path, "wb") as buffer:
        buffer.write(file_bytes)

    return file_path, ext