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
    <div className="App min-h-screen bg-slate-100 selection:bg-sky-500/30 selection:text-sky-900 transition-colors duration-700">
      <div className="relative w-full min-h-screen z-10 transition-all duration-500 max-w-[1440px] mx-auto">
        {screen === 'login' && <LoginPage onLogin={handleLogin} />}

        {screen === 'landing' && user && (
          <LandingScreen user={user} onStartQuiz={handleStartQuiz} onLogout={handleLogout} />
        )}

        {screen === 'quiz' && user && (
          <QuizScreen user={user} onBackToHome={handleBackToHome} />
        )}
      </div>

      {/* Persistent Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden h-screen w-screen z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-400/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/10 rounded-full blur-[120px]"></div>
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
