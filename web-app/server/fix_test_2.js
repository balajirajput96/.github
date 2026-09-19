const fs = require('fs');
const file = 'web-app/server/index.test.js';
let content = fs.readFileSync(file, 'utf8');

const search = `      mockStream.emit('data', 'data: {"candidates": [{"content": {"parts": [{"text": "Gemini response"}]}}]}
');`;

const replace = `      mockStream.emit('data', 'data: {"candidates": [{"content": {"parts": [{"text": "Gemini response"}]}}]}\n');`;

if (content.includes(search)) {
    content = content.replace(search, replace);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Test file fixed syntax error.');
} else {
    console.log('Search string not found.');
}
