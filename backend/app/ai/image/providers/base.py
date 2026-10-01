from abc import ABC, abstractmethod
from typing import Literal

ImageQuality = Literal[
    "standard",
    "low",
    "medium",
    "high",
    "xhigh",
    "max",
    "auto",
]

ImageSize = Literal[
    "1024x1024",
    "1024x1536",
    "1536x1024",
    "auto",
]

class ImageProvider(ABC):

    @abstractmethod
    async def generate(
        self,
        *,
        prompt: str,
        input_image_urls: list[str] | None = None,
        reference_image_urls: list[str] | None = None,
        size: ImageSize | None = None,
        quality: ImageQuality | None = None,
    ) -> bytes:
        """
        Generate a new image.

        input_image_urls:
            Images that should materially appear in or influence
            the final composition, such as product photos,
            people, event photos, etc.

        reference_image_urls:
            Images supplied mainly as visual/style/layout reference.

        Returns:
            Final image bytes.
        """
        raise NotImplementedError