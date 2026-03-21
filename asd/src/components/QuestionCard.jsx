import React, { useEffect, useMemo, useState } from 'react';
import AnswerTile from './AnswerTile';

const QuestionCard = ({ question, onAnswerSelect, selectedAnswer }) => {
  const [questionImageFailed, setQuestionImageFailed] = useState(false);

  useEffect(() => {
    setQuestionImageFailed(false);
  }, [question.id, question.questionImage]);

  const shuffledOptions = useMemo(() => {
    const options = [...question.options];
    for (let i = options.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return options;
  }, [question.id]);

  return (
    <div className="w-full max-w-7xl glass-card rounded-[80px] p-12 md:p-24 lg:p-32 border-[24px] border-white/5 relative overflow-hidden shadow-[0_0_100px_rgba(34,211,238,0.15)]">
      {/* Scanline Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-[1] pointer-events-none bg-[length:100%_4px,3px_100%]"></div>

      {/* Dynamic Header */}
      <div className="flex flex-col items-center mb-24 relative z-10 transition-all">
        <h2 className="text-5xl md:text-8xl lg:text-9xl font-black text-white mb-16 text-center tracking-tighter leading-none max-w-6xl drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          {question.questionLabel}
        </h2>
        
        {/* Modern Image Container */}
        <div className="relative w-full aspect-video md:aspect-[24/10] rounded-[64px] overflow-hidden bg-black/40 border-[20px] border-white/5 flex items-center justify-center shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] group transition-all duration-700 hover:border-cyan-500/30">
          <div className="absolute inset-0 bg-cyan-900/10 mix-blend-overlay transition-opacity group-hover:opacity-0"></div>
          {!questionImageFailed ? (
            <img
              src={question.questionImage}
              alt={question.questionAlt}
              className="w-full h-full object-contain p-10 md:p-20 transition-all duration-1000 group-hover:scale-110 brightness-90 group-hover:brightness-110 contrast-125"
              onError={() => setQuestionImageFailed(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-20 text-center text-cyan-900/40">
              <span className="text-9xl mb-12 grayscale opacity-20">SYSTEM_IMAGE_MISSING</span>
              <p className="text-4xl font-black uppercase tracking-[0.5em]">{question.questionAlt}</p>
            </div>
          )}
          {/* Neon Corner Accents */}
          <div className="absolute top-0 left-0 w-24 h-24 border-t-8 border-l-8 border-cyan-500/50 rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 border-b-8 border-r-8 border-purple-500/50 rounded-br-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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
