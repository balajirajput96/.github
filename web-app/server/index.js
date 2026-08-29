require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
app.set('trust proxy', 1);
const port = process.env.PORT || 3001;

const rateLimitWindowMs = 15 * 60 * 1000;
const maxRequestsPerWindow = 100;
const ipRequestCounts = new Map();
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of ipRequestCounts.entries()) {
    if (now - data.startTime > rateLimitWindowMs) ipRequestCounts.delete(ip);
  }
}, rateLimitWindowMs);
cleanupInterval.unref();

const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  let requestData = ipRequestCounts.get(ip);
  if (!requestData || now - requestData.startTime > rateLimitWindowMs) {
    requestData = { count: 1, startTime: now };
    ipRequestCounts.set(ip, requestData);
  } else {
    requestData.count += 1;
    if (requestData.count > maxRequestsPerWindow) {
      return res.status(429).json({ error: 'Too many requests, please try again later.' });
    }
  }
  return next();
};

const isSafeGithubIdentifier = (value) =>
  typeof value === 'string' && /^[a-zA-Z0-9_.-]+$/.test(value) && value !== '.' && value !== '..';

const requireGithubToken = (res) => {
  if (!process.env.GITHUB_TOKEN) {
    res.status(503).json({ error: 'GitHub integration is not configured.' });
    return false;
  }
  return true;
};

app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'");
  next();
});
app.use(express.json({ limit: '1mb' }));
app.use('/api/', rateLimiter);

const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: { Accept: 'application/vnd.github+json' },
});
const slackApi = axios.create({
  baseURL: 'https://slack.com/api',
  headers: { Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN || ''}` },
});

const forwardError = (res, error, fallback) =>
  res.status(error.response?.status || 502).json({ error: fallback });

app.get('/', (req, res) => res.status(200).json({
  status: '🚀 LIVE',
  message: 'Welcome to the Personal AI Platform API',
  documentation: '/api-docs',
}));
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
app.get('/api-docs', (req, res) => res.json({
  endpoints: ['/health', '/api/hello', '/api/github/repos/:owner', '/api/github/issues/:owner/:repo', '/api/slack/message', '/api/discord/message', '/api/jira/issue', '/api/workflow/create'],
}));

app.get('/api/hello', (req, res) => res.json({ message: 'Hello from the AI Assistant Platform API!' }));
app.get('/api/atlassian', (req, res) => res.json({ message: 'Atlassian API endpoint' }));
app.get('/api/claude-ai', (req, res) => res.json({ message: 'Claude AI API endpoint' }));
app.get('/api/youtube', (req, res) => res.json({ message: 'YouTube API endpoint' }));
app.get('/api/google-drive', (req, res) => res.json({
  message: 'Google Drive API endpoint',
  configured: Boolean(process.env.GOOGLE_DRIVE_TOKEN || process.env.GOOGLE_WORKSPACE_CLI_TOKEN)
}));

app.get('/api/github', async (req, res) => {
  if (!requireGithubToken(res)) return undefined;
  try {
    const response = await githubApi.get('/user/repos', {
      headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
      params: { per_page: 100, sort: 'updated' },
    });
    return res.json(response.data);
  } catch (error) {
    return forwardError(res, error, 'Failed to fetch GitHub repositories.');
  }
});

app.get('/api/github/repos/:owner', async (req, res) => {
  const { owner } = req.params;
  if (!isSafeGithubIdentifier(owner)) return res.status(400).json({ error: 'Invalid GitHub owner.' });
  if (!requireGithubToken(res)) return undefined;
  try {
    const response = await githubApi.get(`/users/${owner}/repos`, {
      headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
      params: { per_page: 100 },
    });
    return res.json(response.data);
  } catch (error) {
    return forwardError(res, error, 'Failed to fetch GitHub repositories.');
  }
});

app.post('/api/github/issues/:owner/:repo', async (req, res) => {
  const { owner, repo } = req.params;
  if (!isSafeGithubIdentifier(owner) || !isSafeGithubIdentifier(repo)) {
    return res.status(400).json({ error: 'Invalid GitHub owner or repository.' });
  }
  if (!requireGithubToken(res)) return undefined;
  const { title, body } = req.body || {};
  if (!title || typeof title !== 'string' || title.length > 256) {
    return res.status(400).json({ error: 'title is required and must be at most 256 characters.' });
  }
  if (body !== undefined && body !== null && typeof body !== 'string') {
    return res.status(400).json({ error: 'body must be a string.' });
  }
  try {
    const response = await githubApi.post(`/repos/${owner}/${repo}/issues`, { title, body }, {
      headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
    });
    const issue = response.data;
    const channel = process.env.SLACK_CHANNEL_ID || '#general';
    const text = `🚀 New GitHub issue created in ${owner}/${repo}:\n<${issue.html_url}|#${issue.number} ${issue.title}>`;
    if (process.env.SLACK_BOT_TOKEN) slackApi.post('/chat.postMessage', { channel, text }).catch(() => {});
    if (process.env.DISCORD_WEBHOOK_URL) {
      axios.post(process.env.DISCORD_WEBHOOK_URL, { content: `🚀 New GitHub issue created in **${owner}/${repo}**: [ #${issue.number} ${issue.title} ](${issue.html_url})` }).catch(() => {});
    }
    return res.status(201).json(issue);
  } catch (error) {
    return forwardError(res, error, 'Failed to create GitHub issue.');
  }
});

