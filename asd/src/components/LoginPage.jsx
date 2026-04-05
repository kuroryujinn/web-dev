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
        <div className="flex-1 flex flex-col justify-center p-8 md:p-12 lg:p-16 bg-white/20 backdrop-blur-xl relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(14,165,233,0.05)_0%,transparent_70%)] pointer-events-none"></div>
          
          <div className="relative z-10 max-w-xl mx-auto lg:mx-0">
            <div className="mb-8 inline-flex items-center justify-center p-6 rounded-full border-2 border-slate-200 glass-morphism shadow-sm">
              <span className="text-6xl animate-bounce-slow inline-block grayscale brightness-110">🚀</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-800 mb-6 tracking-tight leading-tight">
              Welcome to <br /><span className="text-sky-600">ASD QUIZ</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed mb-10 uppercase tracking-widest">
              Initialize testing module_01
            </p>
            
            <div className="space-y-8">
              <div className="relative group">
                <label htmlFor="name" className="text-xs font-black text-sky-600 block mb-4 uppercase tracking-[0.3em] ml-1">
                  Assign Alias
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 20))}
                  placeholder="ID_QUEST_MASTER"
                  className="w-full px-8 py-5 text-2xl border-2 border-slate-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 transition-all bg-white/40 font-bold text-slate-700 placeholder:text-slate-300 shadow-sm backdrop-blur-md"
                />
              </div>

              <button
                onClick={handleLogin}
                disabled={!name || !selectedAvatar}
                className={`w-full py-6 text-3xl font-black rounded-3xl shadow-lg transition-all active:scale-95 border-b-8 uppercase tracking-widest ${
                  name && selectedAvatar 
                    ? 'bg-sky-600 text-white hover:bg-sky-500 border-sky-800 hover:shadow-sky-500/20' 
                    : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed opacity-50 grayscale'
                }`}
              >
                Launch Grid
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Identity Selection */}
        <div className="flex-1 bg-slate-50/10 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative overflow-hidden border-l-2 border-slate-200/50">
          <div className="relative z-10 w-full max-w-2xl mx-auto">
            <p className="text-xs font-black text-slate-400 mb-10 uppercase tracking-[0.5em] text-center lg:text-left">
              Select Avatar Protocol
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`aspect-square text-6xl md:text-7xl p-6 rounded-[32px] border-[4px] group relative transition-all duration-300 ${
                    selectedAvatar === avatar 
                      ? 'bg-sky-100/50 border-sky-400 shadow-lg scale-105' 
                      : 'bg-white/40 border-slate-200 hover:border-sky-300 hover:bg-white/60'
                  }`}
                >
                  <div className={`transition-all duration-500 ${selectedAvatar === avatar ? 'scale-110 drop-shadow-md' : 'grayscale opacity-50'}`}>
                    {avatar}
                  </div>
                  {selectedAvatar === avatar && (
                    <div className="absolute -top-3 -right-3 bg-sky-500 text-white rounded-full p-2 shadow-lg border-4 border-white">
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
