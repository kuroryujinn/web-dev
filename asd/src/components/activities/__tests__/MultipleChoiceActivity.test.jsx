import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import MultipleChoiceActivity from '../MultipleChoiceActivity';

const content = {
  questionLabel: 'Find the Dog',
  questionImage: null,
  questionAlt: 'A dog',
  options: [
    { id: 'a', label: 'Cat', image: null, correct: false },
    { id: 'b', label: 'Dog', image: null, correct: true },
    { id: 'c', label: 'Bird', image: null, correct: false },
  ],
  feedback: { correct: 'Great job!', incorrect: 'Keep going!' },
};

describe('MultipleChoiceActivity', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the question and every option as an accessible button', () => {
    render(<MultipleChoiceActivity content={content} onComplete={vi.fn()} />);

    expect(screen.getByRole('group')).toHaveAttribute(
      'aria-labelledby',
      'mc-question',
    );
    expect(screen.getByRole('heading', { name: 'Find the Dog' })).toBeInTheDocument();

    for (const option of content.options) {
      const button = screen.getByRole('button', { name: new RegExp(option.label) });
      expect(button).toBeEnabled();
    }
  });

  it('completes with a perfect score when the correct option is chosen', () => {
    const onComplete = vi.fn();
    render(<MultipleChoiceActivity content={content} onComplete={onComplete} />);

    fireEvent.click(screen.getByRole('button', { name: /dog/i }));
    vi.advanceTimersByTime(1500);

    expect(onComplete).toHaveBeenCalledWith(100);
    expect(screen.getByRole('status')).toHaveTextContent('Correct');
  });

  it('completes with zero when a wrong option is chosen', () => {
    const onComplete = vi.fn();
    render(<MultipleChoiceActivity content={content} onComplete={onComplete} />);

    fireEvent.click(screen.getByRole('button', { name: /cat/i }));
    vi.advanceTimersByTime(1500);

    expect(onComplete).toHaveBeenCalledWith(0);
    expect(screen.getByRole('status')).toHaveTextContent('Not quite');
  });

  it('disables all options after an answer is selected', () => {
    render(<MultipleChoiceActivity content={content} onComplete={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /dog/i }));

    for (const option of content.options) {
      expect(screen.getByRole('button', { name: new RegExp(option.label) })).toBeDisabled();
    }
  });

  it('highlights the selected answer with aria-pressed', () => {
    render(<MultipleChoiceActivity content={content} onComplete={vi.fn()} />);

    const dog = screen.getByRole('button', { name: /dog/i });
    fireEvent.click(dog);

    expect(dog).toHaveAttribute('aria-pressed', 'true');
  });

  it('ignores clicks after the result is shown', () => {
    const onComplete = vi.fn();
    render(<MultipleChoiceActivity content={content} onComplete={onComplete} />);

    fireEvent.click(screen.getByRole('button', { name: /cat/i }));
    // Try selecting another option after the reveal.
    fireEvent.click(screen.getByRole('button', { name: /dog/i }));
    vi.advanceTimersByTime(1500);

    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
