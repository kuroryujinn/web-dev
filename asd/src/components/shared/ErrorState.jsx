import React from 'react';
import AccessibleButton from './AccessibleButton';

/**
 * Friendly error state card (9.6) with an optional retry action.
 * Shown on screens whose data failed to load (e.g. progress unavailable).
 */
const ErrorState = ({ title = "Something went wrong", message, onRetry }) => (
  <div
    role="alert"
    data-testid="error-state"
    className="w-full max-w-xl mx-auto"
  >
    <div className="brutal-card raised-glass-soft bg-warm-coral/70 p-8 rounded-[2rem] text-center">
      <div className="text-6xl mb-4" aria-hidden="true">
        😕
      </div>
      <h2 className="text-2xl md:text-3xl font-black text-[var(--ink)]">
        {title}
      </h2>
      {message && (
        <p className="mt-2 text-base md:text-lg font-bold text-[var(--ink-soft)]">
          {message}
        </p>
      )}
      {onRetry && (
        <AccessibleButton
          onClick={onRetry}
          variant="coral"
          className="mt-6 px-8 py-3"
        >
          ↻ RETRY
        </AccessibleButton>
      )}
    </div>
  </div>
);

export default ErrorState;
