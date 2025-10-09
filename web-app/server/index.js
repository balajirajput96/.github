const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

// API routes
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello gamer!' });
});

app.get('/api/atlassian', (req, res) => {
  res.json({ message: 'Atlassian API endpoint' });
});

app.get('/api/slack', (req, res) => {
  res.json({ message: 'Slack API endpoint' });
});

app.get('/api/claude-ai', (req, res) => {
  res.json({ message: 'Claude AI API endpoint' });
});

app.get('/api/youtube', (req, res) => {
  res.json({ message: 'YouTube API endpoint' });
});

app.get('/api/google-drive', (req, res) => {
  res.json({ message: 'Google Drive API endpoint' });
});

app.get('/api/github', (req, res) => {
  res.json({
    repositories: [
      { id: 1, name: 'react-app', owner: 'jules', stars: 150 },
      { id: 2, name: 'express-server', owner: 'jules', stars: 99 },
      { id: 3, name: 'automation-hub', owner: 'user', stars: 42 }
    ]
  });
});

// Serve static files from the React app build
const clientBuildPath = path.join(__dirname, '..', 'client', 'build');
app.use(express.static(clientBuildPath));

// All other GET requests not handled before will return the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
