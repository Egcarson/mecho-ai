from app.schemas.campaign_context import CampaignContext
from app.services.audience_guides import AUDIENCE_GUIDES
from app.services.platform_guides import PLATFORM_GUIDES
from app.schemas.trend_context import TrendContext
from app.schemas.trend_context import TrendContext

def build_platform_guidance(platforms: list[str]) -> str:
    sections: list[str] = []

    for platform in platforms:
        guide = PLATFORM_GUIDES.get(platform)
        if guide:
            sections.append(f"{platform}\n{guide}")

    return "\n\n".join(sections)


def build_audience_guidance(audiences: list[str]) -> str:
    sections: list[str] = []

    for audience in audiences:
        guide = AUDIENCE_GUIDES.get(audience)
        if guide:
            sections.append(f"{audience}\n{guide}")

    return "\n\n".join(sections)


def build_localization_rules() -> str:
    return """
LOCALIZATION

Do not translate literally.

Adapt naturally for the target culture.

Maintain identical meaning.

Maintain emotional tone.

Maintain the intended call-to-action.

Use natural expressions.

Avoid awkward wording.

For Yoruba, Igbo, Hausa and Nigerian Pidgin, write exactly as a native speaker would.

If a requested language is unsupported, return the English version.
"""


def build_output_schema() -> str:
    return """
OUTPUT FORMAT

Return ONLY valid JSON.

{
  "generated": [
    {
      "language": "...",
      "contents": [
        {
          "platform": "...",
          "hook": "...",
          "content": "...",
          "call_to_action": "...",
          "hashtags": [
            "...",
            "..."
          ]
        }
      ]
    }
  ]
}
"""


def build_social_prompt(
    context: CampaignContext,
    trends: TrendContext,
) -> str:

    return f"""
WORKFLOW

Social Media Content Generation

OBJECTIVE

Generate highly engaging, platform-native social media content.

REFERENCE MATERIAL

{context.source_text or "None"}

USER CONTENT

{context.content or "None"}

CREATIVE BRIEF

{context.brief or "None"}

CONTENT SETTINGS

Tone:
{context.tone}

Languages:
{", ".join(context.languages)}

Platforms:
{", ".join(context.platforms)}

Audience Categories:
{", ".join(context.audiences) or "General Public"}

Include Emojis:
{context.include_emojis}

Include Hashtags:
{context.include_hashtags}

PLATFORM GUIDANCE

{build_platform_guidance(context.platforms)}

AUDIENCE GUIDANCE

{build_audience_guidance(context.audiences)}

{build_trend_section(trends)}

CONTENT RULES

Use the supplied source document as reference.

Prioritize factual accuracy.

Never fabricate missing information.

Do not invent facts.

Generate unique content for every platform.

Each platform should feel native.

Hooks should maximize engagement.

Optimize for conversions.

Choose hashtags based on discoverability,
not by extracting random words from the content.

{build_localization_rules()}

{build_output_schema()}
"""


def build_professional_prompt(
    context: CampaignContext,
    trends: TrendContext,
) -> str:

    return f"""
WORKFLOW

Professional Campaign

CAMPAIGN OVERVIEW

Title:
{context.campaign_title}

Goal:
{context.campaign_goal}

Primary Audience:
{context.target_audience}

Audience Categories:
{", ".join(context.audiences) or "General Public"}

Key Message:
{context.key_message}

Call To Action:
{context.call_to_action}

Additional Notes:
{context.additional_notes}

REFERENCE DOCUMENT

{context.source_text or "None"}

SETTINGS

Tone:
{context.tone}

Languages:
{", ".join(context.languages)}

Platforms:
{", ".join(context.platforms)}

Include Emojis:
{context.include_emojis}

Include Hashtags:
{context.include_hashtags}

PLATFORM GUIDANCE

{build_platform_guidance(context.platforms)}

AUDIENCE GUIDANCE

{build_audience_guidance(context.audiences)}

{build_trend_section(trends)}

CAMPAIGN RULES

Use the supplied reference document as the primary source of truth.

Do not invent facts.

If information is unavailable, omit it rather than guessing.

Never invent facts.

Generate persuasive,
professionally structured,
conversion-focused campaign content.

Each platform must receive unique content.

Maintain the campaign objective across all outputs.

{build_localization_rules()}

{build_output_schema()}
"""


def build_prompt(
    context: CampaignContext,
    trends: TrendContext,
) -> str:

    if context.workflow == "social":
        return build_social_prompt(
            context,
            trends,
        )

    return build_professional_prompt(
        context,
        trends,
    )

def build_trend_section(
    trends: TrendContext,
) -> str:

    if not trends.enabled:
        return ""

    topics = "\n".join(
        f"- {topic}" for topic in trends.topics
    )

    hashtags = ", ".join(trends.hashtags)

    return f"""
TREND INTELLIGENCE

Current Country:
{trends.country}

Relevant Trending Topics:
{topics}

Suggested Trending Hashtags:
{hashtags}

IMPORTANT

Use these trends ONLY if they naturally fit the campaign.

Do not force unrelated current events.

Prefer subtle references instead of making trends the main subject.

If none are relevant, ignore them completely.
"""