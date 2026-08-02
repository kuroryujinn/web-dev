import React from 'react';
import AccessibleButton from '../shared/AccessibleButton';
import ScoreDisplay from './ScoreDisplay';
import StarsEarned from './StarsEarned';
import BadgesEarned from './BadgesEarned';

/**
 * End-of-activity results summary. Shows score, stars, XP gained, and any
 * badges earned on this completion, with PLAY AGAIN / HOME actions.
 */
const ResultsScreen = ({
  score,
  totalQuestions = 100,
  stars,
  xp,
  activityTitle,
  earnedBadges = [],
  onPlayAgain,
  onBackToHome,
}) => {
  const passed = score >= 70;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-transparent p-6 relative overflow-hidden">
      <div className="w-full max-w-4xl brutal-card raised-glass-soft p-8 md:p-14 rounded-[2rem] text-center relative z-10 bg-warm-peach/75">
        <div className="absolute top-0 left-0 w-full h-1 bg-[var(--ink)]" />

        <h1 className="text-4xl md:text-6xl font-black text-[var(--ink)] tracking-tight uppercase leading-none mb-2">
          {passed ? 'SESSION COMPLETE' : 'KEEP PRACTICING'}
        </h1>
        <p className="text-lg md:text-xl text-[var(--ink-soft)] font-black tracking-[0.18em] uppercase mb-8">
          {activityTitle}
        </p>

        <div aria-live="polite">
          <ScoreDisplay score={score} total={totalQuestions} />
          <StarsEarned stars={stars} />
        </div>

        <div className="my-8">
          <div className="brutal-card inline-block px-6 py-3 bg-warm-mint/50">
            <span className="text-2xl font-black text-[var(--ink)] tabular-nums">+{xp} XP</span>
          </div>
        </div>

        <BadgesEarned badges={earnedBadges} />

        <div className="flex flex-col md:flex-row gap-6 justify-center w-full max-w-xl mx-auto mt-8">
          <AccessibleButton onClick={onPlayAgain} variant="mint" className="flex-1 py-4 text-xl">
            PLAY AGAIN
          </AccessibleButton>
          <AccessibleButton onClick={onBackToHome} variant="sky" className="flex-1 py-4 text-xl">
            HOME
          </AccessibleButton>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
