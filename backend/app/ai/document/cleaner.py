import re


class DocumentCleaner:

    @staticmethod
    def clean(
        text: str,
    ) -> str:

        if not text:
            return ""

        # Normalize line endings
        text = text.replace(
            "\r\n",
            "\n",
        ).replace(
            "\r",
            "\n",
        )

        # Remove null characters
        text = text.replace(
            "\x00",
            "",
        )

        # Collapse spaces/tabs,
        # but preserve paragraph structure
        text = re.sub(
            r"[ \t]+",
            " ",
            text,
        )

        # Remove spaces around newlines
        text = re.sub(
            r" *\n *",
            "\n",
            text,
        )

        # Collapse excessive blank lines
        text = re.sub(
            r"\n{3,}",
            "\n\n",
            text,
        )

        return text.strip()