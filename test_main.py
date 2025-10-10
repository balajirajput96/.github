import pytest
from fastapi.testclient import TestClient
from main import app
import os

client = TestClient(app)

def test_home():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "API Running!", "status": "active"}

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_predict():
    response = client.post("/predict", json={"features": [5.1, 3.5, 1.4, 0.2]})
    assert response.status_code == 200
    assert "prediction" in response.json()

def test_get_github_repos_no_token():
    # Ensure the environment variable is not set for this test
    if "GITHUB_TOKEN" in os.environ:
        del os.environ["GITHUB_TOKEN"]

    response = client.get("/github-repos")
    assert response.status_code == 400
    assert response.json() == {"detail": "GitHub token not configured. Please set it in your .env file."}

def test_send_slack_message_no_token():
    # Ensure the environment variable is not set for this test
    if "SLACK_BOT_TOKEN" in os.environ:
        del os.environ["SLACK_BOT_TOKEN"]

    response = client.post("/send-slack-message", json={"text": "test message"})
    assert response.status_code == 400
    assert response.json() == {"detail": "Slack token not configured. Please set it in your .env file."}

def test_send_slack_message_no_channel_id():
    # Set a dummy token but no channel ID
    os.environ["SLACK_BOT_TOKEN"] = "dummy-token"
    if "SLACK_CHANNEL_ID" in os.environ:
        del os.environ["SLACK_CHANNEL_ID"]

    response = client.post("/send-slack-message", json={"text": "test message"})
    assert response.status_code == 400
    assert response.json() == {"detail": "Slack channel ID not configured. Please set it in your .env file."}

    # Clean up environment variable
    del os.environ["SLACK_BOT_TOKEN"]

def test_send_slack_message_no_body():
    response = client.post("/send-slack-message")
    assert response.status_code == 422 # Unprocessable Entity for missing request body
    assert "body" in response.json()["detail"][0]["loc"]