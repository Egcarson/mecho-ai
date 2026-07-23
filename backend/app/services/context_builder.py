from app.schemas.campaign_context import CampaignContext
from app.schemas.request import GenerateRequest
from app.services.document_preprocessor import preprocess_document


def build_context(
    request: GenerateRequest,
    extracted_text: str,
) -> CampaignContext:
    """
    Converts the incoming request into a normalized CampaignContext.

    This is the single source of truth used by the AI pipeline.
    """

    return CampaignContext(
        workflow=request.workflow,

        source_text=preprocess_document(extracted_text),

        content=request.content,
        brief=request.brief,

        campaign_title=request.campaignTitle,
        campaign_goal=request.campaignGoal,
        target_audience=request.targetAudience,
        key_message=request.keyMessage,
        call_to_action=request.callToAction,
        additional_notes=request.additionalNotes,

        tone=request.tone,

        languages=request.languages,
        platforms=request.platforms,
        audiences=request.audiences,

        include_emojis=request.includeEmojis,
        include_hashtags=request.includeHashtags,

        optimize_for_trends=request.optimizeForTrends,

        country=request.country,
    )