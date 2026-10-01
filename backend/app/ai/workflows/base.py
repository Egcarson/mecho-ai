from abc import ABC, abstractmethod

from app.ai.context.base import PromptContext
from app.models.generation import Generation
from app.models.project import Project


class Workflow(ABC):

    @abstractmethod
    async def build_context(
        self,
        *,
        project: Project,
        generation: Generation,
    ) -> PromptContext:
        """
        Build workflow-specific context required
        before prompt construction.
        """
        raise NotImplementedError