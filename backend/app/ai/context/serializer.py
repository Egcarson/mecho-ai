from app.ai.context.base import PromptContext


class ContextSerializer:

    @staticmethod
    def serialize(
        context: PromptContext,
    ) -> dict:

        return context.model_dump()