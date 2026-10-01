import asyncio
import os

import httpx
from dotenv import load_dotenv


load_dotenv()


async def main():

    timeout = httpx.Timeout(
        connect=15.0,
        read=180.0,
        write=30.0,
        pool=15.0,
    )

    print("API key found:", bool(
        os.getenv("VOICE_PROVIDER_API_KEY")
    ))

    print("Sending request...")

    try:
        async with httpx.AsyncClient(
            timeout=timeout,
        ) as client:

            response = await client.post(
                "https://yarngpt.ai/api/v1/tts",
                headers={
                    "Authorization": (
                        f"Bearer "
                        f"{os.getenv('VOICE_PROVIDER_API_KEY')}"
                    ),
                },
                json={
                    "text": (
                        "Hello, this is a test "
                        "from LocalVoice AI."
                    ),
                    "voice": "Idera",
                    "response_format": "mp3",
                },
            )

            print(
                "Status:",
                response.status_code,
            )

            print(
                "Content-Type:",
                response.headers.get(
                    "content-type"
                ),
            )

            response.raise_for_status()

            with open(
                "yarngpt_test.mp3",
                "wb",
            ) as file:
                file.write(response.content)

            print(
                "Success:",
                len(response.content),
                "bytes",
            )

    except Exception as exc:
        print(
            type(exc).__name__,
            repr(exc),
        )


asyncio.run(main())