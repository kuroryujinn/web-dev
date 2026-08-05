import React from 'react';
import { useProgress } from '../../contexts/ProgressContext';
import { logout } from '../../services/authService';
import LevelGrid from './LevelGrid';
import BadgeShelf from './BadgeShelf';
import QuickStats from './QuickStats';

const DashboardScreen = ({ user, onSelectLevel, onNavigate }) => {
  const { progress, loading } = useProgress();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const navigate = (target) => () => {
    if (onNavigate) onNavigate(target);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-black text-[var(--ink)]">LOADING...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-transparent p-4 md:p-8">
      {/* Header */}
      <div className="w-full max-w-6xl mx-auto mb-8">
        <div className="brutal-card raised-glass-soft bg-warm-butter/70 p-6 rounded-[2rem]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-[var(--ink)] tracking-tight">
                Welcome, {user.name}
              </h1>
              <p className="text-lg text-[var(--ink-soft)] font-bold mt-2">
                Level {progress?.currentLevel || 1} &bull; {progress?.totalXP || 0} XP
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={navigate('profile')}
                className="brutal-button pressable px-5 py-3 text-sm font-black text-[var(--ink)] bg-[var(--surface-sky)] uppercase tracking-[0.15em]"
              >
                👤 PROFILE
              </button>
              <button
                onClick={navigate('settings')}
                className="brutal-button pressable px-5 py-3 text-sm font-black text-[var(--ink)] bg-[var(--surface-butter)] uppercase tracking-[0.15em]"
              >
                ⚙ SETTINGS
              </button>
              <button
                onClick={handleLogout}
                className="brutal-button pressable px-6 py-3 text-sm font-black text-[var(--ink)] bg-[var(--surface-coral)] uppercase tracking-[0.15em]"
              >
                LOG OUT
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="w-full max-w-6xl mx-auto mb-8">
        <QuickStats progress={progress} />
      </div>

      {/* Level Grid */}
      <div className="w-full max-w-6xl mx-auto mb-8">
        <h2 className="text-2xl font-black text-[var(--ink)] mb-4">Levels</h2>
        <LevelGrid
          currentLevel={progress?.currentLevel || 1}
          totalXP={progress?.totalXP || 0}
          onSelectLevel={onSelectLevel}
        />
      </div>

      {/* Badges */}
      <div className="w-full max-w-6xl mx-auto mb-8">
        <h2 className="text-2xl font-black text-[var(--ink)] mb-4">Badges</h2>
        <BadgeShelf badges={progress?.badges || []} />
      </div>
    </div>
  );
};

export default DashboardScreen;