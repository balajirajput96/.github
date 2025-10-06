import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders dashboard page on default route', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const headingElement = screen.getByRole('heading', { name: /Dashboard/i });
  expect(headingElement).toBeInTheDocument();
});