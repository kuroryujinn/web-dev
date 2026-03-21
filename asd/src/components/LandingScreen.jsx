import React from 'react';

const LandingScreen = ({ user, onStartQuiz, onLogout }) => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-transparent w-full items-stretch overflow-hidden">
      {/* Left Section: Welcome Message */}
      <div className="flex-[1.4] flex flex-col justify-center p-12 md:p-24 lg:p-40 relative z-10">
        <div className="max-w-6xl">
          <div className="mb-16 inline-flex items-center gap-6 glass-card px-10 py-5 rounded-full border-cyan-500/30">
            <span className="text-4xl animate-pulse">⚡</span>
            <span className="text-2xl font-black text-cyan-400 uppercase tracking-[0.4em]">Neural Link Established</span>
          </div>
          
          <h1 className="text-7xl md:text-9xl lg:text-[10rem] font-black text-white mb-12 tracking-tighter leading-none">
            Welcome, <br />
            <span className="neon-text-blue drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]">{user.name}</span>
          </h1>
          
          <p className="text-3xl md:text-4xl text-white/50 mb-24 font-light leading-relaxed max-w-4xl border-l-8 border-purple-500 pl-12 py-4">
            The data streams are aligned. Your cognitive patterns are being uploaded to the <span className="text-purple-400 font-bold">CORE_GRID</span> for validation.
          </p>

          <div className="flex flex-col md:flex-row gap-12">
            <button
              onClick={onStartQuiz}
              className="group relative px-24 py-14 text-5xl font-black text-white bg-cyan-600 rounded-2xl shadow-[0_15px_0_rgb(8,145,178)] hover:shadow-[0_10px_0_rgb(8,145,178)] hover:translate-y-[5px] active:translate-y-[15px] active:shadow-none transition-all duration-75 uppercase tracking-[0.2em] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative flex items-center justify-center gap-8">
                INITIATE_GAME <span className="text-6xl group-hover:scale-125 transition-transform">⌬</span>
              </span>
            </button>
            
            <button
              className="group px-16 py-14 text-3xl font-black text-purple-400 glass-card border-none rounded-2xl shadow-2xl hover:bg-purple-500/10 active:scale-95 transition-all uppercase tracking-widest"
            >
              ARCHIVE_BADGES
            </button>
          </div>
        </div>
      </div>

      {/* Right Section: Stats & Profile Card */}
      <div className="flex-1 p-12 md:p-24 flex flex-col justify-center items-center relative">
        <div className="w-full max-w-3xl space-y-16 relative z-10">
          {/* Avatar Profile Card */}
          <div className="glass-card p-16 rounded-[4rem] text-center relative group overflow-hidden border-cyan-500/20">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
            
            <div className="w-56 h-56 md:w-80 md:h-80 bg-black/40 rounded-3xl border-4 border-white/10 shadow-[0_0_50px_rgba(34,211,238,0.2)] flex items-center justify-center text-9xl md:text-[12rem] mx-auto mb-12 overflow-hidden relative">
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-150"></div>
              <div className="animate-pulse">{user.avatar}</div>
            </div>
            
            <div className="inline-block bg-white/5 border border-white/10 text-cyan-400 px-14 py-5 rounded-xl font-black text-3xl shadow-2xl uppercase tracking-[0.3em] mb-8">
              RANK :: LEVEL_01
            </div>

            <button
              onClick={onLogout}
              className="mt-4 w-full py-6 text-xl font-black text-rose-400 hover:text-rose-100 bg-rose-500/5 hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-500 rounded-2xl transition-all uppercase tracking-[0.3em]"
            >
              Terminate_Connection
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { label: 'Uptime', value: '100%', icon: '⚡' },
              { label: 'Credits', value: '1.2k', icon: '💎' },
              { label: 'Global', value: '#42', icon: '🌐' }
            ].map((stat, i) => (
              <div key={i} className="glass-card p-12 rounded-3xl text-center group hover:border-purple-500/50 transition-all border-white/5 bg-white/5">
                <div className="text-5xl mb-6 opacity-80">{stat.icon}</div>
                <div className="text-5xl font-black text-white mb-2">{stat.value}</div>
                <div className="text-sm font-black text-cyan-500/60 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;
