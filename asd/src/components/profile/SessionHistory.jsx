import React from 'react';

/**
 * List of recently completed activities, most recent first.
 *
 * @param {object} progress - Progress document (activities: { id: { bestScore, stars, attempts, completed, lastAttempted } })
 * @param {object} activityTitles - Optional map of activityId -> display title
 */
const SessionHistory = ({ progress, activityTitles = {} }) => {
  const sessions = Object.entries(progress?.activities ?? {})
    .filter(([, result]) => result.completed)
    .sort(
      ([, a], [, b]) =>
        new Date(b.lastAttempted ?? 0) - new Date(a.lastAttempted ?? 0),
    );

  if (sessions.length === 0) {
    return (
      <div className="brutal-card p-8 rounded-xl text-center bg-white/50">
        <p className="text-lg font-black text-[var(--ink-soft)]">
          No activities yet — complete your first activity to see it here!
        </p>
      </div>
    );
  }

  const formatDate = (iso) => {
    if (!iso) return 'Recently';
    const date = new Date(iso);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <ul className="flex flex-col gap-3">
      {sessions.map(([activityId, result]) => {
        const title = activityTitles[activityId] || activityId;
        return (
          <li
            key={activityId}
            className="brutal-card p-4 rounded-xl bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2"
          >
            <div className="min-w-0">
              <p className="font-black text-[var(--ink)] truncate">{title}</p>
              <p className="text-xs font-bold text-[var(--ink-soft)] mt-1">
                {formatDate(result.lastAttempted)} &bull; Attempts: {result.attempts}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-sm font-black text-[var(--surface-mint)] tabular-nums">
                {result.bestScore}%
              </span>
              <span className="text-sm font-black text-[var(--ink-soft)] tabular-nums">
                {result.stars > 0 ? '⭐ '.repeat(result.stars) : '—'}
                {result.stars} stars
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default SessionHistory;
