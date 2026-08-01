import React from 'react';
import { logout } from '../../services/authService';

const DashboardScreen = ({ user }) => {
  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="brutal-card raised-glass-soft p-8 rounded-[2rem] text-center bg-warm-butter/70 max-w-md w-full">
        <span className="text-6xl block mb-4">{user?.avatar || '🧑'}</span>
        <h1 className="text-3xl font-black text-[var(--ink)] mb-2">
          Welcome, {user?.name || 'Friend'}
        </h1>
        <p className="text-lg text-[var(--ink-soft)] font-bold mb-6">
          Dashboard coming soon...
        </p>
        <button
          onClick={handleLogout}
          className="brutal-button pressable px-6 py-3 text-sm font-black text-[var(--ink)] bg-[var(--surface-coral)] uppercase tracking-[0.15em]"
        >
          LOG OUT
        </button>
      </div>
    </div>
  );
};

export default DashboardScreen;
