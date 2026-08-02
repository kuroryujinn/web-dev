import { LEVELS, getLevelById, getLevelByOrder, getNextLevel } from '../levels';

const ALL_TYPES = [
  'multipleChoice',
  'pathTracing',
  'freehandDrawing',
  'dragAndDrop',
  'sorting',
  'matching',
];

describe('levels', () => {
  it('defines exactly 5 progressive levels in order', () => {
    expect(LEVELS).toHaveLength(5);
    expect(LEVELS.map((l) => l.order)).toEqual([1, 2, 3, 4, 5]);
    expect(LEVELS.map((l) => l.id)).toEqual([
      'level1',
      'level2',
      'level3',
      'level4',
      'level5',
    ]);
  });

  it('uses the spec unlock XP thresholds', () => {
    expect(LEVELS.map((l) => l.unlockXP)).toEqual([0, 500, 1500, 3000, 5000]);
  });

  it('keeps Level 1 to recognition activities only', () => {
    expect(LEVELS[0].activityTypes).toEqual(['multipleChoice', 'matching']);
  });

  it('excludes freehandDrawing from Level 4 (all types except FreehandDrawing)', () => {
    expect(LEVELS[3].activityTypes).toEqual([
      'multipleChoice',
      'pathTracing',
      'dragAndDrop',
      'sorting',
      'matching',
    ]);
  });

  it('includes all 6 activity types in Level 5', () => {
    expect(LEVELS[4].activityTypes).toEqual(ALL_TYPES);
  });

  describe('helper functions', () => {
    it('getLevelById finds a level by id', () => {
      expect(getLevelById('level3')?.title).toBe('Visual-Motor Integration');
      expect(getLevelById('nope')).toBeUndefined();
    });

    it('getLevelByOrder finds a level by order', () => {
      expect(getLevelByOrder(1)?.id).toBe('level1');
      expect(getLevelByOrder(99)).toBeUndefined();
    });

    it('getNextLevel returns the next level and undefined after the last', () => {
      expect(getNextLevel(2)?.id).toBe('level3');
      expect(getNextLevel(5)).toBeUndefined();
    });
  });
});