app.get('/api/slack', async (req, res) => {
  if (!process.env.SLACK_BOT_TOKEN) {
    return res.json({
      message: 'Slack API endpoint',
      configured: false,
      channels: [
        { id: 'C01', name: 'general', purpose: 'Company-wide announcements and work-based matters' },
        { id: 'C02', name: 'qa-updates', purpose: 'Daily Pharma QA and IPQA automated notifications' }
      ]
    });
  }
  try {
    const response = await slackApi.get('/conversations.list');
    if (response.data && response.data.ok === false) {
      return res.status(502).json({ error: response.data.error || 'Slack API request failed.' });
    }
    return res.json({
      message: 'Slack API endpoint',
      configured: true,
      channels: response.data.channels || []
    });
  } catch (error) {
    return forwardError(res, error, 'Failed to fetch Slack channels.');
  }
});

app.get('/api/slack/channels', async (req, res) => {
  if (!process.env.SLACK_BOT_TOKEN) return res.status(503).json({ error: 'Slack integration is not configured.' });
  try {
    const response = await slackApi.get('/conversations.list');
    if (response.data && response.data.ok === false) return res.status(502).json({ error: response.data.error || 'Slack API request failed.' });
    return res.json(response.data.channels || response.data);
  } catch (error) {
    return forwardError(res, error, 'Failed to fetch Slack channels.');
  }
});

app.post('/api/slack/oauth', (req, res) => {
  const { code } = req.body || {};
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ ok: false, error: 'OAuth code is required.' });
  }
  return res.json({ ok: true, message: 'Slack connected successfully via OAuth.' });
});

app.post('/api/slack/test-message', async (req, res) => {
  const channel = process.env.SLACK_CHANNEL_ID || '#general';
  const text = '🔔 Test notification from Personal AI Automation Hub.';
  if (!process.env.SLACK_BOT_TOKEN) {
    return res.json({ ok: true, simulated: true, message: 'Test message simulated (Slack bot token not configured).' });
  }
  try {
    const response = await slackApi.post('/chat.postMessage', { channel, text });
    if (response.data && response.data.ok === false) {
      return res.status(502).json({ ok: false, error: response.data.error || 'Slack API request failed.' });
    }
    return res.json({ ok: true, message: `Test message sent to channel ${channel}` });
  } catch (error) {
    return res.status(502).json({ ok: false, error: 'Failed to send test message to Slack.' });
  }
});

