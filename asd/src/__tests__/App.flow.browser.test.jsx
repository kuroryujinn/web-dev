import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import App from '../App';
import '../index.css'; // real stylesheet — focus rings & layout are real

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

const PROGRESS_KEY = 'asd_progress_demo-user';

/**
 * Milestone 10.8–10.11 — real-browser manual-test walkthrough (Vitest browser
 * mode → Playwright chromium). These replace the checklist's manual tasks with
 * deterministic end-to-end assertions in a genuine browser DOM:
 *  - 10.8 full user flow: dashboard → level → activity → feedback → XP awarded
 *  - 10.9 persistence: XP survives a full unmount/remount (page refresh)
 *  - 10.10 level unlocking: locked levels are disabled until XP threshold
 *  - 10.11 accessibility basics: <main> landmark, headings, visible focus rings
 */
describe('Full user flow — real browser (10.8)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const playIdentifyTheFruit = async () => {
    // Dashboard → Level 1
    fireEvent.click(screen.getByRole('button', { name: /level 1/i }));
    await screen.findByText('Level 1: Core Recognition');

    // Level 1 → first activity (Identify the Fruit, a multiple-choice).
    fireEvent.click(screen.getByRole('button', { name: /identify the fruit/i }));
    await screen.findByTestId('multiple-choice-activity');

    // Select the correct answer (seeded data: "🍌 Banana" is the correct
    // option). The button's accessible name includes the emoji + label.
    const banana = screen.getByRole('button', { name: /banana/i });
    fireEvent.click(banana);

    // Feedback overlay appears after the 1500ms reveal.
    await screen.findByText('NICE WORK!', undefined, { timeout: 4000 });
    fireEvent.click(screen.getByRole('button', { name: 'CONTINUE' }));
  };

  it('walks dashboard → level → activity → feedback and awards XP', async () => {
    render(<App />);
    await screen.findByText('Welcome, Demo');

    // Dashboard stats exist. The header reads "Level 1 • 0 XP".
    expect(screen.getByText('Total XP')).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes('Level') && content.includes('0 XP')),
    ).toBeInTheDocument();

    // Level grid: Level 1 unlocked, Levels 2–5 locked.
    const level1 = screen.getByRole('button', { name: /level 1/i });
    expect(level1).toBeEnabled();
    for (let n = 2; n <= 5; n += 1) {
      expect(screen.getByRole('button', { name: new RegExp(`level ${n}`, 'i') })).toBeDisabled();
    }

    await playIdentifyTheFruit();

    // Back on the level screen after CONTINUE.
    await screen.findByText('Level 1: Core Recognition');

    // Return to the dashboard — XP was awarded for the completion.
    fireEvent.click(screen.getByRole('button', { name: /back to dashboard/i }));
    await screen.findByText('Welcome, Demo');
    // 3 stars × difficulty 1 → 15 XP in the dashboard header.
    expect(
      screen.getByText((content) => content.includes('Level') && content.includes('15 XP')),
    ).toBeInTheDocument();

    // The completed activity is recorded in the localStorage backup.
    const backup = JSON.parse(localStorage.getItem(PROGRESS_KEY));
    expect(backup.totalXP).toBe(15);
    expect(backup.activities).toBeTruthy();
  });
});

describe('Progress persistence — real browser (10.9)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('keeps XP after a full page reload (unmount + remount)', async () => {
    const first = render(<App />);
    await screen.findByText('Welcome, Demo');

    // Complete one activity to earn XP.
    fireEvent.click(screen.getByRole('button', { name: /level 1/i }));
    await screen.findByText('Level 1: Core Recognition');
    fireEvent.click(screen.getByRole('button', { name: /identify the fruit/i }));
    await screen.findByTestId('multiple-choice-activity');
    fireEvent.click(screen.getByRole('button', { name: /banana/i }));
    await screen.findByText('NICE WORK!', undefined, { timeout: 4000 });
    fireEvent.click(screen.getByRole('button', { name: 'CONTINUE' }));
    await screen.findByText('Level 1: Core Recognition');
    fireEvent.click(screen.getByRole('button', { name: /back to dashboard/i }));
    await screen.findByText('Welcome, Demo');
    expect(
      screen.getByText((content) => content.includes('Level') && content.includes('15 XP')),
    ).toBeInTheDocument();

    // Simulate a page refresh: unmount the whole app and render it fresh.
    first.unmount();
    render(<App />);

    // Demo mode + localStorage backup → the dashboard restores the same XP.
    await screen.findByText('Welcome, Demo');
    expect(
      screen.getByText((content) => content.includes('Level') && content.includes('15 XP')),
    ).toBeInTheDocument();

    // The activity completion itself survived the refresh: Level 1 shows the
    // fruit activity as completed (best score in its aria-label) and the
    // level progress reflects the completed activity.
    fireEvent.click(screen.getByRole('button', { name: /level 1/i }));
    await screen.findByText('Level 1: Core Recognition');
    const fruit = screen.getByRole('button', { name: /identify the fruit/i });
    expect(fruit.getAttribute('aria-label')).toMatch(/completed/i);
  });
});

describe('Level unlocking — real browser (10.10)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('keeps higher levels locked until the XP threshold is reached', async () => {
    const first = render(<App />);
    await screen.findByText('Welcome, Demo');

    // Fresh user: only Level 1 unlocked.
    expect(screen.getByRole('button', { name: /level 1/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /level 2/i })).toBeDisabled();

    // Unmount the first instance so the DOM holds a single app, then seed
    // progress at the Level 2 threshold (500 XP) and remount.
    first.unmount();
    const threshold = {
      totalXP: 500,
      currentLevel: 2,
      badges: [],
      activities: {},
      sessionActivities: 0,
      streak: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
    };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(threshold));
    render(<App />);
    await screen.findByText('Welcome, Demo');

    // Level 2 is now unlocked; Level 3 still locked.
    expect(screen.getByRole('button', { name: /level 2/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /level 3/i })).toBeDisabled();
  });
});

describe('Accessibility basics — real browser (10.11)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('exposes a main landmark, headings, and visible focus rings', async () => {
    render(<App />);
    await screen.findByText('Welcome, Demo');

    // Landmark: the app content lives inside a <main> element.
    const main = document.querySelector('main');
    expect(main).not.toBeNull();
    expect(main.querySelector('h1')).not.toBeNull();

    // Buttons have visible labels (accessibility snapshot / getByRole rely on
    // an accessible name; a missing name throws).
    expect(screen.getByRole('button', { name: /profile/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /settings/i })).toBeInTheDocument();

    // Focus ring: the button carries the visible-outline utility, and a real
    // keyboard Tab press (not programmatic focus) both moves focus and makes
    // the browser apply :focus-visible — a genuine outline, not none.
    const level1 = screen.getByRole('button', { name: /level 1/i });
    expect(level1.className).toContain('focus-visible:outline-4');

    await userEvent.keyboard('{Tab}');
    expect(document.activeElement).not.toBeNull();
    expect(document.activeElement.matches(':focus-visible')).toBe(true);
    expect(getComputedStyle(document.activeElement).outlineStyle).not.toBe('none');
  });
});
