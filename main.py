import os
from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel
import requests
from dotenv import load_dotenv
import hmac
import hashlib

# Load environment variables from .env file
load_dotenv()

app = FastAPI(title="AI Automation Platform")

# --- Pydantic Models for GitHub Webhook Payload ---

class GitHubIssue(BaseModel):
    title: str
    html_url: str

class GitHubPayload(BaseModel):
    action: str
    issue: GitHubIssue

# --- Jira Integration Logic ---

def create_jira_issue(issue_title: str, issue_url: str):
    jira_domain = os.getenv("JIRA_DOMAIN")
    jira_username = os.getenv("JIRA_USERNAME")
    jira_api_token = os.getenv("JIRA_API_TOKEN")
    jira_project_key = os.getenv("JIRA_PROJECT_KEY")

    if not all([jira_domain, jira_username, jira_api_token, jira_project_key]):
        raise HTTPException(status_code=500, detail="Jira credentials are not fully configured.")

    url = f"https://{jira_domain}/rest/api/3/issue"

    auth = (jira_username, jira_api_token)

    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }

    payload = {
        "fields": {
            "project": {
                "key": jira_project_key
            },
            "summary": issue_title,
            "description": {
                "type": "doc",
                "version": 1,
                "content": [
                    {
                        "type": "paragraph",
                        "content": [
                            {
                                "type": "text",
                                "text": f"Original GitHub issue: {issue_url}"
                            }
                        ]
                    }
                ]
            },
            "issuetype": {
                "name": "Task"  # Or "Story", "Bug", etc., depending on your Jira setup
            }
        }
    }

    try:
        response = requests.post(url, headers=headers, json=payload, auth=auth)
        response.raise_for_status()  # Raise an exception for bad status codes
        return response.json()
    except requests.exceptions.HTTPError as http_err:
        raise HTTPException(status_code=response.status_code, detail=f"Jira API error: {http_err} - {response.text}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

# --- Root Endpoint ---

@app.get("/")
def read_root():
    return {"message": "AI Automation Platform is running"}

# --- Webhook Endpoint ---

@app.post("/webhook/github")
async def github_webhook(request: Request, payload: GitHubPayload):
    # 1. Verify the webhook signature
    secret = os.getenv("GITHUB_WEBHOOK_SECRET")
    if not secret:
        raise HTTPException(status_code=500, detail="GitHub webhook secret not configured.")

    signature_header = request.headers.get("X-Hub-Signature-256")
    if not signature_header:
        raise HTTPException(status_code=400, detail="X-Hub-Signature-256 header is missing.")

    body = await request.body()
    h = hmac.new(secret.encode("utf-8"), body, hashlib.sha256)
    expected_signature = "sha256=" + h.hexdigest()

    if not hmac.compare_digest(expected_signature, signature_header):
        raise HTTPException(status_code=400, detail="Request signature does not match.")

    # 2. Check if it's a new issue event
    if payload.action == "opened":
        # 3. Create a Jira issue
        jira_response = create_jira_issue(
            issue_title=payload.issue.title,
            issue_url=payload.issue.html_url
        )
        return {
            "message": "New GitHub issue processed and Jira issue created.",
            "jira_issue": jira_response
        }

    return {"message": f"Ignoring action: {payload.action}"}