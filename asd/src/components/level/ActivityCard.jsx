import React from 'react';

// Friendly display labels for each activity type (9.2).
const TYPE_LABELS = {
  multipleChoice: 'Multiple Choice',
  dragAndDrop: 'Drag & Drop',
  pathTracing: 'Path Tracing',
  freehandDrawing: 'Drawing',
  sorting: 'Sorting',
  matching: 'Matching',
};

const ActivityCard = ({ activity, isCompleted, bestScore, accentColor, onClick }) => {
  // Guard against a missing best score so completed cards never show "undefined%".
  const score = bestScore ?? 0;
  const typeLabel = TYPE_LABELS[activity.type] || activity.type;

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
          <span
            data-testid="activity-type-chip"
            className={`activity-chip activity-chip--${activity.type}`}
            style={accentColor ? { backgroundColor: accentColor } : undefined}
          >
            {typeLabel}
          </span>
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
