import React from 'react';

const ResultsScreen = ({ user, score, totalQuestions, onPlayAgain, onBackToHome }) => {
  const percentage = (score / totalQuestions) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-transparent p-6 relative overflow-hidden">
      <div className="w-full max-w-4xl glass-card p-12 md:p-24 rounded-[3rem] text-center relative z-10 border-slate-200/50 shadow-xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-500 to-transparent"></div>
        
        <div className="mb-8">
          <span className="text-8xl md:text-[10rem] block mb-6 animate-bounce-slow">
            {user.avatar}
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-slate-800 tracking-tight uppercase leading-none">
            MISSION <span className="text-sky-600">{percentage >= 50 ? 'COMPLETE' : 'FAILED'}</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mt-4 font-mono tracking-widest uppercase">
            Subject_{user.name} // Status_Verified
          </p>
        </div>

        <div className="flex flex-col items-center justify-center my-12">
          <div className="relative group">
            <div className="absolute inset-0 bg-sky-500/10 blur-[40px] rounded-full group-hover:bg-sky-500/20 transition-all"></div>
            <div className="relative glass-card border-none rounded-full w-48 h-48 md:w-64 md:h-64 flex flex-col items-center justify-center shadow-lg">
              <span className="text-6xl md:text-8xl font-black text-slate-800 leading-none">{score}</span>
              <div className="w-12 h-1 bg-slate-200 my-2 md:my-4"></div>
              <span className="text-2xl md:text-3xl font-black text-sky-600/60 leading-none">{totalQuestions}</span>
            </div>
          </div>
          <p className="mt-8 text-xl md:text-2xl font-light text-slate-500 italic">
            "{percentage >= 80 ? 'Perfect synthesis of data.' : percentage >= 50 ? 'Adequate cognitive performance.' : 'Neural recalibration required.'}"
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 justify-center w-full max-w-xl mx-auto">
          <button
            onClick={onPlayAgain}
            className="flex-1 group relative px-8 py-6 text-2xl font-black text-white bg-purple-600 rounded-xl shadow-[0_6px_0_rgb(126,34,206)] hover:shadow-[0_4px_0_rgb(126,34,206)] hover:translate-y-[2px] active:translate-y-[6px] active:shadow-none transition-all uppercase tracking-widest overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            REBOOT_CHALLENGE
          </button>
          
          <button
            onClick={onBackToHome}
            className="flex-1 px-8 py-6 text-2xl font-black text-slate-400 glass-card rounded-xl hover:bg-slate-50 active:scale-95 transition-all uppercase tracking-widest border-slate-200"
          >
            TERMINATE_SESSION
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
