import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import SortingActivity from '../SortingActivity';

// Display order: Elephant(2), Ant(0), Dog(1). Correct order: Ant, Dog, Elephant.
const content = {
  instructions: 'Order the animals from smallest to biggest',
  direction: 'ascending',
  items: [
    { id: 'big', label: 'Elephant', image: null, order: 2 },
    { id: 'small', label: 'Ant', image: null, order: 0 },
    { id: 'mid', label: 'Dog', image: null, order: 1 },
  ],
  feedback: { correct: 'Great sorting!', incorrect: 'Keep trying!' },
};

const renderActivity = (props = {}) =>
  render(<SortingActivity content={content} onComplete={vi.fn()} {...props} />);

const sortItem = (label) => screen.getByRole('button', { name: new RegExp(label) });

describe('SortingActivity', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders instructions, the direction hint, items, and the check button', () => {
    renderActivity();

    expect(screen.getByText('Order the animals from smallest to biggest')).toBeInTheDocument();
    expect(screen.getByText(/Put them in order \(smallest to biggest\)/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'CHECK ORDER' })).toBeInTheDocument();

    // Items render in the content order.
    const buttons = screen.getAllByRole('button').filter((b) => b.dataset.testid);
    expect(buttons.map((b) => b.textContent.replace(/\d+\./, '').trim())).toEqual([
      'Elephant',
      'Ant',
      'Dog',
    ]);
  });

  it('uses a custom order hint when the content provides one', () => {
    renderActivity({
      content: { ...content, orderHint: 'red, orange, yellow, green' },
    });

    expect(
      screen.getByText(/Put them in order \(red, orange, yellow, green\)/),
    ).toBeInTheDocument();
  });

  it('swaps two tapped items by ID', () => {
    renderActivity();

    fireEvent.click(sortItem('Elephant'));
    fireEvent.click(sortItem('Ant'));

    const buttons = screen.getAllByRole('button').filter((b) => b.dataset.testid);
    expect(buttons.map((b) => b.textContent.replace(/\d+\./, '').trim())).toEqual([
      'Ant',
      'Elephant',
      'Dog',
    ]);
  });

  it('swaps two items via drag and drop', () => {
    renderActivity();

    const elephant = sortItem('Elephant');
    fireEvent.dragStart(elephant, {
      dataTransfer: { setData: vi.fn(), getData: vi.fn() },
    });
    fireEvent.dragOver(sortItem('Ant'));
    fireEvent.drop(sortItem('Ant'));
    fireEvent.dragEnd(elephant);

    const buttons = screen.getAllByRole('button').filter((b) => b.dataset.testid);
    expect(buttons.map((b) => b.textContent.replace(/\d+\./, '').trim())).toEqual([
      'Ant',
      'Elephant',
      'Dog',
    ]);
  });

  it('keeps focus on an item after moving it with the arrow keys', () => {
    renderActivity();

    const dog = sortItem('Dog');
    dog.focus();
    fireEvent.keyDown(dog, { key: 'ArrowUp' });

    expect(document.activeElement).toBe(sortItem('Dog'));
  });

  it('gives sort items a visible focus ring', () => {
    renderActivity();

    expect(sortItem('Elephant')).toHaveClass('focus-visible:outline-4');
  });

  it('marks a selected item as pressed and deselects after a swap', () => {
    renderActivity();

    const elephant = sortItem('Elephant');
    fireEvent.click(elephant);

    expect(elephant).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('SELECTED')).toBeInTheDocument();

    fireEvent.click(sortItem('Dog'));
    expect(elephant).not.toHaveAttribute('aria-pressed');
  });

  it('moves an item up with the ArrowUp key', () => {
    renderActivity();

    // Dog is last; move it up past Ant.
    fireEvent.keyDown(sortItem('Dog'), { key: 'ArrowUp' });
    fireEvent.keyDown(sortItem('Dog'), { key: 'ArrowUp' });

    const buttons = screen.getAllByRole('button').filter((b) => b.dataset.testid);
    expect(buttons.map((b) => b.textContent.replace(/\d+\./, '').trim())).toEqual([
      'Dog',
      'Elephant',
      'Ant',
    ]);
  });

  it('moves an item down with the ArrowDown key', () => {
    renderActivity();

    fireEvent.keyDown(sortItem('Ant'), { key: 'ArrowDown' });

    const buttons = screen.getAllByRole('button').filter((b) => b.dataset.testid);
    expect(buttons.map((b) => b.textContent.replace(/\d+\./, '').trim())).toEqual([
      'Elephant',
      'Dog',
      'Ant',
    ]);
  });

  it('does not move the first item up or the last item down', () => {
    renderActivity();

    fireEvent.keyDown(sortItem('Elephant'), { key: 'ArrowUp' });
    fireEvent.keyDown(sortItem('Dog'), { key: 'ArrowDown' });

    const buttons = screen.getAllByRole('button').filter((b) => b.dataset.testid);
    expect(buttons.map((b) => b.textContent.replace(/\d+\./, '').trim())).toEqual([
      'Elephant',
      'Ant',
      'Dog',
    ]);
  });

  it('completes with 100 when every item is in its correct position', () => {
    const onComplete = vi.fn();
    renderActivity({ onComplete });

    // Elephant <-> Ant, then Elephant <-> Dog → Ant, Dog, Elephant.
    fireEvent.click(sortItem('Elephant'));
    fireEvent.click(sortItem('Ant'));
    fireEvent.click(sortItem('Elephant'));
    fireEvent.click(sortItem('Dog'));

    fireEvent.click(screen.getByRole('button', { name: 'CHECK ORDER' }));
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(onComplete).toHaveBeenCalledWith(100);
  });

  it('completes with a partial score for a partially correct order', () => {
    const onComplete = vi.fn();
    renderActivity({ onComplete });

    // Swap only Elephant and Ant → Ant, Elephant, Dog (1 of 3 correct).
    fireEvent.click(sortItem('Elephant'));
    fireEvent.click(sortItem('Ant'));

    fireEvent.click(screen.getByRole('button', { name: 'CHECK ORDER' }));
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(onComplete).toHaveBeenCalledWith(33);
  });

  it('announces swaps and moves through the live region', () => {
    renderActivity();

    fireEvent.click(sortItem('Elephant'));
    fireEvent.click(sortItem('Ant'));
    expect(screen.getByRole('status')).toHaveTextContent('Swapped Elephant and Ant');

    fireEvent.keyDown(sortItem('Dog'), { key: 'ArrowUp' });
    expect(screen.getByRole('status')).toHaveTextContent('moved up to position');
  });

  it('announces the result through a polite live region', () => {
    renderActivity();

    // Reach a perfect order so the message is the positive one.
    fireEvent.click(sortItem('Elephant'));
    fireEvent.click(sortItem('Ant'));
    fireEvent.click(sortItem('Elephant'));
    fireEvent.click(sortItem('Dog'));

    fireEvent.click(screen.getByRole('button', { name: 'CHECK ORDER' }));

    expect(screen.getByRole('status')).toHaveTextContent('Great sorting!');
  });

  it('disables the items after the result is shown', () => {
    renderActivity();

    fireEvent.click(sortItem('Elephant'));
    fireEvent.click(sortItem('Ant'));
    fireEvent.click(screen.getByRole('button', { name: 'CHECK ORDER' }));

    expect(sortItem('Elephant')).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'CHECK ORDER' })).not.toBeInTheDocument();
  });

  it('does not fire onComplete after the activity unmounts', () => {
    const onComplete = vi.fn();
    const { unmount } = renderActivity({ onComplete });

    fireEvent.click(sortItem('Elephant'));
    fireEvent.click(sortItem('Ant'));
    fireEvent.click(screen.getByRole('button', { name: 'CHECK ORDER' }));

    unmount();
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(onComplete).not.toHaveBeenCalled();
  });
});
