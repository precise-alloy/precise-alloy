import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { contactForm } from '@data/contact';

const { submitContactForm } = vi.hoisted(() => ({
  submitContactForm: vi.fn(),
}));

vi.mock('@_api/contact-form', () => ({
  submitContactForm,
}));

import ContactForm from './contact-form';

describe('ContactForm', () => {
  beforeEach(() => {
    submitContactForm.mockReset();
    vi.mocked(alert).mockClear();
  });

  it('renders only the configured fields and submit button', () => {
    render(<ContactForm {...contactForm} message={undefined} />);

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.queryByLabelText('Message')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('submits the mapped payload, alerts success, and resets the form on success', async () => {
    const user = userEvent.setup();

    submitContactForm.mockResolvedValueOnce({
      success: true,
      message: 'Thanks for reaching out.',
    });

    render(<ContactForm {...contactForm} />);

    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email');
    const messageInput = screen.getByLabelText('Message');

    await user.type(nameInput, 'Alice');
    await user.type(emailInput, 'alice@example.com');
    await user.type(messageInput, 'Hello from the form');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(submitContactForm).toHaveBeenCalledWith({
        name: 'Alice',
        email: 'alice@example.com',
        message: 'Hello from the form',
      });
    });

    expect(alert).toHaveBeenCalledWith('Thanks for reaching out.');

    await waitFor(() => {
      expect(screen.getByLabelText('Name')).toHaveValue('');
      expect(screen.getByLabelText('Email')).toHaveValue('');
      expect(screen.getByLabelText('Message')).toHaveValue('');
    });
  });

  it('alerts an Error when the API responds with a failure message', async () => {
    const user = userEvent.setup();

    submitContactForm.mockResolvedValueOnce({
      success: false,
      message: 'Submission failed',
    });

    render(<ContactForm {...contactForm} />);

    await user.type(screen.getByLabelText('Name'), 'Alice');
    await user.type(screen.getByLabelText('Email'), 'alice@example.com');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(alert).toHaveBeenCalledWith(expect.any(Error));
    });

    expect((vi.mocked(alert).mock.calls[0]?.[0] as Error).message).toBe('Submission failed');
  });

  it('alerts rejected API errors', async () => {
    const user = userEvent.setup();
    const rejection = new Error('Network unavailable');

    submitContactForm.mockRejectedValueOnce(rejection);

    render(<ContactForm {...contactForm} />);

    await user.type(screen.getByLabelText('Name'), 'Alice');
    await user.type(screen.getByLabelText('Email'), 'alice@example.com');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(alert).toHaveBeenCalledWith(rejection);
    });
  });

  it('submits safely when optional fields are omitted from the model', async () => {
    const user = userEvent.setup();

    submitContactForm.mockResolvedValueOnce({
      success: true,
      message: 'Minimal form submitted.',
    });

    render(<ContactForm globalModifier={[]} submitButton={{ text: 'Send' }} />);

    await user.click(screen.getByRole('button', { name: 'Send' }));

    await waitFor(() => {
      expect(submitContactForm).toHaveBeenCalledWith({
        name: undefined,
        email: undefined,
        message: undefined,
      });
    });

    expect(alert).toHaveBeenCalledWith('Minimal form submitted.');
  });
});
