import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const GoogleLinkButton = () => {
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      // In a real app, you'd exchange code for tokens
      // For this UI, we'll simulate the "Linked" state or redirect to profile
      console.log('Google Link Success:', codeResponse);
      alert('Neural ID Linked Successfully!');
    },
    onError: (error) => console.log('Login Failed:', error)
  });

  return (
    <button
      className="px-6 py-2 text-[10px] font-black text-amber-600 hover:text-white glass-card border-amber-500/20 hover:border-amber-500 rounded-lg transition-all uppercase tracking-[0.2em] backdrop-blur-3xl flex items-center gap-2"
      onClick={() => login()}
    >
      <span className="text-sm">G</span> Link_Neural_ID
    </button>
  );
};

const LandingScreen = ({ user, onStartQuiz, onLogout, hasGoogleClientId = true }) => {

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-transparent w-full items-stretch overflow-hidden">
      {/* Absolute Quick Actions */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 items-end">
        {hasGoogleClientId ? (
          <GoogleLinkButton />
        ) : (
          <button
            type="button"
            className="px-6 py-2 text-[10px] font-black text-slate-400 glass-card border-slate-300/20 rounded-lg uppercase tracking-[0.2em] backdrop-blur-3xl flex items-center gap-2 cursor-not-allowed"
            disabled
            title="Google client ID not configured"
          >
            <span className="text-sm">G</span> Link_Neural_ID
          </button>
        )}
        <button
          onClick={onLogout}
          className="px-6 py-2 text-[10px] font-black text-rose-600 hover:text-white glass-card border-rose-500/20 hover:border-rose-500 rounded-lg transition-all uppercase tracking-[0.2em] backdrop-blur-3xl bg-rose-50/20"
        >
          Terminate_Session [✕]
        </button>
      </div>

      {/* Left Section: Welcome Message */}
      <div className="flex-[1.4] flex flex-col justify-center p-8 md:p-16 lg:p-24 relative z-10">
        <div className="max-w-4xl">
          <div className="mb-8 inline-flex items-center gap-4 glass-card px-6 py-3 rounded-full border-sky-500/10">
            <span className="text-2xl">⚡</span>
            <span className="text-sm font-black text-sky-600 uppercase tracking-[0.3em]">Neural Link Established</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-800 mb-8 tracking-tighter leading-none">
            Welcome, <br />
            <span className="text-sky-600 drop-shadow-sm">{user.name}</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-500 mb-12 font-light leading-relaxed max-w-2xl border-l-4 border-purple-400 pl-8 py-2">
            The data streams are aligned. Your cognitive patterns are being uploaded to the <span className="text-purple-600 font-bold">CORE_GRID</span> for validation.
          </p>

          <div className="flex flex-col md:flex-row gap-6">
            <button
              onClick={onStartQuiz}
              className="group relative px-12 py-6 text-2xl font-black text-white bg-sky-600 rounded-xl shadow-[0_8px_0_rgb(3,105,161)] hover:shadow-[0_4px_0_rgb(3,105,161)] hover:translate-y-[4px] active:translate-y-[8px] active:shadow-none transition-all duration-75 uppercase tracking-[0.1em] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative flex items-center justify-center gap-4">
                INITIATE_GAME <span className="text-3xl group-hover:scale-110 transition-transform">⌬</span>
              </span>
            </button>
            
            <button
              className="group px-8 py-6 text-xl font-black text-purple-600 glass-card border-none rounded-xl shadow-lg hover:bg-purple-100/30 active:scale-95 transition-all uppercase tracking-widest"
            >
              ARCHIVE_BADGES
            </button>
          </div>
        </div>
      </div>

      {/* Right Section: Stats & Profile Card */}
      <div className="flex-1 p-8 md:p-16 flex flex-col justify-center items-center relative">
        <div className="w-full max-w-xl space-y-12 relative z-10">
          {/* Avatar Profile Card */}
          <div className="glass-card p-12 rounded-[3rem] text-center relative group overflow-hidden border-sky-500/10">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-400 to-transparent"></div>
            
            <div className="w-40 h-40 md:w-56 md:h-56 bg-slate-100 rounded-2xl border-2 border-slate-200 shadow-lg flex items-center justify-center text-6xl md:text-8xl mx-auto mb-8 overflow-hidden relative">
              <div className="animate-pulse">{user.avatar}</div>
            </div>
            
            <div className="inline-block bg-slate-50 border border-slate-200 text-sky-600 px-8 py-3 rounded-lg font-black text-xl shadow-sm uppercase tracking-[0.2em] mb-6">
              RANK :: LEVEL_01
            </div>

            <button
              onClick={onLogout}
              className="mt-4 w-full py-4 text-sm font-black text-rose-500 hover:text-white bg-rose-50 hover:bg-rose-500 border border-rose-200 hover:border-rose-500 rounded-xl transition-all uppercase tracking-[0.2em]"
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
