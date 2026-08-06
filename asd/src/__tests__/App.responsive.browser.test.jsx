import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { page } from 'vitest/browser';
import App from '../App';
import '../index.css'; // real stylesheet — without it, layout checks are meaningless

// Deterministic demo-mode boot: the dashboard renders without any backend.
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
 * Milestone 9.7 — responsive layout verification in a real browser.
 *
 * For each spec breakpoint (375/768/1024/1440) the app must not overflow
 * horizontally (document.documentElement.scrollWidth <= viewport width) on
 * the dashboard, level, and settings screens.
 */
const BREAKPOINTS = [375, 768, 1024, 1440];

const assertNoHorizontalOverflow = async () => {
  // Allow the layout engine to settle after the viewport resize.
  await new Promise((resolve) => setTimeout(resolve, 50));
  const { scrollWidth, clientWidth } = document.documentElement;
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
};

describe('Responsive layout (9.7)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('keeps the dashboard within the viewport at every breakpoint', async () => {
    render(<App />);
    await screen.findByText('Welcome, Demo');

    for (const width of BREAKPOINTS) {
      await page.viewport(width, 800);
      await assertNoHorizontalOverflow();
    }
  });

  it('keeps the level screen within the viewport at every breakpoint', async () => {
    render(<App />);
    await screen.findByText('Welcome, Demo');

    fireEvent.click(screen.getByRole('button', { name: /level 1/i }));
    await screen.findByText('Level 1: Core Recognition');

    for (const width of BREAKPOINTS) {
      await page.viewport(width, 800);
      await assertNoHorizontalOverflow();
    }
  });

  it('keeps the settings screen within the viewport at every breakpoint', async () => {
    render(<App />);
    await screen.findByText('Welcome, Demo');

    fireEvent.click(screen.getByRole('button', { name: /settings/i }));
    await screen.findByText('Sound Effects');

    for (const width of BREAKPOINTS) {
      await page.viewport(width, 800);
      await assertNoHorizontalOverflow();
    }
  });

  // Regression: Tailwind v4 only generates utilities for colors declared in
  // `@theme`. The warm pastel palette (`bg-warm-butter/coral/mint/sky`) used
  // across every screen was silently dropped, leaving cards untinted. This
  // asserts the compiled utility actually paints a non-transparent color.
  it('applies the warm pastel palette from the compiled theme (regression)', async () => {
    render(<App />);
    await screen.findByText('Welcome, Demo');

    const header = document.querySelector('.brutal-card.raised-glass-soft');
    expect(header).not.toBeNull();
    const bg = getComputedStyle(header).backgroundColor;
    // Chromium serializes the color-mix result as oklab()/rgb() depending on
    // the browser — the robust regression check is that a real color computed
    // instead of the transparent sentinels (which is what the broken build
    // produced).
    expect(bg).not.toBe('transparent');
    expect(bg).not.toBe('rgba(0, 0, 0, 0)');
    expect(bg).toMatch(/\d/); // any numeric channel => a painted color
  });
});
