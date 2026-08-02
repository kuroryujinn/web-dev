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
  content: { feedback: { correct: 'Great job!', incorrect: 'Keep going!' } },
};

const renderWithSettings = (ui) =>
  render(<SettingsProvider>{ui}</SettingsProvider>);

describe('ActivityPlayer', () => {
  afterEach(() => {
    vi.useRealTimers();
  });
  it('renders a placeholder for unimplemented activity types', () => {
    renderWithSettings(
      <ActivityPlayer activity={baseActivity} onComplete={vi.fn()} onBack={vi.fn()} />,
    );

    expect(screen.getByText('COMING SOON')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
  });

  it('renders the registered activity component and header', () => {
    const MockActivity = ({ content, onComplete }) => (
      <button onClick={() => onComplete(95)}>{content.feedback.correct}</button>
    );
    const registry = { multipleChoice: MockActivity };

    renderWithSettings(
      <ActivityPlayer
        activity={baseActivity}
        onComplete={vi.fn()}
        onBack={vi.fn()}
        registry={registry}
      />,
    );

    expect(screen.getByText('Find the Dog')).toBeInTheDocument();
    expect(screen.getByText('Great job!')).toBeInTheDocument();
  });

  it('shows positive feedback and reports the result on continue', () => {
    const MockActivity = ({ onComplete }) => (
      <button onClick={() => onComplete(95)}>finish</button>
    );
    const registry = { multipleChoice: MockActivity };
    const onComplete = vi.fn();

    renderWithSettings(
      <ActivityPlayer
        activity={baseActivity}
        onComplete={onComplete}
        onBack={vi.fn()}
        registry={registry}
      />,
    );

    fireEvent.click(screen.getByText('finish'));

    expect(screen.getByText('NICE WORK!')).toBeInTheDocument();
    expect(screen.getByText('Great job!')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'CONTINUE' }));

    expect(onComplete).toHaveBeenCalledWith({
      score: 95,
      stars: 3,
      xp: 15,
      activityId: 'act-1',
    });
  });

  it('shows encouraging retry feedback for low scores', () => {
    const MockActivity = ({ onComplete }) => (
      <button onClick={() => onComplete(40)}>finish</button>
    );
    const registry = { multipleChoice: MockActivity };

    renderWithSettings(
      <ActivityPlayer
        activity={baseActivity}
        onComplete={vi.fn()}
        onBack={vi.fn()}
        registry={registry}
      />,
    );

    fireEvent.click(screen.getByText('finish'));

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
