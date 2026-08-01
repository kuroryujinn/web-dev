import React from 'react';

const LoginPage = ({ onLogin }) => {
  const handleDemoLogin = () => {
    const user = { uid: 'demo-user', name: 'Demo User', email: 'demo@example.com', avatar: '🧑' };
    localStorage.setItem('asd_user', JSON.stringify(user));
    onLogin(user);
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent w-full">
      <div className="w-full h-full flex flex-col lg:flex-row items-stretch min-h-screen gap-6 p-4 md:p-8">
        <div className="flex-1 brutal-card raised-glass-soft flex flex-col justify-center p-8 md:p-12 lg:p-14 relative overflow-hidden bg-warm-butter/70">
          <div className="relative z-10 max-w-xl mx-auto lg:mx-0">
            <div className="mb-6 inline-flex items-center justify-center p-4 rounded-full border-[3px] border-[var(--ink)] bg-white/80">
              <span className="text-5xl inline-block">🚀</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-[var(--ink)] mb-4 tracking-tight leading-tight">
              Welcome to <br /><span className="text-[var(--ink-soft)]">ASD Learn</span>
            </h1>
            <p className="text-base md:text-xl text-[var(--ink-soft)] font-black leading-relaxed mb-8 uppercase tracking-[0.15em]">
              Progressive Motor-Skill Training
            </p>
            <button
              onClick={handleDemoLogin}
              className="w-full brutal-button pressable py-5 text-2xl font-black text-[var(--ink)] bg-[var(--surface-coral)] uppercase tracking-[0.12em]"
            >
              START LEARNING
            </button>
          </div>
        </div>

        <div className="flex-1 brutal-card raised-glass-soft bg-warm-sky/70 p-8 md:p-12 lg:p-14 flex flex-col justify-center relative overflow-hidden">
          <div className="relative z-10 w-full max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-black text-[var(--ink)] mb-6">Start Learning</h2>
            <p className="text-lg md:text-xl text-[var(--ink-soft)] font-bold mb-8">
              5 levels of progressive motor-skill activities designed for children with ASD
            </p>
            <div className="grid grid-cols-5 gap-3">
              {['🔵', '🟢', '🟡', '🟠', '🔴'].map((emoji, i) => (
                <div key={i} className="brutal-card p-4 rounded-xl bg-white text-center">
                  <span className="text-3xl">{emoji}</span>
                  <p className="text-xs font-black mt-2 uppercase">Level {i + 1}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
