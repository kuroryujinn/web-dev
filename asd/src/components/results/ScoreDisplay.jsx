import React from 'react';

/**
 * Large score tile showing the score out of a total (neo-brutal style).
 */
const ScoreDisplay = ({ score, total }) => (
  <div className="flex flex-col items-center justify-center my-6">
    <div className="brutal-card rounded-[1.5rem] w-48 h-48 md:w-56 md:h-56 flex flex-col items-center justify-center bg-warm-butter/80">
      <span className="text-5xl md:text-7xl font-black text-[var(--ink)] leading-none tabular-nums">
        {score}
      </span>
      <div className="w-12 h-1 bg-[var(--ink)] my-2" />
      <span className="text-xl md:text-2xl font-black text-[var(--ink-soft)] leading-none tabular-nums">
        {total}
      </span>
    </div>
  </div>
);

export default ScoreDisplay;
