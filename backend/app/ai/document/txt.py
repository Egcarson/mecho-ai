from app.ai.document.base import DocumentExtractor


class TXTExtractor(DocumentExtractor):

    async def extract(
        self,
        file_path: str,
    ) -> str:

        with open(
            file_path,
            "r",
            encoding="utf-8",
        ) as file:
            return file.read()