import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { onAuthStateChanged } from 'firebase/auth';
import { AuthProvider, useAuth } from '../AuthContext';

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(),
}));

vi.mock('../../services/firebase', () => ({
  auth: {},
}));

const AuthStateConsumer = () => {
  const { user, loading } = useAuth();
  if (loading) return <div data-testid="auth-state">loading</div>;
  if (!user) return <div data-testid="auth-state">logged-out</div>;
  return (
    <div>
      <div data-testid="auth-state">logged-in</div>
      <span data-testid="user-name">{user.name}</span>
      <span data-testid="user-email">{user.email}</span>
      <span data-testid="user-avatar">{user.avatar}</span>
      <span data-testid="user-photo">{user.photoURL}</span>
    </div>
  );
};

const firebaseUser = (overrides = {}) => ({
  uid: 'uid-1',
  displayName: 'Alex',
  email: 'alex@example.com',
  photoURL: 'http://example.com/a.png',
  ...overrides,
});

describe('AuthContext', () => {
  let onAuthStateChangedCallback;
  let mockUnsubscribe;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUnsubscribe = vi.fn();
    onAuthStateChanged.mockImplementation((auth, callback) => {
      onAuthStateChangedCallback = callback;
      return mockUnsubscribe;
    });
  });

  const renderWithProvider = () =>
    render(
      <AuthProvider>
        <AuthStateConsumer />
      </AuthProvider>
    );

  it('starts in the loading state until the auth state is resolved', () => {
    renderWithProvider();

    expect(screen.getByTestId('auth-state')).toHaveTextContent('loading');
  });

  it('maps a logged-in Firebase user into the app user shape', () => {
    renderWithProvider();

    act(() => {
      onAuthStateChangedCallback(firebaseUser());
    });

    expect(screen.getByTestId('auth-state')).toHaveTextContent('logged-in');
    expect(screen.getByTestId('user-name')).toHaveTextContent('Alex');
    expect(screen.getByTestId('user-email')).toHaveTextContent('alex@example.com');
    expect(screen.getByTestId('user-avatar')).toHaveTextContent('🧑');
    expect(screen.getByTestId('user-photo')).toHaveTextContent('http://example.com/a.png');
  });

  it('falls back to "Friend" as the name when displayName is missing', () => {
    renderWithProvider();

    act(() => {
      onAuthStateChangedCallback(firebaseUser({ displayName: null }));
    });

    expect(screen.getByTestId('user-name')).toHaveTextContent('Friend');
  });

  it('clears the user and stops loading when signed out', () => {
    renderWithProvider();

    act(() => {
      onAuthStateChangedCallback(null);
    });

    expect(screen.getByTestId('auth-state')).toHaveTextContent('logged-out');
  });

  it('handles auth state transitions (sign-in after sign-out)', () => {
    renderWithProvider();

    act(() => {
      onAuthStateChangedCallback(firebaseUser());
    });
    expect(screen.getByTestId('user-name')).toHaveTextContent('Alex');

    act(() => {
      onAuthStateChangedCallback(null);
    });
    expect(screen.getByTestId('auth-state')).toHaveTextContent('logged-out');

    act(() => {
      onAuthStateChangedCallback(firebaseUser({ uid: 'uid-2', displayName: 'Sam' }));
    });
    expect(screen.getByTestId('user-name')).toHaveTextContent('Sam');
  });

  it('unsubscribes from auth changes on unmount', () => {
    const { unmount } = renderWithProvider();

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it('throws when used outside of AuthProvider', () => {
    const Unwrapped = () => {
      useAuth();
      return null;
    };

    expect(() => render(<Unwrapped />)).toThrow(
      'useAuth must be used within AuthProvider'
    );
  });
});
