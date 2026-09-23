const fs = require('fs');
let code = fs.readFileSync('web-app/server/index.test.js', 'utf8');

const search = `expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse'),
        { contents: [{ parts: [{ text: 'Say hello' }] }] },
        { params: { key: 'gemini-test-key' }, headers: { 'Content-Type': 'application/json' } },
      );`;
const replace = `expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse'),
        { contents: [{ role: 'user', parts: [{ text: 'Say hello' }] }] },
        { params: { key: 'gemini-test-key' }, headers: { 'Content-Type': 'application/json' }, responseType: 'stream' },
      );`;

code = code.replace(search, replace);

fs.writeFileSync('web-app/server/index.test.js', code);
