require('dotenv').config();
const express = require('express');
const app = express();
const port = 3001;

app.use(express.json());

// Temporary in-memory storage for the access token
let slackAccessToken = null;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello gamer!' });
});

app.post('/api/slack/oauth', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code is missing' });
  }

  // Simulate a successful OAuth exchange
  console.log('Simulating Slack OAuth flow with code:', code);
  slackAccessToken = 'xoxp-simulated-token-for-testing'; // Store a simulated token
  console.log('Simulated Slack access token stored:', slackAccessToken);
  res.json({ ok: true });
});

app.post('/api/slack/test-message', async (req, res) => {
  if (!slackAccessToken) {
    return res.status(400).json({ error: 'Slack integration not connected' });
  }

  // Simulate sending a message
  console.log('Simulating sending a test message to Slack...');
  console.log('Channel: #general');
  console.log('Message: Hello from the AI Automation Hub!');
  console.log('Using token:', slackAccessToken);

  res.json({ ok: true, message: 'Simulated test message sent successfully' });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});