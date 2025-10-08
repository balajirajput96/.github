import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the global fetch function
beforeEach(() => {
  jest.spyOn(window, 'fetch');
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders the welcome message and fetches the API greeting', async () => {
  // Mock a successful fetch call
  window.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ message: 'Hello from the AI Assistant Platform API!' }),
  });

  render(<App />);

  // Check that the main welcome message is rendered
  const welcomeElement = screen.getByText(/Welcome to the AI Assistant Platform/i);
  expect(welcomeElement).toBeInTheDocument();

  // Wait for the message from the API to be displayed
  const apiMessage = await screen.findByText(/Hello from the AI Assistant Platform API!/i);
  expect(apiMessage).toBeInTheDocument();
});

test('displays a connection error message on failed API request', async () => {
  // Mock the fetch call to return an error response
  window.fetch.mockResolvedValueOnce({
    ok: false,
    status: 500,
  });

  render(<App />);

  // Wait for the error message to be displayed
  const errorMessage = await screen.findByText(/Could not connect to the server./i);
  expect(errorMessage).toBeInTheDocument();
});