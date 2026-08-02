import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { ProgressProvider } from './contexts/ProgressContext';
import LoginPage from './components/auth/LoginPage';
import DashboardScreen from './components/dashboard/DashboardScreen';

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-black text-[var(--ink)]">LOADING...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return <DashboardScreen user={user} />;
};

function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <SettingsProvider>
          <div className="App min-h-screen bg-warm-cream selection:bg-warm-coral/60 selection:text-ink transition-colors duration-500">
            <div className="relative w-full min-h-screen z-10 transition-all duration-500 max-w-[1440px] mx-auto">
              <AppContent />
            </div>

            {/* Persistent Background Effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden h-screen w-screen z-0">
              <div className="absolute -top-20 -left-24 w-[420px] h-[420px] bg-warm-peach/70 rounded-full blur-[110px]" />
              <div className="absolute top-[18%] right-[-8%] w-[360px] h-[360px] bg-warm-butter/65 rounded-full blur-[96px]" />
              <div className="absolute bottom-[-12%] left-[25%] w-[430px] h-[430px] bg-warm-mint/55 rounded-full blur-[110px]" />
            </div>
          </div>
        </SettingsProvider>
      </ProgressProvider>
    </AuthProvider>
  );
}

export default App;
