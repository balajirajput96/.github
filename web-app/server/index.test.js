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
  });

  // Health Check and API Documentation
  describe('GET /', () => {
    it('should return a status object and API documentation link', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', '🚀 LIVE');
    });
  });

  describe('GET /health', () => {
    it('should return a 200 status with "ok"', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ status: 'ok' });
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

    it('POST /api/github/issues/:owner/:repo should create an issue and trigger a Slack notification', async () => {
      mockAxiosInstance.post.mockResolvedValueOnce({ data: mockIssue }); // For GitHub
      mockAxiosInstance.post.mockResolvedValueOnce({ data: { ok: true } }); // For Slack

      const newIssue = { title: 'Test Issue', body: 'This is a test.' };
      const res = await request(app)
        .post('/api/github/issues/test-owner/test-repo')
        .send(newIssue);

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(mockIssue);

      // Check if GitHub API was called
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/repos/test-owner/test-repo/issues', newIssue);

      // Check if Slack API was called
      const expectedSlackMessage = `🚀 New GitHub issue created in test-owner/test-repo:\n<http://example.com|#123 Test Issue>`;
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/chat.postMessage', {
        channel: '#general',
        text: expectedSlackMessage,
      });
    });

    it('should handle errors when fetching repositories', async () => {
      mockAxiosInstance.get.mockRejectedValue({ response: { status: 404 }, message: 'Not Found' });

      const res = await request(app).get('/api/github/repos/non-existent-owner');

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({
        message: 'Failed to fetch repositories for non-existent-owner',
        error: 'Not Found',
      });
    });
  });

  // Slack Endpoints
  describe('Slack Integration', () => {
    it('POST /api/slack/message should send a message', async () => {
      mockAxiosInstance.post.mockResolvedValue({ data: { ok: true } });

      const message = { channel: '#general', text: 'Hello, world!' };
      const res = await request(app)
        .post('/api/slack/message')
        .send(message);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Message sent to channel: #general' });
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/chat.postMessage', message);
    });

    it('should handle errors when sending a Slack message', async () => {
      mockAxiosInstance.post.mockResolvedValue({ data: { ok: false, error: 'invalid_channel' } });

      const message = { channel: '#invalid', text: 'This will fail' };
      const res = await request(app)
        .post('/api/slack/message')
        .send(message);

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({
        message: 'Failed to send Slack message',
        error: 'invalid_channel',
      });
    });
  });

  // Jira Integration Endpoints
  describe('Jira Integration', () => {
    it('POST /api/jira/issue should return a placeholder message', async () => {
      const res = await request(app).post('/api/jira/issue').send({ projectKey: 'PROJ', summary: 'Test' });
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toContain('Successfully created Jira issue');
    });
  });
});