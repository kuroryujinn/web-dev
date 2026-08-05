import React from 'react';
import AccessibleButton from '../shared/AccessibleButton';

const ActivityCard = ({ activity, isCompleted, bestScore, onClick }) => {
  // Guard against a missing best score so completed cards never show "undefined%".
  const score = bestScore ?? 0;

  return (
    <button
      onClick={onClick}
      className={`brutal-card p-5 rounded-xl transition-all text-left w-full
        focus-visible:outline-4 focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2
        cursor-pointer hover:-translate-y-1 active:translate-y-1
      `}
      aria-label={`${activity.title}${isCompleted ? ` — Completed, ${score}%` : ''}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-black text-[var(--ink)]">{activity.title}</h3>
          <p className="text-sm font-bold text-[var(--ink-soft)] mt-1">
            {activity.description || activity.type}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {activity.timeLimit && (
            <span className="text-xs font-black text-[var(--ink-soft)] uppercase">
              {activity.timeLimit}s
            </span>
          )}
          {isCompleted && (
            <span className="text-sm font-black text-[var(--surface-mint)]">
              {score}%
            </span>
          )}
          <span className="text-2xl" aria-hidden="true">
            {isCompleted ? '✅' : '▶️'}
          </span>
        </div>
      </div>
    </button>
  );
};

export default ActivityCard;