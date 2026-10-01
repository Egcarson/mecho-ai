from abc import ABC, abstractmethod


class DocumentExtractor(ABC):

    @abstractmethod
    async def extract(
        self,
        file_path: str,
    ) -> str:
        raise NotImplementedError