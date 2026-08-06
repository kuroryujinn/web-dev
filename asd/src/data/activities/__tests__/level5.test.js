import { getActivitiesForLevel } from '../index';
import { validateLevelContent } from './levelContentValidator';

describe('Level 5 activities', () => {
  const activities = validateLevelContent({
    levelId: 'level5',
    difficulty: 5,
    expectedTypes: {
      freehandDrawing: 4,
      sorting: 3,
      dragAndDrop: 3,
      pathTracing: 2,
      matching: 2,
    },
  });

  it('keeps level 4 content untouched', () => {
    expect(getActivitiesForLevel('level4')).toHaveLength(10);
  });

  // No level-specific extra assertions beyond the shared validator for now.
  expect(activities).toBeDefined();
});
