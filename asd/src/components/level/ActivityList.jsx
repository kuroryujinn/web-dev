import React from 'react';
import ActivityCard from './ActivityCard';

const ActivityList = ({ activities = [], progress, accentColor, onSelectActivity }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="brutal-card p-8 rounded-xl text-center bg-white/50">
        <p className="text-lg font-black text-[var(--ink-soft)]">
          No activities available yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {activities.map((activity) => {
        const activityResult = progress?.activities?.[activity.id];
        const isCompleted = activityResult?.completed ?? false;
        const bestScore = activityResult?.bestScore ?? 0;

        return (
          <ActivityCard
            key={activity.id}
            activity={activity}
            isCompleted={isCompleted}
            bestScore={bestScore}
            accentColor={accentColor}
            onClick={() => onSelectActivity(activity)}
          />
        );
      })}
    </div>
  );
};

export default ActivityList;
