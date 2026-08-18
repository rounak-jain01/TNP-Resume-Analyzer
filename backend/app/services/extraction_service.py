import pdfplumber
from docx import Document
from fastapi import HTTPException


def extract_text_from_pdf(file_path: str) -> str:
    text_parts = []
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text_parts.append(page_text)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Failed to extract text from PDF: {str(e)}")

    full_text = "\n".join(text_parts).strip()
    if not full_text:
        raise HTTPException(status_code=422, detail="No readable text found in PDF (it may be a scanned image)")

    return full_text


def extract_text_from_docx(file_path: str) -> str:
    try:
        doc = Document(file_path)
        text_parts = [para.text for para in doc.paragraphs if para.text.strip()]
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Failed to extract text from DOCX: {str(e)}")

    full_text = "\n".join(text_parts).strip()
    if not full_text:
        raise HTTPException(status_code=422, detail="No readable text found in DOCX")

    return full_text


def extract_text(file_path: str, file_type: str) -> str:
    if file_type == "pdf":
        return extract_text_from_pdf(file_path)
    elif file_type == "docx":
        return extract_text_from_docx(file_path)
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {file_type}")