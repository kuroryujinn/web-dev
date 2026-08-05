import React, { useMemo } from 'react';
import { useProgress } from '../../contexts/ProgressContext';
import { getLevelProgress } from '../../utils/progress';
import ActivityList from './ActivityList';
import AccessibleButton from '../shared/AccessibleButton';

const LevelScreen = ({ level, activities, onSelectActivity, onBack }) => {
  const { progress } = useProgress();

  const levelProgress = useMemo(() => {
    if (!progress || !activities) return { completed: 0, total: 0, percentage: 0 };
    const activityIds = activities.map((a) => a.id);
    return getLevelProgress(progress, activityIds);
  }, [progress, activities]);

  return (
    <div className="flex flex-col min-h-screen bg-transparent p-4 md:p-8">
      {/* Header */}
      <div className="w-full max-w-4xl mx-auto mb-8">
        <div
          className="brutal-card raised-glass-soft p-6 rounded-[2rem]"
          style={{ borderColor: level.color }}
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl" aria-hidden="true">{level.icon}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-[var(--ink)] tracking-tight">
                Level {level.order}: {level.title}
              </h1>
              <p className="text-lg text-[var(--ink-soft)] font-bold mt-1">
                {level.description}
              </p>
            </div>
          </div>

          {/* Level Progress Bar */}
          {activities && activities.length > 0 && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-black text-[var(--ink-soft)] uppercase">
                  Progress
                </span>
                <span className="text-sm font-black text-[var(--ink-soft)]">
                  {levelProgress.completed}/{levelProgress.total} ({levelProgress.percentage}%)
                </span>
              </div>
              <div className="w-full h-4 bg-white/60 rounded-full overflow-hidden border-[3px] border-[var(--ink)]">
                <div
                  className="h-full bg-[var(--surface-mint)] transition-all duration-500"
                  style={{ width: `${levelProgress.percentage}%` }}
                  role="progressbar"
                  aria-valuenow={levelProgress.percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Level progress: ${levelProgress.percentage}%`}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Activities */}
      <div className="w-full max-w-4xl mx-auto flex-1">
        <h2 className="text-2xl font-black text-[var(--ink)] mb-4">Activities</h2>
        <ActivityList
          activities={activities}
          progress={progress}
          onSelectActivity={onSelectActivity}
        />
      </div>

      {/* Back Button */}
      <div className="w-full max-w-4xl mx-auto mt-8">
        <AccessibleButton
          onClick={onBack}
          variant="white"
          className="px-6 py-3 text-sm"
        >
          ← BACK TO DASHBOARD
        </AccessibleButton>
      </div>
    </div>
  );
};

export default LevelScreen;