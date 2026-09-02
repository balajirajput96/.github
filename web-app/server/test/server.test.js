const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { app } = require('../index');

function request(server, path) {
  return new Promise((resolve, reject) => {
    const address = server.address();
    const req = http.get({ hostname: '127.0.0.1', port: address.port, path }, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', reject);
  });
}

test('API hello endpoint returns JSON and security headers', async (t) => {
  const server = app.listen(0);
  t.after(() => server.close());

  const response = await request(server, '/api/hello');
  assert.equal(response.statusCode, 200);
  assert.deepEqual(JSON.parse(response.body), {
    message: 'Hello from the AI Assistant Platform API!',
  });
  assert.equal(response.headers['x-content-type-options'], 'nosniff');
  assert.equal(response.headers['x-frame-options'], 'DENY');
});

test('Atlassian endpoint reports configuration status', async (t) => {
  const server = app.listen(0);
  t.after(() => server.close());

  const response = await request(server, '/api/atlassian');
  assert.equal(response.statusCode, 200);
  assert.deepEqual(JSON.parse(response.body).configured, false);
});
