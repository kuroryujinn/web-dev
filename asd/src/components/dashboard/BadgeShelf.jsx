import React from 'react';
import { BADGES } from '../../data/badges';

const BadgeShelf = ({ badges = [] }) => {
  // Guard against null/undefined so callers can pass a raw progress field.
  const earnedIds = badges ?? [];
  if (!BADGES || BADGES.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {BADGES.map((badge) => {
        const earned = earnedIds.includes(badge.id);
        return (
          <div
            key={badge.id}
            className={`brutal-card p-4 rounded-xl text-center transition-all duration-200 ${
              earned ? 'bg-white' : 'bg-white/30 opacity-50'
            }`}
            aria-label={`${badge.title}${earned ? ' — Earned' : ' — Locked'}`}
          >
            <span className="text-3xl block mb-2" aria-hidden="true">{badge.icon}</span>
            <p className="text-xs font-black text-[var(--ink)] uppercase leading-tight">
              {badge.title}
            </p>
            {!earned && (
              <p className="text-[10px] font-bold text-[var(--ink-soft)] mt-1">Locked</p>
            )}
            {earned && (
              <p className="text-[10px] font-bold text-[var(--surface-mint)] mt-1">✓ Earned</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BadgeShelf;