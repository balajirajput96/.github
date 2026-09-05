require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const crypto = require('crypto');

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

const requireAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const envKey = process.env.API_KEY;

  if (!apiKey || !envKey) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing API key.' });
  }

  const apiKeyBuffer = Buffer.from(apiKey);
  const envKeyBuffer = Buffer.from(envKey);

  if (apiKeyBuffer.length !== envKeyBuffer.length || !crypto.timingSafeEqual(apiKeyBuffer, envKeyBuffer)) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing API key.' });
  }

  return next();
};

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
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'");
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
app.get('/api/atlassian', (req, res) => res.json({ message: 'Atlassian API endpoint', configured: Boolean(process.env.ATLASSIAN_TOKEN || process.env.JIRA_API_TOKEN) }));
app.get('/api/claude-ai', (req, res) => res.json({ message: 'Claude AI API endpoint', configured: Boolean(process.env.ANTHROPIC_API_KEY) }));
app.get('/api/youtube', (req, res) => res.json({ message: 'YouTube API endpoint', configured: Boolean(process.env.YOUTUBE_API_KEY) }));
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

app.post('/api/github/issues/:owner/:repo', requireAuth, async (req, res) => {
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

app.post('/api/slack/oauth', async (req, res) => {
  const { code } = req.body || {};
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ ok: false, error: 'OAuth code is required.' });
  }
  const clientId = process.env.SLACK_CLIENT_ID;
  const clientSecret = process.env.SLACK_CLIENT_SECRET;
  const redirectUri = process.env.SLACK_REDIRECT_URI;
  if (!clientId || !clientSecret) {
    return res.status(503).json({ ok: false, error: 'Slack OAuth is not configured.' });
  }
  try {
    const params = new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret });
    if (redirectUri) params.set('redirect_uri', redirectUri);
    const response = await axios.post('https://slack.com/api/oauth.v2.access', params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    if (!response.data?.ok) {
      return res.status(502).json({ ok: false, error: response.data?.error || 'Slack OAuth exchange failed.' });
    }
    return res.json({
      ok: true,
      message: 'Slack connected successfully via OAuth.',
      team: response.data.team ? { id: response.data.team.id, name: response.data.team.name } : undefined,
      bot_user_id: response.data.bot_user_id || undefined,
    });
  } catch (error) {
    return res.status(502).json({ ok: false, error: 'Failed to complete Slack OAuth exchange.' });
  }
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

