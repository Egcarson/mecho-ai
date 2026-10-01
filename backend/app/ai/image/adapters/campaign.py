from app.ai.image.adapters.base import (
    CreativeSourceAdapter,
)
from app.ai.image.schemas import (
    CreativeSourceContent,
)
from app.ai.responses.campaign import CampaignGenerateResponse


class CampaignCreativeSourceAdapter(
    CreativeSourceAdapter,
):

    def extract(
        self,
        *,
        output_content: str,
        source_language: str | None = None,
        source_variant: str | None = None,
    ) -> CreativeSourceContent:

        if not source_language:
            raise ValueError(
                "Source language is required."
            )

        response = (
            CampaignGenerateResponse
            .model_validate_json(
                output_content,
            )
        )

        campaign = next(
            (
                item
                for item in response.generated
                if item.language.lower()
                == source_language.lower()
            ),
            None,
        )

        if campaign is None:
            raise ValueError(
                f"No generated campaign found for "
                f"language '{source_language}'."
            )

        return CreativeSourceContent(
            title=campaign.title,
            body=campaign.main_message,
            call_to_action=campaign.next_step,
            supporting_text=[
                campaign.theme,
                *campaign.supporting_content,
            ],
        )