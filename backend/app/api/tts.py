from fastapi import APIRouter
from pydantic import BaseModel

from app.services.tts_service import generate_audio

router = APIRouter(tags=["TTS"])


class TTSRequest(BaseModel):
    text: str
    language: str


@router.post("/tts")
async def tts(request: TTSRequest):

    audio_url = await generate_audio(
        text=request.text,
        language=request.language,
    )

    return {
        "audio_url": audio_url
    }