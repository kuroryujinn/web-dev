import React from 'react';

const QuickStats = ({ progress }) => {
  const stats = [
    { label: 'Total XP', value: progress?.totalXP ?? 0, icon: '⚡' },
    { label: 'Activities', value: Object.keys(progress?.activities ?? {}).length, icon: '🎯' },
    { label: 'Streak', value: `${progress?.streak ?? 0} days`, icon: '🔥' },
    { label: 'Badges', value: progress?.badges?.length ?? 0, icon: '🏆' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

export default QuickStats;