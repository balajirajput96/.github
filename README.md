# AI Automation Hub, Pharma Job Workspace, and GitHub-to-Jira API

This repository combines a personal AI-powered job-search toolkit for Pharmaceutical QA/IPQA roles, a React and Node.js integration dashboard, and a unified FastAPI service. The API supports a bounded placeholder prediction endpoint, authorized GitHub and Slack integrations, and a signed GitHub webhook that creates a Jira task when a new issue is opened.

## Features

- **Job collection:** Scan public job boards and company career pages using authorized sources.
- **Resume tailoring and matching:** Compare job descriptions with a Pharma QA/IPQA profile and generate concise match scores for skills such as GMP, BMR/BPR review, and quality oversight.
- **Application drafting and reporting:** Generate tailored HR email and cover-letter drafts, together with daily summaries of new jobs and matches.
- **Integration dashboard:** Use the web application to access GitHub, Slack, Atlassian, Claude AI, YouTube, Google Drive, and other integration entry points.
- **GitHub integration:** The dashboard and API can load repositories from GitHub when `GITHUB_TOKEN` is configured; without a token, the API returns a clear configuration error rather than exposing credentials.
- **GitHub-to-Jira automation:** A signed `opened` issue webhook creates a Jira task through the configured Jira API.

## Repository Structure

- `agents/`: Core job collection, resume analysis, matching, and email-generation modules.
- `utils/`: Logging and configuration helpers.
- `scripts/`: Demo, daily-job, and scheduling scripts.
- `jobs/`, `reports/`: CSV, JSON, and text outputs.
- `docs/`: Setup, troubleshooting, and beginner guides.
- `web-app/client/`: React frontend.
- `web-app/server/`: Node.js and Express backend.
- `main.py`: FastAPI service and webhook endpoints.
- `test_main.py`: FastAPI service tests.

## Python and FastAPI Setup

Use Python 3.10 or later and create an isolated environment:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pip install -r requirements-dev.txt
cp .env.example .env
```

Configure only the integrations you use. The Jira workflow requires `GITHUB_WEBHOOK_SECRET`, `JIRA_DOMAIN`, `JIRA_USERNAME`, `JIRA_API_TOKEN`, and `JIRA_PROJECT_KEY`. Use a Jira API token rather than a password. Never commit `.env` or put real credentials in documentation.

Run the API with:

```bash
uvicorn main:app --reload
```

The local service listens on `http://127.0.0.1:8000` by default. For deployment, use:

```bash
uvicorn main:app --host 0.0.0.0 --port "$PORT"
```

### API endpoints

| Endpoint | Purpose |
|---|---|
| `GET /` | Service status. |
| `GET /health` | Deployment health check. |
| `POST /predict` | Placeholder ML prediction with bounded feature input. |
| `GET /github-repos` | Fetch repository names using `GITHUB_TOKEN`. |
| `POST /send-slack-message` | Send a message using the configured Slack bot. |
| `POST /webhook/github` | Verify a GitHub webhook signature and create a Jira task for `opened` issue events. |

### GitHub webhook configuration

Configure a repository webhook to point to `/webhook/github`, select the JSON content type, and use the same random secret stored in `GITHUB_WEBHOOK_SECRET`. The application validates `X-Hub-Signature-256` using constant-time comparison. Only `opened` issue events create Jira tasks; other actions receive an explicit ignore response.

## Web Application Setup

The web application is a React frontend with a Node.js/Express backend. Node.js and npm are required.

### Backend

```bash
cd web-app/server
npm install
```

Create `web-app/server/.env` and configure the integrations you intend to use. For GitHub, create a personal access token through [GitHub Developer settings](https://github.com/settings/tokens) with only the scopes required for the intended repositories, then set:

```dotenv
GITHUB_TOKEN=your_github_token
```

Start the backend:

```bash
npm start
```

The backend listens on `http://localhost:3001` by default. The GitHub dashboard endpoint is `GET /api/github`; it returns repository data from GitHub when a valid token is configured.

### Frontend

In a separate terminal:

```bash
cd web-app/client
npm install
npm start
```

The development frontend opens at `http://localhost:3000` and communicates with the backend according to the client configuration.

## Testing

Run the FastAPI test suite with:

```bash
pytest -q
```

Tests cover service status, health and prediction behavior, missing credentials, webhook signature validation, ignored actions, and missing Jira configuration. External Jira, Slack, and GitHub calls should be mocked in tests and must not receive real secrets.

Run the Node.js backend tests from `web-app/server` with:

```bash
NODE_ENV=test npm test
```

If no Node test files are present, the package script reports that tests have not been configured for that package. Python tests, when present, can be run with `pytest` from the repository root.

## Workspace Automation

The repository also contains modules for authorized job collection, resume tailoring, pharmaceutical QA/IPQA match scoring, application-email drafting, and reporting. Review generated results before using them externally and comply with each source platform's terms.

## Security and Responsible Use

Keep `.env` files and API tokens out of version control. The web server disables Express fingerprinting, applies common security headers, limits API request rates, and avoids starting a listener when `NODE_ENV=test`. Use only public or otherwise authorized data sources, and follow the terms of each external platform.

## Disclaimer

Use this project only with public or authorized data and with appropriate human review. Generated messages, matches, and automation outputs are not a substitute for professional judgment.
