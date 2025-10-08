const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

/**
 * @route GET /api/hello
 * @description A simple test endpoint to ensure the server is running.
 * @returns {object} 200 - A JSON object with a "Hello gamer!" message.
 */
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello gamer!' });
});

/**
 * @route GET /api/atlassian
 * @description Endpoint to handle Atlassian integration.
 * @returns {object} 200 - A JSON object with a message indicating the endpoint.
 */
app.get('/api/atlassian', (req, res) => {
  res.json({ message: 'Atlassian API endpoint' });
});

/**
 * @route GET /api/slack
 * @description Endpoint to handle Slack integration.
 * @returns {object} 200 - A JSON object with a message indicating the endpoint.
 */
app.get('/api/slack', (req, res) => {
  res.json({ message: 'Slack API endpoint' });
});

/**
 * @route GET /api/claude-ai
 * @description Endpoint to handle Claude AI integration.
 * @returns {object} 200 - A JSON object with a message indicating the endpoint.
 */
app.get('/api/claude-ai', (req, res) => {
  res.json({ message: 'Claude AI API endpoint' });
});

/**
 * @route GET /api/youtube
 * @description Endpoint to handle YouTube integration.
 * @returns {object} 200 - A JSON object with a message indicating the endpoint.
 */
app.get('/api/youtube', (req, res) => {
  res.json({ message: 'YouTube API endpoint' });
});

/**
 * @route GET /api/google-drive
 * @description Endpoint to handle Google Drive integration.
 * @returns {object} 200 - A JSON object with a message indicating the endpoint.
 */
app.get('/api/google-drive', (req, res) => {
  res.json({ message: 'Google Drive API endpoint' });
});

/**
 * @description Serves the static files from the React app build directory.
 * This includes the main `index.html` and other assets like CSS and JavaScript files.
 */
const clientBuildPath = path.join(__dirname, '..', 'client', 'build');
app.use(express.static(clientBuildPath));

/**
 * @route GET /*
 * @description This is a catch-all route that serves the React application's `index.html` file.
 * It ensures that any GET request that doesn't match a previously defined API route
 * will be handled by the client-side routing of the React app.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
