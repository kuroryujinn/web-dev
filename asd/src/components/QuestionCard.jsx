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
    <div className="w-full max-w-5xl glass-card rounded-[40px] p-8 md:p-12 lg:p-16 border-[12px] border-slate-200/50 relative overflow-hidden shadow-[0_0_60px_rgba(14,165,233,0.05)]">
      {/* Scanline Effect - Subtler for light mode */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,0.02)_50%)] z-[1] pointer-events-none bg-[length:100%_4px]"></div>

      {/* Dynamic Header */}
      <div className="flex flex-col items-center mb-12 relative z-10 transition-all">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-800 mb-8 text-center tracking-tight leading-tight max-w-4xl">
          {question.questionLabel}
        </h2>
        
        {/* Modern Image Container */}
        <div className="relative w-full aspect-video md:aspect-[21/9] rounded-[32px] overflow-hidden bg-slate-200/30 border-[10px] border-slate-100 flex items-center justify-center shadow-[inset_0_0_30px_rgba(0,0,0,0.05)] group transition-all duration-700 hover:border-sky-500/20">
          <div className="absolute inset-0 bg-sky-200/5 mix-blend-overlay transition-opacity group-hover:opacity-0"></div>
          {!questionImageFailed ? (
            <img
              src={question.questionImage}
              alt={question.questionAlt}
              className="w-full h-full object-contain p-6 md:p-10 transition-all duration-1000 group-hover:scale-105 brightness-100 group-hover:brightness-105"
              onError={() => setQuestionImageFailed(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-10 text-center text-slate-400">
              <span className="text-6xl mb-6 grayscale opacity-20">IMAGE_NOT_FOUND</span>
              <p className="text-2xl font-black uppercase tracking-[0.3em]">{question.questionAlt}</p>
            </div>
          )}
          {/* Neon Corner Accents */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-sky-500/30 rounded-tl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-purple-500/30 rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </div>

      {/* Answer Grid */}
      <div className="flex flex-col gap-8 md:gap-10 relative z-10 w-full max-w-5xl mx-auto">
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
