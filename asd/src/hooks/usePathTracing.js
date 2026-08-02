import { useState, useCallback, useRef } from 'react';

/**
 * Pointer-based drawing state for PathTracingActivity.
 *
 * Points are stored in a normalized 0–100 coordinate space (percent of the
 * SVG's bounding box), so they line up with the template `viewBox="0 0 100 100"`
 * and can be scored against the template paths directly.
 */
export const usePathTracing = () => {
  const [strokes, setStrokes] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState([]);
  const svgRef = useRef(null);

  const getPointerPosition = useCallback((e) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    if (!rect.width || !rect.height) return { x: 0, y: 0 };
    return {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
  }, []);

  const handlePointerDown = useCallback(
    (e) => {
      e.preventDefault();
      setIsDrawing(true);
      const pos = getPointerPosition(e);
      setCurrentStroke([pos]);
    },
    [getPointerPosition],
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (!isDrawing) return;
      e.preventDefault();
      const pos = getPointerPosition(e);
      setCurrentStroke((prev) => [...prev, pos]);
    },
    [isDrawing, getPointerPosition],
  );

  const handlePointerUp = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setStrokes((prev) =>
      currentStroke.length > 1 ? [...prev, currentStroke] : prev,
    );
    setCurrentStroke([]);
  }, [isDrawing, currentStroke]);

  const clearStrokes = useCallback(() => {
    setStrokes([]);
    setCurrentStroke([]);
  }, []);

  const undoStroke = useCallback(() => {
    setStrokes((prev) => prev.slice(0, -1));
  }, []);

  return {
    strokes,
    currentStroke,
    isDrawing,
    svgRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    clearStrokes,
    undoStroke,
  };
};
