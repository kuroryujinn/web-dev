import React from 'react';

/**
 * Detailed stats for the user profile screen.
 * Pure presentational — reads from the progress document.
 */
const UserStats = ({ progress }) => {
  const completedCount = Object.values(progress?.activities ?? {}).filter(
    (a) => a.completed,
  ).length;

  const stats = [
    { label: 'Total XP', value: progress?.totalXP ?? 0, icon: '⚡' },
    { label: 'Current Level', value: progress?.currentLevel ?? 1, icon: '🎯' },
    { label: 'Activities', value: completedCount, icon: '🕹️' },
    { label: 'Badges', value: progress?.badges?.length ?? 0, icon: '🏆' },
    { label: 'Day Streak', value: progress?.streak ?? 0, icon: '🔥' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="brutal-card raised-glass-soft p-4 rounded-xl text-center bg-white"
        >
          <span className="text-2xl block mb-1" aria-hidden="true">{stat.icon}</span>
          <span className="text-2xl font-black text-[var(--ink)] block tabular-nums">
            {stat.value}
          </span>
          <span className="text-xs font-black text-[var(--ink-soft)] uppercase tracking-wider">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default UserStats;
