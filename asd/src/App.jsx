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
    <div className="App min-h-screen relative">
      {screen === 'login' && <LoginPage onLogin={handleLogin} />}

      {screen === 'landing' && user && (
        <LandingScreen user={user} onStartQuiz={handleStartQuiz} />
      )}

      {screen === 'quiz' && user && (
        <QuizScreen user={user} onBackToHome={handleBackToHome} />
      )}

      {user && (
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 px-4 py-2 text-sm font-bold text-white bg-red-500 rounded-lg"
        >
          Logout
        </button>
      )}
    </div>
  );
}

function App() {
  if (!GOOGLE_CLIENT_ID) {
    console.warn('VITE_GOOGLE_CLIENT_ID not set. Google login will not work. Set it in your .env file.');
    return <AppContent />;
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppContent />
    </GoogleOAuthProvider>
  );
}

export default App;
