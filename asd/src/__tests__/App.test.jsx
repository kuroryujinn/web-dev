import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { getDoc } from 'firebase/firestore';
import App from '../App';

// Provides everything authService wraps so the login flow can be exercised end-to-end.
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(),
  signInWithPopup: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  updateProfile: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => ({ id: 'progress-doc' })),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
}));

vi.mock('../services/firebase', () => ({
  auth: {},
  db: {},
}));

const firebaseUser = (overrides = {}) => ({
  uid: 'uid-1',
  displayName: 'Alex',
  email: 'alex@example.com',
  photoURL: 'http://example.com/a.png',
  ...overrides,
});

describe('App routing', () => {
  let onAuthStateChangedCallback;
  let mockUnsubscribe;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUnsubscribe = vi.fn();
    onAuthStateChanged.mockImplementation((auth, callback) => {
      onAuthStateChangedCallback = callback;
      return mockUnsubscribe;
    });
    // No progress document exists yet — the provider seeds a fresh one.
    getDoc.mockResolvedValue({ exists: () => false, data: () => ({}) });
  });

  it('shows a loading screen while auth state is pending', () => {
    render(<App />);

    expect(screen.getByText('LOADING...')).toBeInTheDocument();
  });

  it('shows the login page when signed out', () => {
    render(<App />);

    act(() => {
      onAuthStateChangedCallback(null);
    });

    expect(screen.getByText(/SIGN IN WITH GOOGLE/)).toBeInTheDocument();
    expect(screen.getByText(/ASD Learn/)).toBeInTheDocument();
  });

  it('shows the dashboard when signed in', () => {
    render(<App />);

    act(() => {
      onAuthStateChangedCallback(firebaseUser());
    });

    expect(screen.getByText('Welcome, Alex')).toBeInTheDocument();
    expect(screen.getByText('LOG OUT')).toBeInTheDocument();
  });

  it('signs in through the login form and navigates to the dashboard without crashing', async () => {
    const user = firebaseUser();
    signInWithEmailAndPassword.mockResolvedValue({ user });
    render(<App />);

    act(() => {
      onAuthStateChangedCallback(null);
    });
    expect(screen.getByText(/SIGN IN WITH GOOGLE/)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'alex@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret1' } });
    fireEvent.click(screen.getByText('SIGN IN'));

    // The full handler chain runs without crashing (regression: LoginPage used to expect
    // an onLogin prop that App never passed; navigation is now purely context-driven).
    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'alex@example.com',
        'secret1'
      );
    });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    act(() => {
      onAuthStateChangedCallback(user);
    });
    expect(screen.getByText('Welcome, Alex')).toBeInTheDocument();
  });
});
