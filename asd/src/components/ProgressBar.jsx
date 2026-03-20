import React from 'react';

export const ProgressBar = ({ current, total }) => {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-end mb-2">
        <span className="text-lg font-bold text-text-secondary" aria-live="polite">
          Question {current} of {total}
        </span>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-accent-blue rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin="1"
          aria-valuemax={total}
        />
      </div>
    </div>
  );
};
