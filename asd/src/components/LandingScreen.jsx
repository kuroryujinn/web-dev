import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';

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
      className="brutal-button pressable px-5 py-2 text-[10px] font-black text-[var(--ink)] bg-[var(--surface-butter)] uppercase tracking-[0.2em] flex items-center gap-2"
      onClick={() => login()}
    >
      <span className="text-sm">G</span> LINK GOOGLE
    </button>
  );
};

const LandingScreen = ({ user, onStartQuiz, onLogout, hasGoogleClientId = true }) => {

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-transparent w-full items-stretch overflow-hidden gap-6 p-4 md:p-8">
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 items-end">
        {hasGoogleClientId ? (
          <GoogleLinkButton />
        ) : (
          <button
            type="button"
            className="brutal-button px-5 py-2 text-[10px] font-black text-[var(--ink-soft)] bg-white/70 uppercase tracking-[0.2em] flex items-center gap-2 cursor-not-allowed"
            disabled
            title="Google client ID not configured"
          >
            <span className="text-sm">G</span> LINK GOOGLE
          </button>
        )}
        <button
          onClick={onLogout}
          className="brutal-button pressable px-5 py-2 text-[10px] font-black text-[var(--ink)] bg-[var(--surface-coral)] uppercase tracking-[0.2em]"
        >
          LOG OUT
        </button>
      </div>

      <div className="flex-[1.4] flex flex-col justify-center p-4 md:p-8 lg:p-12 relative z-10 brutal-card raised-glass-soft bg-[var(--surface-sky)]">
        <div className="max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-4 brutal-card px-4 py-2 rounded-full bg-warm-butter/80">
            <span className="text-2xl">⚡</span>
            <span className="text-sm font-black text-[var(--ink)] uppercase tracking-[0.2em]">Session Ready</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-[var(--ink)] mb-8 tracking-tight leading-none">
            Welcome, <br />
            <span className="text-[var(--ink-soft)]">{user.name}</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-[var(--ink)] mb-10 font-black leading-relaxed max-w-2xl border-l-[6px] border-[var(--ink)] pl-6 py-2">
            Pick up where you left off and push your score higher.
          </p>

          <div className="flex flex-col md:flex-row gap-6">
            <button
              onClick={onStartQuiz}
              className="brutal-button pressable px-12 py-5 text-2xl font-black text-[var(--ink)] bg-[var(--surface-coral)] uppercase tracking-[0.08em]"
            >
              INITIATE_GAME
            </button>
            
            <button
              className="brutal-button pressable px-8 py-5 text-xl font-black text-[var(--ink)] bg-[var(--surface-butter)] uppercase tracking-[0.08em]"
            >
              BADGES
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-8 flex flex-col justify-center items-center relative brutal-card raised-glass-soft bg-[var(--surface-coral)]">
        <div className="w-full max-w-xl space-y-12 relative z-10">
          <div className="brutal-card p-8 rounded-[2rem] text-center relative bg-white">
            
            <div className="w-40 h-40 md:w-52 md:h-52 bg-[var(--surface-mint)] rounded-2xl border-[3px] border-[var(--ink)] flex items-center justify-center text-6xl md:text-8xl mx-auto mb-6">
              <div>{user.avatar}</div>
            </div>
            
            <div className="inline-block bg-[var(--surface-butter)] border-[3px] border-[var(--ink)] text-[var(--ink)] px-6 py-2 rounded-lg font-black text-lg uppercase tracking-[0.12em] mb-6">
              RANK :: LEVEL_01
            </div>

            <button
              onClick={onLogout}
              className="brutal-button pressable mt-2 w-full py-3 text-sm font-black text-[var(--ink)] bg-[var(--surface-coral)] uppercase tracking-[0.15em]"
            >
              END SESSION
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Uptime', value: '100%', icon: '⚡' },
              { label: 'Credits', value: '1.2k', icon: '💎' },
              { label: 'Global', value: '#42', icon: '🌐' }
            ].map((stat, i) => (
              <div key={i} className="brutal-card p-4 rounded-2xl text-center bg-white">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-black text-[var(--ink)] mb-1">{stat.value}</div>
                <div className="text-xs font-black text-[var(--ink)] uppercase tracking-[0.15em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;
