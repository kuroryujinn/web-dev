import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { usePathTracing } from '../../hooks/usePathTracing';
import { calculateTraceScore, getPathCoverage } from '../../utils/pathTracing';
import AccessibleButton from '../shared/AccessibleButton';

/**
 * Path tracing activity: trace along the template paths with a finger,
 * stylus, or mouse. Pointer events give unified touch + mouse support.
 *
 * - Template paths light up as they get covered (live visual feedback).
 * - Score = fraction of traced points within tolerance of any template path.
 * - Results are announced via a polite live region.
 */
const PathTracingActivity = ({ content, onComplete }) => {
  const {
    strokes,
    currentStroke,
    svgRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    clearStrokes,
    undoStroke,
  } = usePathTracing();

  const [showResult, setShowResult] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const completeTimerRef = useRef(null);

  const tolerance = content.tolerance ?? 5;

  // Clear a pending completion timer if the activity unmounts.
  useEffect(() => {
    return () => clearTimeout(completeTimerRef.current);
  }, []);

  const strokeToPath = (points) => {
    if (points.length < 2) return '';
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  };

  // Live per-path coverage for visual feedback while tracing.
  const pathCoverage = useMemo(() => {
    return content.paths.map((path) => ({
      ...path,
      coverage: getPathCoverage(strokes, path.d, tolerance),
    }));
  }, [content.paths, strokes, tolerance]);

  const hasTraced = strokes.length > 0;

  // Once the result is shown, stop accepting new strokes during the reveal.
  const gatedPointerDown = showResult ? undefined : handlePointerDown;
  const gatedPointerMove = showResult ? undefined : handlePointerMove;
  const gatedPointerUp = showResult ? undefined : handlePointerUp;

  const handleSubmit = useCallback(() => {
    const score = calculateTraceScore(
      strokes,
      content.paths.map((path) => path.d),
      tolerance,
    );
    setShowResult(true);
    setAnnouncement(score >= 70 ? 'Nice tracing! Well done.' : 'Keep practicing!');
    completeTimerRef.current = setTimeout(() => onComplete(score), 1500);
  }, [strokes, content.paths, tolerance, onComplete]);

  return (
    <div
      data-testid="path-tracing-activity"
      className="brutal-card raised-glass-soft relative w-full max-w-5xl rounded-[2rem] bg-[#b85d33]/90 p-6 md:p-10"
    >
      <h2
        id="pt-instructions"
        className="text-2xl md:text-4xl font-black text-[var(--ink)] mb-6 text-center"
      >
        {content.instructions}
      </h2>

      <div className="relative w-full aspect-video rounded-[24px] overflow-hidden bg-white border-[3px] border-[var(--ink)] mb-6">
        <svg
          ref={svgRef}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full touch-none"
          onPointerDown={gatedPointerDown}
          onPointerMove={gatedPointerMove}
          onPointerUp={gatedPointerUp}
          onPointerLeave={gatedPointerUp}
          role="img"
          aria-label="Tracing area — draw along the shapes"
        >
          {/* Template paths */}
          {pathCoverage.map((path) => (
            <path
              key={path.id}
              d={path.d}
              fill="none"
              stroke={path.coverage > 0.5 ? 'var(--surface-mint)' : '#ddd'}
              strokeWidth={path.strokeWidth || 2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-colors duration-300"
            />
          ))}

          {/* Completed user strokes */}
          {strokes.map((stroke, i) => (
            <path
              key={i}
              d={strokeToPath(stroke)}
              fill="none"
              stroke="#ff7a59"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Live stroke while drawing */}
          {currentStroke.length > 1 && (
            <path
              d={strokeToPath(currentStroke)}
              fill="none"
              stroke="#ff7a59"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.7}
            />
          )}
        </svg>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <AccessibleButton
          onClick={undoStroke}
          disabled={!hasTraced || showResult}
          variant="white"
          className="px-6 py-3 text-sm"
        >
          UNDO
        </AccessibleButton>
        <AccessibleButton
          onClick={clearStrokes}
          disabled={!hasTraced || showResult}
          variant="white"
          className="px-6 py-3 text-sm"
        >
          CLEAR
        </AccessibleButton>
        <AccessibleButton
          onClick={handleSubmit}
          disabled={!hasTraced || showResult}
          variant="coral"
          className="px-8 py-3 text-sm"
        >
          DONE
        </AccessibleButton>
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
};

export default PathTracingActivity;
