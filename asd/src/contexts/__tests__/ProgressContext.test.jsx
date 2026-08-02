import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { getDoc, setDoc } from 'firebase/firestore';
import { ProgressProvider, useProgress } from '../ProgressContext';

// A mutable auth user that tests can swap between renders.
let mockUser = null;

vi.mock('../AuthContext', () => ({
  useAuth: () => ({ user: mockUser }),
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn((db, collection, id) => ({ db, collection, id })),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
}));

vi.mock('../../services/firebase', () => ({
  db: {},
}));

const ProgressConsumer = () => {
  const {
    progress,
    loading,
    recordActivityResult,
    isLevelUnlocked,
    getLevelProgress,
    earnedBadges,
  } = useProgress();

  if (loading) return <div data-testid="progress-state">loading</div>;
  if (!progress) return <div data-testid="progress-state">no-progress</div>;

  return (
    <div>
      <div data-testid="progress-state">loaded</div>
      <span data-testid="total-xp">{progress.totalXP}</span>
      <span data-testid="level">{progress.currentLevel}</span>
      <span data-testid="badge-count">{earnedBadges.length}</span>
      <button
        onClick={() =>
          recordActivityResult({ activityId: 'a1', score: 100, stars: 3, xp: 600 })
        }
      >
        COMPLETE
      </button>
      <span data-testid="level2-unlocked">{String(isLevelUnlocked(2))}</span>
      <span data-testid="level-progress">
        {JSON.stringify(getLevelProgress(['a1', 'a2']))}
      </span>
    </div>
  );
};

const renderWithProvider = () =>
  render(
    <ProgressProvider>
      <ProgressConsumer />
    </ProgressProvider>,
  );

describe('ProgressContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockUser = { uid: 'uid-1' };
    getDoc.mockResolvedValue({ exists: () => false, data: () => ({}) });
    setDoc.mockResolvedValue(undefined);
  });

  it('throws when used outside of ProgressProvider', () => {
    const Unwrapped = () => {
      useProgress();
      return null;
    };

    expect(() => render(<Unwrapped />)).toThrow(
      'useProgress must be used within ProgressProvider',
    );
  });

  it('seeds a fresh progress document when the user has none', async () => {
    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId('progress-state')).toHaveTextContent('loaded');
    });
    expect(screen.getByTestId('total-xp')).toHaveTextContent('0');
    expect(setDoc).toHaveBeenCalled();
  });

  it('loads existing progress from Firestore', async () => {
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        totalXP: 120,
        currentLevel: 2,
        badges: ['first_steps'],
        activities: {},
        sessionActivities: 1,
        streak: 1,
        lastActiveDate: new Date().toISOString().split('T')[0],
      }),
    });

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId('progress-state')).toHaveTextContent('loaded');
    });
    expect(screen.getByTestId('total-xp')).toHaveTextContent('120');
    expect(screen.getByTestId('level')).toHaveTextContent('2');
    expect(screen.getByTestId('badge-count')).toHaveTextContent('1');
  });

  it('records an activity result, updates progress, and returns earned badges', async () => {
    renderWithProvider();
    await waitFor(() => {
      expect(screen.getByTestId('progress-state')).toHaveTextContent('loaded');
    });

    fireEvent.click(screen.getByRole('button', { name: 'COMPLETE' }));

    await waitFor(() => {
      expect(screen.getByTestId('total-xp')).toHaveTextContent('600');
    });
    expect(screen.getByTestId('level')).toHaveTextContent('2');
    expect(screen.getByTestId('level2-unlocked')).toHaveTextContent('true');
    // first_steps + level_up + perfectionist (the 3-star result earns all three).
    expect(screen.getByTestId('badge-count')).toHaveTextContent('3');
    expect(setDoc).toHaveBeenCalledWith(expect.anything(), expect.anything(), {
      merge: true,
    });
  });

  it('reports level progress from completed activities', async () => {
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        totalXP: 0,
        currentLevel: 1,
        badges: [],
        activities: { a1: { completed: true, stars: 2, bestScore: 80, attempts: 1 } },
        sessionActivities: 1,
        streak: 1,
        lastActiveDate: new Date().toISOString().split('T')[0],
      }),
    });

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId('level-progress')).toHaveTextContent('"completed":1');
    });
    expect(screen.getByTestId('level-progress')).toHaveTextContent('"total":2');
    expect(screen.getByTestId('level-progress')).toHaveTextContent('"percentage":50');
  });

  it('clears progress when the user signs out', async () => {
    const view = renderWithProvider();
    await waitFor(() => {
      expect(screen.getByTestId('progress-state')).toHaveTextContent('loaded');
    });

    view.unmount();
    mockUser = null;
    renderWithProvider();

    expect(screen.getByTestId('progress-state')).toHaveTextContent('no-progress');
  });
});
