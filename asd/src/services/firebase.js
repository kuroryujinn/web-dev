import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const isConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.authDomain,
);

/**
 * DEV-only demo mode: when Firebase isn't configured, the app runs with a
 * local demo user (see AuthContext) so the UI can be browsed without backend
 * credentials. Never true in production builds (import.meta.env.DEV is false
 * there), and never active in tests (vitest runs with DEV=false and mocks
 * this module).
 */
export const isDemoMode = import.meta.env.DEV && !isConfigured;

let app = null;
let auth;
let db = null;
let googleProvider = null;

if (isDemoMode) {
  // Stub so authService/progressService imports stay safe. AuthContext signs
  // in the demo user directly and never calls Firebase; progressService
  // already falls back to its localStorage backup when Firestore is absent.
  auth = {
    currentUser: null,
    onAuthStateChanged: () => () => {},
  };
} else {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
}

export { auth, db, googleProvider };
export default app;
