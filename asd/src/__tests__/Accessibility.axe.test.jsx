import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { onAuthStateChanged } from 'firebase/auth';

expect.extend(toHaveNoViolations);
import { getDoc } from 'firebase/firestore';
import App from '../App';

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
  isDemoMode: false,
}));

const firebaseUser = (overrides = {}) => ({
  uid: 'uid-1',
  displayName: 'Alex',
  email: 'alex@example.com',
  photoURL: 'http://example.com/a.png',
  ...overrides,
});

describe('Accessibility audit (axe-core)', () => {
  let onAuthStateChangedCallback;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    onAuthStateChanged.mockImplementation((auth, callback) => {
      onAuthStateChangedCallback = callback;
      return vi.fn();
    });
    // No progress document yet — the provider seeds a fresh one.
    getDoc.mockResolvedValue({ exists: () => false, data: () => ({}) });
  });

  const signIn = async () => {
    render(<App />);
    act(() => {
      onAuthStateChangedCallback(firebaseUser());
    });
    await waitFor(() => {
      expect(screen.getByText('Welcome, Alex')).toBeInTheDocument();
    });
  };

  it('has no violations on the login page', async () => {
    render(<App />);
    act(() => {
      onAuthStateChangedCallback(null);
    });

    await waitFor(() => {
      expect(screen.getByText(/SIGN IN WITH GOOGLE/)).toBeInTheDocument();
    });

    const results = await axe(document.body);
    expect(results).toHaveNoViolations();
  });

  it('has no violations on the dashboard', async () => {
    await signIn();

    const results = await axe(document.body);
    expect(results).toHaveNoViolations();
  });

  it('has no violations on a level screen with activities', async () => {
    await signIn();

    fireEvent.click(screen.getByRole('button', { name: /level 1/i }));
    await waitFor(() => {
      expect(screen.getByText('Level 1: Core Recognition')).toBeInTheDocument();
    });

    const results = await axe(document.body);
    expect(results).toHaveNoViolations();
  });

  it('has no violations on an activity in play', async () => {
    await signIn();

    fireEvent.click(screen.getByRole('button', { name: /level 1/i }));
    await waitFor(() => {
      expect(screen.getByText('Level 1: Core Recognition')).toBeInTheDocument();
    });

    // Open the first activity card (an activity list button).
    fireEvent.click(screen.getByRole('button', { name: /identify the fruit/i }));
    await waitFor(() => {
      expect(screen.getByTestId('multiple-choice-activity')).toBeInTheDocument();
    });

    const results = await axe(document.body);
    expect(results).toHaveNoViolations();
  });

  it('has no violations on the settings screen', async () => {
    await signIn();

    fireEvent.click(screen.getByRole('button', { name: /settings/i }));
    await waitFor(() => {
      expect(screen.getByText('Sound Effects')).toBeInTheDocument();
    });

    const results = await axe(document.body);
    expect(results).toHaveNoViolations();
  });
});
