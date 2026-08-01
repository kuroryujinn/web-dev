import React, { useEffect, useState } from 'react';
import LoginPage from './components/auth/LoginPage';
import DashboardScreen from './components/dashboard/DashboardScreen';

const getStoredUser = () => {
  const storedUser = localStorage.getItem('asd_user');
  if (!storedUser) return null;
  try {
    const parsed = JSON.parse(storedUser);
    if (parsed?.name && parsed?.uid) return parsed;
  } catch {
    localStorage.removeItem('asd_user');
  }
  return null;
};

function AppContent() {
  const [user, setUser] = useState(() => getStoredUser());
  const [screen, setScreen] = useState(() => (getStoredUser() ? 'dashboard' : 'login'));

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setScreen('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('asd_user');
    setUser(null);
    setScreen('login');
  };

  return (
    <div className="App min-h-screen bg-warm-cream selection:bg-warm-coral/60 selection:text-ink transition-colors duration-500">
      <div className="relative w-full min-h-screen z-10 transition-all duration-500 max-w-[1440px] mx-auto">
        {screen === 'login' && <LoginPage onLogin={handleLogin} />}
        {screen === 'dashboard' && user && (
          <DashboardScreen user={user} onLogout={handleLogout} />
        )}
      </div>

      {/* Persistent Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden h-screen w-screen z-0">
        <div className="absolute -top-20 -left-24 w-[420px] h-[420px] bg-warm-peach/70 rounded-full blur-[110px]" />
        <div className="absolute top-[18%] right-[-8%] w-[360px] h-[360px] bg-warm-butter/65 rounded-full blur-[96px]" />
        <div className="absolute bottom-[-12%] left-[25%] w-[430px] h-[430px] bg-warm-mint/55 rounded-full blur-[110px]" />
      </div>
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
