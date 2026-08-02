import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import FreehandDrawingActivity from '../FreehandDrawingActivity';

const content = {
  instructions: 'Draw a house',
  template: 'M 20 80 L 50 30 L 80 80',
  canvasWidth: 800,
  canvasHeight: 450,
  strokeWidth: 4,
  feedback: { correct: 'Beautiful!', incorrect: 'Keep drawing!' },
};

const createMockContext = () => {
  const ctx = {};
  ['beginPath', 'moveTo', 'lineTo', 'stroke', 'fillRect', 'clearRect'].forEach((method) => {
    ctx[method] = vi.fn();
  });
  return ctx;
};

const stubRect = () => ({
  left: 0,
  top: 0,
  width: 800,
  height: 450,
  right: 800,
  bottom: 450,
});

describe('FreehandDrawingActivity', () => {
  const originalGetContext = HTMLCanvasElement.prototype.getContext;
  let mockCtx;

  beforeEach(() => {
    vi.useFakeTimers();
    mockCtx = createMockContext();
    HTMLCanvasElement.prototype.getContext = vi.fn(() => mockCtx);
  });

  afterEach(() => {
    vi.useRealTimers();
    HTMLCanvasElement.prototype.getContext = originalGetContext;
  });

  const renderActivity = (props = {}) => {
    const view = render(
      <FreehandDrawingActivity content={content} onComplete={vi.fn()} {...props} />,
    );
    const canvas = document.querySelector('canvas');
    canvas.getBoundingClientRect = stubRect;
    return { ...view, canvas };
  };

  const drawStroke = (canvas, startX, startY, endX, endY) => {
    fireEvent.pointerDown(canvas, { clientX: startX, clientY: startY });
    fireEvent.pointerMove(canvas, {
      clientX: (startX + endX) / 2,
      clientY: (startY + endY) / 2,
    });
    fireEvent.pointerMove(canvas, { clientX: endX, clientY: endY });
    fireEvent.pointerUp(canvas);
  };

  it('renders instructions, the canvas, and controls', () => {
    renderActivity();

    expect(screen.getByText('Draw a house')).toBeInTheDocument();
    expect(document.querySelector('canvas')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'CLEAR' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'DONE' })).toBeInTheDocument();
  });

  it('renders the template guide when content provides one', () => {
    renderActivity();

    expect(document.querySelector('canvas + svg path')).toBeInTheDocument();
  });

  it('disables DONE, UNDO, and CLEAR until something has been drawn', () => {
    renderActivity();

    expect(screen.getByRole('button', { name: 'DONE' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'UNDO' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'CLEAR' })).toBeDisabled();
  });

  it('draws strokes onto the canvas with pointer events', () => {
    const { canvas } = renderActivity();

    drawStroke(canvas, 100, 100, 200, 200);

    expect(mockCtx.beginPath).toHaveBeenCalled();
    expect(mockCtx.moveTo).toHaveBeenCalledWith(100, 100);
    expect(mockCtx.lineTo).toHaveBeenCalledWith(200, 200);
    expect(mockCtx.stroke).toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'DONE' })).toBeEnabled();
  });

  it('completes with an effort-based score based on strokes made', () => {
    const onComplete = vi.fn();
    const { canvas } = renderActivity({ onComplete });

    drawStroke(canvas, 100, 100, 200, 200);
    drawStroke(canvas, 100, 200, 200, 300);
    drawStroke(canvas, 100, 300, 200, 400);
    drawStroke(canvas, 300, 100, 400, 200);
    drawStroke(canvas, 300, 200, 400, 300);

    fireEvent.click(screen.getByRole('button', { name: 'DONE' }));
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(onComplete).toHaveBeenCalledWith(100);
  });

  it('completes with a lower score for a single stroke', () => {
    const onComplete = vi.fn();
    const { canvas } = renderActivity({ onComplete });

    drawStroke(canvas, 100, 100, 200, 200);

    fireEvent.click(screen.getByRole('button', { name: 'DONE' }));
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(onComplete).toHaveBeenCalledWith(20);
  });

  it('announces the result through a polite live region', () => {
    const { canvas } = renderActivity();

    drawStroke(canvas, 100, 100, 200, 200);
    drawStroke(canvas, 100, 200, 200, 300);
    drawStroke(canvas, 100, 300, 200, 400);
    drawStroke(canvas, 300, 100, 400, 200);
    drawStroke(canvas, 300, 200, 400, 300);

    fireEvent.click(screen.getByRole('button', { name: 'DONE' }));

    expect(screen.getByRole('status')).toHaveTextContent('Beautiful drawing!');
  });

  it('CLEAR wipes the drawing and re-disables the controls', () => {
    const { canvas } = renderActivity();

    drawStroke(canvas, 100, 100, 200, 200);
    expect(screen.getByRole('button', { name: 'DONE' })).toBeEnabled();

    fireEvent.click(screen.getByRole('button', { name: 'CLEAR' }));

    expect(screen.getByRole('button', { name: 'DONE' })).toBeDisabled();
  });

  it('UNDO removes the last stroke and re-disables the controls', () => {
    const { canvas } = renderActivity();

    drawStroke(canvas, 100, 100, 200, 200);
    drawStroke(canvas, 300, 100, 400, 200);
    expect(screen.getByRole('button', { name: 'DONE' })).toBeEnabled();

    fireEvent.click(screen.getByRole('button', { name: 'UNDO' }));
    expect(screen.getByRole('button', { name: 'DONE' })).toBeEnabled();

    fireEvent.click(screen.getByRole('button', { name: 'UNDO' }));
    expect(screen.getByRole('button', { name: 'DONE' })).toBeDisabled();
  });

  it('redraws the remaining strokes after an undo', () => {
    const { canvas } = renderActivity();

    drawStroke(canvas, 100, 100, 200, 200);
    drawStroke(canvas, 300, 100, 400, 200);

    // Each committed stroke triggers a full redraw (clear + replay).
    const movesBefore = mockCtx.moveTo.mock.calls.length;
    fireEvent.click(screen.getByRole('button', { name: 'UNDO' }));

    expect(mockCtx.moveTo.mock.calls.length).toBeGreaterThan(movesBefore);
  });

  it('stops accepting new strokes after the result is shown', () => {
    const { canvas } = renderActivity();

    drawStroke(canvas, 100, 100, 200, 200);
    fireEvent.click(screen.getByRole('button', { name: 'DONE' }));

    const strokesBefore = mockCtx.stroke.mock.calls.length;
    drawStroke(canvas, 300, 100, 400, 200);

    expect(mockCtx.stroke.mock.calls.length).toBe(strokesBefore);
  });

  it('does not fire onComplete after the activity unmounts', () => {
    const onComplete = vi.fn();
    const { canvas, unmount } = renderActivity({ onComplete });

    drawStroke(canvas, 100, 100, 200, 200);
    fireEvent.click(screen.getByRole('button', { name: 'DONE' }));

    unmount();
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(onComplete).not.toHaveBeenCalled();
  });
});
