import { getActivitiesForLevel } from '../index';
import { validateLevelContent } from './levelContentValidator';

describe('Level 1 activities', () => {
  const activities = validateLevelContent({
    levelId: 'level1',
    difficulty: 1,
    expectedTypes: { multipleChoice: 5, matching: 3 },
  });

  it('returns an empty array for unknown levels', () => {
    expect(getActivitiesForLevel('level99')).toEqual([]);
  });

  // No level-specific extra assertions beyond the shared validator for now.
  expect(activities).toBeDefined();
});
