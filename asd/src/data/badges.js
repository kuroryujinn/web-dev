/**
 * Badge definitions for the ASD learning platform.
 * Rarity order (display tier): common < rare < epic < legendary.
 */
export const BADGES = [
  {
    id: 'first_steps',
    title: 'First Steps',
    description: 'Complete your first activity',
    icon: '👶',
    rarity: 'common',
    criteria: { type: 'activities_completed', count: 1 },
  },
  {
    id: 'quick_learner',
    title: 'Quick Learner',
    description: 'Complete 5 activities in one session',
    icon: '⚡',
    rarity: 'common',
    criteria: { type: 'session_activities', count: 5 },
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Get 3 stars on any activity',
    icon: '⭐',
    rarity: 'rare',
    criteria: { type: 'three_stars', count: 1 },
  },
  {
    id: 'level_up',
    title: 'Level Up',
    description: 'Unlock a new level',
    icon: '🔓',
    rarity: 'rare',
    criteria: { type: 'levels_unlocked', count: 1 },
  },
  {
    id: 'streak_master',
    title: 'Streak Master',
    description: 'Login 7 days in a row',
    icon: '🔥',
    rarity: 'epic',
    criteria: { type: 'login_streak', count: 7 },
  },
  {
    id: 'badge_collector',
    title: 'Badge Collector',
    description: 'Earn 10 badges',
    icon: '🏆',
    rarity: 'epic',
    criteria: { type: 'badges_earned', count: 10 },
  },
  {
    id: 'motor_pro',
    title: 'Motor Skills Pro',
    description: 'Complete Level 4',
    icon: '🏅',
    rarity: 'legendary',
    criteria: { type: 'level_completed', level: 4 },
  },
  {
    id: 'master_artist',
    title: 'Master Artist',
    description: 'Complete Level 5',
    icon: '🎨',
    rarity: 'legendary',
    criteria: { type: 'level_completed', level: 5 },
  },
];

/** Rarity tiers in ascending display order. */
export const RARITY_ORDER = ['common', 'rare', 'epic', 'legendary'];

export const getBadgeById = (id) => BADGES.find((badge) => badge.id === id);

export const getBadgesByRarity = (rarity) => BADGES.filter((badge) => badge.rarity === rarity);
