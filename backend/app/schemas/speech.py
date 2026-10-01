from pydantic import BaseModel


class SpeechLanguageContent(BaseModel):
    language: str

    title: str

    speech: str

    key_memories: list[str]

    estimated_duration: str


class SpeechGenerateResponse(BaseModel):
    generated: list[SpeechLanguageContent]