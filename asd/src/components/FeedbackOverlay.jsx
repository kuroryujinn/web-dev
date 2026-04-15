import React from 'react';

const FeedbackOverlay = ({ isCorrect, feedback, onNext }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(31,26,23,0.35)] p-6 backdrop-blur-[2px]">
      <div className={`brutal-card raised-glass-soft w-full max-w-3xl rounded-[2rem] p-8 md:p-12 text-center ${
        isCorrect
          ? 'bg-warm-mint'
          : 'bg-warm-coral'
      }`}>
        <div className="text-7xl mb-6">
          {isCorrect ? '🌟' : '🧠'}
        </div>
        
        <h2 className={`text-4xl md:text-6xl font-black mb-4 uppercase tracking-[0.04em] ${
          isCorrect ? 'text-[var(--ink)]' : 'text-[var(--ink)]'
        }`}>
          {isCorrect ? 'NICE WORK!' : 'TRY AGAIN!'}
        </h2>

        <p className="text-xl md:text-3xl font-black text-[var(--ink-soft)] mb-10 leading-relaxed max-w-2xl mx-auto">
          {feedback}
        </p>

        <button
          onClick={onNext}
          className="brutal-button pressable w-full py-4 text-2xl md:text-3xl font-black text-[var(--ink)] bg-[var(--surface-butter)] uppercase tracking-[0.16em]"
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
};

export default FeedbackOverlay;
