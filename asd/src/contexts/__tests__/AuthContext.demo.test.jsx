import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { onAuthStateChanged } from 'firebase/auth';
import { AuthProvider, useAuth } from '../AuthContext';

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(() => vi.fn()),
}));

// Simulates a dev server with no Firebase config: firebase.js exports
// isDemoMode=true and a stub auth instead of a real Firebase app.
vi.mock('../../services/firebase', () => ({
  auth: {},
  isDemoMode: true,
}));

const Probe = () => {
  const { user, loading } = useAuth();
  if (loading) return <div data-testid="auth-state">loading</div>;
  return <div data-testid="auth-state">{user ? `user:${user.name}` : 'logged-out'}</div>;
};

describe('AuthProvider demo mode (DEV, no Firebase config)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('signs in the demo user immediately without calling Firebase auth', async () => {
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent('user:Demo');
    });
    expect(onAuthStateChanged).not.toHaveBeenCalled();
  });

  it('exposes stable demo user identity fields', async () => {
    const Identity = () => {
      const { user, loading } = useAuth();
      if (loading) return null;
      return (
        <div>
          <span data-testid="uid">{user?.uid}</span>
          <span data-testid="email">{user?.email}</span>
          <span data-testid="avatar">{user?.avatar}</span>
        </div>
      );
    };

    render(
      <AuthProvider>
        <Identity />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('uid')).toHaveTextContent('demo-user');
      expect(screen.getByTestId('email')).toHaveTextContent('demo@local.dev');
      expect(screen.getByTestId('avatar')).toHaveTextContent('🧑');
    });
  });
});
