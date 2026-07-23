from __future__ import annotations

import os

import httpx

from app.schemas.campaign_context import CampaignContext
from app.schemas.trend_context import TrendContext

GNEWS_API_KEY = os.getenv("GNEWS_API_KEY")

GNEWS_URL = "https://gnews.io/api/v4/top-headlines"


async def build_trend_context(
    context: CampaignContext,
) -> TrendContext:
    """
    Returns live trend context.

    Falls back gracefully if:
    - trend optimization is disabled
    - API key missing
    - API unavailable
    """

    if not context.optimize_for_trends:
        return TrendContext(
            enabled=False,
            country=context.country,
        )

    if not GNEWS_API_KEY:
        return TrendContext(
            enabled=False,
            country=context.country,
        )

    try:

        params = {
            "country": context.country.lower(),
            "lang": "en",
            "max": 10,
            "apikey": GNEWS_API_KEY,
        }

        async with httpx.AsyncClient(timeout=15) as client:

            response = await client.get(
                GNEWS_URL,
                params=params,
            )

            response.raise_for_status()

            payload = response.json()

        articles = payload.get("articles", [])

        topics = []
        hashtags = set()

        for article in articles:

            title = article.get("title")

            if title:
                topics.append(title)

                for word in title.split():

                    word = (
                        word.replace(",", "")
                        .replace(".", "")
                        .replace(":", "")
                        .replace("-", "")
                    )

                    if (
                        len(word) > 5
                        and word[0].isupper()
                    ):
                        hashtags.add(f"#{word}")

        return TrendContext(
            enabled=True,
            country=context.country,
            topics=topics[:5],
            hashtags=sorted(list(hashtags))[:8],
            guidance=(
                "Only use a trend if it naturally aligns with the campaign. "
                "Never force unrelated current events into the content."
            ),
        )

    except Exception:

        return TrendContext(
            enabled=False,
            country=context.country,
        )