app.post('/api/slack/message', requireAuth, async (req, res) => {
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

app.post('/api/discord/message', requireAuth, async (req, res) => {
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
  const githubConfigured = Boolean(process.env.GITHUB_TOKEN || process.env.GH_TOKEN);
  const slackConfigured = Boolean(process.env.SLACK_BOT_TOKEN);
  const discordConfigured = Boolean(process.env.DISCORD_WEBHOOK_URL);
  const googleDriveConfigured = Boolean(process.env.GOOGLE_DRIVE_TOKEN || process.env.GOOGLE_WORKSPACE_CLI_TOKEN);
  const geminiConfigured = Boolean(process.env.GEMINI_API_KEY);
  const datadogConfigured = Boolean(process.env.DATADOG_API_KEY || process.env.DD_API_KEY);
  const antigravityConfigured = Boolean(process.env.ANTIGRAVITY_VERSION || process.env.ANTIGRAVITY_CLI_PATH);
  return res.json({
    github: { configured: githubConfigured, status: githubConfigured ? 'configured' : 'unconfigured' },
    slack: { configured: slackConfigured, status: slackConfigured ? 'configured' : 'unconfigured' },
    discord: { configured: discordConfigured, status: discordConfigured ? 'configured' : 'unconfigured' },
    google_drive: { configured: googleDriveConfigured, status: googleDriveConfigured ? 'configured' : 'unconfigured' },
    gemini: { configured: geminiConfigured, status: geminiConfigured ? 'configured' : 'unconfigured' },
    antigravity: {
      configured: antigravityConfigured,
      version: process.env.ANTIGRAVITY_VERSION || null,
      status: antigravityConfigured ? 'configured' : 'unverified'
    },
    datadog: { configured: datadogConfigured, status: datadogConfigured ? 'configured' : 'unconfigured' }
  });
});

app.get('/api/gemini/status', (req, res) => {
  const configured = Boolean(process.env.GEMINI_API_KEY);
  return res.json({
    service: 'Google Gemini',
    configured,
    cli_installed: false,
    cli_version: null,
    antigravity_bridge: 'unverified',
    status: configured ? 'configured' : 'unconfigured'
  });
});

app.get('/api/datadog/status', (req, res) => {
  const configured = Boolean(process.env.DATADOG_API_KEY || process.env.DD_API_KEY);
  return res.json({
    service: 'Datadog',
    configured,
    agent_status: configured ? 'configured' : 'unconfigured',
    telemetry: configured ? 'configured' : 'unconfigured'
  });
});

app.post('/api/assistant/chat', requireAuth, async (req, res) => {
  const { prompt, history } = req.body || {};
  if (!prompt || typeof prompt !== 'string' || prompt.length > 20000) {
    return res.status(400).json({ error: 'prompt is required and must be at most 20000 characters.' });
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'Gemini integration is not configured.' });
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const formattedHistory = [];
  if (history && Array.isArray(history)) {
    for (const msg of history) {
      if (msg.sender === 'user') {
        formattedHistory.push({ role: 'user', parts: [{ text: msg.text }] });
      } else if (msg.sender === 'ai') {
        formattedHistory.push({ role: 'model', parts: [{ text: msg.text }] });
      }
    }
  }
  formattedHistory.push({ role: 'user', parts: [{ text: prompt }] });

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse`,
      { contents: formattedHistory },
      { params: { key: apiKey }, headers: { 'Content-Type': 'application/json' }, responseType: 'stream' }
    );
    
    response.data.on('data', (chunk) => {
      const lines = chunk.toString().split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
          try {
            const parsed = JSON.parse(line.slice(6));
            const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
            if (text) {
              res.write(`data: ${JSON.stringify({ type: 'FINAL_RESPONSE', content: text })}\n\n`);
            }
          } catch (e) {}
        }
      }
    });

    response.data.on('end', () => {
      res.write('data: [DONE]\n\n');
      res.end();
    });

    response.data.on('error', (err) => {
      res.write(`data: ${JSON.stringify({ type: 'FINAL_RESPONSE', content: '\n\n**Error**: Connection failed.' })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    });

  } catch (error) {
    if (!res.headersSent) {
      return res.status(error.response?.status || 502).json({ error: 'Failed to process request with Gemini.' });
    }
    res.write(`data: ${JSON.stringify({ type: 'FINAL_RESPONSE', content: '\n\n**API Error**: Failed to connect.' })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  }
});

app.get('/api/jira/projects', (req, res) => res.json({ message: 'Jira Projects endpoint', configured: Boolean(process.env.JIRA_API_TOKEN) }));
app.post('/api/jira/issue', requireAuth, async (req, res) => {
  const { title, description } = req.body || {};
  if (!process.env.JIRA_API_TOKEN || !process.env.JIRA_DOMAIN) {
    return res.status(500).json({ error: 'Jira credentials are not fully configured.' });
  }
  try {
    const response = await axios.post(
      `https://${process.env.JIRA_DOMAIN}/rest/api/3/issue`,
      {
        fields: {
          project: { key: process.env.JIRA_PROJECT_KEY },
          summary: title,
          description: {
            type: 'doc',
            version: 1,
            content: [{ type: 'paragraph', content: [{ type: 'text', text: description || 'No description provided' }] }]
          },
          issuetype: { name: 'Task' }
        }
      },
      {
        auth: {
          username: process.env.JIRA_USERNAME,
          password: process.env.JIRA_API_TOKEN
        }
      }
    );
    res.status(201).json({ message: 'Jira issue created successfully', issue: response.data });
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: 'Jira API request failed' });
  }
});
app.post('/api/workflow/create', requireAuth, (req, res) => {
  const { workflowName, steps } = req.body || {};
  if (!workflowName || !Array.isArray(steps)) return res.status(400).json({ error: 'workflowName and steps are required' });
  return res.status(201).json({ message: `Workflow '${workflowName}' created successfully.`, steps });
});
app.post('/api/workflow/sync', requireAuth, (req, res) => {
  const { source, destination } = req.body || {};
  if (!source || !destination) return res.status(400).json({ error: 'source and destination are required' });
  return res.json({ message: `Sync workflow from ${source} to ${destination} initiated.` });
});

app.get('/api/jobs/run', requireAuth, (req, res) => {
  const { execFile } = require('child_process');
  const path = require('path');
  const scriptPath = path.join(__dirname, '..', '..', 'scripts', 'demo_run.py');
  
  execFile('python3', [scriptPath], (error, stdout, stderr) => {
    if (error) {
      console.error(`execFile error: ${error}`);
      return res.status(500).json({ error: 'Failed to run Pharma Job Automation script', details: stderr });
    }
    res.json({ success: true, output: stdout });
  });
});


app.get('/api/resume/download', requireAuth, (req, res) => {
  const { execFile } = require('child_process');
  const path = require('path');
  const fs = require('fs');
  const scriptPath = path.join(__dirname, '..', '..', 'resume', 'resume.py');
  const pdfPath = path.join(__dirname, '..', '..', 'Balaji_Rajput_QA_Officer_Resume.pdf');
  
  execFile('python3', [scriptPath], (error, stdout, stderr) => {
    if (error) {
      console.error(`execFile error: ${error}`);
      return res.status(500).json({ error: 'Failed to generate PDF' });
    }
    if (fs.existsSync(pdfPath)) {
      res.download(pdfPath, 'Balaji_Rajput_Optimized_Resume.pdf');
    } else {
      res.status(404).json({ error: 'PDF not found' });
    }
  });
});


app.get('/api/jobs/db', requireAuth, (req, res) => {
  const sqlite3 = require('sqlite3').verbose();
  const path = require('path');
  const dbPath = path.join(__dirname, '..', '..', 'jobs.db');
  
  const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) return res.status(500).json({ error: 'Database not found. Run Job Scan first.' });
  });

  db.all("SELECT * FROM jobs", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ jobs: rows });
  });
  db.close();
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
