# AI Automation Hub

This is a web application that serves as a dashboard for various AI and developer productivity integrations.

## Setup

This project is a monorepo containing a React frontend and a Node.js/Express backend.

### Prerequisites

- Node.js and npm

### Backend Setup

1.  Navigate to the server directory:
    ```bash
    cd web-app/server
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  **Create a GitHub Personal Access Token:**
    - Go to your [GitHub Developer settings](https://github.com/settings/tokens).
    - Click "Generate new token".
    - Give it a descriptive name (e.g., "AI-Automation-Hub-Dev").
    - Select the `repo` scope to allow access to your repositories.
    - Click "Generate token" and copy the token.

4.  **Set up environment variables:**
    - In the `web-app/server` directory, create a new file named `.env`.
    - Add the following line to the `.env` file, replacing `your_github_token` with the token you just created:
      ```
      GITHUB_TOKEN=your_github_token
      ```
5.  Start the server:
    ```bash
    npm start
    ```
    The server will be running at `http://localhost:3001`.

### Frontend Setup

1.  In a separate terminal, navigate to the client directory:
    ```bash
    cd web-app/client
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Start the client:
    ```bash
    npm start
    ```
    The application will open in your browser at `http://localhost:3000`.