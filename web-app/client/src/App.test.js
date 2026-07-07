import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders dashboard page on default route', async () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const headingElement = await screen.findByRole('heading', { name: /Dashboard/i });
  expect(headingElement).toBeInTheDocument();
});
