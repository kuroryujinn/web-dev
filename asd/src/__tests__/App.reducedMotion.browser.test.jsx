import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from '../App';
// Load the real stylesheet so the reduced-motion CSS kill-switch can be
// asserted via getComputedStyle (jsdom never loads CSS; the browser does).
import '../index.css';

// The Firebase SDK entry modules and the app's firebase service are mocked so
// the test stays deterministic: demo mode signs in the local user and never
// touches a backend, regardless of whether a .env with real Firebase keys
// exists. Everything else — React rendering, real DOM, real events, the real
// index.css — runs in the browser, so the CSS kill-switch assertion is genuine.
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(() => vi.fn()),
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
  db: null,
  googleProvider: {},
  isDemoMode: true,
}));

/**
 * Real-browser end-to-end test (Vitest browser mode → Playwright chromium).
 *
 * Verifies the Milestone 8.6 reduced-motion wiring in a real DOM:
 *  - the root `.App` element carries `data-reduced-motion` from settings
 *  - toggling Reduced Motion in Settings flips the attribute both ways
 *  - the CSS kill-switch actually collapses transition durations
 *    (`[data-reduced-motion='true'] *` → 0.01ms) as computed by the browser.
 */
const STORAGE_KEY = 'asd-settings-v1';

const seedSettings = (overrides = {}) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      sound: false,
      haptic: true,
      reducedMotion: false,
      fontSize: 'normal',
      ...overrides,
    }),
  );
};

const appRoot = () => document.querySelector('.App');

const openSettings = async () => {
  // Dashboard → Settings (AppContent routes on the SETTINGS button).
  fireEvent.click(screen.getByRole('button', { name: /settings/i }));
  await screen.findByText('Sound Effects');
};

// transitionDuration serializes as e.g. "0.01ms" or "1e-05s" and can be a
// comma-separated list when several transition properties are declared.
// Parse every component into milliseconds.
const durationsInMs = (computed) =>
  computed
    .split(', ')
    .map((part) => {
      const value = Number.parseFloat(part);
      return part.includes('ms') ? value : value * 1000;
    });

describe('Reduced Motion toggle — real browser (8.6/8.7)', () => {
  beforeEach(() => {
    localStorage.clear();
    seedSettings(); // Deterministic start: reduced motion OFF regardless of host OS.
  });

  it('boots to the dashboard with data-reduced-motion=false', async () => {
    render(<App />);

    // Demo user lands on the dashboard without touching Firebase auth.
    await screen.findByText('Welcome, Demo');

    expect(appRoot()).not.toBeNull();
    expect(appRoot()).toHaveAttribute('data-reduced-motion', 'false');
  });

  it('flips the root data-reduced-motion attribute when toggled in settings', async () => {
    render(<App />);
    await screen.findByText('Welcome, Demo');
    expect(appRoot()).toHaveAttribute('data-reduced-motion', 'false');

    await openSettings();

    const toggle = screen.getByRole('button', { name: /toggle reduced motion/i });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');

    // Turn it ON — the attribute flips in the real DOM.
    fireEvent.click(toggle);
    await waitFor(() => {
      expect(appRoot()).toHaveAttribute('data-reduced-motion', 'true');
    });
    expect(toggle).toHaveAttribute('aria-pressed', 'true');

    // Turn it back OFF.
    fireEvent.click(toggle);
    await waitFor(() => {
      expect(appRoot()).toHaveAttribute('data-reduced-motion', 'false');
    });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
  });

  it('applies the reduced-motion CSS kill-switch in the browser', async () => {
    render(<App />);
    await screen.findByText('Welcome, Demo');

    await openSettings();

    const toggle = screen.getByRole('button', { name: /toggle reduced motion/i });

    // Before: the neo-brutal button transition runs at its full duration.
    const before = durationsInMs(getComputedStyle(toggle).transitionDuration);
    expect(Math.min(...before)).toBeGreaterThan(1); // ~90ms+ per the stylesheet

    fireEvent.click(toggle);
    await waitFor(() => {
      expect(appRoot()).toHaveAttribute('data-reduced-motion', 'true');
    });

    // After: the [data-reduced-motion='true'] kill-switch collapses every
    // transition to 0.01ms — proven by the browser's computed style.
    const after = durationsInMs(getComputedStyle(toggle).transitionDuration);
    expect(after.length).toBeGreaterThan(0);
    after.forEach((duration) => expect(duration).toBeLessThanOrEqual(0.02));
  });
});
