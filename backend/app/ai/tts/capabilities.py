from pydantic import BaseModel


class TTSProviderCapabilities(BaseModel):
    supports_ssml: bool = False

    supports_emotions: bool = False

    supports_events: bool = False

    supports_pronunciation: bool = False

    supports_prosody: bool = False

    max_characters: int | None = None