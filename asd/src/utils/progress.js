/**
 * Pure progress logic for the learning platform.
 * Everything here is side-effect free so it can be unit tested without
 * Firebase or React.
 */
import { LEVELS } from '../data/levels';
import { BADGES } from '../data/badges';

const today = () => new Date().toISOString().split('T')[0];

/** Default progress document shape for a brand-new user. */
export const createInitialProgress = () => ({
  totalXP: 0,
  currentLevel: 1,
  badges: [],
  activities: {},
  sessionActivities: 0,
  streak: 1,
  lastActiveDate: today(),
  createdAt: new Date().toISOString(),
});

/**
 * Highest level order whose XP threshold the user has reached.
 * @param {number} totalXP
 * @returns {number} level order (1-5)
 */
export const getLevelForXP = (totalXP) => {
  let level = 1;
  LEVELS.forEach((l) => {
    if (totalXP >= l.unlockXP) level = Math.max(level, l.order);
  });
  return level;
};

/**
 * Whether a level is unlocked. Level 1 is always available.
 * @param {object|null} progress
 * @param {number} levelOrder
 */
export const isLevelUnlocked = (progress, levelOrder) => {
  if (levelOrder <= 1) return true;
  if (!progress) return false;
  const level = LEVELS.find((l) => l.order === levelOrder);
  return !!level && progress.totalXP >= level.unlockXP;
};

const countCompletedActivities = (progress) =>
  Object.values(progress.activities ?? {}).filter((a) => a.completed).length;

const countThreeStarActivities = (progress) =>
  Object.values(progress.activities ?? {}).filter((a) => (a.stars ?? 0) >= 3).length;

const isBadgeEarnable = (badge, progress) => {
  const { type, count, level } = badge.criteria;
  switch (type) {
    case 'activities_completed':
      return countCompletedActivities(progress) >= count;
    case 'session_activities':
      return (progress.sessionActivities ?? 0) >= count;
    case 'three_stars':
      return countThreeStarActivities(progress) >= count;
    case 'levels_unlocked':
      return (progress.currentLevel ?? 1) - 1 >= count;
    case 'login_streak':
      return (progress.streak ?? 1) >= count;
    case 'badges_earned':
      return (progress.badges ?? []).length >= count;
    case 'level_completed':
      // Reaching a level's order is the proxy for completing it (levels unlock
      // only by earning XP within the previous level's activities).
      return (progress.currentLevel ?? 1) >= level;
    default:
      return false;
  }
};

/**
 * Badges whose criteria are now met but that the user has not earned yet.
 * @param {object} progress
 * @returns {Array} badge objects
 */
export const checkEarnableBadges = (progress) => {
  const earned = new Set(progress.badges ?? []);
  return BADGES.filter((badge) => !earned.has(badge.id) && isBadgeEarnable(badge, progress));
};

/**
 * Badge objects for the ids currently in the user's progress.
 * Note: `sessionActivities` (Quick Learner) is a persisted lifetime counter
 * rather than a true per-login-session count — a documented simplification.
 */
export const getEarnedBadgeObjects = (progress) =>
  BADGES.filter((badge) => (progress?.badges ?? []).includes(badge.id));

/**
 * Record an activity result and produce the next progress state.
 * Pure — returns the new progress plus any badges earned by this result.
 *
 * @param {object} progress - Current progress
 * @param {{ activityId: string, score: number, stars: number, xp: number }} result
 * @returns {{ progress: object, newlyEarnedBadges: Array }}
 */
export const applyActivityResult = (progress, { activityId, score, stars, xp }) => {
  const prevActivity = progress.activities?.[activityId];
  const activities = {
    ...(progress.activities ?? {}),
    [activityId]: {
      bestScore: Math.max(prevActivity?.bestScore ?? 0, score),
      stars: Math.max(prevActivity?.stars ?? 0, stars),
      attempts: (prevActivity?.attempts ?? 0) + 1,
      completed: true,
      lastAttempted: new Date().toISOString(),
    },
  };

  const totalXP = (progress.totalXP ?? 0) + xp;
  const base = {
    ...progress,
    totalXP,
    currentLevel: Math.max(progress.currentLevel ?? 1, getLevelForXP(totalXP)),
    activities,
    sessionActivities: (progress.sessionActivities ?? 0) + 1,
  };

  const newlyEarnedBadges = checkEarnableBadges(base);
  const next = {
    ...base,
    badges: [...(base.badges ?? []), ...newlyEarnedBadges.map((b) => b.id)],
  };

  return { progress: next, newlyEarnedBadges };
};

/**
 * Update the login streak when the user returns.
 * - Same calendar day: keep the streak.
 * - Next calendar day: increment.
 * - Any longer gap: reset to 1.
 * @param {object} progress
 * @returns {object} progress with updated streak/lastActiveDate (same ref if unchanged)
 */
export const updateLoginStreak = (progress) => {
  const last = progress?.lastActiveDate;
  if (!last) return { ...progress, streak: 1, lastActiveDate: today() };

  const lastTime = new Date(`${last}T00:00:00`).getTime();
  const todayTime = new Date(`${today()}T00:00:00`).getTime();
  const diffDays = Math.round((todayTime - lastTime) / 86_400_000);

  if (diffDays === 0) return progress;
  if (diffDays === 1) {
    return { ...progress, streak: (progress.streak ?? 1) + 1, lastActiveDate: today() };
  }
  return { ...progress, streak: 1, lastActiveDate: today() };
};

/**
 * Completion summary for a level given its activity ids.
 * @param {object|null} progress
 * @param {string[]} levelActivityIds
 * @returns {{ completed: number, total: number, percentage: number }}
 */
export const getLevelProgress = (progress, levelActivityIds = []) => {
  const completed = (levelActivityIds || []).filter(
    (id) => progress?.activities?.[id]?.completed,
  ).length;
  const total = (levelActivityIds || []).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { completed, total, percentage };
};
