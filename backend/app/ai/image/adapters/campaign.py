import json

from app.ai.image.adapters.base import (
    CreativeSourceAdapter,
)
from app.ai.image.schemas import (
    CreativeSourceContent,
)


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

        try:
            payload = json.loads(
                output_content
            )
        except json.JSONDecodeError as exc:
            raise ValueError(
                "Generated campaign content is not valid JSON."
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

        selected_content = None

        for item in generated:

            language = str(
                item.get(
                    "language",
                    "",
                )
            ).strip().lower()

            if language == requested_language:
                selected_content = item
                break

        if selected_content is None:
            raise ValueError(
                f"No generated campaign content found "
                f"for language '{source_language}'."
            )

        supporting_content = (
            selected_content.get(
                "supporting_content",
                [],
            )
        )

        if not isinstance(
            supporting_content,
            list,
        ):
            supporting_content = []

        theme = selected_content.get(
            "theme"
        )

        supporting_text: list[str] = []

        if theme:
            supporting_text.append(
                str(theme)
            )

        supporting_text.extend(
            str(item)
            for item in supporting_content
        )

        return CreativeSourceContent(
            title=selected_content.get(
                "title"
            ),
            body=(
                selected_content.get(
                    "main_message"
                )
                or ""
            ),
            call_to_action=(
                selected_content.get(
                    "next_step"
                )
            ),
            supporting_text=(
                supporting_text
            ),
            hashtags=[],
        )