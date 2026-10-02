from typing import cast

from app.ai.context.base import PromptContext
from app.ai.context.campaign import CampaignPromptContext
from app.ai.context.content import ContentPromptContext
from app.ai.context.serializer import (
        ContextSerializer,
)
from app.ai.context.speech import SpeechPromptContext
from app.ai.prompt.campaign import (
        CAMPAIGN_PROMPT,
)
from app.ai.prompt.length import CAMPAIGN_LENGTH_GUIDANCE
from app.ai.prompt.social import (
        SOCIAL_LENGTH_GUIDANCE,
        SOCIAL_PROMPT,
)
from app.ai.prompt.speech import (
        SPEECH_PROMPT,
        format_speech_memories,
)
from app.ai.prompt.system import (
        BASE_SYSTEM_PROMPT,
)
from app.models.enums import ProjectWorkflow


def calculate_word_range(
        duration_minutes: int,
    ) -> tuple[int, int]:

        minimum = duration_minutes * 120
        maximum = duration_minutes * 150

        return minimum, maximum


class PromptBuilder:

    def build_system_prompt(self) -> str:

        return BASE_SYSTEM_PROMPT

    # def build_system_prompt(
    #     self,
    #     workflow: ProjectWorkflow,
    # ) -> str:
    #     pass


    def build_user_prompt(
        self,
        workflow: ProjectWorkflow,
        context: PromptContext,
    ) -> str:

        context_data = ContextSerializer.serialize(
            context,
        )

        if workflow == ProjectWorkflow.SOCIAL:

            social_context = cast(
                ContentPromptContext,
                context,
            )

            context_data["length"] = (
                social_context.length.value
            )

            context_data["length_guidance"] = (
                SOCIAL_LENGTH_GUIDANCE[
                    social_context.length
                ]
            )

            return SOCIAL_PROMPT.format(
                **context_data,
            )

        if workflow == ProjectWorkflow.CAMPAIGN:

            campaign_context = cast(
                CampaignPromptContext,
                context,
            )

            context_data["length_guidance"] = (
                CAMPAIGN_LENGTH_GUIDANCE[
                    campaign_context.length
                ]
            )

            return CAMPAIGN_PROMPT.format(
                **context_data
            )

        if workflow == ProjectWorkflow.SPEECH:

            speech_context = cast(
                SpeechPromptContext,
                context,
            )

            minimum_words, maximum_words = calculate_word_range(
                speech_context.target_duration_minutes,
            )

            context_data["target_word_range"] = (
                f"{minimum_words}-{maximum_words}"
            )

            context_data["memories"] = format_speech_memories(
                speech_context.memories,
            )

            return SPEECH_PROMPT.format(
                **context_data,
            )


        raise ValueError(
            f"Unsupported workflow: {workflow}"
        )