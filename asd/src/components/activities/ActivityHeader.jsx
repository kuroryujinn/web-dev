import React from 'react';
import AccessibleButton from '../shared/AccessibleButton';
import { useTimer } from '../../hooks/useTimer';

/**
 * Activity header with title, optional countdown timer, and back navigation.
 * Uses the shared useTimer hook so the countdown is testable and reusable.
 */
const ActivityHeader = ({ title, timer, onBack, onTimeUp, score }) => {
  const { timeLeft, formattedTime } = useTimer({
    duration: timer,
    onTimeUp,
    autoStart: Boolean(timer),
  });

  return (
    <div className="w-full max-w-5xl mb-8 flex flex-col items-center relative z-10 brutal-card raised-glass-soft bg-warm-butter/70 p-4 md:p-6">
      <div className="w-full max-w-4xl flex justify-between items-center px-2 md:px-4">
        <AccessibleButton
          onClick={onBack}
          variant="white"
          className="px-4 py-2 text-sm"
          aria-label="Go back"
        >
          ← BACK
        </AccessibleButton>

        <h1 className="text-xl md:text-3xl font-black text-[var(--ink)] tracking-tight text-center flex-1 mx-4">
          {title}
        </h1>

        <div className="flex items-center gap-3">
          {score !== undefined && score !== null && (
            <div className="brutal-card px-4 py-2 bg-white" aria-label={`Score ${score}`}>
              <span className="text-lg font-black text-[var(--ink)] tabular-nums">{score}</span>
            </div>
          )}
          {timer && timeLeft !== null && (
            <div
              className="brutal-card px-4 py-2 bg-white"
              role="timer"
              aria-label={`Time remaining: ${formattedTime}`}
            >
              <span className="text-lg font-black text-[var(--ink)] tabular-nums">
                {formattedTime}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityHeader;
