const request = require('supertest');
const app = require('./index');
const axios = require('axios');

// The manual mock in __mocks__/axios.js is used automatically
const mockAxiosInstance = axios.create();

describe('Personal AI Platform API', () => {
  beforeEach(() => {
    // Clear mock history before each test
    mockAxiosInstance.get.mockClear();
    mockAxiosInstance.post.mockClear();
    axios.post.mockClear(); // Clear history for the top-level mock

    // Set a default for the webhook URL
    process.env.DISCORD_WEBHOOK_URL = 'http://discord.webhook.url';
  });

  // Health Check and API Documentation
  describe('GET /', () => {
    it('should return a status object and API documentation link', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', '🚀 LIVE');
    });
  });

  // GitHub Endpoints
  describe('GitHub Integration', () => {
    const mockRepos = [{ id: 1, name: 'repo1' }];
    const mockIssue = { id: 1, number: 123, title: 'Test Issue', html_url: 'http://example.com' };

    it('GET /api/github/repos/:owner should fetch repositories', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: mockRepos });
      const res = await request(app).get('/api/github/repos/test-owner');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockRepos);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users/test-owner/repos');
    });

    it('POST /api/github/issues/:owner/:repo should trigger Slack and Discord notifications', async () => {
      mockAxiosInstance.post.mockResolvedValueOnce({ data: mockIssue }); // GitHub
      mockAxiosInstance.post.mockResolvedValueOnce({ data: { ok: true } }); // Slack
      axios.post.mockResolvedValueOnce({ status: 204 }); // Discord

      const newIssue = { title: 'Test Issue', body: 'This is a test.' };
      const res = await request(app).post('/api/github/issues/test-owner/test-repo').send(newIssue);
      expect(res.statusCode).toBe(201);

      const expectedSlackMessage = `🚀 New GitHub issue created in test-owner/test-repo:\n<http://example.com|#123 Test Issue>`;
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/chat.postMessage', { channel: '#general', text: expectedSlackMessage });

      const expectedDiscordMessage = `🚀 New GitHub issue created in **test-owner/test-repo**: [ #${mockIssue.number} ${mockIssue.title} ](${mockIssue.html_url})`;
      expect(axios.post).toHaveBeenCalledWith(process.env.DISCORD_WEBHOOK_URL, { content: expectedDiscordMessage });
    });
  });

  // Slack Endpoints
  describe('Slack Integration', () => {
    it('POST /api/slack/message should send a message', async () => {
      mockAxiosInstance.post.mockResolvedValue({ data: { ok: true } });
      const message = { channel: '#general', text: 'Hello, world!' };
      const res = await request(app).post('/api/slack/message').send(message);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Message sent to channel: #general' });
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/chat.postMessage', message);
    });
  });

  // Discord Endpoints
  describe('Discord Integration', () => {
    it('POST /api/discord/message should send a message', async () => {
      axios.post.mockResolvedValue({ status: 204 });
      const message = { content: 'Hello, Discord!' };
      const res = await request(app).post('/api/discord/message').send(message);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Message sent to Discord' });
      expect(axios.post).toHaveBeenCalledWith(process.env.DISCORD_WEBHOOK_URL, message);
    });
  });

  // Jira Integration (Placeholder)
  describe('Jira Integration', () => {
    it('POST /api/jira/issue should return a placeholder message', async () => {
      const res = await request(app).post('/api/jira/issue').send({ projectKey: 'PROJ', summary: 'Test' });
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toContain('Successfully created Jira issue');
    });
  });
});