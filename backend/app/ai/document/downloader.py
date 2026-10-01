import tempfile

import httpx


class DocumentDownloader:

    @staticmethod
    async def download(
        url: str,
    ) -> str:

        async with httpx.AsyncClient() as client:

            response = await client.get(url)

            response.raise_for_status()

            with tempfile.NamedTemporaryFile(
                delete=False,
                suffix=".pdf",
            ) as temp_file:

                temp_file.write(
                    response.content,
                )

                return temp_file.name