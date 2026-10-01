from app.models.enums import ContentLength

CAMPAIGN_LENGTH_GUIDANCE = {
    ContentLength.SHORT: """
Create a concise campaign communication.

Target approximately 120-200 words per language.

Use:
- a concise title;
- a short campaign theme;
- one clear main message;
- 1-2 supporting paragraphs;
- one clear next step.
""",

    ContentLength.MEDIUM: """
Create a moderately detailed campaign communication.

Target approximately 250-450 words per language.

Use:
- a clear campaign title;
- a campaign theme;
- a developed main message;
- 2-4 substantial supporting paragraphs;
- one clear next step.
""",

    ContentLength.LONG: """
Create a comprehensive campaign communication.

Target approximately 500-800 words per language.

Use:
- a strong campaign title;
- a clear campaign theme;
- a fully developed main message;
- 4-7 substantial supporting paragraphs;
- enough context and explanation for the audience to understand why the campaign matters;
- a clear and appropriate next step.

Do not compress the campaign into a short caption or summary.
""",

    ContentLength.EXTENDED: """
Create an extended, highly developed campaign communication.

Target approximately 900-1,400 words per language.

Use:
- a strong campaign title;
- a clear and memorable campaign theme;
- a substantial opening main message;
- 7-12 well-developed supporting paragraphs;
- deeper explanation of the issue, purpose, context, implications, and audience relevance;
- careful development of the campaign's reasoning and persuasive message;
- clear transitions between ideas;
- a strong concluding section that reinforces the campaign objective;
- one clear and contextually appropriate next step.

The result should feel like a complete institutional/public-interest campaign communication asset,
not a summary, caption, announcement, or social-media post.

Do not pad the response with repetition merely to reach the requested length.
Every paragraph should contribute meaningful campaign information or persuasion.
""",
}