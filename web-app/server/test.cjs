const request = require('supertest');
const app = require('./index');
const axios = require('axios');

async function run() {
  process.env.GEMINI_API_KEY = 'gemini-test-key';
  process.env.API_KEY = 'test-api-key';

  axios.post = require('jest-mock').fn().mockResolvedValue({ data: { candidates: [{ content: { parts: [{ text: 'Gemini response' }] } }] } });

  const res = await request(app).post('/api/assistant/chat').set('x-api-key', 'test-api-key').send({ prompt: 'Say hello' });
  console.log(res.statusCode);
  console.log(res.body);
}
run();
