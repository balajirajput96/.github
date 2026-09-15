const { PassThrough } = require('stream');
const request = require('supertest');
const app = require('./index');
const axios = require('axios');

jest.mock('axios');

describe('Personal AI Platform API', () => {
  const mockAxiosInstance = {
    post: jest.fn(),
    get: jest.fn(),
  };

  beforeEach(() => {
    process.env.API_KEY = 'test-api-key';
    process.env.GITHUB_TOKEN = 'github-test-token';
    process.env.SLACK_BOT_TOKEN = 'xoxb-test-token';
    process.env.DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/test';
    process.env.GEMINI_API_KEY = 'gemini-test-key';
    process.env.DATADOG_API_KEY = 'test-datadog-key';
    process.env.ANTIGRAVITY_VERSION = 'v2.0';

    axios.create.mockReturnValue(mockAxiosInstance);
    jest.clearAllMocks();
  });

  afterAll(() => {
    delete process.env.API_KEY;
    delete process.env.GITHUB_TOKEN;
    delete process.env.SLACK_BOT_TOKEN;
    delete process.env.DISCORD_WEBHOOK_URL;
    delete process.env.GEMINI_API_KEY;
    delete process.env.DATADOG_API_KEY;
    delete process.env.ANTIGRAVITY_VERSION;
  });

  it('GET / returns the live status', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: '🚀 LIVE', message: 'Welcome to the Personal AI Platform API', documentation: '/api-docs' });
  });

  describe('GitHub', () => {
    it('fetches authenticated user repositories with GET /api/github', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: [{ name: 'repo1', html_url: 'http://repo1' }] });
      const res = await request(app).get('/api/github').set('x-api-key', 'test-api-key');
      expect(res.statusCode).toBe(200);
      expect(res.body.repos).toHaveLength(1);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/user/repos', expect.objectContaining({ headers: { Authorization: 'Bearer github-test-token' } }));
    });

    it('returns 503 for GET /api/github without a token', async () => {
      delete process.env.GITHUB_TOKEN;
      const res = await request(app).get('/api/github').set('x-api-key', 'test-api-key');
      expect(res.statusCode).toBe(503);
    });

    it('fetches repositories with the configured token', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: [{ name: 'repo1', html_url: 'http://repo1' }] });
      const res = await request(app).get('/api/github/repos/test-user').set('x-api-key', 'test-api-key');
      expect(res.statusCode).toBe(200);
      expect(res.body.repos).toHaveLength(1);
    });

    it('rejects unsafe owner input before calling GitHub', async () => {
      const res = await request(app).get('/api/github/repos/../test-user').set('x-api-key', 'test-api-key');
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'Invalid GitHub owner.' });
    });

    it('returns 503 without a GitHub token', async () => {
      delete process.env.GITHUB_TOKEN;
      const res = await request(app).get('/api/github/repos/test-user').set('x-api-key', 'test-api-key');
      expect(res.statusCode).toBe(503);
    });

    const mockIssue = { html_url: 'http://example.com/issue/1', number: 123 };
    it('creates an issue and triggers configured notifications', async () => {
      mockAxiosInstance.post.mockResolvedValueOnce({ data: mockIssue });
      mockAxiosInstance.post.mockResolvedValueOnce({ data: { ok: true } });
      axios.post.mockResolvedValueOnce({ status: 204 });
      const res = await request(app).post('/api/github/issues/test-owner/test-repo').set('x-api-key', 'test-api-key').send({ title: 'Test Issue', body: 'This is a test.' });
      expect(res.statusCode).toBe(201);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/repos/test-owner/test-repo/issues', { title: 'Test Issue', body: 'This is a test.' }, { headers: { Authorization: 'Bearer github-test-token' } });
      expect(axios.post).toHaveBeenCalledWith(process.env.DISCORD_WEBHOOK_URL, { content: '🚀 New GitHub issue created in **test-owner/test-repo**: [ #123 Test Issue ](http://example.com/issue/1)' });
    });

    it('returns 401 when creating an issue without API key', async () => {
      const res = await request(app).post('/api/github/issues/test-owner/test-repo').send({ title: 'Test Issue' });
      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({ error: 'Unauthorized: Invalid or missing API key.' });
    });

    it('rejects unsafe repository input', async () => {
      const res = await request(app).post('/api/github/issues/test-owner/%2Ftmp').set('x-api-key', 'test-api-key').send({ title: 'Test Issue' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'Invalid GitHub owner or repository.' });
    });
  });

  describe('Slack', () => {
    it('sends a message with the configured bot token', async () => {
      mockAxiosInstance.post.mockResolvedValue({ data: { ok: true, ts: '123.456' } });
      const message = { channel: '#general', text: 'Hello, world!' };
      const res = await request(app).post('/api/slack/message').set('x-api-key', 'test-api-key').send(message);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Message sent to channel: #general', ts: '123.456' });
    });

    it('returns 401 when sending a message without API key', async () => {
      const res = await request(app).post('/api/slack/message').send({ channel: '#general', text: 'Hello' });
      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({ error: 'Unauthorized: Invalid or missing API key.' });
    });

    it('returns 503 without a Slack token', async () => {
      delete process.env.SLACK_BOT_TOKEN;
      const res = await request(app).post('/api/slack/message').set('x-api-key', 'test-api-key').send({ channel: '#general', text: 'Hello' });
      expect(res.statusCode).toBe(503);
    });

    it('handles GET /api/slack with fallback channels when unconfigured', async () => {
      delete process.env.SLACK_BOT_TOKEN;
      const res = await request(app).get('/api/slack');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('configured', false);
      expect(Array.isArray(res.body.channels)).toBe(true);
    });

    it('exchanges a Slack OAuth code when OAuth credentials are configured', async () => {
      process.env.SLACK_CLIENT_ID = 'client-id';
      process.env.SLACK_CLIENT_SECRET = 'client-secret';
      axios.post.mockResolvedValue({ data: { ok: true, team: { id: 'T1', name: 'Test Team' }, bot_user_id: 'U1' } });
      const res = await request(app).post('/api/slack/oauth').send({ code: 'temporary-code' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        ok: true,
        message: 'Slack connected successfully via OAuth.',
        team: { id: 'T1', name: 'Test Team' },
        bot_user_id: 'U1',
      });
      expect(axios.post).toHaveBeenCalledWith(
        'https://slack.com/api/oauth.v2.access',
        expect.stringContaining('code=temporary-code'),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );
      delete process.env.SLACK_CLIENT_ID;
      delete process.env.SLACK_CLIENT_SECRET;
    });

    it('returns 503 when Slack OAuth is not configured', async () => {
      const res = await request(app).post('/api/slack/oauth').send({ code: 'temporary-code' });
      expect(res.statusCode).toBe(503);
      expect(res.body).toEqual({ ok: false, error: 'Slack OAuth is not configured.' });
    });

    it('handles POST /api/slack/test-message', async () => {
      mockAxiosInstance.post.mockResolvedValue({ data: { ok: true } });
      const res = await request(app).post('/api/slack/test-message');
      expect(res.statusCode).toBe(200);
      expect(res.body.ok).toBe(true);
    });
  });

  describe('Connectors and Integrations Status', () => {
    it('GET /api/connectors returns truthful connector states', async () => {
      const res = await request(app).get('/api/connectors');
      expect(res.statusCode).toBe(200);
      expect(res.body.github.status).toBe('configured');
      expect(res.body.slack.status).toBe('configured');
      expect(res.body.discord.status).toBe('configured');
      expect(res.body.google_drive.status).toBe('unconfigured');
      expect(res.body.gemini.status).toBe('configured');
      expect(res.body.antigravity.status).toBe('configured');
      expect(res.body.datadog.status).toBe('configured');
    });

    it('GET /api/gemini/status reports configuration without claiming CLI availability', async () => {
      const res = await request(app).get('/api/gemini/status');
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({ configured: true, cli_installed: false, status: 'configured' });
      expect(res.body.cli_version).toBeNull();
    });

    it('GET /api/datadog/status reports configuration without claiming agent telemetry', async () => {
      const res = await request(app).get('/api/datadog/status');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ service: 'Datadog', configured: true, agent_status: 'configured', telemetry: 'configured' });
    });

    it('GET /api/google-drive returns configured state', async () => {
      const res = await request(app).get('/api/google-drive');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('Discord', () => {
    it('sends a message with the configured webhook', async () => {
      axios.post.mockResolvedValue({ status: 204 });
      const message = { content: 'Hello, Discord!' };
      const res = await request(app).post('/api/discord/message').set('x-api-key', 'test-api-key').send(message);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Message sent to Discord' });
    });

    it('returns 401 when sending a message without API key', async () => {
      const res = await request(app).post('/api/discord/message').send({ content: 'Hello' });
      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({ error: 'Unauthorized: Invalid or missing API key.' });
    });

    it('returns 503 without a webhook', async () => {
      delete process.env.DISCORD_WEBHOOK_URL;
      const res = await request(app).post('/api/discord/message').set('x-api-key', 'test-api-key').send({ content: 'Hello' });
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
          // Assert that axios was called correctly
          expect(axios.post).toHaveBeenCalledWith(
            expect.stringContaining('/v1beta/models/gemini-2.5-flash:streamGenerateContent'),
            expect.objectContaining({ contents: expect.any(Array) }),
            { params: { key: 'gemini-test-key' }, headers: { 'Content-Type': 'application/json' }, responseType: 'stream' }
          );
          done();
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
