import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc } from 'firebase/firestore';
import App from '../App';

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(() => vi.fn()),
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => ({ id: 'progress-doc' })),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
}));

// Demo mode: no Firebase config (isDemoMode=true, db=null) — the app must
// boot straight to the dashboard with a local demo user, never touching auth.
vi.mock('../services/firebase', () => ({
  auth: {},
  db: null,
  isDemoMode: true,
}));

describe('App in demo mode (DEV, no Firebase config)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // No progress document — the provider seeds a fresh one from localStorage.
    getDoc.mockResolvedValue({ exists: () => false, data: () => ({}) });
  });

  it('boots straight to the dashboard as the demo user without Firebase auth', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Welcome, Demo')).toBeInTheDocument();
    });
    expect(screen.getByText('LOG OUT')).toBeInTheDocument();
    expect(screen.getByText('Levels')).toBeInTheDocument();
    expect(onAuthStateChanged).not.toHaveBeenCalled();
  });
});
