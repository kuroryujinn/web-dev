import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import ActivityHeader from '../ActivityHeader';

describe('ActivityHeader', () => {
  afterEach(() => {
    vi.useRealTimers();
  });
  it('renders the activity title and back button', () => {
    render(<ActivityHeader title="Match the Shapes" onBack={vi.fn()} />);

    expect(screen.getByText('Match the Shapes')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go back' })).toBeInTheDocument();
  });

  it('calls onBack when the back button is clicked', () => {
    const onBack = vi.fn();
    render(<ActivityHeader title="Test" onBack={onBack} />);

    fireEvent.click(screen.getByRole('button', { name: 'Go back' }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('shows a formatted countdown when a timer is provided', () => {
    vi.useFakeTimers();
    render(<ActivityHeader title="Timed" timer={65} onBack={vi.fn()} />);

    expect(screen.getByRole('timer')).toHaveTextContent('1:05');

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByRole('timer')).toHaveTextContent('1:04');
  });

  it('calls onTimeUp when the timer expires', () => {
    vi.useFakeTimers();
    const onTimeUp = vi.fn();
    render(<ActivityHeader title="Timed" timer={1} onBack={vi.fn()} onTimeUp={onTimeUp} />);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(onTimeUp).toHaveBeenCalledTimes(1);
  });

  it('hides the timer when no timer is provided', () => {
    render(<ActivityHeader title="Untimed" onBack={vi.fn()} />);

    expect(screen.queryByRole('timer')).not.toBeInTheDocument();
  });

  it('shows the score when a score prop is provided', () => {
    render(<ActivityHeader title="Scored" score={87} onBack={vi.fn()} />);

    expect(screen.getByLabelText('Score 87')).toBeInTheDocument();
  });
});
