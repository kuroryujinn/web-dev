import React from 'react';
import { useProgress } from '../../contexts/ProgressContext';
import UserStats from './UserStats';
import SessionHistory from './SessionHistory';
import BadgeShelf from '../dashboard/BadgeShelf';
import AccessibleButton from '../shared/AccessibleButton';
import LoadingSkeleton from '../shared/LoadingSkeleton';
import ErrorState from '../shared/ErrorState';

const ProfileScreen = ({ user, onBack }) => {
  const { progress, loading, error, retry } = useProgress();

  if (loading) {
    return <LoadingSkeleton variant="profile" />;
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center min-h-screen p-4 md:p-8">
        <ErrorState
          title="Couldn't load your profile"
          message="Check your connection and try again."
          onRetry={retry}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-transparent p-4 md:p-8">
      {/* Header */}
      <div className="w-full max-w-4xl mx-auto mb-8">
        <div className="brutal-card raised-glass-soft bg-warm-sky/70 p-6 rounded-[2rem]">
          <div className="flex items-center gap-4">
            <span className="text-6xl" aria-hidden="true">{user.avatar || '🧑'}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-[var(--ink)] tracking-tight">
                {user.name}
              </h1>
              <p className="text-lg text-[var(--ink-soft)] font-bold mt-1">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="w-full max-w-4xl mx-auto mb-8">
        <h2 className="text-2xl font-black text-[var(--ink)] mb-4">My Stats</h2>
        <UserStats progress={progress} />
      </div>

      {/* Badges */}
      <div className="w-full max-w-4xl mx-auto mb-8">
        <h2 className="text-2xl font-black text-[var(--ink)] mb-4">Badges</h2>
        <BadgeShelf badges={progress?.badges || []} />
      </div>

      {/* Session History */}
      <div className="w-full max-w-4xl mx-auto mb-8 flex-1">
        <h2 className="text-2xl font-black text-[var(--ink)] mb-4">Session History</h2>
        <SessionHistory progress={progress} />
      </div>

      {/* Back Button */}
      <div className="w-full max-w-4xl mx-auto">
        <AccessibleButton onClick={onBack} variant="white" className="px-6 py-3 text-sm">
          ← BACK TO DASHBOARD
        </AccessibleButton>
      </div>
    </div>
  );
};

export default ProfileScreen;
