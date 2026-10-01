from app.ai.image.adapters.base import (
    CreativeSourceAdapter,
)
from app.ai.image.schemas import (
    CreativeSourceContent,
)
from app.ai.responses.social import SocialGenerateResponse


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

        response = (
            SocialGenerateResponse
            .model_validate_json(
                output_content
            )
        )

        requested_language = (
            source_language
            .strip()
            .lower()
        )

        language_content = next(
            (
                item
                for item in response.generated
                if (
                    item.language.value
                    if hasattr(
                        item.language,
                        "value",
                    )
                    else str(
                        item.language
                    )
                )
                .strip()
                .lower()
                == requested_language
            ),
            None,
        )

        if language_content is None:
            raise ValueError(
                f"No generated content found for "
                f"language '{source_language}'."
            )

        if source_variant:

            requested_variant = (
                source_variant
                .strip()
                .lower()
            )

            content = next(
                (
                    item
                    for item
                    in language_content.contents
                    if (
                        item.platform.value
                        if hasattr(
                            item.platform,
                            "value",
                        )
                        else str(
                            item.platform
                        )
                    )
                    .strip()
                    .lower()
                    == requested_variant
                ),
                None,
            )

            if content is None:
                raise ValueError(
                    f"No generated content found for "
                    f"variant '{source_variant}'."
                )

        else:

            if len(
                language_content.contents
            ) != 1:
                raise ValueError(
                    "Source variant is required when "
                    "multiple content variants exist."
                )

            content = (
                language_content.contents[0]
            )

        return CreativeSourceContent(
            title=content.hook,
            body=content.content,
            call_to_action=(
                content.call_to_action
            ),
            hashtags=(
                content.hashtags
            ),
        )