# AI Automation Hub

This project is a web-based dashboard designed to centralize and manage various AI-powered automations and integrations. It provides a unified interface for connecting to services like Atlassian, Slack, Claude AI, YouTube, and Google Drive.

## Features

- **Centralized Dashboard**: View and manage all your integrations from a single dashboard.
- **Service Integrations**: Connect to popular services:
  - Atlassian
  - Slack
  - Claude AI
  - YouTube
  - Google Drive
- **Scalable Architecture**: Built with a separate client and server, allowing for independent development and scaling.

## Tech Stack

- **Frontend**: React, React Router, Material-UI (MUI)
- **Backend**: Node.js, Express.js

## Project Structure

The project is organized into two main directories:

- `web-app/client`: Contains the React frontend application.
- `web-app/server`: Contains the Node.js/Express backend server.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You will need to have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your machine.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install server dependencies:**
    ```bash
    cd web-app/server
    npm install
    ```

3.  **Install client dependencies:**
    ```bash
    cd ../client
    npm install
    ```

### Running the Application

You will need to run the client and server in separate terminal windows.

1.  **Start the backend server:**
    ```bash
    cd web-app/server
    npm start
    ```
    The server will start on `http://localhost:3001`.

2.  **Start the frontend application:**
    ```bash
    cd web-app/client
    npm start
    ```
    The client development server will open in your browser at `http://localhost:3000`.

## Available Scripts

### Client (`web-app/client`)

- `npm start`: Runs the app in development mode.
- `npm test`: Launches the test runner in interactive watch mode.
- `npm run build`: Builds the app for production to the `build` folder.

### Server (`web-app/server`)

- `npm start`: Starts the server using `node index.js`.