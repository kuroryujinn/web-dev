import React from 'react';
import LevelCard from './LevelCard';
import { LEVELS } from '../../data/levels';

const LevelGrid = ({ currentLevel, totalXP, onSelectLevel }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {LEVELS.map((level) => {
        const isUnlocked = totalXP >= level.unlockXP;
        const isCurrent = level.order === currentLevel;
        const isCompleted = level.order < currentLevel;

        return (
          <LevelCard
            key={level.id}
            level={level}
            isUnlocked={isUnlocked}
            isCurrent={isCurrent}
            isCompleted={isCompleted}
            onClick={() => onSelectLevel(level)}
          />
        );
      })}
    </div>
  );
};

export default LevelGrid;