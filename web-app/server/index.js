const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3001;

// Middleware to parse JSON bodies
app.use(express.json());

// --- API Clients ---
const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
  },
});

const slackApi = axios.create({
  baseURL: 'https://slack.com/api',
  headers: {
    Authorization: `Bearer ${process.env.SLACK_TOKEN}`,
    'Content-Type': 'application/json; charset=utf-8',
  },
});

// --- API Documentation and Health Check ---
app.get('/', (req, res) => {
  res.status(200).json({
    status: '🚀 LIVE',
    service: 'Personal AI Platform',
    features: {
      github: process.env.GITHUB_TOKEN ? '✅ Connected' : '⚠️ Not Connected',
      slack: process.env.SLACK_TOKEN ? '✅ Connected' : '⚠️ Not Connected',
      jira: process.env.JIRA_TOKEN ? '✅ Connected' : '⚠️ Not Connected',
      discord: process.env.DISCORD_WEBHOOK_URL ? '✅ Connected' : '⚠️ Not Connected',
    },
    api_documentation: '/api-docs',
  });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// --- GitHub Integration Endpoints ---
app.get('/api/github/repos/:owner', async (req, res) => {
  const { owner } = req.params;
  try {
    const response = await githubApi.get(`/users/${owner}/repos`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: `Failed to fetch repositories for ${owner}`,
      error: error.message,
    });
  }
});

app.post('/api/github/issues/:owner/:repo', async (req, res) => {
  const { owner, repo } = req.params;
  const { title, body } = req.body;

  if (!title || !body) {
    return res.status(400).json({ message: 'Title and body are required' });
  }

  try {
    const issueResponse = await githubApi.post(`/repos/${owner}/${repo}/issues`, {
      title,
      body,
    });

    const issueData = issueResponse.data;
    // --- Workflow: Send notifications ---
    const slackMessage = `🚀 New GitHub issue created in ${owner}/${repo}:\n<${issueData.html_url}|#${issueData.number} ${issueData.title}>`;
    slackApi.post('/chat.postMessage', {
      channel: '#general',
      text: slackMessage,
    }).catch(err => console.error('Failed to send Slack notification:', err.message));

    const discordMessage = `🚀 New GitHub issue created in **${owner}/${repo}**: [ #${issueData.number} ${issueData.title} ](${issueData.html_url})`;
    if (process.env.DISCORD_WEBHOOK_URL) {
      axios.post(process.env.DISCORD_WEBHOOK_URL, { content: discordMessage })
        .catch(err => console.error('Failed to send Discord notification:', err.message));
    }
    // --- End Workflow ---

    res.status(201).json(issueData);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: `Failed to create issue in ${owner}/${repo}`,
      error: error.message,
    });
  }
});

// --- Slack Integration Endpoints ---
app.post('/api/slack/message', async (req, res) => {
  const { channel, text } = req.body;

  if (!channel || !text) {
    return res.status(400).json({ message: 'Channel and text are required' });
  }

  try {
    const response = await slackApi.post('/chat.postMessage', { channel, text });
    if (!response.data.ok) throw new Error(response.data.error);
    res.json({ message: `Message sent to channel: ${channel}` });
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: 'Failed to send Slack message',
      error: error.message,
    });
  }
});

// --- Discord Integration Endpoints ---
app.post('/api/discord/message', async (req, res) => {
  const { content } = req.body;
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!content) {
    return res.status(400).json({ message: 'Content is required' });
  }
  if (!webhookUrl) {
    return res.status(500).json({ message: 'Discord webhook URL is not configured' });
  }

  try {
    await axios.post(webhookUrl, { content });
    res.json({ message: 'Message sent to Discord' });
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: 'Failed to send Discord message',
      error: error.message,
    });
  }
});

// --- Jira Integration Endpoints (Placeholder) ---
app.get('/api/jira/projects', (req, res) => {
  res.json({ message: 'Fetching Jira projects' });
});

app.post('/api/jira/issue', (req, res) => {
  const { projectKey, summary, description } = req.body;
  res.status(201).json({ message: 'Successfully created Jira issue', issue: { projectKey, summary, description } });
});

// --- Workflow Automation Endpoints (Placeholder) ---
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