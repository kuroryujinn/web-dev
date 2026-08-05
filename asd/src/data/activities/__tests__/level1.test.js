import { getActivitiesForLevel } from '../index';
import { LEVELS } from '../../levels';

describe('Level 1 activities', () => {
  const activities = getActivitiesForLevel('level1');

  it('provides 8 activities for Level 1', () => {
    expect(activities).toHaveLength(8);
  });

  it('provides 5 multiple choice and 3 matching activities', () => {
    const types = activities.map((a) => a.type);
    expect(types.filter((t) => t === 'multipleChoice')).toHaveLength(5);
    expect(types.filter((t) => t === 'matching')).toHaveLength(3);
  });

  it('are all assigned to level1 with unique ids and sequential order', () => {
    const ids = activities.map((a) => a.id);
    expect(new Set(ids).size).toBe(8);
    activities.forEach((a, i) => {
      expect(a.levelId).toBe('level1');
      expect(a.order).toBe(i + 1);
    });
  });

  it('only uses activity types supported by Level 1', () => {
    const level1 = LEVELS.find((l) => l.id === 'level1');
    activities.forEach((a) => {
      expect(level1.activityTypes).toContain(a.type);
    });
  });

  it('has valid document-level fields on every activity', () => {
    activities.forEach((a) => {
      expect(a.difficulty).toBe(1);
      expect(a.maxScore).toBe(100);
      expect(typeof a.timeLimit === 'number' || a.timeLimit === null).toBe(true);
      expect(a.title).toBeTruthy();
      expect(a.description).toBeTruthy();
    });
  });

  it('orders activities by their order field ascending', () => {
    const orders = activities.map((a) => a.order);
    expect([...orders].sort((x, y) => x - y)).toEqual(orders);
  });

  describe('multiple choice content', () => {
    const mc = activities.filter((a) => a.type === 'multipleChoice');

    it.each(mc.map((a) => [a.id, a]))(
      '%s has a question, at least 3 options, and exactly one correct answer',
      (_id, activity) => {
        expect(activity.content.questionLabel).toBeTruthy();
        expect(activity.content.options.length).toBeGreaterThanOrEqual(3);
        const correct = activity.content.options.filter((o) => o.correct);
        expect(correct).toHaveLength(1);
        activity.content.options.forEach((o) => {
          expect(o.id).toBeTruthy();
          expect(o.label).toBeTruthy();
        });
      },
    );

    it('includes feedback messages', () => {
      mc.forEach((a) => {
        expect(a.content.feedback.correct).toBeTruthy();
        expect(a.content.feedback.incorrect).toBeTruthy();
      });
    });
  });

  describe('matching content', () => {
    const matching = activities.filter((a) => a.type === 'matching');

    it.each(matching.map((a) => [a.id, a]))(
      '%s has instructions and at least 3 pairs with unique ids',
      (_id, activity) => {
        expect(activity.content.instructions).toBeTruthy();
        expect(activity.content.pairs.length).toBeGreaterThanOrEqual(3);
        const leftIds = activity.content.pairs.map((p) => p.left.id);
        const rightIds = activity.content.pairs.map((p) => p.right.id);
        expect(new Set(leftIds).size).toBe(activity.content.pairs.length);
        expect(new Set(rightIds).size).toBe(activity.content.pairs.length);
        activity.content.pairs.forEach((p) => {
          expect(p.left.label).toBeTruthy();
          expect(p.right.label).toBeTruthy();
        });
      },
    );

    it('includes feedback messages', () => {
      matching.forEach((a) => {
        expect(a.content.feedback.correct).toBeTruthy();
        expect(a.content.feedback.incorrect).toBeTruthy();
      });
    });
  });

  it('returns an empty array for levels without content yet', () => {
    expect(getActivitiesForLevel('level5')).toEqual([]);
  });
});
