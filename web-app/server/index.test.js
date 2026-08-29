const request = require('supertest');
const app = require('./index');
const axios = require('axios');

jest.mock('axios');
const mockAxiosInstance = axios.create();
const originalEnv = process.env;

describe('Personal AI Platform API', () => {
  beforeEach(() => {
    process.env = { ...originalEnv, DISCORD_WEBHOOK_URL: 'http://discord.webhook.url', GITHUB_TOKEN: 'github-test-token', SLACK_BOT_TOKEN: 'slack-test-token' };
    mockAxiosInstance.get.mockReset();
    mockAxiosInstance.post.mockReset();
    axios.post.mockReset();
  });

  afterAll(() => { process.env = originalEnv; });

  it('GET / returns the live status', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', '🚀 LIVE');
  });

  describe('GitHub', () => {
    const mockRepos = [{ id: 1, name: 'repo1' }];
    const mockIssue = { id: 1, number: 123, title: 'Test Issue', html_url: 'http://example.com' };

    it('fetches authenticated user repositories with GET /api/github', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: mockRepos });
      const res = await request(app).get('/api/github');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockRepos);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/user/repos', {
        headers: { Authorization: 'Bearer github-test-token' },
        params: { per_page: 100, sort: 'updated' },
      });
    });

    it('returns 503 for GET /api/github without a token', async () => {
      delete process.env.GITHUB_TOKEN;
      const res = await request(app).get('/api/github');
      expect(res.statusCode).toBe(503);
      expect(res.body).toEqual({ error: 'GitHub integration is not configured.' });
    });

    it('fetches repositories with the configured token', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: mockRepos });
      const res = await request(app).get('/api/github/repos/test-owner');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockRepos);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users/test-owner/repos', {
        headers: { Authorization: 'Bearer github-test-token' }, params: { per_page: 100 },
      });
    });

    it('rejects unsafe owner input before calling GitHub', async () => {
      const res = await request(app).get('/api/github/repos/%2Fetc%2Fpasswd');
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'Invalid GitHub owner.' });
      expect(mockAxiosInstance.get).not.toHaveBeenCalled();
    });

    it('returns 503 without a GitHub token', async () => {
      delete process.env.GITHUB_TOKEN;
      const res = await request(app).get('/api/github/repos/test-owner');
      expect(res.statusCode).toBe(503);
      expect(res.body).toEqual({ error: 'GitHub integration is not configured.' });
    });

    it('creates an issue and triggers configured notifications', async () => {
      mockAxiosInstance.post.mockResolvedValueOnce({ data: mockIssue });
      mockAxiosInstance.post.mockResolvedValueOnce({ data: { ok: true } });
      axios.post.mockResolvedValueOnce({ status: 204 });
      const res = await request(app).post('/api/github/issues/test-owner/test-repo').send({ title: 'Test Issue', body: 'This is a test.' });
      expect(res.statusCode).toBe(201);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/repos/test-owner/test-repo/issues', { title: 'Test Issue', body: 'This is a test.' }, { headers: { Authorization: 'Bearer github-test-token' } });
      expect(axios.post).toHaveBeenCalledWith(process.env.DISCORD_WEBHOOK_URL, { content: '🚀 New GitHub issue created in **test-owner/test-repo**: [ #123 Test Issue ](http://example.com)' });
    });

    it('rejects unsafe repository input', async () => {
      const res = await request(app).post('/api/github/issues/test-owner/%2Ftmp').send({ title: 'Test Issue' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'Invalid GitHub owner or repository.' });
    });
  });

  describe('Slack', () => {
    it('sends a message with the configured bot token', async () => {
      mockAxiosInstance.post.mockResolvedValue({ data: { ok: true, ts: '123.456' } });
      const message = { channel: '#general', text: 'Hello, world!' };
      const res = await request(app).post('/api/slack/message').send(message);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Message sent to channel: #general', ts: '123.456' });
    });

    it('returns 503 without a Slack token', async () => {
      delete process.env.SLACK_BOT_TOKEN;
      const res = await request(app).post('/api/slack/message').send({ channel: '#general', text: 'Hello' });
      expect(res.statusCode).toBe(503);
    });

    it('handles GET /api/slack with fallback channels when unconfigured', async () => {
      delete process.env.SLACK_BOT_TOKEN;
      const res = await request(app).get('/api/slack');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('configured', false);
      expect(Array.isArray(res.body.channels)).toBe(true);
    });

    it('handles POST /api/slack/oauth', async () => {
      const res = await request(app).post('/api/slack/oauth').send({ code: 'temp-auth-code' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ ok: true, message: 'Slack connected successfully via OAuth.' });
    });

    it('handles POST /api/slack/test-message', async () => {
      mockAxiosInstance.post.mockResolvedValue({ data: { ok: true } });
      const res = await request(app).post('/api/slack/test-message');
      expect(res.statusCode).toBe(200);
      expect(res.body.ok).toBe(true);
    });
  });

  describe('Connectors and Integrations Status', () => {
    it('GET /api/connectors returns all connector states', async () => {
      const res = await request(app).get('/api/connectors');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('github');
      expect(res.body).toHaveProperty('slack');
      expect(res.body).toHaveProperty('discord');
      expect(res.body).toHaveProperty('google_drive');
      expect(res.body).toHaveProperty('gemini');
      expect(res.body).toHaveProperty('antigravity');
      expect(res.body).toHaveProperty('datadog');
      expect(res.body.antigravity.status).toBe('active');
    });

    it('GET /api/gemini/status returns status', async () => {
      const res = await request(app).get('/api/gemini/status');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('cli_installed', true);
      expect(res.body).toHaveProperty('status', 'operational');
    });

    it('GET /api/datadog/status returns telemetry status', async () => {
      const res = await request(app).get('/api/datadog/status');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('service', 'Datadog');
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
      const res = await request(app).post('/api/discord/message').send(message);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Message sent to Discord' });
    });

    it('returns 503 without a webhook', async () => {
      delete process.env.DISCORD_WEBHOOK_URL;
      const res = await request(app).post('/api/discord/message').send({ content: 'Hello' });
      expect(res.statusCode).toBe(503);
    });
  });

  it('does not claim Jira is implemented when it is not', async () => {
    const res = await request(app).post('/api/jira/issue').send({ projectKey: 'PROJ', summary: 'Test' });
    expect(res.statusCode).toBe(501);
    expect(res.body).toEqual({ error: 'Jira integration is not implemented in this repository.' });
  });
});
