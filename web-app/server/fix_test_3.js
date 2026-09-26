const fs = require('fs');
const file = 'web-app/server/index.test.js';
let content = fs.readFileSync(file, 'utf8');

const search = `    it('POST /api/assistant/chat uses Gemini when configured', async () => {
      axios.post.mockResolvedValue({ data: { candidates: [{ content: { parts: [{ text: 'Gemini response' }] } }] } });
      const res = await request(app).post('/api/assistant/chat').set('x-api-key', 'test-api-key').send({ prompt: 'Say hello' });
      expect(res.statusCode).toBe(200);
      expect(res.body.reply).toBe('Gemini response');
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/v1beta/models/gemini-2.5-flash:generateContent'),
        { contents: [{ parts: [{ text: 'Say hello' }] }] },
        { params: { key: 'gemini-test-key' }, headers: { 'Content-Type': 'application/json' } },
      );
    });`;

const replace = `    it('POST /api/assistant/chat uses Gemini when configured', async () => {
      const mockStream = new (require('stream').PassThrough)();
      axios.post.mockResolvedValue({ data: mockStream });

      const reqPromise = request(app).post('/api/assistant/chat').set('x-api-key', 'test-api-key').send({ prompt: 'Say hello' });

      mockStream.emit('data', 'data: {"candidates": [{"content": {"parts": [{"text": "Gemini response"}]}}]}\n');
      mockStream.emit('end');

      const res = await reqPromise;

      expect(res.statusCode).toBe(200);
      expect(res.text).toContain('FINAL_RESPONSE');
      expect(res.text).toContain('Gemini response');
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse'),
        { contents: [{ role: 'user', parts: [{ text: 'Say hello' }] }] },
        { params: { key: 'gemini-test-key' }, headers: { 'Content-Type': 'application/json' }, responseType: 'stream' },
      );
    });`;

if (content.includes(search)) {
    content = content.replace(search, replace);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Test file patched.');
} else {
    console.log('Search string not found.');
}
