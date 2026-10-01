from app.ai.document.base import DocumentExtractor
from pypdf import PdfReader


class PDFExtractor(DocumentExtractor):

    async def extract(
        self,
        file_path: str,
    ) -> str:

        reader = PdfReader(file_path)

        pages: list[str] = []

        for page in reader.pages:
            text = page.extract_text()

            if text:
                pages.append(text.strip())

        return "\n\n".join(pages)