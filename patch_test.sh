sed -i -e "s/axios.post.mockResolvedValue({ data: { candidates: \[{ content: { parts: \[{ text: 'Gemini response' }\] } }\] } });/const { EventEmitter } = require('events');\n      const mockStream = new EventEmitter();\n      axios.post.mockResolvedValue({ data: mockStream });/g" web-app/server/index.test.js

sed -i -e "s/const res = await request(app).post('\/api\/assistant\/chat').set('x-api-key', 'test-api-key').send({ prompt: 'Say hello' });/const resPromise = request(app).post('\/api\/assistant\/chat').set('x-api-key', 'test-api-key').send({ prompt: 'Say hello' });\n\n      setTimeout(() => {\n        mockStream.emit('data', Buffer.from('data: ' + JSON.stringify({ candidates: [{ content: { parts: [{ text: 'Gemini stream chunk' }] } }] }) + '\\\n'));\n        mockStream.emit('end');\n      }, 10);\n\n      const res = await resPromise;/g" web-app/server/index.test.js

sed -i -e "s/expect(res.body.reply).toBe('Gemini response');/expect(res.text).toContain('Gemini stream chunk');/g" web-app/server/index.test.js

sed -i -e "s/expect.stringContaining('\/v1beta\/models\/gemini-2.5-flash:generateContent'),/expect.stringContaining('\/v1beta\/models\/gemini-2.5-flash:streamGenerateContent?alt=sse'),/g" web-app/server/index.test.js

sed -i -e "s/{ contents: \[{ parts: \[{ text: 'Say hello' }\] }\] },/{ contents: [{ role: 'user', parts: [{ text: 'Say hello' }] }] },/g" web-app/server/index.test.js

sed -i -e "s/{ params: { key: 'gemini-test-key' }, headers: { 'Content-Type': 'application\/json' } },/{ params: { key: 'gemini-test-key' }, headers: { 'Content-Type': 'application\/json' }, responseType: 'stream' },/g" web-app/server/index.test.js
