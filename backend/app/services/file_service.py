import os
import uuid

from fastapi import HTTPException, UploadFile


UPLOAD_BASE_DIR = "uploads"
TEMP_FOLDER = "temp"

ALLOWED_EXTENSIONS = {"pdf", "docx"}

MAX_FILE_SIZE_MB = 5
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024


def get_file_extension(filename: str | None) -> str:
    if not filename or "." not in filename:
        return ""

    return filename.rsplit(".", 1)[-1].lower()


def save_temp_file(
    file: UploadFile,
) -> tuple[str, str]:
    """
    Save an uploaded PDF/DOCX temporarily for processing.

    The caller MUST delete the returned file after processing.

    Returns:
        tuple[str, str]: (file_path, file_type)
    """

    extension = get_file_extension(
        file.filename
    )

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are allowed",
        )

    file_bytes = file.file.read()

    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=400,
            detail=(
                f"File size must not exceed "
                f"{MAX_FILE_SIZE_MB}MB"
            ),
        )

    filename = (
        f"{uuid.uuid4().hex}.{extension}"
    )

    folder_path = os.path.join(
        UPLOAD_BASE_DIR,
        TEMP_FOLDER,
    )

    os.makedirs(
        folder_path,
        exist_ok=True,
    )

    file_path = os.path.join(
        folder_path,
        filename,
    )

    with open(file_path, "wb") as buffer:
        buffer.write(file_bytes)

    return file_path, extension


def delete_temp_file(
    file_path: str | None,
) -> None:
    """
    Safely delete a temporary uploaded file.
    """

    if not file_path:
        return

    if not os.path.exists(file_path):
        return

    try:
        os.remove(file_path)
    except OSError:
        pass