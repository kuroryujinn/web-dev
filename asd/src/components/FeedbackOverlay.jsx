import React from 'react';

const FeedbackOverlay = ({ isCorrect, feedback, onNext }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900/80 backdrop-blur-xl z-[100] p-10 animate-fade-in">
      <div className={`w-full max-w-4xl p-16 md:p-24 text-center rounded-[64px] shadow-2xl border-[16px] transform transition-all animate-scale-up ${
        isCorrect 
          ? 'bg-white border-green-400 shadow-green-200/50' 
          : 'bg-white border-red-400 shadow-red-200/50'
      }`}>
        <div className="text-9xl mb-12 animate-bounce-slow">
          {isCorrect ? '🌟' : '💪'}
        </div>
        
        <h2 className={`text-6xl md:text-8xl font-black mb-8 uppercase tracking-tighter ${
          isCorrect ? 'text-green-500' : 'text-red-500'
        }`}>
          {isCorrect ? 'AMAZING!' : 'STAY POSITIVE!'}
        </h2>

        <p className="text-3xl md:text-4xl font-bold text-gray-600 mb-16 leading-relaxed max-w-2xl mx-auto">
          {feedback}
        </p>

        <button
          onClick={onNext}
          className="w-full max-w-xl py-10 text-5xl font-black text-white bg-[#4A90D9] rounded-[40px] shadow-[0_20px_0_rgb(30,64,175)] hover:translate-y-[5px] hover:shadow-[0_15px_0_rgb(30,64,175)] active:translate-y-[20px] active:shadow-none transition-all duration-75 uppercase tracking-widest"
        >
          CONTINUE 🚀
        </button>
      </div>
    </div>
  );
};

export default FeedbackOverlay;
