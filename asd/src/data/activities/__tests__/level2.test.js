import { getActivitiesForLevel } from '../index';
import { validateLevelContent } from './levelContentValidator';

describe('Level 2 activities', () => {
  const activities = validateLevelContent({
    levelId: 'level2',
    difficulty: 2,
    expectedTypes: { multipleChoice: 3, dragAndDrop: 3, matching: 2 },
  });

  it('keeps level 1 content untouched', () => {
    expect(getActivitiesForLevel('level1')).toHaveLength(8);
  });

  // No level-specific extra assertions beyond the shared validator for now.
  expect(activities).toBeDefined();
});
