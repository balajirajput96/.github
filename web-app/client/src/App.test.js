import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// Mock the global fetch function
beforeEach(() => {
  jest.spyOn(window, 'fetch');
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders learn react link', () => {
  window.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ message: 'Hello gamer!' }),
  });
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test('displays an error message on failed API request', async () => {
  // Mock the fetch call to return an error response
  window.fetch.mockResolvedValueOnce({
    ok: false,
    status: 500,
  });

  render(<App />);

  // Wait for the error message to be displayed
  const errorMessage = await screen.findByText(/failed to fetch message/i);
  expect(errorMessage).toBeInTheDocument();
});
