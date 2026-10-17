const fs = require('fs');
let code = fs.readFileSync('web-app/server/index.test.js', 'utf8');

code = code.replace(
  "axios.post.mockResolvedValue({ data: { candidates: [{ content: { parts: [{ text: 'Gemini response' }] } }] } });",
  "const { EventEmitter } = require('events');\n      const mockStream = new EventEmitter();\n      axios.post.mockResolvedValue({ data: mockStream });"
);

code = code.replace(
  "const res = await request(app).post('/api/assistant/chat').set('x-api-key', 'test-api-key').send({ prompt: 'Say hello' });",
  "const resPromise = request(app).post('/api/assistant/chat').set('x-api-key', 'test-api-key').send({ prompt: 'Say hello' });\n\n      // Simulate stream output\n      setTimeout(() => {\n        mockStream.emit('data', Buffer.from('data: ' + JSON.stringify({ candidates: [{ content: { parts: [{ text: 'Gemini stream chunk' }] } }] }) + '\\n'));\n        mockStream.emit('end');\n      }, 10);\n      \n      const res = await resPromise;"
);

code = code.replace(
  "expect(res.body.reply).toBe('Gemini response');",
  "expect(res.text).toContain('Gemini stream chunk');"
);

code = code.replace(
  "expect.stringContaining('/v1beta/models/gemini-2.5-flash:generateContent'),",
  "expect.stringContaining('/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse'),"
);

code = code.replace(
  "{ contents: [{ parts: [{ text: 'Say hello' }] }] },",
  "{ contents: [{ role: 'user', parts: [{ text: 'Say hello' }] }] },"
);

code = code.replace(
  "{ params: { key: 'gemini-test-key' }, headers: { 'Content-Type': 'application/json' } },",
  "{ params: { key: 'gemini-test-key' }, headers: { 'Content-Type': 'application/json' }, responseType: 'stream' },"
);

fs.writeFileSync('web-app/server/index.test.js', code);
