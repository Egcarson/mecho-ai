from abc import ABC, abstractmethod
from typing import Any


class AIProvider(ABC):

    @abstractmethod
    async def generate(
        self,
        *,
        system_prompt: str,
        prompt: str,
        response_schema: type[Any] | None = None,
        temperature: float = 1.0,
        top_p: float = 0.95,
    ) -> str:
        """
        Generate content from the supplied prompts.
        """
        raise NotImplementedError