const request = require('supertest');
const app = require('./index');

describe('API Endpoints', () => {
  it('should return a "Hello gamer!" message from /api/hello', async () => {
    const res = await request(app).get('/api/hello');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: 'Hello gamer!' });
  });

  it('should return a message from /api/atlassian', async () => {
    const res = await request(app).get('/api/atlassian');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: 'Atlassian API endpoint' });
  });

  it('should return a message from /api/slack', async () => {
    const res = await request(app).get('/api/slack');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: 'Slack API endpoint' });
  });

  it('should return a message from /api/claude-ai', async () => {
    const res = await request(app).get('/api/claude-ai');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: 'Claude AI API endpoint' });
  });

  it('should return a message from /api/youtube', async () => {
    const res = await request(app).get('/api/youtube');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: 'YouTube API endpoint' });
  });

  it('should return a message from /api/google-drive', async () => {
    const res = await request(app).get('/api/google-drive');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: 'Google Drive API endpoint' });
  });
});