import {
  calculateDragDropScore,
  calculateMatchingScore,
  calculateMultipleChoiceScore,
  calculatePathTracingScore,
  calculateSortingScore,
  calculateStars,
  calculateXP,
} from '../scoring';

describe('calculateStars', () => {
  it('awards 3 stars for scores >= 90', () => {
    expect(calculateStars(90)).toBe(3);
    expect(calculateStars(100)).toBe(3);
  });

  it('awards 2 stars for scores >= 70', () => {
    expect(calculateStars(70)).toBe(2);
    expect(calculateStars(89)).toBe(2);
  });

  it('awards 1 star for any non-zero score below 70', () => {
    expect(calculateStars(1)).toBe(1);
    expect(calculateStars(69)).toBe(1);
  });

  it('awards 0 stars for a zero score', () => {
    expect(calculateStars(0)).toBe(0);
  });
});

describe('calculateXP', () => {
  it('scales base XP by difficulty and stars multipliers', () => {
    expect(calculateXP(1, 1)).toBe(10); // 10 × 1 × 1
    expect(calculateXP(2, 2)).toBe(18); // 10 × 1.5 × 1.2
    expect(calculateXP(3, 3)).toBe(30); // 10 × 2 × 1.5
  });

  it('falls back to a neutral multiplier for unknown values', () => {
    expect(calculateXP(9, 0)).toBe(10);
  });
});

describe('activity scoring helpers', () => {
  it('calculates multiple choice score from correct answers', () => {
    const answers = [
      { selected: true, correct: true },
      { selected: true, correct: false },
      { selected: false, correct: true },
      { selected: true, correct: true },
    ];
    expect(calculateMultipleChoiceScore(answers)).toBe(50);
  });

  it('returns 0 for an empty multiple choice answer list', () => {
    expect(calculateMultipleChoiceScore([])).toBe(0);
  });

  it('calculates drag and drop score from placements', () => {
    const placements = [
      { itemId: 'a', targetId: '1', correct: true },
      { itemId: 'b', targetId: '2', correct: false },
      { itemId: 'c', targetId: '3', correct: true },
    ];
    expect(calculateDragDropScore(placements)).toBe(67);
  });

  it('calculates sorting score from positions', () => {
    const items = [
      { id: 'a', position: 0, correctPosition: 0 },
      { id: 'b', position: 2, correctPosition: 1 },
    ];
    expect(calculateSortingScore(items)).toBe(50);
  });

  it('calculates matching score from pairs', () => {
    const pairs = [
      { leftId: 'a', rightId: 'x', correct: true },
      { leftId: 'b', rightId: 'y', correct: false },
    ];
    expect(calculateMatchingScore(pairs)).toBe(50);
  });

  it('calculates path tracing score from sampled points', () => {
    const points = [
      { x: 1, y: 1, withinTolerance: true },
      { x: 2, y: 2, withinTolerance: true },
      { x: 3, y: 3, withinTolerance: false },
      { x: 4, y: 4, withinTolerance: true },
    ];
    expect(calculatePathTracingScore(points)).toBe(75);
  });
});
