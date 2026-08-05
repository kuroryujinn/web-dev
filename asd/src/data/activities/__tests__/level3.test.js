import { getActivitiesForLevel } from '../index';
import { validateLevelContent } from './levelContentValidator';

describe('Level 3 activities', () => {
  const activities = validateLevelContent({
    levelId: 'level3',
    difficulty: 3,
    expectedTypes: { multipleChoice: 2, pathTracing: 3, dragAndDrop: 3, matching: 2 },
  });

  it('keeps level 2 content untouched', () => {
    expect(getActivitiesForLevel('level2')).toHaveLength(8);
  });

  // No level-specific extra assertions beyond the shared validator for now.
  expect(activities).toBeDefined();
});
