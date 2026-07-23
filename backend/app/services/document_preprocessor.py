import re


MAX_LENGTH = 6000


def preprocess_document(text: str) -> str:
    """
    Cleans extracted documents before prompt construction.
    """

    if not text:
        return ""

    # normalize whitespace
    text = re.sub(r"\r\n?", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[ \t]{2,}", " ", text)

    # remove repeated blank lines
    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    text = "\n".join(lines)

    # trim oversized documents
    if len(text) > MAX_LENGTH:
        text = text[:MAX_LENGTH]

    return text.strip()