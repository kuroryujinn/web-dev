import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { db } from './firebase';

const levelsCollection = () => collection(db, 'levels');
const activitiesCollection = () => collection(db, 'activities');

const mapDoc = (docSnap) => ({ ...docSnap.data(), id: docSnap.id });

/**
 * Fetch all levels, ordered by their progression order.
 * @returns {Promise<Array>} Level documents as plain objects (with id).
 */
export const getLevels = async () => {
  const snapshot = await getDocs(query(levelsCollection(), orderBy('order', 'asc')));
  return snapshot.docs.map(mapDoc);
};

/**
 * Fetch a single level by id.
 * @param {string} levelId
 * @returns {Promise<object|null>} Level document, or null if not found.
 */
export const getLevelById = async (levelId) => {
  const snapshot = await getDoc(doc(levelsCollection(), levelId));
  return snapshot.exists() ? mapDoc(snapshot) : null;
};

/**
 * Fetch all activities for a level, ordered by their display order.
 * @param {string} levelId
 * @returns {Promise<Array>} Activity documents as plain objects (with id).
 */
export const getActivitiesByLevel = async (levelId) => {
  const snapshot = await getDocs(
    query(activitiesCollection(), where('levelId', '==', levelId), orderBy('order', 'asc'))
  );
  return snapshot.docs.map(mapDoc);
};

/**
 * Fetch a single activity by id.
 * @param {string} activityId
 * @returns {Promise<object|null>} Activity document, or null if not found.
 */
export const getActivityById = async (activityId) => {
  const snapshot = await getDoc(doc(activitiesCollection(), activityId));
  return snapshot.exists() ? mapDoc(snapshot) : null;
};
