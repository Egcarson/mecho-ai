import json

from app.ai.image.adapters.base import (
    CreativeSourceAdapter,
)
from app.ai.image.schemas import (
    CreativeSourceContent,
)


class SocialCreativeSourceAdapter(
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

        if not source_variant:
            raise ValueError(
                "Source platform is required."
            )

        try:
            payload = json.loads(
                output_content
            )
        except json.JSONDecodeError as exc:
            raise ValueError(
                "Generated social content is not valid JSON."
            ) from exc

        generated = payload.get(
            "generated",
            [],
        )

        requested_language = (
            source_language
            .strip()
            .lower()
        )

        requested_platform = (
            source_variant
            .strip()
            .lower()
        )

        selected_language = None

        for item in generated:

            language = str(
                item.get(
                    "language",
                    "",
                )
            ).strip().lower()

            if language == requested_language:
                selected_language = item
                break

        if selected_language is None:
            raise ValueError(
                f"No generated content found for "
                f"language '{source_language}'."
            )

        selected_content = None

        for item in selected_language.get(
            "contents",
            [],
        ):

            platform = str(
                item.get(
                    "platform",
                    "",
                )
            ).strip().lower()

            if platform == requested_platform:
                selected_content = item
                break

        if selected_content is None:
            raise ValueError(
                f"No generated content found for "
                f"platform '{source_variant}' "
                f"in language '{source_language}'."
            )

        hashtags = selected_content.get(
            "hashtags",
            [],
        )

        if not isinstance(
            hashtags,
            list,
        ):
            hashtags = []

        return CreativeSourceContent(
            title=selected_content.get(
                "hook"
            ),
            body=(
                selected_content.get(
                    "content"
                )
                or ""
            ),
            call_to_action=(
                selected_content.get(
                    "call_to_action"
                )
            ),
            supporting_text=[],
            hashtags=[
                str(item)
                for item in hashtags
            ],
        )