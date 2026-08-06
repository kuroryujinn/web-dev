import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { ProgressProvider } from './contexts/ProgressContext';
import LoginPage from './components/auth/LoginPage';
import DashboardScreen from './components/dashboard/DashboardScreen';
import LevelScreen from './components/level/LevelScreen';
import ActivityPlayer from './components/activities/ActivityPlayer';
import ProfileScreen from './components/profile/ProfileScreen';
import SettingsScreen from './components/settings/SettingsScreen';
import LoadingSkeleton from './components/shared/LoadingSkeleton';
import { getActivitiesForLevel } from './data/activities';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [screen, setScreen] = useState('dashboard'); // 'dashboard' | 'profile' | 'settings'
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedLevelActivities, setSelectedLevelActivities] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);

  if (loading) {
    return <LoadingSkeleton variant="app" />;
  }

  if (!user) {
    return <LoginPage />;
  }

  if (selectedActivity) {
    return (
      <ActivityPlayer
        activity={selectedActivity}
        onComplete={() => {
          setSelectedActivity(null);
        }}
        onBack={() => setSelectedActivity(null)}
      />
    );
  }

  if (selectedLevel) {
    return (
      <LevelScreen
        level={selectedLevel}
        activities={selectedLevelActivities}
        onSelectActivity={setSelectedActivity}
        onBack={() => {
          setSelectedLevel(null);
          setSelectedLevelActivities(null);
          setScreen('dashboard');
        }}
      />
    );
  }

  if (screen === 'profile') {
    return <ProfileScreen user={user} onBack={() => setScreen('dashboard')} />;
  }

  if (screen === 'settings') {
    return <SettingsScreen user={user} onBack={() => setScreen('dashboard')} />;
  }

  return (
    <DashboardScreen
      user={user}
      onSelectLevel={(level) => {
        setSelectedLevel(level);
        setSelectedLevelActivities(getActivitiesForLevel(level.id));
      }}
      onNavigate={setScreen}
    />
  );
};

/**
 * Renders inside SettingsProvider so the manual Reduced Motion toggle can
 * reach the app root (data-reduced-motion drives the CSS kill-switch for
 * animations/transitions — see index.css).
 */
const AppShell = () => {
  const { settings } = useSettings();

  return (
    <div
      className="App min-h-screen bg-warm-cream selection:bg-warm-coral/60 selection:text-ink transition-colors duration-500"
      data-reduced-motion={settings.reducedMotion ? 'true' : 'false'}
    >
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
  );
};

function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <SettingsProvider>
          <AppShell />
        </SettingsProvider>
      </ProgressProvider>
    </AuthProvider>
  );
}

export default App;