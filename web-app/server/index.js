/**
 * @fileoverview This is the main entry point for the Express server.
 * It sets up API routes and serves the static React application.
 */

const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

/**
 * Route serving a simple hello message.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello gamer!' });
});

// Serve static files from the React app build
const clientBuildPath = path.join(__dirname, '..', 'client', 'build');
app.use(express.static(clientBuildPath));

/**
 * Catch-all route to serve the React app's index.html.
 * This is for any GET request that doesn't match a previous route.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

/**
 * Starts the Express server and listens for connections on the specified port.
 * When the server is ready, a message is logged to the console.
 */
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
