import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import LoginPage from '../LoginPage';
import {
  registerWithEmail,
  signInWithEmail,
  signInWithGoogle,
} from '../../../services/authService';

vi.mock('../../../services/authService', () => ({
  signInWithGoogle: vi.fn(),
  signInWithEmail: vi.fn(),
  registerWithEmail: vi.fn(),
}));

const mockUser = (overrides = {}) => ({
  uid: 'uid-1',
  displayName: 'Alex',
  email: 'alex@example.com',
  ...overrides,
});

const signInWithForm = (email, password) => {
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: email } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: password } });
  fireEvent.click(screen.getByText('SIGN IN'));
};

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the welcome screen with the email form and Google button', () => {
    render(<LoginPage />);

    expect(screen.getByText(/ASD Learn/)).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByText(/SIGN IN WITH GOOGLE/)).toBeInTheDocument();
  });

  it('calls signInWithGoogle when the Google button is clicked', async () => {
    signInWithGoogle.mockResolvedValue(mockUser());
    render(<LoginPage />);

    fireEvent.click(screen.getByText(/SIGN IN WITH GOOGLE/));

    await waitFor(() => {
      expect(signInWithGoogle).toHaveBeenCalledTimes(1);
    });
  });

  it('shows an error when Google sign-in fails', async () => {
    signInWithGoogle.mockRejectedValue(new Error('popup closed'));
    render(<LoginPage />);

    fireEvent.click(screen.getByText(/SIGN IN WITH GOOGLE/));

    expect(await screen.findByRole('alert')).toHaveTextContent('popup closed');
  });

  it('calls signInWithEmail with the entered credentials', async () => {
    signInWithEmail.mockResolvedValue(mockUser());
    render(<LoginPage />);

    signInWithForm('alex@example.com', 'secret1');

    await waitFor(() => {
      expect(signInWithEmail).toHaveBeenCalledWith('alex@example.com', 'secret1');
    });
  });

  it('shows an error when email login fails', async () => {
    signInWithEmail.mockRejectedValue(new Error('wrong password'));
    render(<LoginPage />);

    signInWithForm('alex@example.com', 'wrongpw');

    expect(await screen.findByRole('alert')).toHaveTextContent('wrong password');
  });

  it('calls registerWithEmail with the name, email, and password', async () => {
    registerWithEmail.mockResolvedValue(mockUser());
    render(<LoginPage />);

    fireEvent.click(screen.getByText("Don't have an account? Register"));
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Sam' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'sam@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret1' } });
    fireEvent.click(screen.getByText('CREATE ACCOUNT'));

    await waitFor(() => {
      expect(registerWithEmail).toHaveBeenCalledWith('sam@example.com', 'secret1', 'Sam');
    });
  });
});
