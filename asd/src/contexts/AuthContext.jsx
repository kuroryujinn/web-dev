import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isDemoMode } from '../services/firebase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// DEV-only demo user (see isDemoMode in firebase.js). Static, so it can seed
// state directly instead of via an effect.
const DEMO_USER = {
  uid: 'demo-user',
  name: 'Demo',
  email: 'demo@local.dev',
  avatar: '🧑',
  photoURL: null,
};

export const AuthProvider = ({ children }) => {
  // In demo mode (dev server without Firebase config) the demo user is signed
  // in immediately and Firebase auth is never touched. firebase.js only sets
  // isDemoMode when import.meta.env.DEV and the config is missing, so this
  // never happens in production.
  const [user, setUser] = useState(isDemoMode ? DEMO_USER : null);
  const [loading, setLoading] = useState(!isDemoMode);

  useEffect(() => {
    if (isDemoMode) return undefined;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'Friend',
          email: firebaseUser.email,
          avatar: '🧑',
          photoURL: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
