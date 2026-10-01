from app.ai.context.speech import SpeechMemoryContext, SpeechPromptContext
from app.ai.workflows.base import Workflow
from app.models.generation import Generation
from app.models.project import Project
from app.schemas.response import SpeechGenerateResponse


class SpeechWorkflow(Workflow):

    response_schema = SpeechGenerateResponse

    async def build_context(
        self,
        *,
        project: Project,
        generation: Generation,
    ) -> SpeechPromptContext:

        memories = [
            SpeechMemoryContext.model_validate(item)
            for item in generation.memories
        ]

        return SpeechPromptContext(
        event_details=generation.input_content or "",
        memories=memories,
        document_content=project.source_document_text,
        audiences=project.audiences,
        languages=project.languages,
        objective=project.objective,
        tone=project.tone,
        target_duration_minutes=(
            project.target_duration_minutes or 10
        ),
    )