import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useAuth } from './AuthContext';
import { loadProgress, persistProgress } from '../services/progressService';
import {
  applyActivityResult,
  createInitialProgress,
  getEarnedBadgeObjects,
  getLevelProgress as getLevelProgressUtil,
  isLevelUnlocked as isLevelUnlockedUtil,
  updateLoginStreak,
} from '../utils/progress';

const ProgressContext = createContext(null);

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress must be used within ProgressProvider');
  return context;
};

const INITIAL_STATE = { uid: null, progress: null, loading: true, error: false };

/**
 * Global progress state (XP, stars, badges, per-activity results).
 *
 * - Loads from Firestore (localStorage fallback) when a user signs in.
 * - Records activity completions through `recordActivityResult`.
 * - Exposes `error` + `retry` so screens can show a friendly error card with
 *   a retry action when progress is unreachable (9.6).
 * - State is keyed by user uid and derived at render time, so switching
 *   accounts or signing out never shows another user's progress, and no
 *   synchronous setState happens inside effects.
 */
export const ProgressProvider = ({ children }) => {
  const { user } = useAuth();
  const [state, setState] = useState(INITIAL_STATE);

  const uid = user?.uid ?? null;
  const isFresh = state.uid === uid;

  // Signed-out users have no progress; signing in shows a loading state
  // until the current user's document is loaded.
  const progress = isFresh ? state.progress : null;
  const loading = user ? !isFresh || state.loading : false;
  const error = isFresh ? state.error : false;

  useEffect(() => {
    if (!user || state.uid === user.uid) return;

    let cancelled = false;
    const load = async () => {
      try {
        let loaded = await loadProgress(user.uid);
        if (loaded) {
          // Bump the login streak if this is a new day.
          const withStreak = updateLoginStreak(loaded);
          if (withStreak !== loaded) {
            await persistProgress(user.uid, withStreak);
          }
          loaded = withStreak;
        } else {
          loaded = createInitialProgress();
          await persistProgress(user.uid, loaded);
        }
        if (!cancelled && state.uid !== user.uid) {
          setState({ uid: user.uid, progress: loaded, loading: false, error: false });
        }
      } catch {
        if (!cancelled && state.uid !== user.uid) {
          setState({ uid: user.uid, progress: null, loading: false, error: true });
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [user, state.uid]);

  /**
   * Re-attempt loading progress after a failure. Resets to the initial
   * loading state so the effect re-runs with the current user.
   */
  const retry = useCallback(() => {
    setState({ uid: null, progress: null, loading: true, error: false });
  }, []);

  /**
   * Record an activity completion and update progress + persistence.
   * @param {{ activityId: string, score: number, stars: number, xp: number }} result
   * @returns {Promise<{ progress: object|null, newlyEarnedBadges: Array }>}
   */
  const recordActivityResult = useCallback(
    async ({ activityId, score, stars, xp }) => {
      if (!progress || !user) return { progress: null, newlyEarnedBadges: [] };
      const { progress: next, newlyEarnedBadges } = applyActivityResult(progress, {
        activityId,
        score,
        stars,
        xp,
      });
      setState({ uid: user.uid, progress: next, loading: false, error: false });
      persistProgress(user.uid, next);
      return { progress: next, newlyEarnedBadges };
    },
    [progress, user],
  );

  const isLevelUnlocked = useCallback(
    (levelOrder) => isLevelUnlockedUtil(progress, levelOrder),
    [progress],
  );

  const getLevelProgress = useCallback(
    (levelActivityIds) => getLevelProgressUtil(progress, levelActivityIds),
    [progress],
  );

  const earnedBadges = getEarnedBadgeObjects(progress);

  return (
    <ProgressContext.Provider
      value={{
        progress,
        loading,
        error,
        retry,
        recordActivityResult,
        isLevelUnlocked,
        getLevelProgress,
        earnedBadges,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};
