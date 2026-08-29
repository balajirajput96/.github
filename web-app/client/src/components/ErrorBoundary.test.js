import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from './ErrorBoundary';

function BrokenComponent() {
  throw new Error('boom');
}

test('renders children when there is no error', () => {
  render(
    <ErrorBoundary>
      <div>Healthy page</div>
    </ErrorBoundary>
  );

  expect(screen.getByText('Healthy page')).toBeInTheDocument();
});

test('shows a recoverable fallback when a child throws', () => {
  const originalError = console.error;
  console.error = jest.fn();

  render(
    <ErrorBoundary>
      <BrokenComponent />
    </ErrorBoundary>
  );

  expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong.');
  expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();

  console.error = originalError;
});

test('allows retrying the failed render', async () => {
  const originalError = console.error;
  console.error = jest.fn();
  let shouldBreak = true;

  function ToggleComponent() {
    if (shouldBreak) throw new Error('boom');
    return <div>Recovered page</div>;
  }

  render(
    <ErrorBoundary>
      <ToggleComponent />
    </ErrorBoundary>
  );

  shouldBreak = false;
  await userEvent.click(screen.getByRole('button', { name: /try again/i }));
  expect(screen.getByText('Recovered page')).toBeInTheDocument();

  console.error = originalError;
});
