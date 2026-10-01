from app.ai.context.campaign import CampaignPromptContext
from app.ai.responses.campaign import CampaignGenerateResponse
from app.ai.workflows.base import Workflow
from app.models.generation import Generation
from app.models.project import Project


class CampaignWorkflow(Workflow):

    response_schema = CampaignGenerateResponse

    async def build_context(
        self,
        *,
        project: Project,
        generation: Generation,
    ) -> CampaignPromptContext:

        return CampaignPromptContext(
            campaign_brief=generation.input_content,
            document_content=project.source_document_text,
            objective=project.objective,
            tone=project.tone,
            audiences=project.audiences,
            languages=project.languages,
            length=project.length,
        )