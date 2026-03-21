import React from 'react';

const ResultsScreen = ({ user, score, totalQuestions, onPlayAgain, onBackToHome }) => {
  const percentage = (score / totalQuestions) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-transparent p-6 relative overflow-hidden">
      <div className="w-full max-w-5xl glass-card p-16 md:p-32 rounded-[4rem] text-center relative z-10 border-cyan-500/20 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
        
        <div className="mb-12">
          <span className="text-9xl md:text-[14rem] block mb-8 animate-bounce-slow filter drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            {user.avatar}
          </span>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none">
            MISSION <span className="neon-text-blue">{percentage >= 50 ? 'COMPLETE' : 'FAILED'}</span>
          </h1>
          <p className="text-2xl md:text-3xl text-white/40 mt-6 font-mono tracking-widest uppercase">
            Subject_{user.name} // Status_Verified
          </p>
        </div>

        <div className="flex flex-col items-center justify-center my-20">
          <div className="relative group">
            <div className="absolute inset-0 bg-cyan-500/20 blur-[60px] rounded-full group-hover:bg-cyan-500/40 transition-all"></div>
            <div className="relative glass-card border-none rounded-full w-64 h-64 md:w-80 md:h-80 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(34,211,238,0.2)]">
              <span className="text-7xl md:text-9xl font-black text-white leading-none">{score}</span>
              <div className="w-20 h-1 bg-white/20 my-4"></div>
              <span className="text-3xl md:text-4xl font-black text-cyan-400/60 leading-none">{totalQuestions}</span>
            </div>
          </div>
          <p className="mt-12 text-3xl md:text-4xl font-light text-white/50 italic">
            "{percentage >= 80 ? 'Perfect synthesis of data.' : percentage >= 50 ? 'Adequate cognitive performance.' : 'Neural recalibration required.'}"
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-10 justify-center w-full max-w-2xl mx-auto">
          <button
            onClick={onPlayAgain}
            className="flex-1 group relative px-12 py-10 text-3xl font-black text-white bg-purple-600 rounded-2xl shadow-[0_12px_0_rgb(126,34,206)] hover:shadow-[0_8px_0_rgb(126,34,206)] hover:translate-y-[4px] active:translate-y-[12px] active:shadow-none transition-all uppercase tracking-widest overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            REBOOT_CHALLENGE
          </button>
          
          <button
            onClick={onBackToHome}
            className="flex-1 px-12 py-10 text-3xl font-black text-white/60 glass-card rounded-2xl hover:bg-white/5 active:scale-95 transition-all uppercase tracking-widest border-white/5"
          >
            TERMINATE_SESSION
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
