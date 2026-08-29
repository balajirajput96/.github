import hashlib
import hmac
import json
from unittest.mock import patch

from fastapi.testclient import TestClient

from main import app

client = TestClient(app)
SECRET = "test-secret"
SAMPLE_PAYLOAD = {
    "action": "opened",
    "issue": {
        "title": "Test Issue",
        "html_url": "https://github.com/test/repo/issues/1",
    },
}


def signature(body: bytes) -> str:
    return "sha256=" + hmac.new(SECRET.encode(), body, hashlib.sha256).hexdigest()


def test_home_and_health():
    assert client.get("/").json() == {"message": "AI Automation Platform is running", "status": "active"}
    assert client.get("/health").json() == {"status": "healthy"}


def test_predict():
    response = client.post("/predict", json={"features": [5.1, 3.5, 1.4, 0.2]})
    assert response.status_code == 200
    assert "prediction" in response.json()


def test_github_requires_token(monkeypatch):
    monkeypatch.delenv("GITHUB_TOKEN", raising=False)
    response = client.get("/github-repos")
    assert response.status_code == 400
    assert "GitHub token not configured" in response.json()["detail"]


def test_github_repositories_filters_invalid_items(monkeypatch):
    monkeypatch.setenv("GITHUB_TOKEN", "test-token")
    fake_response = type("Response", (), {
        "status_code": 200,
        "json": lambda self: [{"name": "repo-a"}, {"bad": "item"}, {"name": "repo-b"}],
        "raise_for_status": lambda self: None,
    })()
    with patch("main.requests.get", return_value=fake_response) as mock_get:
        response = client.get("/github-repos")
    assert response.status_code == 200
    assert response.json() == {"repositories": ["repo-a", "repo-b"]}
    mock_get.assert_called_once()


def test_slack_requires_token(monkeypatch):
    monkeypatch.delenv("SLACK_BOT_TOKEN", raising=False)
    response = client.post("/send-slack-message", json={"text": "hello"})
    assert response.status_code == 400
    assert "Slack token not configured" in response.json()["detail"]


def test_slack_requires_channel(monkeypatch):
    monkeypatch.setenv("SLACK_BOT_TOKEN", "dummy-token")
    monkeypatch.delenv("SLACK_CHANNEL_ID", raising=False)
    response = client.post("/send-slack-message", json={"text": "hello"})
    assert response.status_code == 400
    assert "Slack channel ID not configured" in response.json()["detail"]


def test_slack_message_is_sent(monkeypatch):
    monkeypatch.setenv("SLACK_BOT_TOKEN", "dummy-token")
    monkeypatch.setenv("SLACK_CHANNEL_ID", "C123")
    fake_client = type("FakeClient", (), {
        "chat_postMessage": lambda self, **kwargs: {"ok": True}
    })()
    with patch("main.WebClient", return_value=fake_client) as mock_client:
        response = client.post("/send-slack-message", json={"text": "hello"})
    assert response.status_code == 200
    assert response.json() == {"ok": True, "message": "Message sent successfully."}
    mock_client.assert_called_once_with(token="dummy-token")


def test_webhook_requires_signature(monkeypatch):
    monkeypatch.setenv("GITHUB_WEBHOOK_SECRET", SECRET)
    response = client.post("/webhook/github", json=SAMPLE_PAYLOAD)
    assert response.status_code == 400
    assert "missing" in response.json()["detail"]


def test_webhook_rejects_invalid_signature(monkeypatch):
    monkeypatch.setenv("GITHUB_WEBHOOK_SECRET", SECRET)
    response = client.post(
        "/webhook/github",
        json=SAMPLE_PAYLOAD,
        headers={"X-Hub-Signature-256": "sha256=invalid"},
    )
    assert response.status_code == 400
    assert "does not match" in response.json()["detail"]


def test_webhook_ignores_non_opened_action(monkeypatch):
    monkeypatch.setenv("GITHUB_WEBHOOK_SECRET", SECRET)
    payload = dict(SAMPLE_PAYLOAD)
    payload["action"] = "closed"
    body = json.dumps(payload).encode("utf-8")
    response = client.post(
        "/webhook/github",
        content=body,
        headers={"Content-Type": "application/json", "X-Hub-Signature-256": signature(body)},
    )
    assert response.status_code == 200
    assert response.json() == {"message": "Ignoring action: closed"}


def test_webhook_requires_jira_credentials(monkeypatch):
    monkeypatch.setenv("GITHUB_WEBHOOK_SECRET", SECRET)
    for key in ("JIRA_DOMAIN", "JIRA_USERNAME", "JIRA_API_TOKEN", "JIRA_PROJECT_KEY"):
        monkeypatch.delenv(key, raising=False)
    body = json.dumps(SAMPLE_PAYLOAD).encode("utf-8")
    response = client.post(
        "/webhook/github",
        content=body,
        headers={"Content-Type": "application/json", "X-Hub-Signature-256": signature(body)},
    )
    assert response.status_code == 500
    assert "Jira credentials are not fully configured" in response.json()["detail"]
