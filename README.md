# Personal AI Platform

This project is a web-based platform designed to integrate with various development and communication tools like GitHub, Slack, and Jira. It is built with a React frontend and a Node.js/Express backend, and it is optimized for easy deployment on Railway.

## 🚀 Features

- **GitHub Integration:** Manage repositories and issues directly from the platform.
- **Slack Integration:** Send notifications and messages to Slack channels.
- **Jira Integration:** Create and manage Jira issues.
- **Workflow Automation:** Create custom workflows to sync information between services.
- **Health Checks:** A `/health` endpoint to monitor the status of the service.
- **Ready for Deployment:** Optimized for one-click deployment on Railway.

## 🛠️ Tech Stack

- **Frontend:** React
- **Backend:** Node.js, Express
- **Deployment:** Railway.app

## ⚙️ Getting Started

### Prerequisites

- Node.js and npm
- A GitHub account
- A Railway account

### Deployment

1.  **Fork this Repository:**
    Click the "Fork" button at the top right of this page to create your own copy.

2.  **Create a New Project on Railway:**
    - Go to your Railway dashboard and click "New Project".
    - Select "Deploy from GitHub repo" and choose the repository you just forked.

3.  **Configure Environment Variables:**
    - In your Railway project dashboard, go to the "Variables" tab.
    - Add the following environment variables. You can get the necessary tokens from the respective services.

    ```
    GITHUB_TOKEN=your_github_personal_access_token
    SLACK_TOKEN=your_slack_bot_token
    JIRA_USER=your_jira_email
    JIRA_TOKEN=your_jira_api_token
    JIRA_HOST=your_jira_instance.atlassian.net
    ```

4.  **Deploy:**
    Railway will automatically detect the `railway.json` file and deploy the application. Once the deployment is complete, you can access your live application at the URL provided by Railway.

## API Endpoints

- `GET /`: Health check and status of integrations.
- `GET /health`: Simple health check, returns `{ "status": "ok" }`.
- `GET /api/github/repos/:owner`: Fetch repositories for a GitHub owner.
- `POST /api/github/issues/:owner/:repo`: Create a new issue in a GitHub repository.
- `POST /api/slack/message`: Send a message to a Slack channel.
- `POST /api/jira/issue`: Create a new issue in a Jira project.
- `POST /api/workflow/create`: Create a new automation workflow.
- `POST /api/workflow/sync`: Initiate a sync between two services.