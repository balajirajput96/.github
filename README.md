# AI Automation Workspace and Express API

This repository contains the AI-assisted pharmaceutical job-automation workspace and an Express server that exposes safe, testable integration routes for GitHub, Slack, Jira, and workflow orchestration.

## Server routes

| Route | Purpose |
|---|---|
| `GET /` | Service status and configured integration indicators. |
| `GET /health` | Health check. |
| `GET /api/hello` | Basic API smoke test. |
| `GET /api/atlassian`, `/api/slack`, `/api/claude-ai`, `/api/youtube`, `/api/google-drive` | Integration placeholders. |
| `GET/POST /api/github/...` | Authorized GitHub integration placeholders with input validation. |
| `GET/POST /api/slack/...` | Slack integration placeholders with input validation. |
| `GET/POST /api/jira/...` | Jira integration placeholders with input validation. |
| `POST /api/workflow/create` | Validate and create a workflow representation. |
| `POST /api/workflow/sync` | Validate a workflow synchronization request. |
| `GET /api-docs` | Lightweight endpoint list. |

All API routes are rate-limited in memory and return JSON errors for invalid input. The module exports the Express app and only starts a listener outside `NODE_ENV=test`, which keeps tests deterministic.

## Local setup

```bash
cd web-app/server
npm ci
npm test
npm start
```

The server listens on port `3001` by default or the value of `PORT`. The client build is served from `web-app/client/build` when it exists.

Copy `.env.example` to `.env` and provide only the credentials required for your integrations. Never commit `.env` or put real tokens in source files.

## Testing

The server test suite uses Jest and Supertest:

```bash
cd web-app/server
NODE_ENV=test npm test
```

Tests cover the API smoke endpoints and integration placeholders without sending external messages or modifying third-party systems.

## Workspace automation

The repository also contains modules for authorized job collection, resume tailoring, pharmaceutical QA/IPQA matching, application-email drafting, and reporting. Review generated outputs before external use and follow each source platform's terms.

## Deployment

Install dependencies with `npm ci` and start the service with `npm start`. Configure environment variables through the hosting provider. The service must not expose credentials in logs or client-side bundles.

## Disclaimer

Use this project only with public or authorized data and with appropriate human review. The integration routes in this branch are validation-safe placeholders unless a real provider client is deliberately configured.
