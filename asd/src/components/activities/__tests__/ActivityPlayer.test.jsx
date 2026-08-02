import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { SettingsProvider } from '../../../contexts/SettingsContext';
import ActivityPlayer from '../ActivityPlayer';

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

// A type that is not yet wired into the default registry.
const unimplementedActivity = { ...baseActivity, type: 'matching' };

const renderWithSettings = (ui) =>
  render(<SettingsProvider>{ui}</SettingsProvider>);

describe('ActivityPlayer', () => {
  afterEach(() => {
    vi.useRealTimers();
  });
  it('renders a placeholder for unimplemented activity types', () => {
    renderWithSettings(
      <ActivityPlayer activity={unimplementedActivity} onComplete={vi.fn()} onBack={vi.fn()} />,
    );

    expect(screen.getByText('COMING SOON')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
  });

  it('renders the registered activity component and header', () => {
    renderWithSettings(
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

    renderWithSettings(
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

  it('shows encouraging retry feedback for low scores', () => {
    vi.useFakeTimers();
    renderWithSettings(
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

    renderWithSettings(
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

    renderWithSettings(
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
});
