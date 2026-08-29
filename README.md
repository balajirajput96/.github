# AI Automation Hub and Pharma Job Automation Agent

This repository combines a personal AI-powered job-search toolkit for Pharmaceutical QA/IPQA roles with a React and Node.js dashboard for developer productivity and AI integrations.

## Features

- **Job collection:** Scan public job boards and company career pages using authorized sources.
- **Resume tailoring and matching:** Compare job descriptions with a Pharma QA/IPQA profile and generate concise match scores for skills such as GMP, BMR/BPR review, and quality oversight.
- **Application drafting and reporting:** Generate tailored HR email and cover-letter drafts, together with daily summaries of new jobs and matches.
- **Integration dashboard:** Use the web application to access GitHub, Slack, Atlassian, Claude AI, YouTube, Google Drive, and other integration entry points.
- **GitHub integration:** The dashboard can load repositories from the GitHub API when `GITHUB_TOKEN` is configured; without a token, the API returns a clear configuration error rather than exposing credentials.

## Repository Structure

- `agents/`: Core job collection, resume analysis, matching, and email-generation modules.
- `utils/`: Logging and configuration helpers.
- `scripts/`: Demo, daily-job, and scheduling scripts.
- `jobs/`, `reports/`: CSV, JSON, and text outputs.
- `docs/`: Setup, troubleshooting, and beginner guides.
- `web-app/client/`: React frontend.
- `web-app/server/`: Node.js and Express backend.

## Python Quick Start

1. Create and activate a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate
   # Windows: venv\\Scripts\\activate
   ```

2. Install requirements and configure environment variables:

   ```bash
   pip install -r requirements.txt
   cp .env.example .env
   ```

   Add authorized API keys, such as Google Gemini or OpenAI, to `.env` as needed.

3. Run the demo:

   ```bash
   python scripts/demo_run.py
   ```

## Web Application Setup

The web application is a monorepo containing a React frontend and a Node.js/Express backend. Node.js and npm are required.

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

## Testing & Unified Validation

To execute the entire 16-stage unified validation suite covering Python agents, FastAPI endpoints, SSRF safety guards, scam detection, outreach runners, Express API, React client, TypeScript compiler, ESLint, and production builds:

```bash
bash scripts/run_all_validations.sh
```

### Individual Test Suites

- **Python Agents & FastAPI Tests:**
  ```bash
  python3 scripts/demo_run.py --test
  ```

- **Backend Express & Integration Tests (Jest + Node:test):**
  ```bash
  cd web-app/server && npm test
  ```

- **Frontend React Client Tests:**
  ```bash
  cd web-app/client && npm test -- --watchAll=false
  ```

- **URL Safety & SSRF Validation:**
  ```bash
  python3 job-outreach/automation/test_url_safety.py
  ```

- **Career Lead & Scam Detection:**
  ```bash
  python3 acting-career-automation/scripts/parse_leads.py
  ```

## Security and Responsible Use

Keep `.env` files and API tokens out of version control. The web server disables Express fingerprinting, applies common security headers, limits API request rates, and avoids starting a listener when `NODE_ENV=test`. Use only public or otherwise authorized data sources, and follow the terms of each external platform.

## Disclaimer

This tool is intended for personal automation and authorized integrations. It relies on public and authorized sources and does not endorse bypassing access controls or platform restrictions.
