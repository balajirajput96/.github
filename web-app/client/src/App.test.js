import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

/**
 * Mocks the window.fetch function before each test to isolate tests
 * from making actual network requests.
 */
beforeEach(() => {
  jest.spyOn(window, 'fetch');
});

/**
 * Restores all mocks after each test to ensure a clean state for the
 * next test.
 */
afterEach(() => {
  jest.restoreAllMocks();
});

/**
 * Test case to verify that the "Learn React" link is rendered correctly.
 * It also ensures that the component handles a successful API response
 * without crashing.
 */
test('renders learn react link', () => {
  window.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ message: 'Hello gamer!' }),
  });
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

/**
 * Test case to verify that an error message is displayed when the
 * API request to fetch the message fails.
 */
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
