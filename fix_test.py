import re

with open('web-app/server/index.test.js', 'r') as f:
    content = f.read()

# Fix the multi-line string issue caused by double backslashes resolving to single backslashes in Python string literals
mock_replacement = """    it('POST /api/assistant/chat uses Gemini when configured', async () => {
      const mockStream = {
        on: jest.fn((event, callback) => {
          if (event === 'data') {
            callback(Buffer.from('data: ' + JSON.stringify({ candidates: [{ content: { parts: [{ text: 'Gemini response' }] } }] }) + '\\\\n\\\\n'));
          }
          if (event === 'end') {
            callback();
          }
        }),
      };
      axios.post.mockResolvedValue({ data: mockStream });

      const res = await request(app).post('/api/assistant/chat').set('x-api-key', 'test-api-key').send({ prompt: 'Say hello' });
      expect(res.statusCode).toBe(200);
      expect(res.text).toContain('Gemini response');
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/v1beta/models/gemini-2.5-flash:streamGenerateContent'),
        { contents: [{ role: 'user', parts: [{ text: 'Say hello' }] }] },
        { params: { key: 'gemini-test-key' }, headers: { 'Content-Type': 'application/json' }, responseType: 'stream' },
      );
    });"""

# Simple replacement
new_content = re.sub(
    r"    it\('POST /api/assistant/chat uses Gemini when configured', async \(\) => {[\s\S]*?(?=    it\('POST /api/assistant/chat returns 503)",
    mock_replacement + "\n\n",
    content
)

with open('web-app/server/index.test.js', 'w') as f:
    f.write(new_content)
