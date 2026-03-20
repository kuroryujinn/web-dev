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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9F7F3]">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">👋 Welcome!</h1>
        
        <div>
          <label htmlFor="name" className="text-lg">What's your name?</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 20))}
            placeholder="Type your name..."
            className="w-full px-4 py-2 mt-2 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4A90D9]"
          />
        </div>

        <div>
          <p className="text-lg">Pick your avatar:</p>
          <div className="flex justify-center mt-2 space-x-4">
            {AVATARS.map((avatar) => (
              <button
                key={avatar}
                onClick={() => setSelectedAvatar(avatar)}
                className={`text-4xl p-2 rounded-full ${selectedAvatar === avatar ? 'ring-4 ring-[#4A90D9]' : ''}`}
              >
                {avatar}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={!name || !selectedAvatar}
          className="w-full py-3 text-lg font-bold text-white bg-[#5CB85C] rounded-2xl disabled:bg-gray-400"
        >
          Let's Start!
        </button>

        <GoogleLoginButton onGoogleLogin={handleGoogleLogin} />
      </div>
    </div>
  );
};

export default LoginPage;
