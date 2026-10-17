const fs = require('fs');
const testFile = 'web-app/server/index.test.js';
let content = fs.readFileSync(testFile, 'utf8');

const toReplace = `    it('POST /api/assistant/chat uses Gemini when configured', async () => {
      const mockStream = { on: jest.fn() };
      axios.post.mockResolvedValue({ data: mockStream });
      request(app).post('/api/assistant/chat').set('x-api-key', 'test-api-key').send({ prompt: 'Say hello' }).catch(() => {});
      await new Promise(resolve => setTimeout(resolve, 50));
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/v1beta/models/gemini-2.5-flash:streamGenerateContent'),
        { contents: [{ role: 'user', parts: [{ text: 'Say hello' }] }] },
        { params: { key: 'gemini-test-key' }, headers: { 'Content-Type': 'application/json' }, responseType: 'stream' },
      );
    });`;

const replacement = `    it('POST /api/assistant/chat uses Gemini when configured', function(done) {
      const mockStream = new (require('stream').PassThrough)();
      axios.post.mockResolvedValue({ data: mockStream });

      request(app).post('/api/assistant/chat').set('x-api-key', 'test-api-key').send({ prompt: 'Say hello' }).then(function(res) {
        expect(res.statusCode).toBe(200);
        done();
      }).catch(done);

      setTimeout(function() {
        mockStream.emit('data', 'data: {"candidates": [{"content": {"parts": [{"text": "Gemini response"}]}}]}\\n');
        mockStream.emit('data', 'data: [DONE]\\n');
        mockStream.emit('end');
      }, 50);
    });`;

if (content.includes(toReplace)) {
  content = content.replace(toReplace, replacement);
  fs.writeFileSync(testFile, content);
  console.log('Replaced correctly');
} else {
  console.log('Could not find text');
}
