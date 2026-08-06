import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { calculateMatchingScore } from '../../utils/scoring';
import AccessibleButton from '../shared/AccessibleButton';

/**
 * Matching activity (Levels 1–5): tap one item from each column to create a
 * pair. A visual connection line links matched items.
 *
 * - Tap/click with mouse, touch, or keyboard (native buttons: Tab + Enter).
 * - Either order works (left→right or right→left); tapping the selected item
 *   again deselects it, and matches can be changed before checking.
 * - Score = fraction of correct pairs (predictable feedback).
 * - Results are announced via a polite live region.
 */
const MatchingActivity = ({ content, onComplete }) => {
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matches, setMatches] = useState({});
  const [lines, setLines] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const completeTimerRef = useRef(null);
  const containerRef = useRef(null);
  const leftRefs = useRef({});
  const rightRefs = useRef({});

  // Clear a pending completion timer if the activity unmounts.
  useEffect(() => {
    return () => clearTimeout(completeTimerRef.current);
  }, []);

  const makeMatch = useCallback(
    (leftId, rightId) => {
      if (!leftId || !rightId) return;
      setMatches((prev) => (prev[leftId] === rightId ? prev : { ...prev, [leftId]: rightId }));
      const leftLabel = content.pairs.find((p) => p.left.id === leftId)?.left.label;
      const rightLabel = content.pairs.find((p) => p.right.id === rightId)?.right.label;
      setAnnouncement(`Matched ${leftLabel} with ${rightLabel}`);
      setSelectedLeft(null);
      setSelectedRight(null);
    },
    [content.pairs],
  );

  const handleLeftClick = (id) => {
    if (showResult) return;
    if (selectedLeft === id) {
      setSelectedLeft(null);
      return;
    }
    setSelectedLeft(id);
    if (selectedRight) makeMatch(id, selectedRight);
  };

  const handleRightClick = (id) => {
    if (showResult) return;
    if (selectedRight === id) {
      setSelectedRight(null);
      return;
    }
    setSelectedRight(id);
    if (selectedLeft) makeMatch(selectedLeft, id);
  };

  // Draw a connection line between each matched pair's button centers.
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const nextLines = Object.entries(matches)
      .map(([leftId, rightId]) => {
        const leftEl = leftRefs.current[leftId];
        const rightEl = rightRefs.current[rightId];
        if (!leftEl || !rightEl) return null;
        const leftRect = leftEl.getBoundingClientRect();
        const rightRect = rightEl.getBoundingClientRect();
        return {
          key: leftId,
          x1: leftRect.left - containerRect.left + leftRect.width / 2,
          y1: leftRect.top - containerRect.top + leftRect.height / 2,
          x2: rightRect.left - containerRect.left + rightRect.width / 2,
          y2: rightRect.top - containerRect.top + rightRect.height / 2,
        };
      })
      .filter(Boolean);
    setLines(nextLines);
  }, [matches]);

  const isAllMatched = content.pairs.every((pair) => matches[pair.left.id]);

  const handleSubmit = useCallback(() => {
    const pairs = content.pairs.map((pair) => ({
      leftId: pair.left.id,
      rightId: matches[pair.left.id],
      correct: matches[pair.left.id] === pair.right.id,
    }));
    const score = calculateMatchingScore(pairs);
    setShowResult(true);
    setAnnouncement(score >= 70 ? 'Great matching! Well done.' : 'Keep practicing!');
    completeTimerRef.current = setTimeout(() => onComplete(score), 1500);
  }, [content.pairs, matches, onComplete]);

  return (
    <div
      data-testid="matching-activity"
      className="brutal-card raised-glass-soft relative w-full max-w-5xl rounded-[2rem] bg-[#b85d33]/90 p-6 md:p-10"
    >
      <h2
        id="ma-instructions"
        className="text-2xl md:text-4xl font-black text-[var(--ink)] mb-6 text-center"
      >
        {content.instructions}
      </h2>

      <div
        ref={containerRef}
        className="relative grid grid-cols-2 gap-8 max-w-3xl mx-auto"
      >
        {/* Visual connection lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden="true"
          data-testid="match-lines"
        >
          {lines.map((line) => (
            <line
              key={line.key}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="var(--ink)"
              strokeWidth={4}
              strokeLinecap="round"
              opacity={0.35}
            />
          ))}
        </svg>

        {/* Left column */}
        <div className="flex flex-col gap-4 z-10">
          {content.pairs.map((pair) => {
            const correctRightId = pair.right.id;
            const isSelected = selectedLeft === pair.left.id;
            const isCorrect = showResult && matches[pair.left.id] === correctRightId;
            const isWrong =
              showResult && matches[pair.left.id] && matches[pair.left.id] !== correctRightId;
            const isMatched = !!matches[pair.left.id];

            return (
              <button
                key={pair.left.id}
                type="button"
                data-testid={`match-left-${pair.left.id}`}
                ref={(el) => {
                  leftRefs.current[pair.left.id] = el;
                }}
                onClick={() => handleLeftClick(pair.left.id)}
                aria-pressed={isSelected || undefined}
                className={`brutal-tile pressable p-4 rounded-xl text-center transition-all min-h-[48px] focus-visible:outline-4 focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2
                  ${isSelected ? 'bg-[var(--surface-butter)] -translate-y-1' : ''}
                  ${isCorrect ? 'bg-[var(--surface-mint)]' : ''}
                  ${isWrong ? 'bg-[var(--surface-coral)]' : ''}
                  ${!showResult && isMatched && !isSelected ? 'bg-[var(--surface-mint)] opacity-70' : ''}
                  ${!showResult && !isMatched && !isSelected ? 'bg-white/85 hover:bg-[var(--surface-sky)]' : ''}
                  ${showResult ? 'cursor-not-allowed' : ''}
                `}
                disabled={showResult}
              >
                {pair.left.image && (
                  <img
                    src={pair.left.image}
                    alt={pair.left.label}
                    className="w-12 h-12 object-contain mx-auto mb-2"
                  />
                )}
                <span className="font-black text-[var(--ink)]">{pair.left.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4 z-10">
          {content.pairs.map((pair) => {
            const correctLeftId = pair.left.id;
            const matchedLeftId = Object.keys(matches).find((k) => matches[k] === pair.right.id);
            const isSelected = selectedRight === pair.right.id;
            const isCorrect = showResult && matchedLeftId === correctLeftId;
            const isWrong = showResult && matchedLeftId && matchedLeftId !== correctLeftId;

            return (
              <button
                key={pair.right.id}
                type="button"
                data-testid={`match-right-${pair.right.id}`}
                ref={(el) => {
                  rightRefs.current[pair.right.id] = el;
                }}
                onClick={() => handleRightClick(pair.right.id)}
                aria-pressed={isSelected || undefined}
                className={`brutal-tile pressable p-4 rounded-xl text-center transition-all min-h-[48px] focus-visible:outline-4 focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2
                  ${isSelected ? 'bg-[var(--surface-butter)] -translate-y-1' : ''}
                  ${isCorrect ? 'bg-[var(--surface-mint)]' : ''}
                  ${isWrong ? 'bg-[var(--surface-coral)]' : ''}
                  ${!showResult && matchedLeftId && !isSelected ? 'bg-[var(--surface-mint)] opacity-70' : ''}
                  ${!showResult && !matchedLeftId && !isSelected ? 'bg-white/85 hover:bg-[var(--surface-sky)]' : ''}
                  ${showResult ? 'cursor-not-allowed' : ''}
                `}
                disabled={showResult}
              >
                {pair.right.image && (
                  <img
                    src={pair.right.image}
                    alt={pair.right.label}
                    className="w-12 h-12 object-contain mx-auto mb-2"
                  />
                )}
                <span className="font-black text-[var(--ink)]">{pair.right.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {!showResult && (
        <AccessibleButton
          onClick={handleSubmit}
          disabled={!isAllMatched}
          variant="coral"
          className="mt-8 w-full py-4 text-xl"
        >
          CHECK MATCHES
        </AccessibleButton>
      )}

      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
};

export default MatchingActivity;
