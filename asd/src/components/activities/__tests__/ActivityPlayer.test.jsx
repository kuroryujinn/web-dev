import React, { useEffect, useRef } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc } from 'firebase/firestore';
import { AuthProvider } from '../../../contexts/AuthContext';
import { ProgressProvider, useProgress } from '../../../contexts/ProgressContext';
import { SettingsProvider } from '../../../contexts/SettingsContext';
import ActivityPlayer from '../ActivityPlayer';

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

const baseActivity = {
  id: 'act-1',
  type: 'multipleChoice',
  title: 'Find the Dog',
  difficulty: 1,
  timeLimit: null,
  maxScore: 100,
  content: {
    questionLabel: 'Find the Dog',
    questionImage: null,
    questionAlt: 'A dog',
    options: [
      { id: 'a', label: 'Cat', image: null, correct: false },
      { id: 'b', label: 'Dog', image: null, correct: true },
    ],
    feedback: { correct: 'Great job!', incorrect: 'Keep going!' },
  },
};

// A type that is not wired into the default registry (all six real types are).
const unimplementedActivity = { ...baseActivity, type: 'futureType' };

const renderWithProviders = (ui) =>
  render(
    <AuthProvider>
      <ProgressProvider>
        <SettingsProvider>{ui}</SettingsProvider>
      </ProgressProvider>
    </AuthProvider>,
  );

describe('ActivityPlayer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // The progress service keeps a localStorage backup per uid; clear it so
    // each test starts from a fresh seed (no XP leak between tests).
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
  it('renders a placeholder for unimplemented activity types', () => {
    renderWithProviders(
      <ActivityPlayer activity={unimplementedActivity} onComplete={vi.fn()} onBack={vi.fn()} />,
    );

    expect(screen.getByText('COMING SOON')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
  });

  it('renders the registered activity component and header', () => {
    renderWithProviders(
      <ActivityPlayer
        activity={baseActivity}
        onComplete={vi.fn()}
        onBack={vi.fn()}
      />,
    );

    // The title appears once in the header and once as the question heading.
    expect(screen.getAllByText('Find the Dog')).toHaveLength(2);
    expect(screen.getByTestId('multiple-choice-activity')).toBeInTheDocument();
  });

  it('shows positive feedback and reports the result on continue', () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();

    renderWithProviders(
      <ActivityPlayer
        activity={baseActivity}
        onComplete={onComplete}
        onBack={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /dog/i }));
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(screen.getByText('NICE WORK!')).toBeInTheDocument();
    expect(screen.getByText('Great job!')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'CONTINUE' }));

    expect(onComplete).toHaveBeenCalledWith({
      score: 100,
      stars: 3,
      xp: 15,
      activityId: 'act-1',
    });
  });

  it('awards XP through ProgressContext when an activity is completed', async () => {
    const ProgressConsumer = () => {
      const { progress } = useProgress();
      if (!progress) return <div data-testid="xp">loading</div>;
      return <div data-testid="xp">{progress.totalXP}</div>;
    };

    renderWithProviders(
      <>
        <ActivityPlayer activity={baseActivity} onComplete={vi.fn()} onBack={vi.fn()} />
        <ProgressConsumer />
      </>,
    );

    // Progress is seeded before the activity is attempted (real timers).
    await waitFor(() => {
      expect(screen.getByTestId('xp')).toHaveTextContent('0');
    });

    // Fake timers only for the activity's 1500ms completion reveal.
    vi.useFakeTimers();
    fireEvent.click(screen.getByRole('button', { name: /dog/i }));
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    // 3 stars on difficulty 1 → 15 XP, awarded synchronously via the context.
    expect(screen.getByTestId('xp')).toHaveTextContent('15');
  });

  it('shows encouraging retry feedback for low scores', () => {
    vi.useFakeTimers();
    renderWithProviders(
      <ActivityPlayer
        activity={baseActivity}
        onComplete={vi.fn()}
        onBack={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /cat/i }));
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(screen.getByText('TRY AGAIN!')).toBeInTheDocument();
    expect(screen.getByText('Keep going!')).toBeInTheDocument();
  });

  it('calls onBack when the back button is pressed', () => {
    const MockActivity = () => <div>mock</div>;
    const registry = { multipleChoice: MockActivity };
    const onBack = vi.fn();

    renderWithProviders(
      <ActivityPlayer activity={baseActivity} onComplete={vi.fn()} onBack={onBack} registry={registry} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Go back' }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('completes with 0 when the timer expires before finishing', () => {
    vi.useFakeTimers();
    const MockActivity = () => <div>slow</div>;
    const registry = { multipleChoice: MockActivity };
    const onComplete = vi.fn();
    const timedActivity = { ...baseActivity, timeLimit: 1 };

    renderWithProviders(
      <ActivityPlayer
        activity={timedActivity}
        onComplete={onComplete}
        onBack={vi.fn()}
        registry={registry}
      />,
    );

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText('TRY AGAIN!')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'CONTINUE' }));
    expect(onComplete).toHaveBeenCalledWith({
      score: 0,
      stars: 0,
      xp: 10,
      activityId: 'act-1',
    });
    vi.useRealTimers();
  });

  it('awards XP only once when the timer expiry and the activity completion overlap', async () => {
    // Fake timers BEFORE render so the ActivityHeader countdown interval and
    // the activity's delayed completion are both intercepted by the mock clock.
    vi.useFakeTimers();

    const ProgressConsumer = () => {
      const { progress } = useProgress();
      if (!progress) return <div data-testid="xp">loading</div>;
      return <div data-testid="xp">{progress.totalXP}</div>;
    };

    // Mimics a real activity: the ActivityHeader timer expires at 1000ms
    // (awarding 0 via handleTimeUp), but the activity's own delayed completion
    // fires 1500ms later too. The idempotency guard must prevent a second award.
    const SlowActivity = ({ onComplete }) => {
      const firedRef = useRef(false);
      useEffect(() => {
        const id = setTimeout(() => {
          if (firedRef.current) return;
          firedRef.current = true;
          onComplete(100);
        }, 1500);
        return () => clearTimeout(id);
      }, [onComplete]);
      return <div>slow</div>;
    };
    const registry = { multipleChoice: SlowActivity };
    const timedActivity = { ...baseActivity, timeLimit: 1 };

    renderWithProviders(
      <>
        <ActivityPlayer
          activity={timedActivity}
          onComplete={vi.fn()}
          onBack={vi.fn()}
          registry={registry}
        />
        <ProgressConsumer />
      </>,
    );

    // Flush the async progress seed (getDoc → persist → setState) — these are
    // promise microtasks, not timers, so an async act flush is enough.
    await act(async () => {});
    expect(screen.getByTestId('xp')).toHaveTextContent('0');

    // 1) The header timer expiry fires at 1000ms → score 0 → 10 XP.
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByTestId('xp')).toHaveTextContent('10');

    // 2) The activity's delayed onComplete (100) fires at 2500ms — the guard
    //    ignores it, so XP stays at 10 (no double award, no double attempt).
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(screen.getByTestId('xp')).toHaveTextContent('10');
  });
});
