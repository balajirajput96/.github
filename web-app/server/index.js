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

const axios = require('axios');

app.get('/api/github', async (req, res) => {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return res.status(401).json({
      error: 'GitHub token not provided. Please set the GITHUB_TOKEN environment variable.'
    });
  }

  try {
    const response = await axios.get('https://api.github.com/user/repos', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const repositories = response.data.map(repo => ({
      id: repo.id,
      name: repo.name,
      owner: repo.owner.login,
      stars: repo.stargazers_count,
      url: repo.html_url
    }));

    res.json({ repositories });
  } catch (error) {
    console.error('Error fetching from GitHub API:', error.message);
    res.status(500).json({
      error: 'Failed to fetch data from GitHub API.',
      details: error.message
    });
  }
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
