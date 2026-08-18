import os
from typing import List

import numpy as np
import requests
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError

from utils.logger import setup_logger

load_dotenv()
logger = setup_logger(__name__)

app = FastAPI(title="ML, GitHub, and Slack API")


class PredictionInput(BaseModel):
    """Input payload for the placeholder prediction endpoint."""

    features: List[float] = Field(..., max_length=1000)


class SlackMessage(BaseModel):
    text: str = Field(..., min_length=1, max_length=40_000)


@app.get("/")
def home():
    return {"message": "API Running!", "status": "active"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/predict")
def predict(data: PredictionInput):
    try:
        input_data = np.array([data.features])
        # Load your model here in a production deployment.
        prediction = np.random.random() * 100
        return {"prediction": float(prediction)}
    except Exception as exc:
        logger.exception("Prediction failed")
        raise HTTPException(status_code=500, detail="An internal error occurred") from exc


@app.get("/github-repos")
def get_github_repos():
    github_token = os.getenv("GITHUB_TOKEN")
    if not github_token or github_token.lower().startswith("your_"):
        raise HTTPException(
            status_code=400,
            detail="GitHub token not configured. Please set it in your .env file.",
        )

    headers = {
        "Authorization": f"Bearer {github_token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }

    try:
        response = requests.get(
            "https://api.github.com/user/repos",
            headers=headers,
            params={"per_page": 100},
            timeout=10,
        )
        response.raise_for_status()
        repositories = response.json()
        return {"repositories": [repo["name"] for repo in repositories]}
    except requests.HTTPError as exc:
        status_code = response.status_code
        detail = "Unauthorized. Check the GitHub token." if status_code == 401 else f"GitHub API returned HTTP {status_code}."
        raise HTTPException(status_code=status_code, detail=detail) from exc
    except requests.RequestException as exc:
        logger.warning("GitHub API request failed: %s", exc)
        raise HTTPException(status_code=502, detail="GitHub API request failed.") from exc


@app.post("/send-slack-message")
def send_slack_message(message: SlackMessage):
    slack_token = os.getenv("SLACK_BOT_TOKEN")
    channel_id = os.getenv("SLACK_CHANNEL_ID")
    if not slack_token or slack_token.lower().startswith("your_"):
        raise HTTPException(status_code=400, detail="Slack token not configured. Please set it in your .env file.")
    if not channel_id or channel_id.lower().startswith("your_"):
        raise HTTPException(status_code=400, detail="Slack channel ID not configured. Please set it in your .env file.")

    try:
        WebClient(token=slack_token).chat_postMessage(channel=channel_id, text=message.text)
        return {"ok": True, "message": "Message sent successfully."}
    except SlackApiError as exc:
        error = exc.response.get("error", "unknown_error")
        logger.warning("Slack API request failed: %s", error)
        raise HTTPException(status_code=502, detail=f"Slack API error: {error}") from exc
    except Exception as exc:
        logger.exception("Unexpected Slack error")
        raise HTTPException(status_code=502, detail="Slack API request failed.") from exc
