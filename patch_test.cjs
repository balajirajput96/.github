const fs = require('fs');
let code = fs.readFileSync('web-app/server/index.test.js', 'utf8');

const search = `axios.post.mockResolvedValue({ data: { candidates: [{ content: { parts: [{ text: 'Gemini response' }] } }] } });`;
const replace = `const mockData = new MockResponse();
      axios.post.mockResolvedValue({ data: mockData });

      setTimeout(() => {
        const payload = JSON.stringify({
          candidates: [{ content: { parts: [{ text: 'Gemini response' }] } }]
        });
        mockData.emit('data', Buffer.from(\`data: \${payload}\\n\\ndata: [DONE]\\n\\n\`));
      }, 10);`;

code = code.replace(search, replace);

const search2 = `expect(res.body.reply).toBe('Gemini response');`;
const replace2 = `// For stream we get text directly not JSON
      expect(res.text).toContain('Gemini response');
      expect(res.text).toContain('FINAL_RESPONSE');`;

code = code.replace(search2, replace2);

fs.writeFileSync('web-app/server/index.test.js', code);
