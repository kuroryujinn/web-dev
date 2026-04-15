import React, { useMemo, useState } from 'react';
import AnswerTile from './AnswerTile';

const QuestionCard = ({ question, onAnswerSelect, selectedAnswer }) => {
  const [questionImageFailed, setQuestionImageFailed] = useState(false);

  const shuffledOptions = useMemo(() => {
    const options = [...question.options];
    if (options.length <= 1) return options;

    const offset = question.id % options.length;
    return [...options.slice(offset), ...options.slice(0, offset)];
  }, [question.id, question.options]);

  return (
    <div
      data-testid="question-panel"
      data-layer="question"
      className="brutal-card raised-glass-soft relative w-full max-w-5xl rounded-[2rem] bg-[#c66a3d]/90 p-6 md:p-10 lg:p-12"
      style={{ background: '#b85d33' }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(transparent_49%,rgba(31,26,23,0.03)_50%)] bg-[length:100%_4px] pointer-events-none"></div>

      {/* Dynamic Header */}
      <div className="flex flex-col items-center mb-10 relative z-10">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-[var(--ink)] mb-8 text-center tracking-tight leading-tight max-w-4xl">
          {question.questionLabel}
        </h2>
        
        <div className="relative w-full aspect-video md:aspect-[21/9] rounded-[24px] overflow-hidden bg-[var(--bg-warm)] border-[3px] border-[var(--ink)] flex items-center justify-center shadow-[inset_0_0_0_3px_rgba(255,255,255,0.35)]">
          {question.questionImage && !questionImageFailed ? (
            <img
              src={question.questionImage}
              alt={question.questionAlt}
              className="w-full h-full object-contain p-6 md:p-10 transition-all duration-300"
              onError={() => setQuestionImageFailed(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-10 text-center text-[var(--ink-soft)]">
              <span className="text-5xl mb-4">NO PREVIEW</span>
              <p className="text-xl font-black uppercase tracking-[0.2em]">{question.questionAlt || question.questionLabel}</p>
            </div>
          )}
        </div>
      </div>

      {/* Answer Grid */}
      <div className="flex flex-col gap-5 md:gap-6 relative z-20 w-full max-w-5xl mx-auto">
        {shuffledOptions.map((option) => (
          <AnswerTile
            key={`${question.id}-${option.id}`}
            option={option}
            onSelect={() => onAnswerSelect(option)}
            isSelected={selectedAnswer?.id === option.id}
            isCorrect={option.correct}
            showResult={selectedAnswer !== null}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
