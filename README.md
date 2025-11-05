# AI Automation Platform: GitHub to Jira Workflow

This project is the foundational module for an AI Automation Platform. Its first feature is a powerful workflow that automatically creates a Jira issue when a new issue is opened in a specified GitHub repository.

The application is built using FastAPI and is designed to be secure, robust, and easy to deploy.

## Features

- **GitHub Webhook Listener**: A secure endpoint at `/webhook/github` that listens for events from GitHub.
- **Webhook Signature Verification**: Uses a secret key to ensure that all incoming webhooks are genuinely from GitHub.
- **Jira Issue Creation**: Automatically creates a new task in your Jira project when a new GitHub issue is opened.
- **Secure Configuration**: All secrets (API keys, tokens, etc.) are managed via a `.env` file and are never hardcoded.
- **Tested**: Includes a `pytest` suite to verify functionality and error handling.

## How It Works

1.  You configure a webhook in your GitHub repository to point to the `/webhook/github` endpoint of this deployed application.
2.  When a new issue is created in that repository, GitHub sends a `POST` request (a webhook) to the application.
3.  The application verifies the request's signature to ensure it's authentic.
4.  If the event is `action: "opened"`, the application extracts the issue title and URL.
5.  The application then uses the Jira API to create a new task in your specified Jira project, with the title and a link back to the original GitHub issue.

## Setup and Configuration

### 1. Prerequisites

- Python 3.10+
- `pip` for package installation
- A GitHub repository
- A Jira project

### 2. Installation

First, clone this repository and navigate into the directory:

```bash
git clone <your-repository-url>
cd <repository-name>
```

Create a Python virtual environment and activate it:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

### 3. Environment Variables

This is the most important step for configuring the automation. Copy the example environment file:

```bash
cp .env.example .env
```

Now, open the `.env` file and fill in your details:

-   `GITHUB_WEBHOOK_SECRET`: A long, random string that you create. You will use this same secret when setting up the webhook in GitHub.
-   `JIRA_DOMAIN`: Your company's Jira domain (e.g., `your-company.atlassian.net`).
-   `JIRA_USERNAME`: The email address you use to log into Jira.
-   `JIRA_API_TOKEN`: An API token you generate from your Jira account settings (do NOT use your password).
-   `JIRA_PROJECT_KEY`: The short key for your Jira project (e.g., if your project is "My Awesome Project", the key might be "MAP").

## Local Development and Testing

### Running the Server

To run the application locally for development, use `uvicorn`:

```bash
uvicorn main:app --reload
```

The server will be running at `http://127.0.0.1:8000`.

### Running Tests

To run the test suite, you first need to install the development dependencies:

```bash
pip install -r requirements-dev.txt
```

Then, run `pytest`:

```bash
pytest
```

All tests should pass.