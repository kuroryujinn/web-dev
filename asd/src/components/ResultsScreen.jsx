import React from 'react';

const ResultsScreen = ({ user, score, totalQuestions, onPlayAgain, onBackToHome }) => {
  const percentage = (score / totalQuestions) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-transparent p-6 relative overflow-hidden">
      <div className="w-full max-w-4xl brutal-card raised-glass-soft p-8 md:p-14 rounded-[2rem] text-center relative z-10 bg-warm-peach/75">
        <div className="absolute top-0 left-0 w-full h-1 bg-[var(--ink)]"></div>
        
        <div className="mb-8">
          <span className="text-8xl md:text-[9rem] block mb-4">
            {user.avatar}
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-[var(--ink)] tracking-tight uppercase leading-none">
            SESSION <span className="text-[var(--ink-soft)]">{percentage >= 50 ? 'COMPLETE' : 'RETRY'}</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--ink-soft)] mt-3 font-black tracking-[0.18em] uppercase">
            Player {user.name}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center my-12">
          <div className="relative">
            <div className="relative brutal-card rounded-[1.5rem] w-52 h-52 md:w-64 md:h-64 flex flex-col items-center justify-center bg-warm-butter/80">
              <span className="text-6xl md:text-8xl font-black text-[var(--ink)] leading-none">{score}</span>
              <div className="w-12 h-1 bg-[var(--ink)] my-2 md:my-4"></div>
              <span className="text-2xl md:text-3xl font-black text-[var(--ink-soft)] leading-none">{totalQuestions}</span>
            </div>
          </div>
          <p className="mt-8 text-lg md:text-2xl font-black text-[var(--ink-soft)]">
            {percentage >= 80 ? 'Outstanding run.' : percentage >= 50 ? 'Solid progress.' : 'Keep practicing.'}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 justify-center w-full max-w-xl mx-auto">
          <button
            onClick={onPlayAgain}
            className="flex-1 brutal-button pressable px-8 py-4 text-xl font-black text-[var(--ink)] bg-[var(--surface-mint)] uppercase tracking-[0.1em]"
          >
            PLAY AGAIN
          </button>
          
          <button
            onClick={onBackToHome}
            className="flex-1 brutal-button pressable px-8 py-4 text-xl font-black text-[var(--ink)] bg-[var(--surface-sky)] uppercase tracking-[0.1em]"
          >
            HOME
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
