const mockInstance = {
  get: jest.fn(),
  post: jest.fn(),
};

const axios = {
  create: jest.fn(() => mockInstance),
};

module.exports = axios;