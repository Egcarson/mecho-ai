from pathlib import Path

from app.ai.document.cleaner import DocumentCleaner
from app.ai.document.docx import DOCXExtractor
from app.ai.document.pdf import PDFExtractor
from app.ai.document.txt import TXTExtractor


class DocumentExtractorService:

    @staticmethod
    async def extract(
        file_path: str,
    ) -> str:

        extension = Path(
            file_path,
        ).suffix.lower()

        if extension == ".pdf":
            text = await PDFExtractor().extract(
                file_path,
            )

        elif extension == ".docx":
            text = await DOCXExtractor().extract(
                file_path,
            )

        elif extension == ".txt":
            text = await TXTExtractor().extract(
                file_path,
            )

        else:
            raise ValueError(
                f"Unsupported file type: {extension}"
            )

        return DocumentCleaner.clean(
            text,
        )