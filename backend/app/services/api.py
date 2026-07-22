import requests

BASE_URL = "http://localhost:8000"

def analyze_content(
    content,
    uploaded_file,
):
    data = {
        "workflow": "content",
        "content": content,
    }

    files = None

    if uploaded_file:

        files = {
            "file": (
                uploaded_file.name,
                uploaded_file.getvalue(),
                "application/pdf",
            )
        }

    response = requests.post(
        f"{BASE_URL}/analyze/content",
        data=data,
        files=files,
    )

    return response.json()

def analyze_campaign(
    campaign,
    uploaded_file,
):
    data = {
        "workflow": "content",
        "content": campaign,
    }

    files = None

    if uploaded_file:

        files = {
            "file": (
                uploaded_file.name,
                uploaded_file.getvalue(),
                "application/pdf",
            )
        }
    response = requests.post(
        f"{BASE_URL}/analyze/campaign",
        data=data,
        files=files
    )

    return response.json()