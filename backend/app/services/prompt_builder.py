from app.schemas.request import GenerateRequest
from app.services.audience_guides import AUDIENCE_GUIDES
from app.services.platform_guides import PLATFORM_GUIDES


def build_platform_guidance(platforms: list[str]) -> str:
    sections = []

    for platform in platforms:
        guide = PLATFORM_GUIDES.get(platform)
        if guide:
            sections.append(f"{platform}\n{guide}")

    return "\n\n".join(sections)


def build_audience_guidance(audiences: list[str]) -> str:
    sections = []

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

Maintain CTA.

Use natural expressions.

Avoid awkward wording.

For Yoruba, Igbo, Hausa and Nigerian Pidgin, sound like a native speaker.

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
    request: GenerateRequest,
    source_text: str,
) -> str:

    return f"""
WORKFLOW

Social Media Content Generation

OBJECTIVE

Generate highly engaging and platform-native content.

SOURCE DOCUMENT

{source_text or "None"}

USER CONTENT

{request.content or "None"}

CREATIVE BRIEF

{request.brief or "None"}

CONTENT SETTINGS

Tone:
{request.tone}

Languages:
{", ".join(request.languages)}

Platforms:
{", ".join(request.platforms)}

Audience Categories:
{", ".join(request.audiences) or "General Public"}

Include Emojis:
{request.includeEmojis}

Include Hashtags:
{request.includeHashtags}

PLATFORM GUIDANCE

{build_platform_guidance(request.platforms)}

AUDIENCE GUIDANCE

{build_audience_guidance(request.audiences)}

CONTENT RULES

If the source material is long,
internally summarize it first.

Never invent facts.

Generate unique content for every platform.

Each platform must feel native.

Hooks must maximize engagement.

Optimize for conversions.

Choose hashtags based on discoverability,
not by extracting words from the content.

{build_localization_rules()}

{build_output_schema()}
"""


def build_professional_prompt(
    request: GenerateRequest,
    source_text: str,
) -> str:

    return f"""
WORKFLOW

Professional Campaign

CAMPAIGN OVERVIEW

Title:
{request.campaignTitle}

Goal:
{request.campaignGoal}

Primary Audience:
{request.targetAudience}

Audience Categories:
{", ".join(request.audiences) or "General Public"}

Key Message:
{request.keyMessage}

Call To Action:
{request.callToAction}

Additional Notes:
{request.additionalNotes}

REFERENCE DOCUMENT

{source_text or "None"}

SETTINGS

Tone:
{request.tone}

Languages:
{", ".join(request.languages)}

Platforms:
{", ".join(request.platforms)}

PLATFORM GUIDANCE

{build_platform_guidance(request.platforms)}

AUDIENCE GUIDANCE

{build_audience_guidance(request.audiences)}

CAMPAIGN RULES

If the reference document is long,
internally summarize it first.

Do not invent facts.

Generate persuasive,
conversion-focused,
professionally structured campaigns.

Every platform should receive unique content.

Maintain the campaign objective.

{build_localization_rules()}

{build_output_schema()}
"""


def build_prompt(
    request: GenerateRequest,
    source_text: str,
) -> str:

    if request.workflow == "social":
        return build_social_prompt(
            request=request,
            source_text=source_text,
        )

    return build_professional_prompt(
        request=request,
        source_text=source_text,
    )