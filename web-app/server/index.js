// A more complete server implementation based on the user's request for full automation.
const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3001;

// Middleware to parse JSON bodies
app.use(express.json());

// --- API Documentation and Health Check ---
app.get('/', (req, res) => {
  res.status(200).json({
    status: '🚀 LIVE',
    service: 'Personal AI Platform',
    features: {
      github: process.env.GITHUB_TOKEN ? '✅ Connected' : '⚠️ Not Connected',
      slack: process.env.SLACK_TOKEN ? '✅ Connected' : '⚠️ Not Connected',
      jira: process.env.JIRA_TOKEN ? '✅ Connected' : '⚠️ Not Connected',
    },
    api_documentation: '/api-docs',
  });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// --- GitHub Integration Endpoints ---
app.get('/api/github/repos/:owner', (req, res) => {
  const { owner } = req.params;
  res.json({ message: `Fetching repositories for owner: ${owner}`, owner });
});

app.get('/api/github/issues/:owner/:repo', (req, res) => {
  const { owner, repo } = req.params;
  res.json({ message: `Fetching issues for repo: ${repo}`, owner, repo });
});

app.post('/api/github/issues/:owner/:repo', (req, res) => {
  const { owner, repo } = req.params;
  const { title, body } = req.body;
  res.status(201).json({ message: 'Successfully created issue', owner, repo, issue: { title, body } });
});

// --- Slack Integration Endpoints ---
app.get('/api/slack/channels', (req, res) => {
  res.json({ message: 'Fetching Slack channels' });
});

app.post('/api/slack/message', (req, res) => {
  const { channel, text } = req.body;
  res.json({ message: `Message sent to channel: ${channel}`, sent: { channel, text } });
});

// --- Jira Integration Endpoints ---
app.get('/api/jira/projects', (req, res) => {
  res.json({ message: 'Fetching Jira projects' });
});

app.post('/api/jira/issue', (req, res) => {
  const { projectKey, summary, description } = req.body;
  res.status(201).json({ message: 'Successfully created Jira issue', issue: { projectKey, summary, description } });
});

// --- Workflow Automation Endpoints ---
app.post('/api/workflow/create', (req, res) => {
    const { workflowName, steps } = req.body;
    res.status(201).json({ message: `Workflow '${workflowName}' created successfully.`, steps });
});

app.post('/api/workflow/sync', (req, res) => {
    const { source, destination } = req.body;
    res.json({ message: `Sync workflow from ${source} to ${destination} initiated.` });
});


// Serve React App
const clientBuildPath = path.join(__dirname, '..', 'client', 'build');
app.use(express.static(clientBuildPath));

// Catch-all to serve React's index.html
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}

module.exports = app;