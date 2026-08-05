/**
 * Static activity content for all levels.
 *
 * Each level directory holds JSON activity definitions that mirror the
 * Firestore `activities/{activityId}` document shape, so the app works
 * out-of-the-box without a seeded backend (and the same documents can be
 * uploaded to Firestore later).
 */
import level1Activities from './level1/identify-fruits.json';
import level1IdentifyAnimals from './level1/identify-animals.json';
import level1IdentifyObjects from './level1/identify-objects.json';
import level1IdentifyColors from './level1/identify-colors.json';
import level1IdentifyShapes from './level1/identify-shapes.json';
import level1MatchBodyParts from './level1/match-body-parts.json';
import level1MatchAnimalsToSounds from './level1/match-animals-to-sounds.json';
import level1MatchColorsToObjects from './level1/match-colors-to-objects.json';
import level2IdentifyVehicles from './level2/identify-vehicles.json';
import level2IdentifyFood from './level2/identify-food.json';
import level2CountObjects from './level2/count-objects.json';
import level2MatchShapesToOutlines from './level2/match-shapes-to-outlines.json';
import level2DragFoodToPlate from './level2/drag-food-to-plate.json';
import level2SortItemsBySize from './level2/sort-items-by-size.json';
import level2MatchNumbersToCounts from './level2/match-numbers-to-counts.json';
import level2MatchThingsToPlaces from './level2/match-things-to-places.json';

const ACTIVITIES_BY_LEVEL = {
  level1: [
    level1Activities,
    level1IdentifyAnimals,
    level1IdentifyObjects,
    level1IdentifyColors,
    level1IdentifyShapes,
    level1MatchBodyParts,
    level1MatchAnimalsToSounds,
    level1MatchColorsToObjects,
  ],
  level2: [
    level2IdentifyVehicles,
    level2IdentifyFood,
    level2CountObjects,
    level2MatchShapesToOutlines,
    level2DragFoodToPlate,
    level2SortItemsBySize,
    level2MatchNumbersToCounts,
    level2MatchThingsToPlaces,
  ],
};

/**
 * All activities for a level, ordered by their display order.
 *
 * Static counterpart to the Firestore-backed `getActivitiesByLevel` in
 * `src/services/activityService.js` — use this for the bundled seed content.
 * @param {string} levelId
 * @returns {Array} Activity objects
 */
export const getActivitiesForLevel = (levelId) => {
  const activities = ACTIVITIES_BY_LEVEL[levelId] || [];
  return [...activities].sort((a, b) => a.order - b.order);
};
