from app.ai.image.adapters.registry import (
    IMAGE_SOURCE_ADAPTERS,
)
from app.ai.image.schemas import (
    CreativeSourceContent,
)
from app.ai.image.utils import (
    normalize_creative_output,
)
from app.models.enums import (
    ProjectWorkflow,
)


class CreativeSourceExtractor:

    def extract(
        self,
        *,
        workflow: ProjectWorkflow,
        output_content: str,
        source_language: str | None = None,
        source_variant: str | None = None,
    ) -> CreativeSourceContent:

        adapter = (
            IMAGE_SOURCE_ADAPTERS.get(
                workflow
            )
        )

        if adapter is None:
            raise ValueError(
                f"Image generation is not currently "
                f"supported for workflow "
                f"'{workflow.value}'."
            )

        normalized_output = (
            normalize_creative_output(
                output_content
            )
        )

        return adapter.extract(
            output_content=(
                normalized_output
            ),
            source_language=(
                source_language
            ),
            source_variant=(
                source_variant
            ),
        )