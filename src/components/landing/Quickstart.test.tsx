import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Quickstart } from './Quickstart';

describe('Quickstart copy controls', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('renders one copy control for each setup step', () => {
    render(<Quickstart />);
    expect(screen.getAllByRole('button', { name: 'Copy code snippet' })).toHaveLength(3);
  });

  it('copies the selected setup command and announces success', async () => {
    render(<Quickstart />);
    const buttons = screen.getAllByRole('button', { name: 'Copy code snippet' });

    await userEvent.click(buttons[0]);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'curl -fsSL https://antigravity.google/cli/install.sh | bash'
    );
    expect(await screen.findByText('Copied code to clipboard')).toBeInTheDocument();
  });

  it('keeps copy controls keyboard accessible', () => {
    render(<Quickstart />);
    for (const button of screen.getAllByRole('button', { name: 'Copy code snippet' })) {
      expect(button).toHaveAttribute('type', 'button');
    }
  });
});
