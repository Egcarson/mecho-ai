import json
from typing import Any


def normalize_creative_output(
    output_content: str,
) -> str:
    """
    Normalize workflow-generated JSON before image adapters parse it.

    This keeps image generation tolerant of casing differences like:

    pidgin -> Pidgin
    english -> English
    x -> X
    tiktok -> TIKTOK

    without modifying the original Social, Campaign,
    or future workflow response schemas.
    """

    try:
        data = json.loads(
            output_content
        )
    except json.JSONDecodeError as exc:
        raise ValueError(
            "Generated content is not valid JSON."
        ) from exc

    normalized = _normalize_node(
        data
    )

    return json.dumps(
        normalized
    )


def _normalize_node(
    value: Any,
) -> Any:

    if isinstance(value, dict):

        normalized_dict = {}

        for key, item in value.items():

            if (
                key == "language"
                and isinstance(item, str)
            ):
                normalized_dict[key] = (
                    _normalize_language(
                        item
                    )
                )

            elif (
                key == "platform"
                and isinstance(item, str)
            ):
                normalized_dict[key] = (
                    _normalize_platform(
                        item
                    )
                )

            else:
                normalized_dict[key] = (
                    _normalize_node(
                        item
                    )
                )

        return normalized_dict

    if isinstance(value, list):

        return [
            _normalize_node(item)
            for item in value
        ]

    return value


def _normalize_language(
    value: str,
) -> str:

    languages = {
        "english": "English",
        "pidgin": "Pidgin",
        "yoruba": "Yoruba",
        "igbo": "Igbo",
        "hausa": "Hausa",
    }

    normalized = value.strip().lower()

    return languages.get(
        normalized,
        value,
    )


def _normalize_platform(
    value: str,
) -> str:

    platforms = {
        "instagram": "Instagram",
        "linkedin": "LinkedIn",
        "facebook": "Facebook",
        "youtube": "YouTube",
        "x": "X",
        "twitter": "X",
        "tiktok": "TIKTOK",
    }

    normalized = (
        value
        .strip()
        .lower()
    )

    return platforms.get(
        normalized,
        value,
    )