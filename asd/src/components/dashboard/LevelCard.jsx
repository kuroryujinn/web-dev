import React from 'react';

const LevelCard = ({ level, isUnlocked, isCurrent, isCompleted, onClick }) => {
  return (
    <button
      onClick={isUnlocked ? onClick : undefined}
      disabled={!isUnlocked}
      className={`brutal-card p-6 rounded-[1.5rem] transition-all text-left w-full
        focus-visible:outline-4 focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2
        ${isUnlocked ? 'cursor-pointer hover:-translate-y-1 active:translate-y-1' : 'opacity-50 cursor-not-allowed'}
      `}
      style={{ borderColor: isUnlocked ? level.color : undefined }}
      aria-label={`Level ${level.order}: ${level.title}${isCompleted ? ' — Completed' : isCurrent ? ' — In Progress' : !isUnlocked ? ' — Locked' : ''}`}
    >
      <div className="flex items-center gap-4 mb-4">
        <span className="text-4xl" aria-hidden="true">{level.icon}</span>
        <div>
          <h3 className="text-xl font-black text-[var(--ink)]">Level {level.order}</h3>
          <p className="text-sm font-bold text-[var(--ink-soft)]">{level.title}</p>
        </div>
      </div>

      <p className="text-sm text-[var(--ink-soft)] mb-4">{level.description}</p>

      <div className="flex flex-wrap gap-2">
        {!isUnlocked && (
          <div className="brutal-card inline-block px-4 py-2 bg-white/50">
            <span className="text-sm font-black text-[var(--ink-soft)]">
              🔒 {level.unlockXP} XP needed
            </span>
          </div>
        )}

        {isCompleted && (
          <div className="brutal-card inline-block px-4 py-2 bg-[var(--surface-mint)]">
            <span className="text-sm font-black text-[var(--ink)]">✓ COMPLETED</span>
          </div>
        )}

        {isCurrent && isUnlocked && !isCompleted && (
          <div className="brutal-card inline-block px-4 py-2 bg-[var(--surface-butter)]">
            <span className="text-sm font-black text-[var(--ink)]">▶ IN PROGRESS</span>
          </div>
        )}
      </div>
    </button>
  );
};

export default LevelCard;