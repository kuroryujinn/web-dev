import React from 'react';

/**
 * Badges earned on this completion. Renders nothing when there are none
 * (so the results screen stays calm when no new badge was earned).
 */
const BadgesEarned = ({ badges = [] }) => {
  if (badges.length === 0) return null;

  return (
    <div className="my-6">
      <h3 className="text-sm font-black text-[var(--ink-soft)] uppercase tracking-[0.2em] mb-3">
        Badges Earned
      </h3>
      <ul className="flex justify-center gap-3 flex-wrap">
        {badges.map((badge) => (
          <li
            key={badge.id}
            className="brutal-card p-3 rounded-xl bg-white text-center min-w-[90px]"
          >
            <span className="text-3xl block" aria-hidden="true">
              {badge.icon}
            </span>
            <p className="text-xs font-bold mt-1">{badge.title}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BadgesEarned;
