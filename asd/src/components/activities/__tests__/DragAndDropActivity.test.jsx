import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import DragAndDropActivity from '../DragAndDropActivity';

const content = {
  instructions: 'Put each fruit in its basket',
  items: [
    { id: 'apple', label: 'Apple', image: null },
    { id: 'banana', label: 'Banana', image: null },
  ],
  targets: [
    { id: 't1', label: 'Fruit 1', correctItemId: 'apple' },
    { id: 't2', label: 'Fruit 2', correctItemId: 'banana' },
  ],
  feedback: { correct: 'Great job!', incorrect: 'Keep going!' },
};

describe('DragAndDropActivity', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders instructions, items, and targets', () => {
    render(<DragAndDropActivity content={content} onComplete={vi.fn()} />);

    expect(screen.getByText('Put each fruit in its basket')).toBeInTheDocument();
    expect(screen.getByTestId('drag-item-apple')).toBeInTheDocument();
    expect(screen.getByTestId('drag-item-banana')).toBeInTheDocument();
    expect(screen.getByTestId('drop-target-t1')).toBeInTheDocument();
    expect(screen.getByTestId('drop-target-t2')).toBeInTheDocument();
  });

  it('supports tap-to-assign: select an item then tap a target', () => {
    render(<DragAndDropActivity content={content} onComplete={vi.fn()} />);

    fireEvent.click(screen.getByTestId('drag-item-apple'));
    fireEvent.click(screen.getByTestId('drop-target-t1'));

    expect(screen.getByTestId('drop-target-t1')).toHaveTextContent('→ Apple');
  });

  it('supports native drag and drop', () => {
    render(<DragAndDropActivity content={content} onComplete={vi.fn()} />);

    fireEvent.dragStart(screen.getByTestId('drag-item-banana'));
    fireEvent.drop(screen.getByTestId('drop-target-t2'));

    expect(screen.getByTestId('drop-target-t2')).toHaveTextContent('→ Banana');
  });

  it('disables the check button until every target is filled', () => {
    render(<DragAndDropActivity content={content} onComplete={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'CHECK ANSWERS' })).toBeDisabled();

    fireEvent.click(screen.getByTestId('drag-item-apple'));
    fireEvent.click(screen.getByTestId('drop-target-t1'));

    expect(screen.getByRole('button', { name: 'CHECK ANSWERS' })).toBeDisabled();

    fireEvent.click(screen.getByTestId('drag-item-banana'));
    fireEvent.click(screen.getByTestId('drop-target-t2'));

    expect(screen.getByRole('button', { name: 'CHECK ANSWERS' })).toBeEnabled();
  });

  it('completes with the calculated score when answers are correct', () => {
    const onComplete = vi.fn();
    render(<DragAndDropActivity content={content} onComplete={onComplete} />);

    fireEvent.click(screen.getByTestId('drag-item-apple'));
    fireEvent.click(screen.getByTestId('drop-target-t1'));
    fireEvent.click(screen.getByTestId('drag-item-banana'));
    fireEvent.click(screen.getByTestId('drop-target-t2'));

    fireEvent.click(screen.getByRole('button', { name: 'CHECK ANSWERS' }));
    vi.advanceTimersByTime(1500);

    expect(onComplete).toHaveBeenCalledWith(100);
  });

  it('completes with a partial score when some answers are wrong', () => {
    const onComplete = vi.fn();
    render(<DragAndDropActivity content={content} onComplete={onComplete} />);

    fireEvent.click(screen.getByTestId('drag-item-banana'));
    fireEvent.click(screen.getByTestId('drop-target-t1'));
    fireEvent.click(screen.getByTestId('drag-item-apple'));
    fireEvent.click(screen.getByTestId('drop-target-t2'));

    fireEvent.click(screen.getByRole('button', { name: 'CHECK ANSWERS' }));
    vi.advanceTimersByTime(1500);

    expect(onComplete).toHaveBeenCalledWith(0);
  });

  it('announces the result through a polite live region', () => {
    render(<DragAndDropActivity content={content} onComplete={vi.fn()} />);

    fireEvent.click(screen.getByTestId('drag-item-apple'));
    fireEvent.click(screen.getByTestId('drop-target-t1'));
    fireEvent.click(screen.getByTestId('drag-item-banana'));
    fireEvent.click(screen.getByTestId('drop-target-t2'));
    fireEvent.click(screen.getByRole('button', { name: 'CHECK ANSWERS' }));

    expect(screen.getByRole('status')).toHaveTextContent('All placed correctly');
  });

  it('keeps items interactive via keyboard (aria-pressed on selection)', () => {
    render(<DragAndDropActivity content={content} onComplete={vi.fn()} />);

    const apple = screen.getByTestId('drag-item-apple');
    fireEvent.click(apple);

    expect(apple).toHaveAttribute('aria-pressed', 'true');
  });
});
