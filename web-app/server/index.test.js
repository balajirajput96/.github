const request = require('supertest');
const axios = require('axios');
const app = require('./index');
const { PassThrough } = require('stream');

jest.mock('axios');

describe('Personal AI Platform API', () => {
  beforeEach(() => {
    process.env.API_KEY = 'test-api-key';
    process.env.GITHUB_TOKEN = 'ghp_test_token';
    process.env.SLACK_BOT_TOKEN = 'xoxb-test-token';
    process.env.DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/test';
    process.env.GEMINI_API_KEY = 'gemini-test-key';
    jest.clearAllMocks();
  });

  afterAll(() => {
    delete process.env.API_KEY;
    delete process.env.GITHUB_TOKEN;
    delete process.env.SLACK_BOT_TOKEN;
    delete process.env.DISCORD_WEBHOOK_URL;
    delete process.env.GEMINI_API_KEY;
  });

  it('GET / returns the live status', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Personal AI Platform is live.');
  });

  describe('GitHub', () => {
    it('fetches authenticated user repositories with GET /api/github', async () => {
      axios.get.mockResolvedValue({ data: [{ name: 'test-repo', html_url: 'http://test.repo' }] });
      const res = await request(app).get('/api/github');
      expect(res.statusCode).toBe(200);
      expect(res.body.repos.length).toBe(1);
    });

    it('returns 503 for GET /api/github without a token', async () => {
      delete process.env.GITHUB_TOKEN;
      const res = await request(app).get('/api/github');
      expect(res.statusCode).toBe(503);
    });

    it('fetches repositories with the configured token', async () => {
      axios.get.mockResolvedValue({ data: [{ name: 'test-repo', html_url: 'http://test.repo' }] });
      const res = await request(app).get('/api/github/repos/user');
      expect(res.statusCode).toBe(200);
      expect(res.body.repos.length).toBe(1);
      expect(axios.get).toHaveBeenCalledWith(
        'https://api.github.com/users/user/repos',
        expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'token ghp_test_token' }) })
      );
    });

    it('rejects unsafe owner input before calling GitHub', async () => {
      const res = await request(app).get('/api/github/repos/../user');
      expect(res.statusCode).toBe(400);
      expect(axios.get).not.toHaveBeenCalled();
    });

    it('returns 503 without a GitHub token', async () => {
      delete process.env.GITHUB_TOKEN;
      const res = await request(app).get('/api/github/repos/user');
      expect(res.statusCode).toBe(503);
    });

    it('creates an issue and triggers configured notifications', async () => {
      axios.post.mockResolvedValueOnce({ data: { html_url: 'http://github.com/issue/1' } });
      axios.post.mockResolvedValueOnce({ data: { ok: true } });
      const res = await request(app).post('/api/github/issues').set('x-api-key', 'test-api-key').send({ repo: 'user/repo', title: 'Test Issue', body: 'This is a test issue.' });
      expect(res.statusCode).toBe(201);
      expect(res.body.issue_url).toBe('http://github.com/issue/1');
      expect(axios.post).toHaveBeenCalledTimes(2);
      expect(axios.post).toHaveBeenNthCalledWith(1,
        'https://api.github.com/repos/user/repo/issues',
        { title: 'Test Issue', body: 'This is a test issue.' },
        expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'token ghp_test_token' }) })
      );
    });

    it('returns 401 when creating an issue without API key', async () => {
      const res = await request(app).post('/api/github/issues').send({ repo: 'user/repo', title: 'Test Issue', body: 'This is a test issue.' });
      expect(res.statusCode).toBe(401);
    });

    it('rejects unsafe repository input', async () => {
      const res = await request(app).post('/api/github/issues').set('x-api-key', 'test-api-key').send({ repo: '../user/repo', title: 'Test Issue', body: 'This is a test issue.' });
      expect(res.statusCode).toBe(400);
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  describe('Slack', () => {
    it('sends a message with the configured bot token', async () => {
      axios.post.mockResolvedValue({ data: { ok: true } });
      const res = await request(app).post('/api/slack/message').set('x-api-key', 'test-api-key').send({ channel: 'general', text: 'Hello Slack!' });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(axios.post).toHaveBeenCalledWith(
        'https://slack.com/api/chat.postMessage',
        { channel: 'general', text: 'Hello Slack!' },
        expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'Bearer xoxb-test-token' }) })
      );
    });

    it('returns 401 when sending a message without API key', async () => {
      const res = await request(app).post('/api/slack/message').send({ channel: 'general', text: 'Hello Slack!' });
      expect(res.statusCode).toBe(401);
    });

    it('returns 503 without a Slack token', async () => {
      delete process.env.SLACK_BOT_TOKEN;
      const res = await request(app).post('/api/slack/message').set('x-api-key', 'test-api-key').send({ channel: 'general', text: 'Hello Slack!' });
      expect(res.statusCode).toBe(503);
    });

    it('handles GET /api/slack with fallback channels when unconfigured', async () => {
      delete process.env.SLACK_BOT_TOKEN;
      const res = await request(app).get('/api/slack');
      expect(res.statusCode).toBe(200);
      expect(res.body.channels).toEqual(['general', 'random']);
    });

    it('exchanges a Slack OAuth code when OAuth credentials are configured', async () => {
      process.env.SLACK_CLIENT_ID = 'client-id';
      process.env.SLACK_CLIENT_SECRET = 'client-secret';
      axios.post.mockResolvedValue({ data: { ok: true, access_token: 'new-token' } });
      const res = await request(app).post('/api/slack/oauth').send({ code: 'oauth-code' });
      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBe('new-token');
      delete process.env.SLACK_CLIENT_ID;
      delete process.env.SLACK_CLIENT_SECRET;
    });

    it('returns 503 when Slack OAuth is not configured', async () => {
      const res = await request(app).post('/api/slack/oauth').send({ code: 'oauth-code' });
      expect(res.statusCode).toBe(503);
    });

    it('handles POST /api/slack/test-message', async () => {
      const res = await request(app).post('/api/slack/test-message');
      expect(res.statusCode).toBe(200);
    });
  });

  describe('Connectors and Integrations Status', () => {
    it('GET /api/connectors returns truthful connector states', async () => {
      const res = await request(app).get('/api/connectors');
      expect(res.statusCode).toBe(200);
      expect(res.body.github.configured).toBe(true);
      expect(res.body.slack.configured).toBe(true);
      expect(res.body.discord.configured).toBe(true);
      expect(res.body.notion.configured).toBe(false);
      expect(res.body.jira.configured).toBe(false);
    });

    it('GET /api/gemini/status reports configuration without claiming CLI availability', async () => {
      const res = await request(app).get('/api/gemini/status');
      expect(res.statusCode).toBe(200);
      expect(res.body.configured).toBe(true);
    });

    it('GET /api/datadog/status reports configuration without claiming agent telemetry', async () => {
      const res = await request(app).get('/api/datadog/status');
      expect(res.statusCode).toBe(200);
      expect(res.body.configured).toBe(false);
    });

    it('GET /api/google-drive returns configured state', async () => {
      const res = await request(app).get('/api/google-drive');
      expect(res.statusCode).toBe(200);
      expect(res.body.configured).toBe(false);
    });
  });

  describe('Discord', () => {
    it('sends a message with the configured webhook', async () => {
      axios.post.mockResolvedValue({ status: 204 });
      const res = await request(app).post('/api/discord/message').set('x-api-key', 'test-api-key').send({ content: 'Hello Discord!' });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(axios.post).toHaveBeenCalledWith('https://discord.com/api/webhooks/test', { content: 'Hello Discord!' });
    });

    it('returns 401 when sending a message without API key', async () => {
      const res = await request(app).post('/api/discord/message').send({ content: 'Hello Discord!' });
      expect(res.statusCode).toBe(401);
    });

    it('returns 503 without a webhook', async () => {
      delete process.env.DISCORD_WEBHOOK_URL;
      const res = await request(app).post('/api/discord/message').set('x-api-key', 'test-api-key').send({ content: 'Hello Discord!' });
      expect(res.statusCode).toBe(503);
    });
  });

  describe('AI Assistant', () => {
    it('returns 401 when calling chat without API key', async () => {
      const res = await request(app).post('/api/assistant/chat').send({ prompt: 'Say hello' });
      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({ error: 'Unauthorized: Invalid or missing API key.' });
    });

    it('POST /api/assistant/chat uses Gemini when configured (SSE flow)', (done) => {
      const mockStream = new PassThrough();
      axios.post.mockResolvedValue({ data: mockStream });

      request(app)
        .post('/api/assistant/chat')
        .set('x-api-key', 'test-api-key')
        .send({ prompt: 'Say hello' })
        .expect('Content-Type', 'text/event-stream')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          // Wait briefly to allow stream to finish processing
          setTimeout(() => {
             done();
          }, 50);
        });

      // Emulate the SSE stream events
      setTimeout(() => {
        mockStream.emit('data', Buffer.from(`data: ${JSON.stringify({ candidates: [{ content: { parts: [{ text: 'Gemini response' }] } }] })}\n\n`));
        mockStream.emit('data', Buffer.from('data: [DONE]\n\n'));
        mockStream.end();
      }, 10);
    });

    it('POST /api/assistant/chat returns 503 when Gemini is not configured', async () => {
      delete process.env.GEMINI_API_KEY;
      const res = await request(app).post('/api/assistant/chat').set('x-api-key', 'test-api-key').send({ prompt: 'Say hello' });
      expect(res.statusCode).toBe(503);
      expect(res.body).toEqual({ error: 'Gemini integration is not configured.' });
    });

    it('POST /api/assistant/chat rejects oversized prompts', async () => {
      const res = await request(app).post('/api/assistant/chat').set('x-api-key', 'test-api-key').send({ prompt: 'x'.repeat(20001) });
      expect(res.statusCode).toBe(400);
    });
  });

  it('returns 401 when creating Jira issue without API key', async () => {
    const res = await request(app).post('/api/jira/issue').send({ projectKey: 'PROJ', summary: 'Test' });
    expect(res.statusCode).toBe(401);
  });

  it('returns configuration status for new integrations', async () => {
    for (const endpoint of ['/api/atlassian', '/api/claude-ai', '/api/youtube']) {
      const res = await request(app).get(endpoint);
      expect(res.statusCode).toBe(200);
      expect(res.body.configured).toBeDefined();
    }
  });
});
