import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc } from 'firebase/firestore';
import { AuthProvider } from '../../../contexts/AuthContext';
import { ProgressProvider, useProgress } from '../../../contexts/ProgressContext';
import { SettingsProvider } from '../../../contexts/SettingsContext';
import ActivityPlayer from '../ActivityPlayer';
import { getActivitiesForLevel } from '../../../data/activities';

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => ({ id: 'progress-doc' })),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
}));

vi.mock('../../../services/firebase', () => ({
  auth: {},
  db: {},
}));

// A real seeded Level 2 DragAndDrop activity (difficulty 2, 3 items / 3 targets).
const level2DndActivity = getActivitiesForLevel('level2').find(
  (a) => a.type === 'dragAndDrop',
);

const renderWithProviders = (ui) =>
  render(
    <AuthProvider>
      <ProgressProvider>
        <SettingsProvider>{ui}</SettingsProvider>
      </ProgressProvider>
    </AuthProvider>,
  );

const ProgressConsumer = () => {
  const { progress } = useProgress();
  if (!progress) return <div data-testid="xp">loading</div>;
  return <div data-testid="xp">{progress.totalXP}</div>;
};

describe('ActivityPlayer — Level 2 DragAndDrop integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback({ uid: 'uid-1', displayName: 'Alex', email: 'alex@example.com' });
      return vi.fn();
    });
    // No progress document yet — the provider seeds a fresh one.
    getDoc.mockResolvedValue({ exists: () => false, data: () => ({}) });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('plays a real Level 2 DragAndDrop activity end-to-end, awarding XP', async () => {
    expect(level2DndActivity).toBeDefined();

    const onComplete = vi.fn();

    renderWithProviders(
      <>
        <ActivityPlayer activity={level2DndActivity} onComplete={onComplete} onBack={vi.fn()} />
        <ProgressConsumer />
      </>,
    );

    // The real instructions render through the DragAndDropActivity component.
    expect(
      screen.getByText(level2DndActivity.content.instructions),
    ).toBeInTheDocument();

    // Progress is seeded (fresh user, 0 XP) before the activity is attempted.
    await waitFor(() => {
      expect(screen.getByTestId('xp')).toHaveTextContent('0');
    });

    // Fake timers only for the activity's 1500ms completion reveal.
    vi.useFakeTimers();

    // Tap-to-assign every item to its correct target (real data ids).
    const { items, targets } = level2DndActivity.content;
    items.forEach((item) => {
      fireEvent.click(screen.getByTestId(`drag-item-${item.id}`));
      const target = targets.find((t) => t.correctItemId === item.id);
      fireEvent.click(screen.getByTestId(`drop-target-${target.id}`));
    });

    // Every target is filled → the check button becomes enabled.
    expect(screen.getByRole('button', { name: 'CHECK ANSWERS' })).toBeEnabled();
    fireEvent.click(screen.getByRole('button', { name: 'CHECK ANSWERS' }));
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    // Perfect score → success overlay.
    expect(screen.getByText('NICE WORK!')).toBeInTheDocument();

    // 3 stars on difficulty 2 → 23 XP, awarded synchronously via the context
    // (10 × 1.5 × 1.5 = 22.5 → rounded to 23).
    expect(screen.getByTestId('xp')).toHaveTextContent('23');

    // Continue reports the full result to the parent.
    fireEvent.click(screen.getByRole('button', { name: 'CONTINUE' }));
    expect(onComplete).toHaveBeenCalledWith({
      score: 100,
      stars: 3,
      xp: 23,
      activityId: level2DndActivity.id,
    });
  });

  it('awards less XP for a partial score on the same activity', async () => {
    const onComplete = vi.fn();

    renderWithProviders(
      <>
        <ActivityPlayer activity={level2DndActivity} onComplete={onComplete} onBack={vi.fn()} />
        <ProgressConsumer />
      </>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('xp')).toHaveTextContent('0');
    });

    vi.useFakeTimers();

    const { items, targets } = level2DndActivity.content;
    // Deliberately put every item one target off: item[0] → target[1], etc.
    items.forEach((item, index) => {
      fireEvent.click(screen.getByTestId(`drag-item-${item.id}`));
      const wrongTarget = targets[(index + 1) % targets.length];
      fireEvent.click(screen.getByTestId(`drop-target-${wrongTarget.id}`));
    });

    fireEvent.click(screen.getByRole('button', { name: 'CHECK ANSWERS' }));
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    // All 3 placements wrong → score 0 → 0 stars → 15 XP on difficulty 2
    // (10 × 1.5 × 1, the stars multiplier defaults to 1 for 0 stars).
    expect(screen.getByText('TRY AGAIN!')).toBeInTheDocument();
    expect(screen.getByTestId('xp')).toHaveTextContent('15');

    fireEvent.click(screen.getByRole('button', { name: 'CONTINUE' }));
    expect(onComplete).toHaveBeenCalledWith({
      score: 0,
      stars: 0,
      xp: 15,
      activityId: level2DndActivity.id,
    });
  });
});
