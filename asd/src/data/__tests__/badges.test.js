import { BADGES, RARITY_ORDER, getBadgeById, getBadgesByRarity } from '../badges';

describe('BADGES', () => {
  it('defines the eight spec badges', () => {
    expect(BADGES).toHaveLength(8);
    expect(BADGES.map((b) => b.id)).toEqual([
      'first_steps',
      'quick_learner',
      'perfectionist',
      'level_up',
      'streak_master',
      'badge_collector',
      'motor_pro',
      'master_artist',
    ]);
  });

  it('gives every badge a title, description, icon, rarity, and criteria', () => {
    for (const badge of BADGES) {
      expect(typeof badge.title).toBe('string');
      expect(badge.title.length).toBeGreaterThan(0);
      expect(typeof badge.description).toBe('string');
      expect(typeof badge.icon).toBe('string');
      expect(RARITY_ORDER).toContain(badge.rarity);
      expect(badge.criteria).toBeDefined();
      expect(typeof badge.criteria.type).toBe('string');
    }
  });

  it('uses unique badge ids', () => {
    const ids = BADGES.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('sorts rarity tiers in ascending order', () => {
    expect(RARITY_ORDER).toEqual(['common', 'rare', 'epic', 'legendary']);
  });
});

describe('getBadgeById', () => {
  it('finds a badge by id', () => {
    expect(getBadgeById('perfectionist').title).toBe('Perfectionist');
  });

  it('returns undefined for unknown ids', () => {
    expect(getBadgeById('nope')).toBeUndefined();
  });
});

describe('getBadgesByRarity', () => {
  it('returns only badges of the requested rarity', () => {
    const common = getBadgesByRarity('common');
    expect(common).toHaveLength(2);
    expect(common.every((b) => b.rarity === 'common')).toBe(true);
  });

  it('returns an empty array for a rarity with no badges', () => {
    expect(getBadgesByRarity('mythic')).toEqual([]);
  });
});
