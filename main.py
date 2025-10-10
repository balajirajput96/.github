from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
from typing import List
import os
import requests
from dotenv import load_dotenv
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError

load_dotenv()

app = FastAPI(title="ML, GitHub, and Slack API")

class PredictionInput(BaseModel):
    features: List[float]

class SlackMessage(BaseModel):
    text: str

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
        # Load your model: prediction = model.predict(input_data)
        prediction = np.random.random() * 100
        return {"prediction": float(prediction)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/github-repos")
def get_github_repos():
    github_token = os.getenv("GITHUB_TOKEN")
    if not github_token or github_token == "YOUR_NEW_GITHUB_TOKEN_HERE":
        raise HTTPException(status_code=400, detail="GitHub token not configured. Please set it in your .env file.")

    headers = {
        "Authorization": f"token {github_token}",
        "Accept": "application/vnd.github.v3+json",
    }
    url = "https://api.github.com/user/repos"

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise an exception for bad status codes (4xx or 5xx)
        repos = response.json()
        repo_names = [repo["name"] for repo in repos]
        return {"repositories": repo_names}
    except requests.exceptions.HTTPError as http_err:
        if response.status_code == 401:
            raise HTTPException(status_code=401, detail="Unauthorized. Check your GitHub token.")
        raise HTTPException(status_code=response.status_code, detail=f"HTTP error occurred: {http_err}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@app.post("/send-slack-message")
def send_slack_message(message: SlackMessage):
    slack_token = os.getenv("SLACK_BOT_TOKEN")
    channel_id = os.getenv("SLACK_CHANNEL_ID")

    if not slack_token or slack_token == "YOUR_SLACK_BOT_TOKEN_HERE":
        raise HTTPException(status_code=400, detail="Slack token not configured. Please set it in your .env file.")
    if not channel_id or channel_id == "YOUR_SLACK_CHANNEL_ID_HERE":
        raise HTTPException(status_code=400, detail="Slack channel ID not configured. Please set it in your .env file.")

    client = WebClient(token=slack_token)

    try:
        response = client.chat_postMessage(
            channel=channel_id,
            text=message.text
        )
        return {"ok": True, "message": f"Message sent to channel {channel_id}"}
    except SlackApiError as e:
        # You can handle specific errors here
        error_message = e.response["error"]
        raise HTTPException(status_code=500, detail=f"Slack API error: {error_message}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")