import os
from unittest.mock import patch

from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_home_and_health():
    assert client.get("/").json() == {"message": "API Running!", "status": "active"}
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
