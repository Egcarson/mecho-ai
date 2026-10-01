from abc import ABC, abstractmethod

from app.ai.image.schemas import (
    CreativeSourceContent,
)


class CreativeSourceAdapter(ABC):

    @abstractmethod
    def extract(
        self,
        *,
        output_content: str,
        source_language: str | None = None,
        source_variant: str | None = None,
    ) -> CreativeSourceContent:
        raise NotImplementedError