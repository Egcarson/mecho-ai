from app.ai.context.social import SocialPromptContext
from app.ai.responses.social import SocialGenerateResponse
from app.ai.workflows.base import Workflow
from app.models.generation import Generation
from app.models.project import Project


class SocialWorkflow(Workflow):

    response_schema = SocialGenerateResponse

    async def build_context(
        self,
        *,
        project: Project,
        generation: Generation,
    ) -> SocialPromptContext:

        return SocialPromptContext(
            input_content=generation.input_content,
            document_content=project.source_document_text,
            objective=project.objective,
            tone=project.tone,
            audiences=project.audiences,
            languages=project.languages,
            platforms=project.platforms or [],
            trend_context=None,
            length=project.length
        )