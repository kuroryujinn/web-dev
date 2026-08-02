import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import PathTracingActivity from '../PathTracingActivity';

const content = {
  instructions: 'Trace the line',
  paths: [
    { id: 'p1', d: 'M 0 50 L 100 50', label: 'Horizontal line', strokeWidth: 2 },
  ],
  tolerance: 5,
  feedback: { correct: 'Nice tracing!', incorrect: 'Keep practicing!' },
};

const stubRect = () =>
  ({
    left: 0,
    top: 0,
    width: 100,
    height: 100,
    right: 100,
    bottom: 100,
  });

const renderActivity = (props = {}) => {
  const view = render(<PathTracingActivity content={content} onComplete={vi.fn()} {...props} />);
  const svg = document.querySelector('svg[role="img"]');
  svg.getBoundingClientRect = stubRect;
  return { ...view, svg };
};

const traceLine = (svg) => {
  fireEvent.pointerDown(svg, { clientX: 10, clientY: 50 });
  fireEvent.pointerMove(svg, { clientX: 50, clientY: 50 });
  fireEvent.pointerMove(svg, { clientX: 90, clientY: 50 });
  fireEvent.pointerUp(svg);
};

describe('PathTracingActivity', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders instructions, the tracing area, and controls', () => {
    renderActivity();

    expect(screen.getByText('Trace the line')).toBeInTheDocument();
    expect(document.querySelector('svg')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'UNDO' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'CLEAR' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'DONE' })).toBeInTheDocument();
  });

  it('disables DONE until something has been traced', () => {
    renderActivity();

    expect(screen.getByRole('button', { name: 'DONE' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'UNDO' })).toBeDisabled();
  });

  it('completes with a perfect score when the line is traced accurately', () => {
    const onComplete = vi.fn();
    const { svg } = renderActivity({ onComplete });

    traceLine(svg);
    expect(screen.getByRole('button', { name: 'DONE' })).toBeEnabled();

    fireEvent.click(screen.getByRole('button', { name: 'DONE' }));
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(onComplete).toHaveBeenCalledWith(100);
  });

  it('completes with a low score when traced far off the path', () => {
    const onComplete = vi.fn();
    const { svg } = renderActivity({ onComplete });

    fireEvent.pointerDown(svg, { clientX: 10, clientY: 5 });
    fireEvent.pointerMove(svg, { clientX: 50, clientY: 5 });
    fireEvent.pointerMove(svg, { clientX: 90, clientY: 5 });
    fireEvent.pointerUp(svg);

    fireEvent.click(screen.getByRole('button', { name: 'DONE' }));
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(onComplete).toHaveBeenCalledWith(0);
  });

  it('announces the result through a polite live region', () => {
    const { svg } = renderActivity();

    traceLine(svg);
    fireEvent.click(screen.getByRole('button', { name: 'DONE' }));

    expect(screen.getByRole('status')).toHaveTextContent('Nice tracing!');
  });

  it('UNDO removes the last stroke and re-enables DONE appropriately', () => {
    const { svg } = renderActivity();

    traceLine(svg);
    expect(screen.getByRole('button', { name: 'DONE' })).toBeEnabled();

    fireEvent.click(screen.getByRole('button', { name: 'UNDO' }));

    expect(screen.getByRole('button', { name: 'DONE' })).toBeDisabled();
  });

  it('CLEAR resets all strokes', () => {
    const { svg } = renderActivity();

    traceLine(svg);
    fireEvent.click(screen.getByRole('button', { name: 'CLEAR' }));

    expect(screen.getByRole('button', { name: 'DONE' })).toBeDisabled();
  });
});
