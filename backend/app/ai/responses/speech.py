from pydantic import BaseModel


class SpeechGenerateResponse(BaseModel):
    title: str
    speech: str
    key_memories: list[str]
    estimated_duration: str