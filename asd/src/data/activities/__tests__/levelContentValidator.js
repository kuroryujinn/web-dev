import { getActivitiesForLevel } from '../index';
import { LEVELS } from '../../levels';

/**
 * Shared structural validation for a level's seeded activity content.
 *
 * Each level's test file calls this with its expected shape and gets the
 * common guarantees checked: count, type mix, unique ids, sequential order,
 * type whitelist vs `levels.js`, document fields, ordering, and per-type
 * content shapes. Level-specific assertions live alongside the call site.
 *
 * @param {{ levelId: string, difficulty: number, expectedTypes: Object }} config
 *        expectedTypes maps activity type -> expected count, e.g.
 *        { multipleChoice: 3, dragAndDrop: 3, matching: 2 }
 * @returns {Array} the level's activities (for extra per-level assertions)
 */
export const validateLevelContent = ({ levelId, difficulty, expectedTypes }) => {
  const activities = getActivitiesForLevel(levelId);
  const totalCount = Object.values(expectedTypes).reduce((sum, n) => sum + n, 0);

  describe(`Level ${levelId} activities`, () => {
    it(`provides ${totalCount} activities for ${levelId}`, () => {
      expect(activities).toHaveLength(totalCount);
    });

    it('provides the expected activity type mix', () => {
      const types = activities.map((a) => a.type);
      Object.entries(expectedTypes).forEach(([type, count]) => {
        expect(types.filter((t) => t === type)).toHaveLength(count);
      });
    });

    it(`are all assigned to ${levelId} with unique ids and sequential order`, () => {
      const ids = activities.map((a) => a.id);
      expect(new Set(ids).size).toBe(totalCount);
      activities.forEach((a, i) => {
        expect(a.levelId).toBe(levelId);
        expect(a.order).toBe(i + 1);
      });
    });

    it('only uses activity types supported by the level', () => {
      const level = LEVELS.find((l) => l.id === levelId);
      activities.forEach((a) => {
        expect(level.activityTypes).toContain(a.type);
      });
    });

    it('has valid document-level fields on every activity', () => {
      activities.forEach((a) => {
        expect(a.difficulty).toBe(difficulty);
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

    if (expectedTypes.multipleChoice) {
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
    }

    if (expectedTypes.dragAndDrop) {
      describe('drag and drop content', () => {
        const dnd = activities.filter((a) => a.type === 'dragAndDrop');

        it.each(dnd.map((a) => [a.id, a]))(
          '%s has instructions, unique items, and balanced targets/items',
          (_id, activity) => {
            expect(activity.content.instructions).toBeTruthy();
            expect(activity.content.items.length).toBeGreaterThanOrEqual(3);
            expect(activity.content.targets.length).toBeGreaterThanOrEqual(2);

            const itemIds = activity.content.items.map((i) => i.id);
            const targetIds = activity.content.targets.map((t) => t.id);
            expect(new Set(itemIds).size).toBe(activity.content.items.length);
            expect(new Set(targetIds).size).toBe(activity.content.targets.length);

            // Every target must reference a real item…
            activity.content.targets.forEach((t) => {
              expect(itemIds).toContain(t.correctItemId);
            });
            // …and every item must be the answer to exactly one target, so no
            // item is stranded unplaceable in the UI (balance check).
            const referenced = activity.content.targets.map((t) => t.correctItemId);
            expect(new Set(referenced).size).toBe(referenced.length);
            expect([...itemIds].sort()).toEqual([...referenced].sort());
          },
        );

        it('includes feedback messages', () => {
          dnd.forEach((a) => {
            expect(a.content.feedback.correct).toBeTruthy();
            expect(a.content.feedback.incorrect).toBeTruthy();
          });
        });
      });
    }

    if (expectedTypes.matching) {
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
    }
  });

  return activities;
};
