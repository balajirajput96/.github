import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders dashboard page on default route', async () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
  const headingElement = await screen.findByRole('heading', { name: /Dashboard/i });
  expect(headingElement).toBeInTheDocument();
});

test('renders GitHub integration page on /github route', async () => {
  render(
    <MemoryRouter initialEntries={['/github']}>
      <App />
    </MemoryRouter>
  );
  expect(await screen.findByRole('heading', { name: /GitHub Integration/i })).toBeInTheDocument();
});

test('renders Slack integration page on /slack route', async () => {
  render(
    <MemoryRouter initialEntries={['/slack']}>
      <App />
    </MemoryRouter>
  );
  expect(await screen.findByRole('heading', { name: /Slack Integration/i })).toBeInTheDocument();
});

test('renders Integrations page on /integrations route', async () => {
  render(
    <MemoryRouter initialEntries={['/integrations']}>
      <App />
    </MemoryRouter>
  );
  expect(await screen.findByRole('heading', { name: /Platform Integrations/i })).toBeInTheDocument();
});

test('renders Workflows page on /workflows route', async () => {
  render(
    <MemoryRouter initialEntries={['/workflows']}>
      <App />
    </MemoryRouter>
  );
  expect(await screen.findByRole('heading', { name: /^Automation Workflows$/i })).toBeInTheDocument();
});
