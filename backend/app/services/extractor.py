from io import BytesIO

from fastapi import HTTPException, UploadFile
from docx import Document
from pypdf import PdfReader


SUPPORTED_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
}


async def extract_text_from_file(file: UploadFile) -> str:
    """
    Extract text from PDF, DOCX or TXT files.
    """

    if file.content_type not in SUPPORTED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Only PDF, DOCX and TXT are allowed.",
        )

    content = await file.read()

    if file.content_type == "application/pdf":
        return extract_pdf(content)

    if (
        file.content_type
        == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ):
        return extract_docx(content)

    if file.content_type == "text/plain":
        return content.decode("utf-8", errors="ignore")

    return ""


def extract_pdf(content: bytes) -> str:
    pdf = PdfReader(BytesIO(content))

    pages = []

    for page in pdf.pages:
        pages.append(page.extract_text() or "")

    return "\n".join(pages).strip()


def extract_docx(content: bytes) -> str:
    document = Document(BytesIO(content))

    paragraphs = [
        paragraph.text
        for paragraph in document.paragraphs
        if paragraph.text.strip()
    ]

    return "\n".join(paragraphs).strip()