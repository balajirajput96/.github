# Unified API Server (ML, GitHub, Slack)

This project is a robust FastAPI application that provides a unified API for a placeholder Machine Learning model, GitHub repository fetching, and Slack messaging. It is built with security and best practices in mind, using environment variables to handle sensitive API keys.

## Features

*   **/predict**: A placeholder endpoint for a machine learning model.
*   **/github-repos**: Fetches a list of your repositories from GitHub.
*   **/send-slack-message**: Sends a message to a specified Slack channel.
*   **Secure**: Uses a `.env` file to keep API keys and secrets out of the codebase.
*   **Tested**: Comes with a full `pytest` test suite for all endpoints.
*   **Deployable**: Includes clear instructions for deploying to Render.

## Prerequisites

*   Python 3.10+
*   pip

## 1. Setup and Installation

First, clone the repository to your local machine:

```bash
git clone <your-repository-url>
cd <your-repository-name>
```

It is highly recommended to use a virtual environment to manage dependencies:

```bash
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
```

Install the necessary production and development dependencies:

```bash
# Install production dependencies
pip install -r requirements.txt

# Install development dependencies (for testing)
pip install -r requirements-dev.txt
```

## 2. Configuration

This application requires API keys for GitHub and Slack to function correctly. These are managed through a `.env` file.

First, copy the example file:

```bash
cp .env.example .env
```

Now, open the `.env` file in your editor and add your secret keys. It will look like this:

```
# This is where you put your secret keys. This file is ignored by git.
GITHUB_TOKEN="your_new_github_token"
SLACK_BOT_TOKEN="your_new_slack_token"
SLACK_CHANNEL_ID="your_slack_channel_id"
```

*   `GITHUB_TOKEN`: Your Personal Access Token from GitHub.
*   `SLACK_BOT_TOKEN`: Your Slack Bot User OAuth Token (starts with `xoxb-`).
*   `SLACK_CHANNEL_ID`: The ID of the Slack channel you want to post messages to.

## 3. Running the Application Locally

To start the development server, run the following command from the root of the project:

```bash
uvicorn main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

## 4. Running Tests

To run the full test suite, use `pytest`:

```bash
pytest
```

All tests should pass, confirming the application is working correctly.

## 5. Deployment to Render

This application is ready to be deployed to Render. Here are the step-by-step instructions:

1.  **Push to GitHub**: Make sure your latest code is pushed to your GitHub repository.

2.  **Create a New Web Service**:
    *   Go to [render.com](https://render.com) and log in.
    *   Click the **"New +"** button and select **"Web Service"**.
    *   Connect your GitHub account and select your repository.

3.  **Configure Render Settings**:
    *   **Name**: Give your service a unique name.
    *   **Root Directory**: Leave this blank.
    *   **Runtime**: Select **Python 3**.
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

4.  **Add Environment Variables**:
    *   Scroll down to the **"Environment"** section.
    *   Click **"Add Environment Variable"** for each secret key:
        *   **Key**: `GITHUB_TOKEN`, **Value**: `your_github_token_value`
        *   **Key**: `SLACK_BOT_TOKEN`, **Value**: `your_slack_token_value`
        *   **Key**: `SLACK_CHANNEL_ID`, **Value**: `your_slack_channel_id_value`

5.  **Create Service**:
    *   Click the **"Create Web Service"** button at the bottom of the page.

Render will now build and deploy your application. You will get a live URL once it's complete.