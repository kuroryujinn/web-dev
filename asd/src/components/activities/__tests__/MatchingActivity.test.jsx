import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import MatchingActivity from '../MatchingActivity';

const content = {
  instructions: 'Match each animal to its sound',
  pairs: [
    { left: { id: 'dog', label: 'Dog', image: null }, right: { id: 'woof', label: 'Woof', image: null } },
    { left: { id: 'cat', label: 'Cat', image: null }, right: { id: 'meow', label: 'Meow', image: null } },
    { left: { id: 'cow', label: 'Cow', image: null }, right: { id: 'moo', label: 'Moo', image: null } },
  ],
  feedback: { correct: 'Great matching!', incorrect: 'Keep trying!' },
};

const leftItem = (id) => screen.getByTestId(`match-left-${id}`);
const rightItem = (id) => screen.getByTestId(`match-right-${id}`);

const renderActivity = (props = {}) =>
  render(<MatchingActivity content={content} onComplete={vi.fn()} {...props} />);

const matchAll = (mapping) => {
  Object.entries(mapping).forEach(([leftId, rightId]) => {
    fireEvent.click(leftItem(leftId));
    fireEvent.click(rightItem(rightId));
  });
};

describe('MatchingActivity', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders instructions, all items in both columns, and a disabled check button', () => {
    renderActivity();

    expect(screen.getByText('Match each animal to its sound')).toBeInTheDocument();
    expect(leftItem('dog')).toBeInTheDocument();
    expect(leftItem('cat')).toBeInTheDocument();
    expect(leftItem('cow')).toBeInTheDocument();
    expect(rightItem('woof')).toBeInTheDocument();
    expect(rightItem('meow')).toBeInTheDocument();
    expect(rightItem('moo')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'CHECK MATCHES' })).toBeDisabled();
  });

  it('creates a match when a left item is tapped then a right item', () => {
    renderActivity();

    fireEvent.click(leftItem('dog'));
    expect(leftItem('dog')).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(rightItem('woof'));
    // Selection clears after a match.
    expect(leftItem('dog')).not.toHaveAttribute('aria-pressed');
    expect(rightItem('woof')).not.toHaveAttribute('aria-pressed');
  });

  it('creates a match when a right item is tapped then a left item', () => {
    renderActivity();

    fireEvent.click(rightItem('meow'));
    expect(rightItem('meow')).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(leftItem('cat'));
    expect(rightItem('meow')).not.toHaveAttribute('aria-pressed');
  });

  it('deselects an item when it is tapped again', () => {
    renderActivity();

    fireEvent.click(leftItem('dog'));
    expect(leftItem('dog')).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(leftItem('dog'));
    expect(leftItem('dog')).not.toHaveAttribute('aria-pressed');
  });

  it('enables CHECK MATCHES once every left item has a match', () => {
    renderActivity();

    matchAll({ dog: 'woof', cat: 'meow', cow: 'moo' });

    expect(screen.getByRole('button', { name: 'CHECK MATCHES' })).toBeEnabled();
  });

  it('completes with 100 when every pair is correct', () => {
    const onComplete = vi.fn();
    renderActivity({ onComplete });

    matchAll({ dog: 'woof', cat: 'meow', cow: 'moo' });
    fireEvent.click(screen.getByRole('button', { name: 'CHECK MATCHES' }));
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(onComplete).toHaveBeenCalledWith(100);
  });

  it('completes with a partial score when one pair is wrong', () => {
    const onComplete = vi.fn();
    renderActivity({ onComplete });

    matchAll({ dog: 'meow', cat: 'woof', cow: 'moo' });
    fireEvent.click(screen.getByRole('button', { name: 'CHECK MATCHES' }));
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(onComplete).toHaveBeenCalledWith(33);
  });

  it('allows changing an existing match before checking', () => {
    const onComplete = vi.fn();
    renderActivity({ onComplete });

    matchAll({ dog: 'woof', cat: 'meow', cow: 'moo' });

    // Re-match dog to meow — woof is now orphaned and loses its matched styling.
    fireEvent.click(leftItem('dog'));
    fireEvent.click(rightItem('meow'));
    expect(rightItem('woof').className).not.toContain('surface-mint');

    // Then re-match cat to woof.
    fireEvent.click(leftItem('cat'));
    fireEvent.click(rightItem('woof'));

    fireEvent.click(screen.getByRole('button', { name: 'CHECK MATCHES' }));
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(onComplete).toHaveBeenCalledWith(33);
  });

  it('draws a connection line between the centers of matched items', () => {
    renderActivity();

    const container = document.querySelector('[data-testid="match-lines"]').parentElement;
    container.getBoundingClientRect = () => ({ left: 0, top: 0, width: 600, height: 400 });
    leftItem('dog').getBoundingClientRect = () => ({ left: 50, top: 100, width: 100, height: 50 });
    rightItem('woof').getBoundingClientRect = () => ({ left: 450, top: 150, width: 100, height: 50 });

    fireEvent.click(leftItem('dog'));
    fireEvent.click(rightItem('woof'));

    const line = document.querySelector('line');
    expect(line).toBeInTheDocument();
    expect(Number(line.getAttribute('x1'))).toBe(100); // 50 + 100/2
    expect(Number(line.getAttribute('y1'))).toBe(125); // 100 + 50/2
    expect(Number(line.getAttribute('x2'))).toBe(500); // 450 + 100/2
    expect(Number(line.getAttribute('y2'))).toBe(175); // 150 + 50/2
  });

  it('draws one connection line per match', () => {
    renderActivity();

    matchAll({ dog: 'woof', cat: 'meow', cow: 'moo' });

    expect(document.querySelectorAll('line')).toHaveLength(3);
  });

  it('announces matches and results through a polite live region', () => {
    renderActivity();

    fireEvent.click(leftItem('dog'));
    fireEvent.click(rightItem('woof'));
    expect(screen.getByRole('status')).toHaveTextContent('Matched Dog with Woof');

    matchAll({ cat: 'meow', cow: 'moo' });
    fireEvent.click(screen.getByRole('button', { name: 'CHECK MATCHES' }));

    expect(screen.getByRole('status')).toHaveTextContent('Great matching!');
  });

  it('disables the items after the result is shown', () => {
    renderActivity();

    matchAll({ dog: 'woof', cat: 'meow', cow: 'moo' });
    fireEvent.click(screen.getByRole('button', { name: 'CHECK MATCHES' }));

    expect(leftItem('dog')).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'CHECK MATCHES' })).not.toBeInTheDocument();
  });

  it('does not fire onComplete after the activity unmounts', () => {
    const onComplete = vi.fn();
    const { unmount } = renderActivity({ onComplete });

    matchAll({ dog: 'woof', cat: 'meow', cow: 'moo' });
    fireEvent.click(screen.getByRole('button', { name: 'CHECK MATCHES' }));

    unmount();
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(onComplete).not.toHaveBeenCalled();
  });
});
