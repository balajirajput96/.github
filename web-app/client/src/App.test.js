import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders dashboard page on default route', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
  const headingElement = screen.getByRole('heading', { name: /Dashboard/i });
  expect(headingElement).toBeInTheDocument();
});

test('renders GitHub integration page on /github route', () => {
  render(
    <MemoryRouter initialEntries={['/github']}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByRole('heading', { name: /GitHub Integration/i })).toBeInTheDocument();
});

test('renders Slack integration page on /slack route', () => {
  render(
    <MemoryRouter initialEntries={['/slack']}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByRole('heading', { name: /Slack Integration/i })).toBeInTheDocument();
});

test('renders Integrations page on /integrations route', () => {
  render(
    <MemoryRouter initialEntries={['/integrations']}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByRole('heading', { name: /Platform Integrations/i })).toBeInTheDocument();
});

test('renders Workflows page on /workflows route', () => {
  render(
    <MemoryRouter initialEntries={['/workflows']}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByRole('heading', { name: /^Automation Workflows$/i })).toBeInTheDocument();
});