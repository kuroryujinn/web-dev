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
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#EEF4FB] p-4 md:p-8">
      <div className="w-full max-w-4xl bg-white rounded-[32px] shadow-2xl p-8 md:p-16 border-4 border-white text-center flex flex-col items-center">
        <div className="text-8xl md:text-9xl mb-10 animate-pulse" role="img" aria-label="Result Icon">{icon}</div>
        
        <h2 className="text-4xl md:text-6xl font-black text-gray-800 mb-4 tracking-tight">Quiz Complete!</h2>
        
        <div className="bg-blue-50 px-8 py-6 rounded-3xl border-4 border-blue-100 mb-8 w-full max-w-md">
          <p className="text-4xl md:text-5xl text-[#4A90D9] font-black tracking-tighter">
            {score} <span className="text-gray-400 text-2xl">/</span> {totalQuestions}
          </p>
          <p className="text-lg font-bold text-gray-500 uppercase tracking-widest mt-2">Final Score</p>
        </div>
        
        <p className="text-2xl md:text-3xl text-gray-600 font-bold mb-12 max-w-2xl">
          {message}
        </p>

        <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto">
          <button
            onClick={onRestart}
            className="px-12 py-5 bg-[#4A90D9] text-white text-2xl font-black rounded-2xl 
                       hover:bg-[#3A80C9] active:scale-95 transition-all shadow-xl hover:shadow-2xl
                       min-h-[70px] border-b-8 border-blue-800"
          >
            Play Again 🔄
          </button>
          <button
            onClick={onHome}
            className="px-12 py-5 bg-gray-100 text-gray-500 text-2xl font-black rounded-2xl 
                       hover:bg-gray-200 active:scale-95 transition-all
                       min-h-[70px] border-b-8 border-gray-300"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
