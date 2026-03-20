import React from 'react';

export const ResultScreen = ({ score, totalQuestions, onRestart, onHome }) => {
  let message = '';
  let icon = '';

  if (score >= totalQuestions * 0.8) {
    message = "Amazing work! You're a Quiz Star!";
    icon = "⭐⭐⭐";
  } else if (score >= totalQuestions * 0.5) {
    message = "Great effort! You're doing really well!";
    icon = "🌟";
  } else {
    message = "Good try! Practice makes perfect!";
    icon = "💪";
  }

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-bg-card rounded-2xl border border-gray-100 shadow-sm max-w-[600px] w-full">
      <div className="text-6xl mb-6" role="img" aria-label="Result Icon">{icon}</div>
      
      <h2 className="text-3xl font-bold text-text-primary mb-2">Quiz Complete!</h2>
      <p className="text-2xl text-accent-blue font-bold mb-6">
        You got {score} out of {totalQuestions}! 🎉
      </p>
      
      <p className="text-xl text-text-secondary mb-10">
        {message}
      </p>

      <div className="flex flex-col gap-4 w-full md:w-auto">
        <button
          onClick={onRestart}
          className="px-8 py-4 bg-correct-green text-white text-xl font-bold rounded-xl 
                     hover:bg-green-600 active:bg-green-700 transition-colors shadow-sm
                     min-h-[60px]"
        >
          Play Again
        </button>
        <button
          onClick={onHome}
          className="px-8 py-4 bg-gray-100 text-text-secondary text-xl font-bold rounded-xl 
                     hover:bg-gray-200 active:bg-gray-300 transition-colors
                     min-h-[60px]"
        >
          Back to Start
        </button>
      </div>
    </div>
  );
};
