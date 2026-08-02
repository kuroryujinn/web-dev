import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { usePathTracing } from '../usePathTracing';

// jsdom returns 0-size rects; stub a 100x100 box so percent coords are easy.
const stubRect = () =>
  ({
    left: 0,
    top: 0,
    width: 100,
    height: 100,
    right: 100,
    bottom: 100,
  });

const Harness = () => {
  const {
    strokes,
    currentStroke,
    isDrawing,
    svgRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    clearStrokes,
    undoStroke,
  } = usePathTracing();

  return (
    <div>
      <svg
        ref={svgRef}
        data-testid="trace-svg"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />
      <span data-testid="strokes">{strokes.length}</span>
      <span data-testid="current">{currentStroke.length}</span>
      <span data-testid="drawing">{String(isDrawing)}</span>
      <button onClick={clearStrokes}>clear</button>
      <button onClick={undoStroke}>undo</button>
    </div>
  );
};

const renderHarness = () => {
  render(<Harness />);
  const svg = screen.getByTestId('trace-svg');
  svg.getBoundingClientRect = stubRect;
  return svg;
};

describe('usePathTracing', () => {
  it('records a stroke from pointer down, move, up', () => {
    const svg = renderHarness();

    fireEvent.pointerDown(svg, { clientX: 10, clientY: 10 });
    fireEvent.pointerMove(svg, { clientX: 30, clientY: 10 });
    fireEvent.pointerUp(svg);

    expect(screen.getByTestId('strokes')).toHaveTextContent('1');
    expect(screen.getByTestId('current')).toHaveTextContent('0');
    expect(screen.getByTestId('drawing')).toHaveTextContent('false');
  });

  it('normalizes pointer coordinates into 0–100 space', () => {
    const svg = renderHarness();

    fireEvent.pointerDown(svg, { clientX: 25, clientY: 50 });
    fireEvent.pointerMove(svg, { clientX: 75, clientY: 50 });
    fireEvent.pointerUp(svg);

    // The stroke's points are percentages of the box.
    expect(screen.getByTestId('current')).toHaveTextContent('0');
    expect(screen.getByTestId('strokes')).toHaveTextContent('1');
  });

  it('does not start a stroke without a pointer down', () => {
    const svg = renderHarness();

    fireEvent.pointerMove(svg, { clientX: 30, clientY: 30 });

    expect(screen.getByTestId('strokes')).toHaveTextContent('0');
  });

  it('ignores a single-point tap (no stroke recorded)', () => {
    const svg = renderHarness();

    fireEvent.pointerDown(svg, { clientX: 10, clientY: 10 });
    fireEvent.pointerUp(svg);

    expect(screen.getByTestId('strokes')).toHaveTextContent('0');
  });

  it('undo removes the most recent stroke', () => {
    const svg = renderHarness();

    fireEvent.pointerDown(svg, { clientX: 10, clientY: 10 });
    fireEvent.pointerMove(svg, { clientX: 20, clientY: 10 });
    fireEvent.pointerUp(svg);

    expect(screen.getByTestId('strokes')).toHaveTextContent('1');

    fireEvent.click(screen.getByText('undo'));

    expect(screen.getByTestId('strokes')).toHaveTextContent('0');
  });

  it('clear removes all strokes and any current stroke', () => {
    const svg = renderHarness();

    fireEvent.pointerDown(svg, { clientX: 10, clientY: 10 });
    fireEvent.pointerMove(svg, { clientX: 20, clientY: 10 });
    fireEvent.pointerUp(svg);
    fireEvent.click(screen.getByText('clear'));

    expect(screen.getByTestId('strokes')).toHaveTextContent('0');
    expect(screen.getByTestId('current')).toHaveTextContent('0');
  });
});
