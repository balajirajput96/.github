# Full-Stack Web Application

This repository contains a full-stack web application with a React client and an Express server.

## Purpose of the Application

This application serves as a foundational boilerplate for building modern web applications. It demonstrates a common client-server architecture where a single-page application (the React client) communicates with a backend API (the Express server). It is configured for a seamless development experience and is ready for deployment.

## Overview

*   **Client**: A React application created with `create-react-app`. It fetches data from the server and renders it dynamically.
*   **Server**: An Express.js server that provides a simple API and serves the static client application in production.

## Getting Started

### Prerequisites

*   Node.js and npm installed on your machine.
*   A Heroku account and the Heroku CLI (for deployment).

### Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repository.git
    cd your-repository
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

1.  **Start the server:**
    From the `web-app/server` directory, run:
    ```bash
    npm start
    ```
    The server will start on `http://localhost:3001`.

2.  **Start the client:**
    From the `web-app/client` directory, run:
    ```bash
    npm start
    ```
    The client development server will start on `http://localhost:3000` and will proxy API requests to the server.

## API Endpoints

### `GET /api/hello`

*   **Description**: Retrieves a simple greeting message.
*   **Response**: A JSON object with a `message` property.
    ```json
    {
      "message": "Hello gamer!"
    }
    ```

## Deployment

This application is configured for deployment to Heroku. The `heroku-postbuild` script in `web-app/server/package.json` will automatically build the React application and prepare it to be served by the Express server.

To deploy the application, ensure you have the Heroku CLI installed and are logged in. Then, from the root of the repository, run:

```bash
heroku create
git push heroku main
```

## Project Structure

```
.
├── web-app
│   ├── client
│   │   ├── public
│   │   ├── src
│   │   ├── package.json
│   │   └── ...
│   └── server
│       ├── index.js
│       ├── package.json
│       └── ...
└── README.md
```

*   `web-app/client`: Contains the React frontend application.
*   `web-app/server`: Contains the Express backend application.