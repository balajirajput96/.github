const { PassThrough } = require('stream');

const mockInstance = {
  get: jest.fn(),
  post: jest.fn(),
};

const axios = {
  create: jest.fn(() => mockInstance),
  post: jest.fn((url) => {
    if (url.includes('streamGenerateContent')) {
      const mockStream = new PassThrough();
      setTimeout(() => {
        mockStream.emit('data', Buffer.from(`data: ${JSON.stringify({
          candidates: [{ content: { parts: [{ text: 'Gemini response' }] } }]
        })}\n\n`));
        mockStream.emit('end');
      }, 10);
      return Promise.resolve({ data: mockStream });
    }
    return Promise.resolve({ data: {} });
  }),
  get: jest.fn(),
};

module.exports = axios;
