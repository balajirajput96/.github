const mockInstance = {
  get: jest.fn(),
  post: jest.fn(),
};

const axios = {
  create: jest.fn(() => mockInstance),
  post: jest.fn(), // Add mock for top-level post method
};

module.exports = axios;