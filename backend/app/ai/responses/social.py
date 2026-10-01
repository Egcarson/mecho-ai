from app.ai.responses.base import LanguageContent
from pydantic import BaseModel


class SocialGenerateResponse(BaseModel):
    generated: list[LanguageContent]