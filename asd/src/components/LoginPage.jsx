import React, { useState } from 'react';

const AVATARS = ['🐶', '🐱', '🐸', '🦊', '🐼', '🐧'];

const LoginPage = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const handleLogin = () => {
    if (name) {
      const user = { name, avatar: selectedAvatar || '🚀' };
      localStorage.setItem('asd_quiz_user', JSON.stringify(user));
      onLogin(user);
    }
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
              Welcome to <br /><span className="text-[var(--ink-soft)]">ASD QUIZ</span>
            </h1>
            <p className="text-base md:text-xl text-[var(--ink-soft)] font-black leading-relaxed mb-8 uppercase tracking-[0.15em]">
              Cozy Study Board
            </p>
            
            <div className="space-y-6">
              <div className="relative group">
                <label htmlFor="name" className="text-xs font-black text-[var(--ink-soft)] block mb-3 uppercase tracking-[0.22em] ml-1">
                  Enter Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 20))}
                  placeholder="TANMAY"
                  className="w-full px-6 py-4 text-2xl border-[3px] border-[var(--ink)] rounded-2xl focus:outline-none transition-all bg-white/90 font-black text-[var(--ink)] placeholder:text-[var(--ink-soft)]"
                />
              </div>

              <button
                onClick={handleLogin}
                disabled={!name}
                className={`w-full brutal-button pressable py-5 text-2xl font-black rounded-2xl uppercase tracking-[0.12em] ${
                  name 
                    ? 'bg-[var(--surface-coral)] text-[var(--ink)]' 
                    : 'bg-white/70 text-[var(--ink-soft)] cursor-not-allowed'
                }`}
              >
                START QUIZ
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 brutal-card raised-glass-soft bg-warm-sky/70 p-8 md:p-12 lg:p-14 flex flex-col justify-center relative overflow-hidden">
          <div className="relative z-10 w-full max-w-2xl mx-auto">
            <p className="text-xs font-black text-[var(--ink-soft)] mb-8 uppercase tracking-[0.28em] text-center lg:text-left">
              Pick Avatar
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`brutal-button pressable aspect-square text-6xl md:text-7xl p-6 rounded-[20px] group relative transition-all duration-150 ${
                    selectedAvatar === avatar 
                      ? 'bg-[var(--surface-mint)] -translate-y-1' 
                      : 'bg-white/80 hover:bg-[var(--surface-butter)]'
                  }`}
                >
                  <div className={`transition-all duration-300 ${selectedAvatar === avatar ? 'scale-110' : 'opacity-75'}`}>
                    {avatar}
                  </div>
                  {selectedAvatar === avatar && (
                    <div className="absolute -top-3 -right-3 bg-[var(--surface-coral)] text-[var(--ink)] rounded-full p-2 border-[3px] border-[var(--ink)]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
