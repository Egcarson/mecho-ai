from app.ai.workflows.campaign import CampaignWorkflow
from app.ai.workflows.social import SocialWorkflow
from app.ai.workflows.speech import SpeechWorkflow
from app.models.enums import ProjectWorkflow


class WorkflowRegistry:

    _workflows = {  # noqa: RUF012
        ProjectWorkflow.SOCIAL: SocialWorkflow(),
        ProjectWorkflow.CAMPAIGN: CampaignWorkflow(),
        ProjectWorkflow.SPEECH: SpeechWorkflow()
    }

    @classmethod
    def get(
        cls,
        workflow: ProjectWorkflow,
    ):

        try:
            return cls._workflows[workflow]

        except KeyError:

            raise ValueError(
                f"Unsupported workflow: {workflow}"
            )