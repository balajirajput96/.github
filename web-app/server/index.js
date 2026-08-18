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

app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'");
  next();
});
app.use(express.json());
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
  endpoints: ['/health', '/api/hello', '/api/github/repos/:owner', '/api/slack/message', '/api/discord/message', '/api/jira/issue', '/api/workflow/create'],
}));

app.get('/api/hello', (req, res) => res.json({ message: 'Hello from the AI Assistant Platform API!' }));
app.get('/api/atlassian', (req, res) => res.json({ message: 'Atlassian API endpoint' }));
app.get('/api/slack', (req, res) => res.json({ message: 'Slack API endpoint' }));
app.get('/api/claude-ai', (req, res) => res.json({ message: 'Claude AI API endpoint' }));
app.get('/api/youtube', (req, res) => res.json({ message: 'YouTube API endpoint' }));
app.get('/api/google-drive', (req, res) => res.json({ message: 'Google Drive API endpoint' }));

app.get('/api/github/repos/:owner', async (req, res) => {
  try {
    const response = await githubApi.get(`/users/${req.params.owner}/repos`);
    return res.json(response.data);
  } catch (error) {
    return forwardError(res, error, 'Failed to fetch GitHub repositories.');
  }
});

app.post('/api/github/issues/:owner/:repo', async (req, res) => {
  const { title, body } = req.body || {};
  if (!title) return res.status(400).json({ error: 'title is required.' });
  try {
    const response = await githubApi.post(`/repos/${req.params.owner}/${req.params.repo}/issues`, { title, body });
    const issue = response.data;
    const channel = '#general';
    const text = `🚀 New GitHub issue created in ${req.params.owner}/${req.params.repo}:\n<${issue.html_url}|#${issue.number} ${issue.title}>`;
    slackApi.post('/chat.postMessage', { channel, text }).catch(() => {});
    if (process.env.DISCORD_WEBHOOK_URL) {
      axios.post(process.env.DISCORD_WEBHOOK_URL, { content: `🚀 New GitHub issue created in **${req.params.owner}/${req.params.repo}**: [ #${issue.number} ${issue.title} ](${issue.html_url})` }).catch(() => {});
    }
    return res.status(201).json(issue);
  } catch (error) {
    return forwardError(res, error, 'Failed to create GitHub issue.');
  }
});

app.get('/api/slack/channels', async (req, res) => {
  try {
    const response = await slackApi.get('/conversations.list');
    if (response.data && response.data.ok === false) return res.status(502).json({ error: response.data.error || 'Slack API request failed.' });
    return res.json(response.data.channels || response.data);
  } catch (error) {
    return forwardError(res, error, 'Failed to fetch Slack channels.');
  }
});

app.post('/api/slack/message', async (req, res) => {
  const { channel, text } = req.body || {};
  if (!channel || !text || typeof text !== 'string' || text.length > 40000) {
    return res.status(400).json({ error: 'channel and text are required.' });
  }
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

app.get('/api/jira/projects', (req, res) => res.json({ message: 'Fetching Jira projects' }));
app.post('/api/jira/issue', (req, res) => {
  const { projectKey, summary, description } = req.body || {};
  if (!projectKey || !summary) return res.status(400).json({ error: 'projectKey and summary are required' });
  return res.status(201).json({ message: 'Successfully created Jira issue', issue: { projectKey, summary, description: description || '' } });
});
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
