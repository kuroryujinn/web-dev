import React, { useCallback, useEffect, useRef, useState } from 'react';
import { calculateFreehandDrawingScore } from '../../utils/scoring';
import AccessibleButton from '../shared/AccessibleButton';

/**
 * Freehand drawing activity (Level 5 — self-expression): draw freely on a
 * canvas with a finger, stylus, or mouse.
 *
 * - Pointer events give unified touch + mouse support (`touch-none`).
 * - An optional light template path guides the drawing when provided.
 * - Strokes are recorded as point data, so UNDO can redraw the canvas.
 * - Score is effort-based (completed strokes), per the design spec.
 * - Results are announced via a polite live region.
 */
const FreehandDrawingActivity = ({ content, onComplete }) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef([]);
  const [strokes, setStrokes] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const completeTimerRef = useRef(null);

  const canvasWidth = content.canvasWidth ?? 800;
  const canvasHeight = content.canvasHeight ?? 450;
  const strokeWidth = content.strokeWidth ?? 4;

  // Cache the 2D context once on mount.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    ctxRef.current = canvas.getContext('2d');
  }, []);

  // Redraw the canvas whenever the stroke list changes (initial clear included).
  useEffect(() => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#1f1a17';
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    strokes.forEach((stroke) => {
      if (stroke.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      stroke.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.stroke();
    });
  }, [strokes, strokeWidth]);

  // Clear a pending completion timer if the activity unmounts.
  useEffect(() => {
    return () => clearTimeout(completeTimerRef.current);
  }, []);

  const getPos = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  }, []);

  const startDrawing = useCallback(
    (e) => {
      e.preventDefault();
      const ctx = ctxRef.current;
      if (!ctx) return;
      // Track the pointer so the stroke continues even if the finger or
      // stylus leaves the canvas mid-gesture (key for tablet drawing).
      if (e.pointerId != null && typeof e.currentTarget.setPointerCapture === 'function') {
        e.currentTarget.setPointerCapture(e.pointerId);
      }
      const pos = getPos(e);
      currentStrokeRef.current = [pos];
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      isDrawingRef.current = true;
    },
    [getPos],
  );

  // A ref guard (rather than state) so the first move events of a fast
  // stroke are never dropped between pointerdown and the next render.
  const draw = useCallback(
    (e) => {
      if (!isDrawingRef.current) return;
      e.preventDefault();
      const ctx = ctxRef.current;
      if (!ctx) return;
      const pos = getPos(e);
      currentStrokeRef.current.push(pos);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    },
    [getPos],
  );

  const stopDrawing = useCallback((e) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    if (
      e?.currentTarget &&
      e.pointerId != null &&
      typeof e.currentTarget.hasPointerCapture === 'function' &&
      e.currentTarget.hasPointerCapture(e.pointerId)
    ) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    const stroke = currentStrokeRef.current;
    currentStrokeRef.current = [];
    if (stroke.length > 0) {
      setStrokes((prev) => [...prev, stroke]);
    }
  }, []);

  const clearCanvas = useCallback(() => {
    setStrokes([]);
  }, []);

  const undoStroke = useCallback(() => {
    setStrokes((prev) => prev.slice(0, -1));
  }, []);

  const hasDrawn = strokes.length > 0;

  // Once the result is shown, stop accepting new strokes during the reveal.
  const gatedPointerDown = showResult ? undefined : startDrawing;
  const gatedPointerMove = showResult ? undefined : draw;
  const gatedPointerUp = showResult ? undefined : stopDrawing;

  const handleSubmit = useCallback(() => {
    const score = calculateFreehandDrawingScore(strokes.length);
    setShowResult(true);
    setAnnouncement(
      score >= 70 ? 'Beautiful drawing! Well done.' : 'Keep drawing! You can do it.',
    );
    completeTimerRef.current = setTimeout(() => onComplete(score), 1500);
  }, [strokes.length, onComplete]);

  return (
    <div
      data-testid="freehand-drawing-activity"
      className="brutal-card raised-glass-soft relative w-full max-w-5xl rounded-[2rem] bg-[#b85d33]/90 p-6 md:p-10"
    >
      <h2
        id="fd-instructions"
        className="text-2xl md:text-4xl font-black text-[var(--ink)] mb-6 text-center"
      >
        {content.instructions}
      </h2>

      <div className="relative w-full aspect-video rounded-[24px] overflow-hidden bg-white border-[3px] border-[var(--ink)] mb-6">
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="w-full h-full touch-none cursor-crosshair"
          onPointerDown={gatedPointerDown}
          onPointerMove={gatedPointerMove}
          onPointerUp={gatedPointerUp}
          onPointerLeave={gatedPointerUp}
          role="img"
          aria-label="Drawing area — draw freely"
        />
        {content.template && (
          <svg
            viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden="true"
          >
            <path
              d={content.template}
              fill="none"
              stroke="var(--ink-soft)"
              strokeWidth={strokeWidth}
              strokeOpacity={0.35}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <AccessibleButton
          onClick={undoStroke}
          disabled={!hasDrawn || showResult}
          variant="white"
          className="px-6 py-3 text-sm"
        >
          UNDO
        </AccessibleButton>
        <AccessibleButton
          onClick={clearCanvas}
          disabled={!hasDrawn || showResult}
          variant="white"
          className="px-6 py-3 text-sm"
        >
          CLEAR
        </AccessibleButton>
        <AccessibleButton
          onClick={handleSubmit}
          disabled={!hasDrawn || showResult}
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

export default FreehandDrawingActivity;