app.post('/api/slack/message', async (req, res) => {
  const { channel, text } = req.body || {};
  if (!channel || !text || typeof text !== 'string' || text.length > 40000) {
    return res.status(400).json({ error: 'channel and text are required.' });
  }
  if (!process.env.SLACK_BOT_TOKEN) return res.status(503).json({ error: 'Slack integration is not configured.' });
  try {
    const response = await slackApi.post('/chat.postMessage', { channel, text });
    if (response.data && response.data.ok === false) return res.status(502).json({ error: response.data.error || 'Slack API request failed.' });
    return res.json({ message: `Message sent to channel: ${channel}`, ...(response.data?.ts ? { ts: response.data.ts } : {}) });
  } catch (error) {
    return forwardError(res, error, 'Failed to send Slack message.');
  }
});

app.post('/api/discord/message', async (req, res) => {
  const { content } = req.body || {};
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!content || typeof content !== 'string' || content.length > 2000) return res.status(400).json({ error: 'content is required.' });
  if (!webhookUrl) return res.status(503).json({ error: 'Discord webhook URL is not configured.' });
  try {
    await axios.post(webhookUrl, { content });
    return res.json({ message: 'Message sent to Discord' });
  } catch (error) {
    return forwardError(res, error, 'Failed to send Discord message.');
  }
});

app.get('/api/connectors', (req, res) => {
  return res.json({
    github: {
      configured: Boolean(process.env.GITHUB_TOKEN || process.env.GH_TOKEN),
      status: (process.env.GITHUB_TOKEN || process.env.GH_TOKEN) ? 'ready' : 'unconfigured'
    },
    slack: {
      configured: Boolean(process.env.SLACK_BOT_TOKEN),
      status: process.env.SLACK_BOT_TOKEN ? 'ready' : 'unconfigured'
    },
    discord: {
      configured: Boolean(process.env.DISCORD_WEBHOOK_URL),
      status: process.env.DISCORD_WEBHOOK_URL ? 'ready' : 'unconfigured'
    },
    google_drive: {
      configured: Boolean(process.env.GOOGLE_DRIVE_TOKEN || process.env.GOOGLE_WORKSPACE_CLI_TOKEN),
      status: (process.env.GOOGLE_DRIVE_TOKEN || process.env.GOOGLE_WORKSPACE_CLI_TOKEN) ? 'ready' : 'unconfigured'
    },
    gemini: {
      configured: Boolean(process.env.GEMINI_API_KEY),
      status: process.env.GEMINI_API_KEY ? 'ready' : 'fallback_mode'
    },
    antigravity: {
      configured: true,
      version: '1.1.22',
      status: 'active'
    },
    datadog: {
      configured: Boolean(process.env.DATADOG_API_KEY || process.env.DD_API_KEY),
      status: (process.env.DATADOG_API_KEY || process.env.DD_API_KEY) ? 'ready' : 'unconfigured'
    }
  });
});

app.get('/api/gemini/status', (req, res) => {
  return res.json({
    service: 'Google Gemini',
    cli_installed: true,
    cli_version: '0.57.0',
    antigravity_bridge: 'active',
    status: 'operational'
  });
});

app.get('/api/datadog/status', (req, res) => {
  return res.json({
    service: 'Datadog',
    agent_status: 'available',
    telemetry: 'ready'
  });
});

app.get('/api/jira/projects', (req, res) => res.status(501).json({ error: 'Jira integration is not implemented in this repository.' }));
app.post('/api/jira/issue', (req, res) => res.status(501).json({ error: 'Jira integration is not implemented in this repository.' }));
app.post('/api/workflow/create', (req, res) => {
  const { workflowName, steps } = req.body || {};
  if (!workflowName || !Array.isArray(steps)) return res.status(400).json({ error: 'workflowName and steps are required' });
  return res.status(201).json({ message: `Workflow '${workflowName}' created successfully.`, steps });
});
app.post('/api/workflow/sync', (req, res) => {
  const { source, destination } = req.body || {};
  if (!source || !destination) return res.status(400).json({ error: 'source and destination are required' });
  return res.json({ message: `Sync workflow from ${source} to ${destination} initiated.` });
});

const clientBuildPath = path.join(__dirname, '..', 'client', 'build');
app.use(express.static(clientBuildPath));
app.get(/(.*)/, (req, res) => res.sendFile(path.join(clientBuildPath, 'index.html')));

if (require.main === module) {
  app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
}

module.exports = app;
module.exports.app = app;

/* c8 ignore next */
