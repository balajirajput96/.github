import pytest
from fastapi.testclient import TestClient
from main import app
import os
import hmac
import hashlib

client = TestClient(app)

# --- Test Data ---
SECRET = "test-secret"
os.environ["GITHUB_WEBHOOK_SECRET"] = SECRET

# A sample GitHub webhook payload for a new issue
SAMPLE_PAYLOAD = {
    "action": "opened",
    "issue": {
        "title": "Test Issue from Pytest",
        "html_url": "https://github.com/test/repo/issues/1"
    }
}

# --- Helper Function ---
def create_signature(payload_body):
    h = hmac.new(SECRET.encode("utf-8"), payload_body, hashlib.sha256)
    return "sha256=" + h.hexdigest()

# --- Tests ---

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "AI Automation Platform is running"}

def test_webhook_missing_signature():
    response = client.post("/webhook/github", json=SAMPLE_PAYLOAD)
    assert response.status_code == 400
    assert "missing" in response.json()["detail"]

def test_webhook_invalid_signature():
    headers = {"X-Hub-Signature-256": "sha256=invalid_signature"}
    response = client.post("/webhook/github", json=SAMPLE_PAYLOAD, headers=headers)
    assert response.status_code == 400
    assert "does not match" in response.json()["detail"]

def test_webhook_ignores_other_actions():
    payload = SAMPLE_PAYLOAD.copy()
    payload["action"] = "closed"

    import json
    body = json.dumps(payload).encode('utf-8')
    headers = {"X-Hub-Signature-256": create_signature(body)}

    response = client.post("/webhook/github", content=body, headers=headers)
    assert response.status_code == 200
    assert "Ignoring action: closed" in response.json()["message"]

def test_webhook_jira_credentials_not_configured():
    # This test simulates a valid GitHub webhook but assumes Jira is not configured
    # It expects a 500 error because the app can't proceed

    # Clean up any potentially set Jira env vars
    for key in ["JIRA_DOMAIN", "JIRA_USERNAME", "JIRA_API_TOKEN", "JIRA_PROJECT_KEY"]:
        if key in os.environ:
            del os.environ[key]

    import json
    body = json.dumps(SAMPLE_PAYLOAD).encode('utf-8')
    headers = {"X-Hub-Signature-256": create_signature(body)}

    response = client.post("/webhook/github", content=body, headers=headers)
    assert response.status_code == 500
    assert "Jira credentials are not fully configured" in response.json()["detail"]