const request = require('supertest');
const app = require('./index');

describe('Personal AI Platform API', () => {
  // Health Check and API Documentation
  describe('GET /', () => {
    it('should return a status object and API documentation link', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', '🚀 LIVE');
      expect(res.body).toHaveProperty('service', 'Personal AI Platform');
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
    it('GET /api/github/repos/:owner should return a message', async () => {
      const res = await request(app).get('/api/github/repos/test-owner');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Fetching repositories for owner: test-owner', owner: 'test-owner' });
    });

    it('POST /api/github/issues/:owner/:repo should create an issue', async () => {
      const issue = { title: 'Test Issue', body: 'This is a test.' };
      const res = await request(app)
        .post('/api/github/issues/test-owner/test-repo')
        .send(issue);
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({ message: 'Successfully created issue', owner: 'test-owner', repo: 'test-repo', issue });
    });
  });

  // Slack Endpoints
  describe('Slack Integration', () => {
    it('POST /api/slack/message should send a message', async () => {
      const message = { channel: '#general', text: 'Hello, world!' };
      const res = await request(app)
        .post('/api/slack/message')
        .send(message);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Message sent to channel: #general', sent: message });
    });
  });

  // Jira Endpoints
  describe('Jira Integration', () => {
    it('POST /api/jira/issue should create an issue', async () => {
      const issue = { projectKey: 'PROJ', summary: 'New Bug', description: 'A bug was found.' };
      const res = await request(app)
        .post('/api/jira/issue')
        .send(issue);
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({ message: 'Successfully created Jira issue', issue });
    });
  });

  // Workflow Endpoints
  describe('Workflow Automation', () => {
    it('POST /api/workflow/create should create a workflow', async () => {
        const workflow = { workflowName: 'Test Workflow', steps: ['step1', 'step2']};
        const res = await request(app)
            .post('/api/workflow/create')
            .send(workflow);
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ message: "Workflow 'Test Workflow' created successfully.", steps: workflow.steps });
    });

    it('POST /api/workflow/sync should initiate a sync', async () => {
        const sync = { source: 'GitHub', destination: 'Jira' };
        const res = await request(app)
            .post('/api/workflow/sync')
            .send(sync);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: 'Sync workflow from GitHub to Jira initiated.' });
    });
  });
});