import React, { useState, useCallback } from 'react';
import ActivityHeader from './ActivityHeader';
import MultipleChoiceActivity from './MultipleChoiceActivity';
import DragAndDropActivity from './DragAndDropActivity';
import FeedbackOverlay from '../shared/FeedbackOverlay';
import AccessibleButton from '../shared/AccessibleButton';
import { calculateStars, calculateXP } from '../../utils/scoring';

/**
 * Activity registry maps an activity `type` to its rendering component.
 * Milestone 4 fills this in as each activity component lands. Types not yet
 * implemented render a friendly placeholder instead of breaking the player.
 */
const DEFAULT_REGISTRY = {
  multipleChoice: MultipleChoiceActivity,
  dragAndDrop: DragAndDropActivity,
};

const ActivityPlayer = ({
  activity,
  onComplete,
  onBack,
  registry = DEFAULT_REGISTRY,
}) => {
  const [score, setScore] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({ isCorrect: false, message: '' });

  const ActivityComponent = registry[activity.type];

  const handleComplete = useCallback(
    (activityScore) => {
      setScore(activityScore);
      setFeedback({
        isCorrect: activityScore >= 70,
        message:
          activityScore >= 90
            ? activity.content?.feedback?.correct || 'Excellent work!'
            : activityScore >= 70
            ? 'Good job! Keep practicing!'
            : activity.content?.feedback?.incorrect || 'Keep trying!',
      });
      setShowFeedback(true);
    },
    [activity],
  );

  const handleContinue = useCallback(() => {
    const stars = calculateStars(score);
    const xp = calculateXP(activity.difficulty, stars);
    onComplete({ score, stars, xp, activityId: activity.id });
  }, [score, activity, onComplete]);

  const handleTimeUp = useCallback(() => {
    // Time expired — complete with whatever score was reached (0 if none).
    // Guard against re-completing after the user has already finished.
    if (showFeedback) return;
    handleComplete(score ?? 0);
  }, [score, showFeedback, handleComplete]);

  // Unimplemented activity types get a friendly placeholder.
  if (!ActivityComponent) {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-screen bg-transparent p-4">
        <div className="brutal-card raised-glass-soft w-full max-w-xl rounded-[2rem] bg-warm-butter/70 p-8 md:p-12 text-center">
          <span className="text-7xl block mb-6" aria-hidden="true">
            🧩
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-[var(--ink)] uppercase mb-4 tracking-tight">
            COMING SOON
          </h1>
          <p className="text-lg text-[var(--ink-soft)] font-bold mb-8">
            This activity type is being prepared. Please check back soon!
          </p>
          <AccessibleButton onClick={onBack} variant="sky" className="w-full py-4 text-xl">
            GO BACK
          </AccessibleButton>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-start py-8 lg:py-12 min-h-screen bg-transparent p-4 lg:p-10 w-full overflow-x-hidden">
      <ActivityHeader
        title={activity.title}
        timer={activity.timeLimit}
        onBack={onBack}
        onTimeUp={handleTimeUp}
      />

      <div className="w-full max-w-[90vw] flex-1 flex flex-col items-center">
        <ActivityComponent content={activity.content} onComplete={handleComplete} />
      </div>

      {showFeedback && (
        <FeedbackOverlay
          isCorrect={feedback.isCorrect}
          feedback={feedback.message}
          onNext={handleContinue}
        />
      )}
    </div>
  );
};

export default ActivityPlayer;
