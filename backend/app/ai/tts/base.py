from abc import ABC, abstractmethod

from app.ai.tts.capabilities import (
    TTSProviderCapabilities,
)
from app.ai.tts.models import VoiceScript


class TTSProvider(ABC):

    @property
    @abstractmethod
    def capabilities(
        self,
    ) -> TTSProviderCapabilities:
        raise NotImplementedError

    @abstractmethod
    async def synthesize(
        self,
        *,
        script: VoiceScript,
        voice: str | None = None,
        response_format: str = "mp3",
    ) -> bytes:
        """
        Synthesize a provider-neutral VoiceScript
        into audio.
        """
        raise NotImplementedError