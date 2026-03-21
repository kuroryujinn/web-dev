import React, { useEffect, useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoginPage from './components/LoginPage';
import LandingScreen from './components/LandingScreen';
import QuizScreen from './components/QuizScreen';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function AppContent() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState('login');

  useEffect(() => {
    const storedUser = localStorage.getItem('asd_quiz_user');
    if (!storedUser) return;

    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser?.name && parsedUser?.avatar) {
        setUser(parsedUser);
        setScreen('landing');
      }
    } catch {
      localStorage.removeItem('asd_quiz_user');
    }
  }, []);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setScreen('landing');
  };

  const handleStartQuiz = () => {
    setScreen('quiz');
  };

  const handleBackToHome = () => {
    setScreen('landing');
  };

  const handleLogout = () => {
    localStorage.removeItem('asd_quiz_user');
    setUser(null);
    setScreen('login');
  };

  return (
    <div className="App min-h-screen bg-[#0F172A] selection:bg-cyan-500/30 selection:text-cyan-200 transition-colors duration-700">
      <div className="relative w-full min-h-screen z-10 transition-all duration-500">
        {screen === 'login' && <LoginPage onLogin={handleLogin} />}

        {screen === 'landing' && user && (
          <LandingScreen user={user} onStartQuiz={handleStartQuiz} />
        )}

        {screen === 'quiz' && user && (
          <QuizScreen user={user} onBackToHome={handleBackToHome} />
        )}
      </div>

      {user && (
        <button
          onClick={handleLogout}
          className="fixed top-8 right-8 px-8 py-3 text-sm font-black text-rose-100 bg-rose-500/10 border-2 border-rose-500/50 hover:bg-rose-500/20 hover:border-rose-500 rounded-2xl shadow-[0_0_20px_rgba(244,63,94,0.3)] active:translate-y-[2px] active:shadow-none transition-all z-50 uppercase tracking-widest backdrop-blur-md"
        >
          Disconnect
        </button>
      )}

      {/* Persistent Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden h-screen w-screen z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px]"></div>
      </div>
    </div>
  );
}

function App() {
  const [googleIdMissing, setGoogleIdMissing] = useState(!GOOGLE_CLIENT_ID);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.warn('VITE_GOOGLE_CLIENT_ID not set. Google login will not work.');
      setGoogleIdMissing(true);
    } else {
      setGoogleIdMissing(false);
    }
  }, []);

  if (googleIdMissing) {
    return <AppContent />;
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppContent />
    </GoogleOAuthProvider>
  );
}

export default App;
