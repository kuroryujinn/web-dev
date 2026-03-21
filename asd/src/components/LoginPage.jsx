import React, { useState } from 'react';
import GoogleLoginButton from './GoogleLoginButton';

const AVATARS = ['🐶', '🐱', '🐸', '🦊', '🐼', '🐧'];

const LoginPage = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const handleLogin = () => {
    if (name && selectedAvatar) {
      const user = { name, avatar: selectedAvatar };
      localStorage.setItem('asd_quiz_user', JSON.stringify(user));
      onLogin(user);
    }
  };

  const handleGoogleLogin = (googleUser) => {
    localStorage.setItem('asd_quiz_user', JSON.stringify(googleUser));
    onLogin(googleUser);
  };

  const hasGoogleClientId = !!import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <div className="flex flex-col min-h-screen bg-transparent w-full">
      <div className="w-full h-full flex flex-col lg:flex-row items-stretch min-h-screen">
        
        {/* Left Side: Cyber Intro */}
        <div className="flex-1 flex flex-col justify-center p-12 md:p-20 lg:p-32 bg-[#0F172A]/40 backdrop-blur-3xl relative overflow-hidden">
          {/* Neon Pulse */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(34,211,238,0.05)_0%,transparent_70%)] pointer-events-none"></div>
          
          <div className="relative z-10 max-w-2xl">
            <div className="mb-12 inline-flex items-center justify-center p-8 rounded-full border-4 border-cyan-500/30 glass-morphism shadow-[0_0_50px_rgba(34,211,238,0.2)]">
              <span className="text-9xl animate-bounce-slow inline-block grayscale brightness-200">🚀</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
              Welcome to <br /><span className="neon-text-blue">ASD QUIZ</span>
            </h1>
            <p className="text-2xl md:text-3xl text-cyan-100/60 font-medium leading-relaxed mb-16 uppercase tracking-[0.2em]">
              Initialize testing module_01
            </p>
            
            <div className="space-y-12">
              <div className="relative group">
                <label htmlFor="name" className="text-sm font-black text-cyan-400 block mb-6 uppercase tracking-[0.5em] ml-2">
                  Assign Alias
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 20))}
                  placeholder="ID_QUEST_MASTER"
                  className="w-full px-12 py-10 text-4xl border-4 border-cyan-500/20 rounded-[40px] focus:outline-none focus:ring-4 focus:ring-cyan-500/50 focus:border-cyan-400 transition-all bg-black/40 font-black text-cyan-200 placeholder:text-cyan-900/50 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-xl"
                />
              </div>

              <button
                onClick={handleLogin}
                disabled={!name || !selectedAvatar}
                className={`w-full py-12 text-5xl font-black rounded-[40px] shadow-2xl transition-all active:scale-95 border-b-[15px] uppercase tracking-[0.3em] ${
                  name && selectedAvatar 
                    ? 'bg-cyan-500 text-black hover:bg-cyan-300 border-cyan-700 hover:shadow-[0_0_50px_rgba(34,211,238,0.6)]' 
                    : 'bg-slate-800 text-slate-900 border-slate-950 cursor-not-allowed opacity-50 grayscale'
                }`}
              >
                Launch Grid
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Identity Selection */}
        <div className="flex-1 bg-black/20 p-12 md:p-20 lg:p-32 flex flex-col justify-center relative overflow-hidden border-l-4 border-cyan-500/10">
          <div className="relative z-10 w-full max-w-4xl mx-auto">
            <p className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-16 uppercase tracking-[0.8em] text-center lg:text-left">
              Select Avatar Protocol
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`aspect-square text-8xl md:text-9xl p-10 rounded-[64px] border-[6px] group relative transition-all duration-300 ${
                    selectedAvatar === avatar 
                      ? 'bg-cyan-500/10 border-cyan-400 shadow-[0_0_60px_rgba(34,211,238,0.4)] scale-110' 
                      : 'bg-white/5 border-white/10 hover:border-cyan-500/50 hover:bg-white/10'
                  }`}
                >
                  <div className={`transition-all duration-500 ${selectedAvatar === avatar ? 'brightness-125 scale-110 drop-shadow-[0_0_20px_rgba(34,211,238,1)]' : 'grayscale opacity-60'}`}>
                    {avatar}
                  </div>
                  {selectedAvatar === avatar && (
                    <div className="absolute -top-6 -right-6 bg-cyan-400 text-black rounded-full p-6 shadow-[0_0_30px_rgba(34,211,238,0.8)] border-8 border-[#0F172A]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-24 h-20 flex items-center justify-center lg:justify-start">
              {selectedAvatar ? (
                <div className="flex items-center gap-6">
                  <div className="w-4 h-4 rounded-full bg-cyan-400 animate-ping"></div>
                  <p className="neon-text-blue font-black text-4xl uppercase tracking-[0.2em]">
                    Identity Validated
                  </p>
                </div>
              ) : (
                <p className="text-cyan-900 font-black text-2xl uppercase tracking-[0.5em] animate-pulse">
                  Await selection...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
