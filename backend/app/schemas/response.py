from pydantic import BaseModel, Field

class PlatformContent(BaseModel):
    platform: str
    hook: str
    content: str
    call_to_action: str
    hashtags: list[str] = Field(default_factory=list)

class LanguageContent(BaseModel):
    language: str
    contents: list[PlatformContent]


class GenerateResponse(BaseModel):
    generated: list[LanguageContent]