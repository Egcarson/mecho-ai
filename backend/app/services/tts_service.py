from io import BytesIO

import httpx
from fastapi import HTTPException
from app.services.cloudinary_service import upload_audio
from app.core.config import YARNGPT_API_KEY

API_URL = "https://yarngpt.ai/api/v1/tts"


VOICE_MAP = {
    "English": "Emma",
    "Yoruba": "Idera",
    "Igbo": "Adaora",
    "Hausa": "Umar",
    "Pidgin": "Tayo",
}


async def generate_audio(
    text: str,
    language: str,
) -> BytesIO:

    voice = VOICE_MAP.get(language, "Emma")

    headers = {
        "Authorization": f"Bearer {YARNGPT_API_KEY}",
    }

    payload = {
        "text": text,
        "voice": voice,
        "response_format": "mp3",
    }

    async with httpx.AsyncClient(timeout=60) as client:

        response = await client.post(
            API_URL,
            headers=headers,
            json=payload,
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=500,
            detail="Unable to generate speech.",
        )

   

    audio = BytesIO(response.content)

    url = await upload_audio(audio)

    return url