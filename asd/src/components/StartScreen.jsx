import React from 'react';

export const StartScreen = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6 space-y-6">
      {/* Friendly Icon */}
      <div className="text-6xl mb-4" role="img" aria-label="Star">🌟</div>
      
      <h1 className="text-4xl md:text-5xl font-bold text-text-primary">
        Quiz Time!
      </h1>
      
      <p className="text-xl text-text-secondary max-w-sm">
        Let's answer some fun questions!
      </p>

      <button
        onClick={onStart}
        className="mt-8 px-10 py-4 bg-accent-blue text-white text-xl font-bold rounded-xl 
                   hover:bg-blue-600 active:bg-blue-700 transition-colors 
                   min-h-[60px] min-w-[200px] shadow-sm"
        aria-label="Start Quiz"
      >
        Start Quiz
      </button>
    </div>
  );
};
