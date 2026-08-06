/**
 * Score calculation utilities for the activity engine.
 * All activity scores are normalized to a 0–100 scale.
 */

/**
 * Calculate stars earned from a 0–100 score.
 * @param {number} score - 0-100
 * @returns {number} 0, 1, 2, or 3 stars
 */
export const calculateStars = (score) => {
  if (score >= 90) return 3;
  if (score >= 70) return 2;
  if (score > 0) return 1;
  return 0;
};

/**
 * Calculate XP earned for an activity completion.
 * @param {number} difficulty - 1, 2, 3, 4, or 5
 * @param {number} stars - 0, 1, 2, or 3
 * @returns {number} XP earned
 */
export const calculateXP = (difficulty, stars) => {
  const baseXP = 10;
  const difficultyMultiplier = { 1: 1, 2: 1.5, 3: 2, 4: 2.5, 5: 3 }[difficulty] || 1;
  const starsMultiplier = { 1: 1, 2: 1.2, 3: 1.5 }[stars] || 1;
  return Math.round(baseXP * difficultyMultiplier * starsMultiplier);
};

const scorePercentage = (correctCount, total) => {
  if (total === 0) return 0;
  return Math.round((correctCount / total) * 100);
};

/**
 * Calculate score for a multiple choice activity.
 * @param {Array} answers - Array of { selected, correct } booleans
 * @returns {number} 0-100
 */
export const calculateMultipleChoiceScore = (answers) =>
  scorePercentage(answers.filter((a) => a.selected === a.correct).length, answers.length);

/**
 * Calculate score for a drag and drop activity.
 * @param {Array} placements - Array of { itemId, targetId, correct }
 * @returns {number} 0-100
 */
export const calculateDragDropScore = (placements) =>
  scorePercentage(placements.filter((p) => p.correct).length, placements.length);

/**
 * Calculate score for a sorting activity.
 * @param {Array} items - Array of { id, position, correctPosition }
 * @returns {number} 0-100
 */
export const calculateSortingScore = (items) =>
  scorePercentage(items.filter((i) => i.position === i.correctPosition).length, items.length);

/**
 * Calculate score for a matching activity.
 * @param {Array} pairs - Array of { leftId, rightId, correct }
 * @returns {number} 0-100
 */
export const calculateMatchingScore = (pairs) =>
  scorePercentage(pairs.filter((p) => p.correct).length, pairs.length);

/**
 * Calculate score for a path tracing activity.
 * @param {Array} points - Array of sampled points with { withinTolerance }
 * @returns {number} 0-100
 */
export const calculatePathTracingScore = (points) =>
  scorePercentage(points.filter((p) => p.withinTolerance).length, points.length);

/**
 * Calculate score for a freehand drawing activity.
 * Effort-based per the design spec: each completed stroke earns points,
 * capped at 100 (5+ strokes). Simplified scoring — no overlap detection.
 * @param {number} strokeCount - Number of completed strokes the user made
 * @returns {number} 0-100
 */
export const calculateFreehandDrawingScore = (strokeCount) =>
  Math.min(100, Math.max(0, strokeCount) * 20);
