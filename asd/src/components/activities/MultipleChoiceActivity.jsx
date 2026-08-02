import React, { useState, useMemo, useEffect, useRef } from 'react';
import AnswerTile from '../shared/AnswerTile';

/**
 * Multiple choice activity: one question with several selectable options.
 * Keyboard accessible (native buttons → Tab + Enter/Space) with a polite
 * live region that announces the result after selection.
 */
const MultipleChoiceActivity = ({ content, onComplete }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const completeTimerRef = useRef(null);

  // Clear any pending completion timer if the activity unmounts (e.g. user
  // navigates back before the reveal delay elapses).
  useEffect(() => {
    return () => clearTimeout(completeTimerRef.current);
  }, []);

  // Rotate options deterministically so order varies per question but is
  // stable across re-renders (avoids Date.now()-style test flakiness).
  const shuffledOptions = useMemo(() => {
    const options = [...content.options];
    if (options.length <= 1) return options;
    const offset = options.reduce((sum, o) => sum + o.label.length, 0) % options.length;
    return [...options.slice(offset), ...options.slice(0, offset)];
  }, [content.options]);

  const handleSelect = (option) => {
    if (showResult) return;
    setSelectedAnswer(option);
    setShowResult(true);
    setAnnouncement(option.correct ? 'Correct! Great job.' : 'Not quite. Keep trying.');

    const score = option.correct ? 100 : 0;
    completeTimerRef.current = setTimeout(() => onComplete(score), 1500);
  };

  return (
    <div
      data-testid="multiple-choice-activity"
      role="group"
      aria-labelledby="mc-question"
      className="brutal-card raised-glass-soft relative w-full max-w-5xl rounded-[2rem] bg-[#b85d33]/90 p-6 md:p-10 lg:p-12"
    >
      <div className="flex flex-col items-center mb-10 relative z-10">
        <h2
          id="mc-question"
          className="text-3xl md:text-5xl lg:text-6xl font-black text-[var(--ink)] mb-8 text-center tracking-tight leading-tight max-w-4xl"
        >
          {content.questionLabel}
        </h2>

        {content.questionImage && (
          <div className="relative w-full aspect-video md:aspect-[21/9] rounded-[24px] overflow-hidden bg-[var(--bg-warm)] border-[3px] border-[var(--ink)] flex items-center justify-center mb-8">
            <img
              src={content.questionImage}
              alt={content.questionAlt || content.questionLabel}
              className="w-full h-full object-contain p-6"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-5 md:gap-6 relative z-20 w-full max-w-5xl mx-auto">
        {shuffledOptions.map((option) => (
          <AnswerTile
            key={option.id}
            option={option}
            onSelect={() => handleSelect(option)}
            isSelected={selectedAnswer?.id === option.id}
            isCorrect={option.correct}
            showResult={showResult}
          />
        ))}
      </div>

      {/* Polite live region announces results to screen readers. */}
      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
};

export default MultipleChoiceActivity;
