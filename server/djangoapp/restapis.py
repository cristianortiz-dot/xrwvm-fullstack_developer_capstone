import os
import requests
from dotenv import load_dotenv

load_dotenv()

backend_url = os.getenv(
    'backend_url', os.getenv('BACKEND_URL', 'http://localhost:3030/')
)
sentiment_analyzer_url = os.getenv(
    'sentiment_analyzer_url',
    os.getenv('SENTIMENT_ANALYZER_URL', 'http://localhost:5050/')
)


def get_request(endpoint, **kwargs):
    """Realiza una petición GET al backend Node/Express + MongoDB."""
    params = ""
    if kwargs:
        for key, value in kwargs.items():
            params = params + key + "=" + str(value) + "&"

    request_url = backend_url + endpoint + "?" + params

    print(f"GET from {request_url}")
    try:
        response = requests.get(request_url)
        return response.json()
    except Exception:  # noqa: BLE001
        print("Network exception occurred")
        return {"status": 500, "message": "Network exception occurred"}


def analyze_review_sentiments(text):
    """Consume el microservicio de análisis de sentimientos (NLTK)."""
    request_url = sentiment_analyzer_url + "analyze/" + text
    try:
        response = requests.get(request_url)
        return response.json()
    except Exception as err:  # noqa: BLE001
        print(f"Unexpected {err=}, {type(err)=}")
        print("Network exception occurred")
        return {"sentiment": "neutral"}


def post_review(data_dict):
    """Envía (POST) una nueva reseña al backend Node/Express + MongoDB."""
    request_url = backend_url + "insert_review"
    try:
        response = requests.post(request_url, json=data_dict)
        return response.json()
    except Exception:  # noqa: BLE001
        print("Network exception occurred")
        return {"status": 500, "message": "Network exception occurred"}
