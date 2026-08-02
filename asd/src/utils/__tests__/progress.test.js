import {
  applyActivityResult,
  checkEarnableBadges,
  createInitialProgress,
  getEarnedBadgeObjects,
  getLevelForXP,
  getLevelProgress,
  isLevelUnlocked,
  updateLoginStreak,
} from '../progress';

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
};

describe('createInitialProgress', () => {
  it('starts a fresh user at level 1 with no XP, badges, or activities', () => {
    const progress = createInitialProgress();

    expect(progress.totalXP).toBe(0);
    expect(progress.currentLevel).toBe(1);
    expect(progress.badges).toEqual([]);
    expect(progress.activities).toEqual({});
    expect(progress.sessionActivities).toBe(0);
    expect(progress.streak).toBe(1);
    expect(progress.lastActiveDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('getLevelForXP', () => {
  it('maps XP to the highest unlocked level', () => {
    expect(getLevelForXP(0)).toBe(1);
    expect(getLevelForXP(499)).toBe(1);
    expect(getLevelForXP(500)).toBe(2);
    expect(getLevelForXP(1499)).toBe(2);
    expect(getLevelForXP(1500)).toBe(3);
    expect(getLevelForXP(2999)).toBe(3);
    expect(getLevelForXP(3000)).toBe(4);
    expect(getLevelForXP(4999)).toBe(4);
    expect(getLevelForXP(5000)).toBe(5);
    expect(getLevelForXP(9999)).toBe(5);
  });
});

describe('isLevelUnlocked', () => {
  it('always unlocks level 1 and never unlocks without progress', () => {
    expect(isLevelUnlocked(null, 1)).toBe(true);
    expect(isLevelUnlocked(null, 2)).toBe(false);
  });

  it('unlocks higher levels only once their XP threshold is reached', () => {
    const progress = { ...createInitialProgress(), totalXP: 600 };

    expect(isLevelUnlocked(progress, 1)).toBe(true);
    expect(isLevelUnlocked(progress, 2)).toBe(true);
    expect(isLevelUnlocked(progress, 3)).toBe(false);
  });
});

describe('applyActivityResult', () => {
  it('accumulates XP and records the activity', () => {
    const progress = createInitialProgress();
    const { progress: next } = applyActivityResult(progress, {
      activityId: 'a1',
      score: 80,
      stars: 2,
      xp: 15,
    });

    expect(next.totalXP).toBe(15);
    expect(next.sessionActivities).toBe(1);
    expect(next.activities.a1).toMatchObject({
      bestScore: 80,
      stars: 2,
      attempts: 1,
      completed: true,
    });
  });

  it('keeps the best score and stars across attempts', () => {
    let progress = createInitialProgress();
    ({ progress } = applyActivityResult(progress, { activityId: 'a1', score: 50, stars: 1, xp: 10 }));
    ({ progress } = applyActivityResult(progress, { activityId: 'a1', score: 90, stars: 3, xp: 10 }));
    ({ progress } = applyActivityResult(progress, { activityId: 'a1', score: 60, stars: 2, xp: 10 }));

    expect(progress.activities.a1.bestScore).toBe(90);
    expect(progress.activities.a1.stars).toBe(3);
    expect(progress.activities.a1.attempts).toBe(3);
  });

  it('awards First Steps on the first completed activity', () => {
    const progress = createInitialProgress();
    const { progress: next, newlyEarnedBadges } = applyActivityResult(progress, {
      activityId: 'a1',
      score: 80,
      stars: 2,
      xp: 15,
    });

    expect(newlyEarnedBadges.map((b) => b.id)).toContain('first_steps');
    expect(next.badges).toContain('first_steps');
  });

  it('levels the user up and awards the Level Up badge at the XP threshold', () => {
    const progress = createInitialProgress();
    const { progress: next, newlyEarnedBadges } = applyActivityResult(progress, {
      activityId: 'a1',
      score: 100,
      stars: 3,
      xp: 600,
    });

    expect(next.currentLevel).toBe(2);
    expect(newlyEarnedBadges.map((b) => b.id)).toContain('level_up');
  });

  it('awards badges only once (no duplicates on repeated results)', () => {
    let progress = createInitialProgress();
    ({ progress } = applyActivityResult(progress, { activityId: 'a1', score: 100, stars: 3, xp: 600 }));
    const { progress: next, newlyEarnedBadges } = applyActivityResult(progress, {
      activityId: 'a1',
      score: 100,
      stars: 3,
      xp: 600,
    });

    expect(next.badges.filter((b) => b === 'level_up')).toHaveLength(1);
    expect(newlyEarnedBadges.map((b) => b.id)).not.toContain('level_up');
  });
});

describe('badge criteria', () => {
  it('awards Perfectionist after any 3-star activity', () => {
    const progress = {
      ...createInitialProgress(),
      activities: { a1: { completed: true, stars: 3 } },
    };
    expect(checkEarnableBadges(progress).map((b) => b.id)).toContain('perfectionist');
  });

  it('awards Quick Learner after 5 session activities', () => {
    const progress = { ...createInitialProgress(), sessionActivities: 5 };
    expect(checkEarnableBadges(progress).map((b) => b.id)).toContain('quick_learner');
  });

  it('awards Motor Skills Pro at level 4 and Master Artist at level 5', () => {
    const progress = { ...createInitialProgress(), currentLevel: 4 };
    const badges = checkEarnableBadges(progress).map((b) => b.id);

    expect(badges).toContain('motor_pro');
    expect(badges).not.toContain('master_artist');
  });

  it('awards Badge Collector once 10 badges are held', () => {
    const progress = { ...createInitialProgress(), badges: Array.from({ length: 10 }, (_, i) => `b${i}`) };
    expect(checkEarnableBadges(progress).map((b) => b.id)).toContain('badge_collector');
  });
});

describe('getEarnedBadgeObjects', () => {
  it('returns badge objects for the ids in progress', () => {
    const progress = { ...createInitialProgress(), badges: ['first_steps', 'perfectionist'] };
    const badges = getEarnedBadgeObjects(progress);

    expect(badges.map((b) => b.id)).toEqual(['first_steps', 'perfectionist']);
  });

  it('returns an empty array for no badges', () => {
    expect(getEarnedBadgeObjects(createInitialProgress())).toEqual([]);
  });
});

describe('getLevelProgress', () => {
  it('computes completed, total, and percentage from level activity ids', () => {
    const progress = {
      ...createInitialProgress(),
      activities: {
        a1: { completed: true },
        a2: { completed: true },
        a3: { completed: false },
      },
    };

    expect(getLevelProgress(progress, ['a1', 'a2', 'a3', 'a4'])).toEqual({
      completed: 2,
      total: 4,
      percentage: 50,
    });
  });

  it('handles a missing level activity list and missing progress', () => {
    expect(getLevelProgress(null, [])).toEqual({ completed: 0, total: 0, percentage: 0 });
    expect(getLevelProgress(createInitialProgress())).toEqual({
      completed: 0,
      total: 0,
      percentage: 0,
    });
  });
});

describe('updateLoginStreak', () => {
  it('keeps the streak when returning the same day', () => {
    const progress = { ...createInitialProgress(), streak: 3, lastActiveDate: daysAgo(0) };
    expect(updateLoginStreak(progress)).toBe(progress);
  });

  it('increments the streak on a consecutive day', () => {
    const progress = { ...createInitialProgress(), streak: 3, lastActiveDate: daysAgo(1) };
    const next = updateLoginStreak(progress);

    expect(next.streak).toBe(4);
    expect(next.lastActiveDate).not.toBe(progress.lastActiveDate);
  });

  it('resets the streak after a gap', () => {
    const progress = { ...createInitialProgress(), streak: 5, lastActiveDate: daysAgo(3) };
    const next = updateLoginStreak(progress);

    expect(next.streak).toBe(1);
  });
});
