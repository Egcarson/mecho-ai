from app.ai.image.adapters.base import (
    CreativeSourceAdapter,
)
from app.ai.image.adapters.campaign import (
    CampaignCreativeSourceAdapter,
)
from app.ai.image.adapters.social import (
    SocialCreativeSourceAdapter,
)
from app.models.enums import ProjectWorkflow

IMAGE_SOURCE_ADAPTERS: dict[
    ProjectWorkflow,
    CreativeSourceAdapter,
] = {
    ProjectWorkflow.SOCIAL:
        SocialCreativeSourceAdapter(),

    ProjectWorkflow.CAMPAIGN:
        CampaignCreativeSourceAdapter(),
}