import { getActivitiesForLevel } from '../index';
import { validateLevelContent } from './levelContentValidator';

describe('Level 4 activities', () => {
  const activities = validateLevelContent({
    levelId: 'level4',
    difficulty: 4,
    expectedTypes: { sorting: 4, dragAndDrop: 3, pathTracing: 2, multipleChoice: 1 },
  });

  it('keeps level 3 content untouched', () => {
    expect(getActivitiesForLevel('level3')).toHaveLength(10);
  });

  // No level-specific extra assertions beyond the shared validator for now.
  expect(activities).toBeDefined();
});
