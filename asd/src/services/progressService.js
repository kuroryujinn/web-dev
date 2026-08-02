/**
 * Progress persistence — Firestore-backed with a localStorage fallback.
 * Follows the same module pattern as activityService so tests can mock
 * `firebase/firestore` directly.
 */
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const progressDoc = (uid) => doc(db, 'userProgress', uid);

const LOCAL_KEY = (uid) => `asd_progress_${uid}`;

/** Read the localStorage backup for a user (or null). */
export const getLocalProgress = (uid) => {
  try {
    const raw = localStorage.getItem(LOCAL_KEY(uid));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/** Write the localStorage backup for a user. */
export const setLocalProgress = (uid, progress) => {
  try {
    localStorage.setItem(LOCAL_KEY(uid), JSON.stringify(progress));
  } catch {
    // Storage may be unavailable (private mode) — non-fatal.
  }
};

/**
 * Load a user's progress: Firestore first, localStorage as fallback.
 * @param {string} uid
 * @returns {Promise<object|null>} progress object, or null when none exists anywhere
 */
export const loadProgress = async (uid) => {
  try {
    const snapshot = await getDoc(progressDoc(uid));
    if (snapshot.exists()) return snapshot.data();
  } catch {
    // Firestore unavailable — fall through to the local backup.
  }
  return getLocalProgress(uid);
};

/**
 * Persist progress: always write the local backup, then try Firestore.
 * Firestore failures are non-fatal (offline/not configured) — the local
 * backup keeps the session working.
 * @param {string} uid
 * @param {object} progress
 */
export const persistProgress = async (uid, progress) => {
  setLocalProgress(uid, progress);
  try {
    await setDoc(progressDoc(uid), progress, { merge: true });
  } catch {
    // Offline or backend not configured — local backup is authoritative.
  }
};
