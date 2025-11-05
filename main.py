import hashlib
import hmac
import os
from typing import List

import numpy as np
import requests
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel, Field
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError

from utils.logger import setup_logger

load_dotenv()
logger = setup_logger(__name__)

app = FastAPI(title="AI Automation Platform")


class PredictionInput(BaseModel):
    features: List[float] = Field(..., max_length=1000)


class SlackMessage(BaseModel):
    text: str = Field(..., min_length=1, max_length=40_000)


class GitHubIssue(BaseModel):
    title: str
    html_url: str


class GitHubPayload(BaseModel):
    action: str
    issue: GitHubIssue


@app.get("/")
def read_root():
    return {"message": "AI Automation Platform is running"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/predict")
def predict(data: PredictionInput):
    try:
        input_data = np.array([data.features])
        prediction = np.random.random() * 100
        return {"prediction": float(prediction)}
    except Exception as exc:
        logger.exception("Prediction failed")
        raise HTTPException(status_code=500, detail="An internal error occurred") from exc


@app.get("/github-repos")
def get_github_repos():
    github_token = os.getenv("GITHUB_TOKEN")
    if not github_token or github_token.lower().startswith("your_"):
        raise HTTPException(status_code=400, detail="GitHub token not configured. Please set it in your .env file.")
    headers = {
        "Authorization": f"Bearer {github_token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    try:
        response = requests.get("https://api.github.com/user/repos", headers=headers, params={"per_page": 100}, timeout=10)
        response.raise_for_status()
        return {"repositories": [repo["name"] for repo in response.json()]}
    except requests.HTTPError as exc:
        status_code = response.status_code
        detail = "Unauthorized. Check the GitHub token." if status_code == 401 else f"GitHub API returned HTTP {status_code}."
        raise HTTPException(status_code=status_code, detail=detail) from exc
    except requests.RequestException as exc:
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
        raise HTTPException(status_code=502, detail=f"Slack API error: {error}") from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail="Slack API request failed.") from exc


def create_jira_issue(issue_title: str, issue_url: str):
    jira_domain = os.getenv("JIRA_DOMAIN", "").strip().removeprefix("https://").removeprefix("http://").rstrip("/")
    jira_username = os.getenv("JIRA_USERNAME")
    jira_api_token = os.getenv("JIRA_API_TOKEN")
    jira_project_key = os.getenv("JIRA_PROJECT_KEY")
    if not all([jira_domain, jira_username, jira_api_token, jira_project_key]):
        raise HTTPException(status_code=500, detail="Jira credentials are not fully configured.")

    payload = {
        "fields": {
            "project": {"key": jira_project_key},
            "summary": issue_title[:255],
            "description": {
                "type": "doc",
                "version": 1,
                "content": [{"type": "paragraph", "content": [{"type": "text", "text": f"Original GitHub issue: {issue_url}"}]}],
            },
            "issuetype": {"name": "Task"},
        }
    }
    try:
        response = requests.post(
            f"https://{jira_domain}/rest/api/3/issue",
            headers={"Accept": "application/json", "Content-Type": "application/json"},
            json=payload,
            auth=(jira_username, jira_api_token),
            timeout=10,
        )
        response.raise_for_status()
        return response.json()
    except requests.HTTPError as exc:
        raise HTTPException(status_code=response.status_code, detail=f"Jira API error: HTTP {response.status_code}.") from exc
    except requests.RequestException as exc:
        raise HTTPException(status_code=502, detail="Jira API request failed.") from exc


@app.post("/webhook/github")
async def github_webhook(request: Request, payload: GitHubPayload):
    secret = os.getenv("GITHUB_WEBHOOK_SECRET")
    if not secret or secret.lower().startswith("your_"):
        raise HTTPException(status_code=500, detail="GitHub webhook secret not configured.")
    signature_header = request.headers.get("X-Hub-Signature-256")
    if not signature_header:
        raise HTTPException(status_code=400, detail="X-Hub-Signature-256 header is missing.")
    body = await request.body()
    expected_signature = "sha256=" + hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected_signature, signature_header):
        raise HTTPException(status_code=400, detail="Request signature does not match.")
    if payload.action != "opened":
        return {"message": f"Ignoring action: {payload.action}"}
    jira_response = create_jira_issue(payload.issue.title, payload.issue.html_url)
    return {"message": "New GitHub issue processed and Jira issue created.", "jira_issue": jira_response}
