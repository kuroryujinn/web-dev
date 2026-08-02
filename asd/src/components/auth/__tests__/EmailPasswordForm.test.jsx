import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import EmailPasswordForm from '../EmailPasswordForm';

const fillCredentials = (email, password) => {
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: email } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: password } });
};

describe('EmailPasswordForm', () => {
  it('renders login mode by default', () => {
    render(<EmailPasswordForm onLogin={vi.fn()} onRegister={vi.fn()} />);

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.queryByLabelText('Name')).not.toBeInTheDocument();
    expect(screen.getByText('SIGN IN')).toBeInTheDocument();
  });

  it('submits login with the entered email and password', async () => {
    const onLogin = vi.fn().mockResolvedValue({});
    render(<EmailPasswordForm onLogin={onLogin} onRegister={vi.fn()} />);

    fillCredentials('alex@example.com', 'secret1');
    fireEvent.click(screen.getByText('SIGN IN'));

    await waitFor(() => {
      expect(onLogin).toHaveBeenCalledWith('alex@example.com', 'secret1');
    });
  });

  it('toggles to register mode showing the name field', () => {
    render(<EmailPasswordForm onLogin={vi.fn()} onRegister={vi.fn()} />);

    fireEvent.click(screen.getByText("Don't have an account? Register"));

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByText('CREATE ACCOUNT')).toBeInTheDocument();
  });

  it('toggles back to login mode', () => {
    render(<EmailPasswordForm onLogin={vi.fn()} onRegister={vi.fn()} />);

    fireEvent.click(screen.getByText("Don't have an account? Register"));
    fireEvent.click(screen.getByText('Already have an account? Sign in'));

    expect(screen.queryByLabelText('Name')).not.toBeInTheDocument();
    expect(screen.getByText('SIGN IN')).toBeInTheDocument();
  });

  it('submits registration with name, email, and password', async () => {
    const onRegister = vi.fn().mockResolvedValue({});
    render(<EmailPasswordForm onLogin={vi.fn()} onRegister={onRegister} />);

    fireEvent.click(screen.getByText("Don't have an account? Register"));
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Sam' } });
    fillCredentials('sam@example.com', 'secret1');
    fireEvent.click(screen.getByText('CREATE ACCOUNT'));

    await waitFor(() => {
      expect(onRegister).toHaveBeenCalledWith('sam@example.com', 'secret1', 'Sam');
    });
  });

  it('shows the error message when login fails', async () => {
    const onLogin = vi.fn().mockRejectedValue(new Error('Invalid credentials'));
    render(<EmailPasswordForm onLogin={onLogin} onRegister={vi.fn()} />);

    fillCredentials('alex@example.com', 'wrong1');
    fireEvent.click(screen.getByText('SIGN IN'));

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid credentials');
  });

  it('clears a previous error on the next submit', async () => {
    const onLogin = vi
      .fn()
      .mockRejectedValueOnce(new Error('Invalid credentials'))
      .mockResolvedValueOnce({});
    render(<EmailPasswordForm onLogin={onLogin} onRegister={vi.fn()} />);

    fillCredentials('alex@example.com', 'wrong1');
    fireEvent.click(screen.getByText('SIGN IN'));
    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid credentials');

    fillCredentials('alex@example.com', 'right1');
    fireEvent.click(screen.getByText('SIGN IN'));

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  it('shows validation errors and does not submit when fields are empty', () => {
    const onLogin = vi.fn();
    render(<EmailPasswordForm onLogin={onLogin} onRegister={vi.fn()} />);

    fireEvent.click(screen.getByText('SIGN IN'));

    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(onLogin).not.toHaveBeenCalled();
  });

  it('rejects an invalid email format', () => {
    const onLogin = vi.fn();
    render(<EmailPasswordForm onLogin={onLogin} onRegister={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'not-an-email' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret1' } });
    fireEvent.click(screen.getByText('SIGN IN'));

    expect(screen.getByText('Enter a valid email address')).toBeInTheDocument();
    expect(onLogin).not.toHaveBeenCalled();
  });

  it('rejects a password shorter than 6 characters', () => {
    const onLogin = vi.fn();
    render(<EmailPasswordForm onLogin={onLogin} onRegister={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: '12345' } });
    fireEvent.click(screen.getByText('SIGN IN'));

    expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    expect(onLogin).not.toHaveBeenCalled();
  });

  it('requires a name in register mode', () => {
    const onRegister = vi.fn();
    render(<EmailPasswordForm onLogin={vi.fn()} onRegister={onRegister} />);

    fireEvent.click(screen.getByText("Don't have an account? Register"));
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret1' } });
    fireEvent.click(screen.getByText('CREATE ACCOUNT'));

    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(onRegister).not.toHaveBeenCalled();
  });

  it('submits successfully after validation errors are corrected', async () => {
    const onLogin = vi.fn().mockResolvedValue({});
    render(<EmailPasswordForm onLogin={onLogin} onRegister={vi.fn()} />);

    fireEvent.click(screen.getByText('SIGN IN'));
    expect(screen.getByText('Email is required')).toBeInTheDocument();

    fillCredentials('alex@example.com', 'secret1');
    fireEvent.click(screen.getByText('SIGN IN'));

    await waitFor(() => {
      expect(onLogin).toHaveBeenCalledWith('alex@example.com', 'secret1');
    });
  });

  it('clears a field error as the user types', () => {
    render(<EmailPasswordForm onLogin={vi.fn()} onRegister={vi.fn()} />);

    fireEvent.click(screen.getByText('SIGN IN'));
    expect(screen.getByText('Email is required')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@b.com' } });

    expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  it('shows a loading state while submitting, then re-enables', async () => {
    let resolveLogin;
    const onLogin = vi.fn(() => new Promise((resolve) => { resolveLogin = resolve; }));
    render(<EmailPasswordForm onLogin={onLogin} onRegister={vi.fn()} />);

    fillCredentials('alex@example.com', 'secret1');
    fireEvent.click(screen.getByText('SIGN IN'));

    expect(screen.getByText('LOADING...')).toBeDisabled();

    await act(async () => { resolveLogin({}); });

    expect(screen.getByText('SIGN IN')).not.toBeDisabled();
  });
});
