from dataclasses import dataclass

from app.ai.responses.campaign import CampaignGenerateResponse
from app.ai.responses.social import SocialGenerateResponse
from app.models.enums import ProjectWorkflow
from app.schemas.speech import SpeechGenerateResponse


@dataclass(frozen=True)
class VoiceContent:
    text: str
    language: str
    platform: str


class VoiceContentExtractor:

    def extract(
        self,
        *,
        workflow: ProjectWorkflow,
        output_content: str,
        language: str,
        platform: str | None = None,
    ) -> VoiceContent:

        if workflow == ProjectWorkflow.SOCIAL:
            return self._extract_social(
                output_content=output_content,
                language=language,
                platform=platform,
            )

        if workflow == ProjectWorkflow.CAMPAIGN:
            return self._extract_campaign(
                output_content=output_content,
                language=language,
            )

        if workflow == ProjectWorkflow.SPEECH:
            return self._extract_speech(
                output_content=output_content,
                language=language,
            )

        raise ValueError(
            f"Unsupported workflow: {workflow}"
        )

    @staticmethod
    def _extract_social(
        *,
        output_content: str,
        language: str,
        platform: str | None,
    ) -> VoiceContent:

        response = (
            SocialGenerateResponse
            .model_validate_json(
                output_content,
            )
        )

        language_content = next(
            (
                item
                for item in response.generated
                if item.language.lower()
                == language.lower()
            ),
            None,
        )

        if language_content is None:
            raise ValueError(
                f"No generated content found for "
                f"language '{language}'."
            )

        if platform is None:

            if len(
                language_content.contents
            ) != 1:
                raise ValueError(
                    "Platform is required when multiple "
                    "platform outputs exist."
                )

            platform_content = (
                language_content.contents[0]
            )

        else:

            platform_content = next(
                (
                    item
                    for item in (
                        language_content.contents
                    )
                    if item.platform.lower()
                    == platform.lower()
                ),
                None,
            )

            if platform_content is None:
                raise ValueError(
                    f"No generated content found for "
                    f"platform '{platform}'."
                )

        text = "\n\n".join(
            part.strip()
            for part in (
                platform_content.hook,
                platform_content.content,
                platform_content.call_to_action,
            )
            if part and part.strip()
        )

        return VoiceContent(
            text=text,
            language=(
                language_content.language
            ),
            platform=(
                platform_content.platform
            ),
        )

    @staticmethod
    def _extract_speech(
        *,
        output_content: str,
        language: str,
    ) -> VoiceContent:

        response = SpeechGenerateResponse.model_validate_json(
            output_content,
        )

        speech_content = next(
            (
                item
                for item in response.generated
                if item.language.lower() == language.lower()
            ),
            None,
        )

        if speech_content is None:
            raise ValueError(f"No generated speech found for language '{language}'.")

        return VoiceContent(
            text=speech_content.speech,
            language=speech_content.language,
            platform="speech",
        )

    @staticmethod
    def _extract_campaign(
        *,
        output_content: str,
        language: str,
    ) -> VoiceContent:

        response = CampaignGenerateResponse.model_validate_json(
            output_content,
        )

        campaign = next(
            (
                item
                for item in response.generated
                if item.language.lower() == language.lower()
            ),
            None,
        )

        if campaign is None:
            raise ValueError(f"No generated campaign found for language '{language}'.")

        text = "\n\n".join(
            part.strip()
            for part in (
                campaign.title,
                campaign.theme,
                campaign.main_message,
                *campaign.supporting_content,
                campaign.next_step,
            )
            if part and part.strip()
        )

        return VoiceContent(
            text=text,
            language=campaign.language,
            platform="campaign",
        )