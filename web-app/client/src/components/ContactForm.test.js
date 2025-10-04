import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContactForm from './ContactForm';

describe('ContactForm component', () => {
  test('renders contact form with all fields', () => {
    render(<ContactForm />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^state:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/state code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('auto-populates state code when state is selected', async () => {
    render(<ContactForm />);
    
    const stateSelect = screen.getByLabelText(/^state:/i);
    const stateCodeInput = screen.getByLabelText(/state code/i);
    
    // Initially state code should be empty
    expect(stateCodeInput.value).toBe('');
    
    // Select California
    fireEvent.change(stateSelect, { target: { value: 'California' } });
    
    // State code should be auto-populated
    await waitFor(() => {
      expect(stateCodeInput.value).toBe('CA');
    });
  });

  test('state code field is readonly', () => {
    render(<ContactForm />);
    
    const stateCodeInput = screen.getByLabelText(/state code/i);
    expect(stateCodeInput).toHaveAttribute('readonly');
  });

  test('clears state code when state selection is cleared', async () => {
    render(<ContactForm />);
    
    const stateSelect = screen.getByLabelText(/^state:/i);
    const stateCodeInput = screen.getByLabelText(/state code/i);
    
    // Select a state
    fireEvent.change(stateSelect, { target: { value: 'Texas' } });
    await waitFor(() => {
      expect(stateCodeInput.value).toBe('TX');
    });
    
    // Clear selection
    fireEvent.change(stateSelect, { target: { value: '' } });
    await waitFor(() => {
      expect(stateCodeInput.value).toBe('');
    });
  });

  test('form submission works correctly', () => {
    // Mock alert
    window.alert = jest.fn();
    
    render(<ContactForm />);
    
    // Fill out form
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/^state:/i), { target: { value: 'California' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Test message' } });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    // Check that alert was called
    expect(window.alert).toHaveBeenCalled();
  });

  test('all US states are available in dropdown', () => {
    render(<ContactForm />);
    
    const stateSelect = screen.getByLabelText(/^state:/i);
    const options = stateSelect.querySelectorAll('option');
    
    // Should have 51 options (50 states + 1 "Select a state")
    expect(options.length).toBe(51);
    
    // Check some specific states exist
    expect(Array.from(options).some(opt => opt.value === 'California')).toBe(true);
    expect(Array.from(options).some(opt => opt.value === 'New York')).toBe(true);
    expect(Array.from(options).some(opt => opt.value === 'Texas')).toBe(true);
  });
});
