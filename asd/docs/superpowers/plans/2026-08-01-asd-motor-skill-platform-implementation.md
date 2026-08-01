# ASD Motor-Skill Learning Platform — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the existing quiz app into a progressive, data-driven ASD motor-skill learning platform with Firebase backend, 5 levels, 6 activity types, and full accessibility compliance.

**Architecture:** Data-driven activity engine where every level/activity is defined in JSON/JS modules. Firebase Auth + Firestore for persistence. React Context for global state. Neo-brutalism design system preserved.

**Tech Stack:** React 19, Vite 8, Tailwind CSS 4, Firebase (Auth + Firestore), Vitest

---

## File Structure (Final State)

```
src/
├── contexts/
│   ├── AuthContext.jsx          # Firebase auth state
│   ├── ProgressContext.jsx      # XP, stars, badges state
│   └── SettingsContext.jsx      # User preferences
├── services/
│   ├── firebase.js              # Firebase config & init
│   ├── authService.js           # Login/logout/register
│   ├── progressService.js       # Progress CRUD
│   └── activityService.js       # Activity fetching
├── components/
│   ├── auth/
│   │   ├── LoginPage.jsx        # Refactored login
│   │   ├── GoogleLoginButton.jsx # Firebase Google auth
│   │   └── EmailPasswordForm.jsx # Email/password login
│   ├── dashboard/
│   │   ├── DashboardScreen.jsx  # Home screen
│   │   ├── LevelGrid.jsx        # Level cards grid
│   │   ├── LevelCard.jsx        # Individual level card
│   │   ├── BadgeShelf.jsx       # Badge display
│   │   └── QuickStats.jsx       # Stats summary
│   ├── level/
│   │   ├── LevelScreen.jsx      # Level detail view
│   │   ├── ActivityList.jsx     # Activity cards list
│   │   └── ActivityCard.jsx     # Individual activity card
│   ├── activities/
│   │   ├── ActivityPlayer.jsx   # Main activity renderer
│   │   ├── ActivityHeader.jsx   # Title, timer, score
│   │   ├── MultipleChoiceActivity.jsx
│   │   ├── DragAndDropActivity.jsx
│   │   ├── PathTracingActivity.jsx
│   │   ├── FreehandDrawingActivity.jsx
│   │   ├── SortingActivity.jsx
│   │   └── MatchingActivity.jsx
│   ├── results/
│   │   ├── ResultsScreen.jsx    # Activity completion
│   │   ├── ScoreDisplay.jsx
│   │   ├── StarsEarned.jsx
│   │   └── BadgesEarned.jsx
│   ├── profile/
│   │   ├── ProfileScreen.jsx
│   │   ├── UserStats.jsx
│   │   └── SessionHistory.jsx
│   ├── settings/
│   │   └── SettingsScreen.jsx
│   └── shared/
│       ├── ProgressBar.jsx      # Enhanced progress bar
│       ├── FeedbackOverlay.jsx  # Feedback modal
│       ├── AnswerTile.jsx       # Keep existing
│       └── AccessibleButton.jsx # Reusable button
├── hooks/
│   ├── useTimer.js
│   ├── useDragAndDrop.js
│   ├── usePathTracing.js
│   └── useProgress.js
├── data/
│   ├── levels.js                # 5 level definitions
│   ├── badges.js                # Badge definitions
│   └── activities/
│       ├── level1/              # 8-10 activities
│       ├── level2/              # 8-10 activities
│       ├── level3/              # 10-12 activities
│       ├── level4/              # 10-12 activities
│       └── level5/              # 12-15 activities
├── utils/
│   ├── scoring.js
│   ├── accessibility.js
│   └── storage.js
├── App.jsx                      # Refactored with providers
├── main.jsx
├── index.css
└── styles/
    └── tokens.css
```

---

## Task 1: Foundation & Cleanup

### Task 1.1: Remove unused components

**Files:**
- Delete: `src/components/ResultScreen.jsx`
- Delete: `src/components/StartScreen.jsx`
- Delete: `src/components/QuizCard.jsx`
- Delete: `src/components/AnswerOption.jsx`
- Delete: `src/components/FeedbackBanner.jsx`

- [ ] **Step 1: Delete unused component files**

```bash
rm src/components/ResultScreen.jsx
rm src/components/StartScreen.jsx
rm src/components/QuizCard.jsx
rm src/components/AnswerOption.jsx
rm src/components/FeedbackBanner.jsx
```

- [ ] **Step 2: Verify no imports reference deleted files**

Run: `grep -r "ResultScreen\|StartScreen\|QuizCard\|AnswerOption\|FeedbackBanner" src/ --include="*.jsx" --include="*.js"`
Expected: No matches (or only in test files we'll update)

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove unused components"
```

---

### Task 1.2: Remove unused hooks and data

**Files:**
- Delete: `src/hooks/useQuiz.js`
- Delete: `src/data/questions.json`

- [ ] **Step 1: Delete unused files**

```bash
rm src/hooks/useQuiz.js
rm src/data/questions.json
```

- [ ] **Step 2: Verify no imports reference deleted files**

Run: `grep -r "useQuiz\|questions.json" src/ --include="*.jsx" --include="*.js"`
Expected: No matches

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove unused hooks and data files"
```

---

### Task 1.3: Refactor App.jsx — Clean screen routing

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Rewrite App.jsx with clean routing**

```jsx
import React, { useEffect, useState } from 'react';
import LoginPage from './components/auth/LoginPage';
import DashboardScreen from './components/dashboard/DashboardScreen';

const getStoredUser = () => {
  const storedUser = localStorage.getItem('asd_user');
  if (!storedUser) return null;
  try {
    const parsed = JSON.parse(storedUser);
    if (parsed?.name && parsed?.uid) return parsed;
  } catch {
    localStorage.removeItem('asd_user');
  }
  return null;
};

function AppContent() {
  const [user, setUser] = useState(() => getStoredUser());
  const [screen, setScreen] = useState(() => (getStoredUser() ? 'dashboard' : 'login'));

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setScreen('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('asd_user');
    setUser(null);
    setScreen('login');
  };

  return (
    <div className="App min-h-screen bg-warm-cream selection:bg-warm-coral/60 selection:text-ink transition-colors duration-500">
      <div className="relative w-full min-h-screen z-10 transition-all duration-500 max-w-[1440px] mx-auto">
        {screen === 'login' && <LoginPage onLogin={handleLogin} />}
        {screen === 'dashboard' && user && (
          <DashboardScreen user={user} onLogout={handleLogout} />
        )}
      </div>

      {/* Persistent Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden h-screen w-screen z-0">
        <div className="absolute -top-20 -left-24 w-[420px] h-[420px] bg-warm-peach/70 rounded-full blur-[110px]" />
        <div className="absolute top-[18%] right-[-8%] w-[360px] h-[360px] bg-warm-butter/65 rounded-full blur-[96px]" />
        <div className="absolute bottom-[-12%] left-[25%] w-[430px] h-[430px] bg-warm-mint/55 rounded-full blur-[110px]" />
      </div>
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
```

- [ ] **Step 2: Create placeholder components so app builds**

Create `src/components/auth/LoginPage.jsx` (placeholder):
```jsx
import React from 'react';
const LoginPage = ({ onLogin }) => (
  <div className="flex items-center justify-center min-h-screen">
    <p>Loading...</p>
  </div>
);
export default LoginPage;
```

Create `src/components/dashboard/DashboardScreen.jsx` (placeholder):
```jsx
import React from 'react';
const DashboardScreen = ({ user, onLogout }) => (
  <div className="flex items-center justify-center min-h-screen">
    <p>Welcome {user?.name}</p>
    <button onClick={onLogout}>Logout</button>
  </div>
);
export default DashboardScreen;
```

- [ ] **Step 3: Run build to verify**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor: clean App.jsx routing, remove old screens"
```

---

## Task 2: Firebase Setup & Authentication

### Task 2.1: Install Firebase

- [ ] **Step 1: Install dependencies**

```bash
npm install firebase react-firebase-hooks
```

- [ ] **Step 2: Verify installation**

Run: `npm ls firebase`
Expected: firebase listed in dependencies

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: add firebase and react-firebase-hooks"
```

---

### Task 2.2: Create Firebase config

**Files:**
- Create: `src/services/firebase.js`

- [ ] **Step 1: Create Firebase service file**

```js
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

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
```

- [ ] **Step 2: Create `.env.example`**

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

- [ ] **Step 3: Commit**

```bash
git add src/services/firebase.js .env.example
git commit -m "feat: add Firebase configuration"
```

---

### Task 2.3: Create AuthContext

**Files:**
- Create: `src/contexts/AuthContext.jsx`

- [ ] **Step 1: Create AuthContext**

```jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  const value = { user, loading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add src/contexts/AuthContext.jsx
git commit -m "feat: add AuthContext for Firebase auth state"
```

---

### Task 2.4: Create authService

**Files:**
- Create: `src/services/authService.js`

- [ ] **Step 1: Create auth service**

```js
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

export const signInWithEmail = async (email, password) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};

export const registerWithEmail = async (email, password, displayName) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName });
  return result.user;
};

export const logout = async () => {
  await signOut(auth);
};
```

- [ ] **Step 2: Commit**

```bash
git add src/services/authService.js
git commit -m "feat: add authService for login/register/logout"
```

---

### Task 2.5: Create EmailPasswordForm

**Files:**
- Create: `src/components/auth/EmailPasswordForm.jsx`

- [ ] **Step 1: Create EmailPasswordForm component**

```jsx
import React, { useState } from 'react';

const EmailPasswordForm = ({ onLogin, onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await onRegister(email, password, name);
      } else {
        await onLogin(email, password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isRegister && (
        <div>
          <label htmlFor="name" className="text-xs font-black text-[var(--ink-soft)] block mb-2 uppercase tracking-[0.22em]">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border-[3px] border-[var(--ink)] rounded-xl focus:outline-none bg-white/90 font-black text-[var(--ink)]"
            required
          />
        </div>
      )}
      <div>
        <label htmlFor="email" className="text-xs font-black text-[var(--ink-soft)] block mb-2 uppercase tracking-[0.22em]">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border-[3px] border-[var(--ink)] rounded-xl focus:outline-none bg-white/90 font-black text-[var(--ink)]"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="text-xs font-black text-[var(--ink-soft)] block mb-2 uppercase tracking-[0.22em]">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border-[3px] border-[var(--ink)] rounded-xl focus:outline-none bg-white/90 font-black text-[var(--ink)]"
          required
          minLength={6}
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm font-bold" role="alert">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full brutal-button pressable py-4 text-xl font-black text-[var(--ink)] bg-[var(--surface-coral)] uppercase tracking-[0.12em] disabled:opacity-50"
      >
        {loading ? 'LOADING...' : isRegister ? 'CREATE ACCOUNT' : 'SIGN IN'}
      </button>

      <button
        type="button"
        onClick={() => setIsRegister(!isRegister)}
        className="w-full text-sm font-bold text-[var(--ink-soft)] underline"
      >
        {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
      </button>
    </form>
  );
};

export default EmailPasswordForm;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/auth/EmailPasswordForm.jsx
git commit -m "feat: add EmailPasswordForm component"
```

---

### Task 2.6: Refactor LoginPage with Firebase

**Files:**
- Rewrite: `src/components/auth/LoginPage.jsx`

- [ ] **Step 1: Rewrite LoginPage**

```jsx
import React, { useState } from 'react';
import { signInWithGoogle, signInWithEmail, registerWithEmail } from '../../services/authService';
import EmailPasswordForm from './EmailPasswordForm';
import GoogleLoginButton from './GoogleLoginButton';

const LoginPage = ({ onLogin }) => {
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      onLogin({ uid: user.uid, name: user.displayName, email: user.email, avatar: '🧑' });
    } catch (err) {
      setError(err.message || 'Google login failed');
    }
  };

  const handleEmailLogin = async (email, password) => {
    const user = await signInWithEmail(email, password);
    onLogin({ uid: user.uid, name: user.displayName || 'Friend', email: user.email, avatar: '🧑' });
  };

  const handleEmailRegister = async (email, password, name) => {
    const user = await registerWithEmail(email, password, name);
    onLogin({ uid: user.uid, name: name || user.displayName, email: user.email, avatar: '🧑' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent w-full">
      <div className="w-full h-full flex flex-col lg:flex-row items-stretch min-h-screen gap-6 p-4 md:p-8">
        <div className="flex-1 brutal-card raised-glass-soft flex flex-col justify-center p-8 md:p-12 lg:p-14 relative overflow-hidden bg-warm-butter/70">
          <div className="relative z-10 max-w-xl mx-auto lg:mx-0">
            <div className="mb-6 inline-flex items-center justify-center p-4 rounded-full border-[3px] border-[var(--ink)] bg-white/80">
              <span className="text-5xl inline-block">🚀</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-[var(--ink)] mb-4 tracking-tight leading-tight">
              Welcome to <br /><span className="text-[var(--ink-soft)]">ASD Learn</span>
            </h1>
            <p className="text-base md:text-xl text-[var(--ink-soft)] font-black leading-relaxed mb-8 uppercase tracking-[0.15em]">
              Progressive Motor-Skill Training
            </p>

            <div className="space-y-6">
              <EmailPasswordForm onLogin={handleEmailLogin} onRegister={handleEmailRegister} />
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-[var(--ink)]" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-warm-butter/70 text-[var(--ink-soft)] font-bold">OR</span>
                </div>
              </div>
              <GoogleLoginButton onGoogleLogin={handleGoogleLogin} />
            </div>

            {error && (
              <p className="mt-4 text-red-500 text-sm font-bold" role="alert">{error}</p>
            )}
          </div>
        </div>

        <div className="flex-1 brutal-card raised-glass-soft bg-warm-sky/70 p-8 md:p-12 lg:p-14 flex flex-col justify-center relative overflow-hidden">
          <div className="relative z-10 w-full max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-black text-[var(--ink)] mb-6">Start Learning</h2>
            <p className="text-lg md:text-xl text-[var(--ink-soft)] font-bold mb-8">
              5 levels of progressive motor-skill activities designed for children with ASD
            </p>
            <div className="grid grid-cols-5 gap-3">
              {['🔵', '🟢', '🟡', '🟠', '🔴'].map((emoji, i) => (
                <div key={i} className="brutal-card p-4 rounded-xl bg-white text-center">
                  <span className="text-3xl">{emoji}</span>
                  <p className="text-xs font-black mt-2 uppercase">Level {i + 1}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
```

- [ ] **Step 2: Update GoogleLoginButton**

```jsx
import React from 'react';

const GoogleLoginButton = ({ onGoogleLogin }) => {
  return (
    <button
      onClick={onGoogleLogin}
      className="w-full brutal-button pressable py-4 text-xl font-black text-[var(--ink)] bg-white uppercase tracking-[0.12em] flex items-center justify-center gap-3"
    >
      <span className="text-2xl">G</span> SIGN IN WITH GOOGLE
    </button>
  );
};

export default GoogleLoginButton;
```

- [ ] **Step 3: Run build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: implement Firebase auth in LoginPage"
```

---

## Task 3: Activity Engine Core

### Task 3.1: Create level definitions

**Files:**
- Create: `src/data/levels.js`

- [ ] **Step 1: Create levels data**

```js
export const LEVELS = [
  {
    id: 'level1',
    order: 1,
    title: 'Core Recognition',
    description: 'Identify objects, animals, and basic concepts',
    unlockXP: 0,
    icon: '🔵',
    color: '#5eaefd',
    activityTypes: ['multipleChoice', 'matching'],
  },
  {
    id: 'level2',
    order: 2,
    title: 'Basic Coordination',
    description: 'Drag and drop matching, shape recognition',
    unlockXP: 500,
    icon: '🟢',
    color: '#57d19d',
    activityTypes: ['multipleChoice', 'dragAndDrop', 'matching'],
  },
  {
    id: 'level3',
    order: 3,
    title: 'Visual-Motor Integration',
    description: 'Trace paths, follow directions, connect objects',
    unlockXP: 1500,
    icon: '🟡',
    color: '#ffc94a',
    activityTypes: ['multipleChoice', 'pathTracing', 'dragAndDrop', 'matching'],
  },
  {
    id: 'level4',
    order: 4,
    title: 'Fine Motor Skills',
    description: 'Precision sorting, sequencing, pattern completion',
    unlockXP: 3000,
    icon: '🟠',
    color: '#ff7a59',
    activityTypes: ['multipleChoice', 'pathTracing', 'dragAndDrop', 'sorting', 'matching'],
  },
  {
    id: 'level5',
    order: 5,
    title: 'Functional Activities',
    description: 'Daily-life simulations, multi-step tasks, drawing',
    unlockXP: 5000,
    icon: '🔴',
    color: '#e74c3c',
    activityTypes: ['multipleChoice', 'pathTracing', 'freehandDrawing', 'dragAndDrop', 'sorting', 'matching'],
  },
];

export const getLevelById = (id) => LEVELS.find((l) => l.id === id);
export const getLevelByOrder = (order) => LEVELS.find((l) => l.order === order);
export const getNextLevel = (currentOrder) => LEVELS.find((l) => l.order === currentOrder + 1);
```

- [ ] **Step 2: Commit**

```bash
git add src/data/levels.js
git commit -m "feat: add level definitions"
```

---

### Task 3.2: Create badge definitions

**Files:**
- Create: `src/data/badges.js`

- [ ] **Step 1: Create badges data**

```js
export const BADGES = [
  {
    id: 'first_steps',
    title: 'First Steps',
    description: 'Complete your first activity',
    icon: '👶',
    rarity: 'common',
    criteria: { type: 'activities_completed', count: 1 },
  },
  {
    id: 'quick_learner',
    title: 'Quick Learner',
    description: 'Complete 5 activities in one session',
    icon: '⚡',
    rarity: 'common',
    criteria: { type: 'session_activities', count: 5 },
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Get 3 stars on any activity',
    icon: '⭐',
    rarity: 'rare',
    criteria: { type: 'three_stars', count: 1 },
  },
  {
    id: 'level_up',
    title: 'Level Up',
    description: 'Unlock a new level',
    icon: '🔓',
    rarity: 'rare',
    criteria: { type: 'levels_unlocked', count: 1 },
  },
  {
    id: 'streak_master',
    title: 'Streak Master',
    description: 'Login 7 days in a row',
    icon: '🔥',
    rarity: 'epic',
    criteria: { type: 'login_streak', count: 7 },
  },
  {
    id: 'badge_collector',
    title: 'Badge Collector',
    description: 'Earn 10 badges',
    icon: '🏆',
    rarity: 'epic',
    criteria: { type: 'badges_earned', count: 10 },
  },
  {
    id: 'motor_pro',
    title: 'Motor Skills Pro',
    description: 'Complete Level 4',
    icon: '🏅',
    rarity: 'legendary',
    criteria: { type: 'level_completed', level: 4 },
  },
  {
    id: 'master_artist',
    title: 'Master Artist',
    description: 'Complete Level 5',
    icon: '🎨',
    rarity: 'legendary',
    criteria: { type: 'level_completed', level: 5 },
  },
];

export const getBadgeById = (id) => BADGES.find((b) => b.id === id);
```

- [ ] **Step 2: Commit**

```bash
git add src/data/badges.js
git commit -m "feat: add badge definitions"
```

---

### Task 3.3: Create scoring utilities

**Files:**
- Create: `src/utils/scoring.js`

- [ ] **Step 1: Create scoring utilities**

```js
/**
 * Calculate stars based on score percentage
 * @param {number} score - 0-100
 * @returns {number} 1, 2, or 3 stars
 */
export const calculateStars = (score) => {
  if (score >= 90) return 3;
  if (score >= 70) return 2;
  if (score > 0) return 1;
  return 0;
};

/**
 * Calculate XP earned for an activity
 * @param {number} difficulty - 1, 2, or 3
 * @param {number} stars - 1, 2, or 3
 * @returns {number} XP earned
 */
export const calculateXP = (difficulty, stars) => {
  const baseXP = 10;
  const difficultyMultiplier = { 1: 1, 2: 1.5, 3: 2 }[difficulty] || 1;
  const starsMultiplier = { 1: 1, 2: 1.2, 3: 1.5 }[stars] || 1;
  return Math.round(baseXP * difficultyMultiplier * starsMultiplier);
};

/**
 * Calculate score for multiple choice activity
 * @param {Array} answers - Array of { selected, correct } booleans
 * @returns {number} 0-100
 */
export const calculateMultipleChoiceScore = (answers) => {
  if (answers.length === 0) return 0;
  const correct = answers.filter((a) => a.selected === a.correct).length;
  return Math.round((correct / answers.length) * 100);
};

/**
 * Calculate score for drag and drop activity
 * @param {Array} placements - Array of { itemId, targetId, correct }
 * @returns {number} 0-100
 */
export const calculateDragDropScore = (placements) => {
  if (placements.length === 0) return 0;
  const correct = placements.filter((p) => p.correct).length;
  return Math.round((correct / placements.length) * 100);
};

/**
 * Calculate score for sorting activity
 * @param {Array} items - Array of { id, position, correctPosition }
 * @returns {number} 0-100
 */
export const calculateSortingScore = (items) => {
  if (items.length === 0) return 0;
  const correct = items.filter((i) => i.position === i.correctPosition).length;
  return Math.round((correct / items.length) * 100);
};

/**
 * Calculate score for matching activity
 * @param {Array} pairs - Array of { leftId, rightId, correct }
 * @returns {number} 0-100
 */
export const calculateMatchingScore = (pairs) => {
  if (pairs.length === 0) return 0;
  const correct = pairs.filter((p) => p.correct).length;
  return Math.round((correct / pairs.length) * 100);
};
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/scoring.js
git commit -m "feat: add scoring utilities"
```

---

### Task 3.4: Create ActivityPlayer

**Files:**
- Create: `src/components/activities/ActivityPlayer.jsx`

- [ ] **Step 1: Create ActivityPlayer component**

```jsx
import React, { useState, useCallback } from 'react';
import ActivityHeader from './ActivityHeader';
import MultipleChoiceActivity from './MultipleChoiceActivity';
import DragAndDropActivity from './DragAndDropActivity';
import PathTracingActivity from './PathTracingActivity';
import FreehandDrawingActivity from './FreehandDrawingActivity';
import SortingActivity from './SortingActivity';
import MatchingActivity from './MatchingActivity';
import FeedbackOverlay from '../shared/FeedbackOverlay';
import ResultsScreen from '../results/ResultsScreen';
import { calculateStars, calculateXP } from '../../utils/scoring';

const ACTIVITY_COMPONENTS = {
  multipleChoice: MultipleChoiceActivity,
  dragAndDrop: DragAndDropActivity,
  pathTracing: PathTracingActivity,
  freehandDrawing: FreehandDrawingActivity,
  sorting: SortingActivity,
  matching: MatchingActivity,
};

const ActivityPlayer = ({ activity, onComplete, onBack }) => {
  const [score, setScore] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const ActivityComponent = ACTIVITY_COMPONENTS[activity.type];

  const handleComplete = useCallback((activityScore) => {
    setScore(activityScore);
    const stars = calculateStars(activityScore);
    const xp = calculateXP(activity.difficulty, stars);
    setIsCorrect(activityScore >= 70);
    setFeedbackMessage(
      activityScore >= 90
        ? activity.feedback?.correct || 'Excellent work!'
        : activityScore >= 70
        ? 'Good job! Keep practicing!'
        : activity.feedback?.incorrect || 'Keep trying!'
    );
    setShowFeedback(true);
  }, [activity]);

  const handleContinue = useCallback(() => {
    const stars = calculateStars(score);
    const xp = calculateXP(activity.difficulty, stars);
    onComplete({ score, stars, xp, activityId: activity.id });
  }, [score, activity, onComplete]);

  if (score !== null) {
    return (
      <ResultsScreen
        score={score}
        totalQuestions={activity.maxScore || 100}
        stars={calculateStars(score)}
        xp={calculateXP(activity.difficulty, calculateStars(score))}
        activityTitle={activity.title}
        onPlayAgain={() => {
          setScore(null);
          setShowFeedback(false);
        }}
        onBackToHome={onBack}
      />
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-start py-8 lg:py-12 min-h-screen bg-transparent p-4 lg:p-10 w-full overflow-x-hidden">
      <ActivityHeader
        title={activity.title}
        timer={activity.timeLimit}
        onBack={onBack}
      />

      <div className="w-full max-w-[90vw] flex-1 flex flex-col items-center">
        {ActivityComponent ? (
          <ActivityComponent
            content={activity.content}
            onComplete={handleComplete}
          />
        ) : (
          <div className="text-center">
            <p className="text-xl font-bold text-[var(--ink)]">Activity type not supported</p>
            <button onClick={onBack} className="mt-4 brutal-button pressable px-6 py-3">
              Go Back
            </button>
          </div>
        )}
      </div>

      {showFeedback && (
        <FeedbackOverlay
          isCorrect={isCorrect}
          feedback={feedbackMessage}
          onNext={handleContinue}
        />
      )}
    </div>
  );
};

export default ActivityPlayer;
```

- [ ] **Step 2: Create ActivityHeader**

```jsx
import React, { useState, useEffect } from 'react';

const ActivityHeader = ({ title, timer, onBack }) => {
  const [timeLeft, setTimeLeft] = useState(timer);

  useEffect(() => {
    if (!timer || timeLeft === null) return;
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-5xl mb-8 flex flex-col items-center relative z-10 brutal-card raised-glass-soft bg-warm-butter/70 p-4 md:p-6">
      <div className="w-full max-w-4xl flex justify-between items-center px-2 md:px-4">
        <button
          onClick={onBack}
          className="brutal-button pressable px-4 py-2 text-sm font-black text-[var(--ink)] uppercase"
          aria-label="Go back"
        >
          ← BACK
        </button>

        <h1 className="text-xl md:text-3xl font-black text-[var(--ink)] tracking-tight text-center flex-1 mx-4">
          {title}
       1        </h1>

        {timer && timeLeft !== null && (
          <div className="brutal-card px-4 py-2 bg-white">
            <span className="text-lg font-black text-[var(--ink)] tabular-nums">
              {formatTime(timeLeft)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityHeader;
```

- [ ] **Step 3: Commit**

```bash
git add src/components/activities/ActivityPlayer.jsx src/components/activities/ActivityHeader.jsx
git commit -m "feat: add ActivityPlayer and ActivityHeader"
```

---

### Task 3.5: Create ResultsScreen

**Files:**
- Create: `src/components/results/ResultsScreen.jsx`

- [ ] **Step 1: Create ResultsScreen**

```jsx
import React from 'react';
import StarsEarned from './StarsEarned';
import ScoreDisplay from './ScoreDisplay';
import BadgesEarned from './BadgesEarned';

const ResultsScreen = ({ score, totalQuestions, stars, xp, activityTitle, onPlayAgain, onBackToHome }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-transparent p-6 relative overflow-hidden">
      <div className="w-full max-w-4xl brutal-card raised-glass-soft p-8 md:p-14 rounded-[2rem] text-center relative z-10 bg-warm-peach/75">
        <div className="absolute top-0 left-0 w-full h-1 bg-[var(--ink)]" />

        <h1 className="text-4xl md:text-6xl font-black text-[var(--ink)] tracking-tight uppercase leading-none mb-2">
          SESSION {score >= 70 ? 'COMPLETE' : 'RETRY'}
        </h1>
        <p className="text-lg md:text-xl text-[var(--ink-soft)] font-black tracking-[0.18em] uppercase mb-8">
          {activityTitle}
        </p>

        <ScoreDisplay score={score} total={totalQuestions} />
        <StarsEarned stars={stars} />

        <div className="my-8">
          <div className="brutal-card inline-block px-6 py-3 bg-warm-mint/50">
            <span className="text-2xl font-black text-[var(--ink)]">+{xp} XP</span>
          </div>
        </div>

        <BadgesEarned />

        <div className="flex flex-col md:flex-row gap-6 justify-center w-full max-w-xl mx-auto mt-8">
          <button
            onClick={onPlayAgain}
            className="flex-1 brutal-button pressable px-8 py-4 text-xl font-black text-[var(--ink)] bg-[var(--surface-mint)] uppercase tracking-[0.1em]"
          >
            PLAY AGAIN
          </button>
          <button
            onClick={onBackToHome}
            className="flex-1 brutal-button pressable px-8 py-4 text-xl font-black text-[var(--ink)] bg-[var(--surface-sky)] uppercase tracking-[0.1em]"
          >
            HOME
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
```

- [ ] **Step 2: Create ScoreDisplay**

```jsx
import React from 'react';

const ScoreDisplay = ({ score, total }) => (
  <div className="flex flex-col items-center justify-center my-6">
    <div className="brutal-card rounded-[1.5rem] w-48 h-48 md:w-56 md:h-56 flex flex-col items-center justify-center bg-warm-butter/80">
      <span className="text-5xl md:text-7xl font-black text-[var(--ink)] leading-none">{score}</span>
      <div className="w-12 h-1 bg-[var(--ink)] my-2" />
      <span className="text-xl md:text-2xl font-black text-[var(--ink-soft)] leading-none">{total}</span>
    </div>
  </div>
);

export default ScoreDisplay;
```

- [ ] **Step 3: Create StarsEarned**

```jsx
import React from 'react';

const StarsEarned = ({ stars }) => (
  <div className="flex justify-center gap-2 my-4" role="img" aria-label={`${stars} stars earned`}>
    {[1, 2, 3].map((i) => (
      <span
        key={i}
        className={`text-4xl md:text-5xl transition-all duration-300 ${
          i <= stars ? 'opacity-100 scale-110' : 'opacity-30 scale-90'
        }`}
      >
        ⭐
      </span>
    ))}
  </div>
);

export default StarsEarned;
```

- [ ] **Step 4: Create BadgesEarned (placeholder)**

```jsx
import React from 'react';

const BadgesEarned = ({ badges = [] }) => {
  if (badges.length === 0) return null;

  return (
    <div className="my-6">
      <h3 className="text-sm font-black text-[var(--ink-soft)] uppercase tracking-[0.2em] mb-3">Badges Earned</h3>
      <div className="flex justify-center gap-3">
        {badges.map((badge) => (
          <div key={badge.id} className="brutal-card p-3 rounded-xl bg-white text-center">
            <span className="text-3xl">{badge.icon}</span>
            <p className="text-xs font-bold mt-1">{badge.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgesEarned;
```

- [ ] **Step 5: Commit**

```bash
git add src/components/results/
git commit -m "feat: add ResultsScreen with score, stars, badges"
```

---

## Task 4: Activity Types

### Task 4.1: MultipleChoiceActivity

**Files:**
- Create: `src/components/activities/MultipleChoiceActivity.jsx`

- [ ] **Step 1: Create MultipleChoiceActivity**

```jsx
import React, { useState, useMemo } from 'react';
import AnswerTile from '../shared/AnswerTile';

const MultipleChoiceActivity = ({ content, onComplete }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const shuffledOptions = useMemo(() => {
    const options = [...content.options];
    if (options.length <= 1) return options;
    const offset = Date.now() % options.length;
    return [...options.slice(offset), ...options.slice(0, offset)];
  }, [content.options]);

  const handleSelect = (option) => {
    if (showResult) return;
    setSelectedAnswer(option);
    setShowResult(true);

    const isCorrect = option.correct;
    const score = isCorrect ? 100 : 0;
    setTimeout(() => onComplete(score), 1500);
  };

  return (
    <div
      data-testid="multiple-choice-activity"
      className="brutal-card raised-glass-soft relative w-full max-w-5xl rounded-[2rem] bg-[#b85d33]/90 p-6 md:p-10 lg:p-12"
    >
      <div className="flex flex-col items-center mb-10 relative z-10">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-[var(--ink)] mb-8 text-center tracking-tight leading-tight max-w-4xl">
          {content.questionLabel}
        </h2>

        {content.questionImage && (
          <div className="relative w-full aspect-video md:aspect-[21/9] rounded-[24px] overflow-hidden bg-[var(--bg-warm)] border-[3px] border-[var(--ink)] flex items-center justify-center mb-8">
            <img
              src={content.questionImage}
              alt={content.questionAlt}
              className="w-full h-full object-contain p-6"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-5 md:gap-6 relative z-20 w-full max-w-5xl mx-auto">
        {shuffledOptions.map((option) => (
          <AnswerTile
            key={option.id}
            option={option}
            onSelect={() => handleSelect(option)}
            isSelected={selectedAnswer?.id === option.id}
            isCorrect={option.correct}
            showResult={showResult}
          />
        ))}
      </div>
    </div>
  );
};

export default MultipleChoiceActivity;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/activities/MultipleChoiceActivity.jsx
git commit -m "feat: add MultipleChoiceActivity"
```

---

### Task 4.2: DragAndDropActivity

**Files:**
- Create: `src/hooks/useDragAndDrop.js`
- Create: `src/components/activities/DragAndDropActivity.jsx`

- [ ] **Step 1: Create useDragAndDrop hook**

```js
import { useState, useCallback } from 'react';

export const useDragAndDrop = (items, targets) => {
  const [assignments, setAssignments] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = useCallback((itemId) => {
    setDraggedItem(itemId);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
  }, []);

  const handleDrop = useCallback((targetId) => {
    if (!draggedItem) return;
    setAssignments((prev) => ({
      ...prev,
      [targetId]: draggedItem,
    }));
    setDraggedItem(null);
  }, [draggedItem]);

  const handleTapAssign = useCallback((itemId, targetId) => {
    setAssignments((prev) => ({
      ...prev,
      [targetId]: itemId,
    }));
  }, []);

  const getPlacements = useCallback(() => {
    return targets.map((target) => ({
      targetId: target.id,
      itemId: assignments[target.id] || null,
      correct: assignments[target.id] === target.correctItemId,
    }));
  }, [assignments, targets]);

  const isComplete = targets.every((t) => assignments[t.id]);

  const reset = useCallback(() => {
    setAssignments({});
    setDraggedItem(null);
  }, []);

  return {
    assignments,
    draggedItem,
    handleDragStart,
    handleDragEnd,
    handleDrop,
    handleTapAssign,
    getPlacements,
    isComplete,
    reset,
  };
};
```

- [ ] **Step 2: Create DragAndDropActivity**

```jsx
import React, { useState, useCallback } from 'react';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { calculateDragDropScore } from '../../utils/scoring';

const DragAndDropActivity = ({ content, onComplete }) => {
  const {
    assignments,
    draggedItem,
    handleDragStart,
    handleDragEnd,
    handleDrop,
    handleTapAssign,
    getPlacements,
    isComplete,
  } = useDragAndDrop(content.items, content.targets);

  const [selectedItem, setSelectedItem] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleItemClick = (itemId) => {
    if (showResult) return;
    if (selectedItem === itemId) {
      setSelectedItem(null);
    } else {
      setSelectedItem(itemId);
    }
  };

  const handleTargetClick = (targetId) => {
    if (showResult || !selectedItem) return;
    handleTapAssign(selectedItem, targetId);
    setSelectedItem(null);
  };

  const handleSubmit = () => {
    const placements = getPlacements();
    const score = calculateDragDropScore(placements);
    setShowResult(true);
    setTimeout(() => onComplete(score), 1500);
  };

  return (
    <div
      data-testid="drag-drop-activity"
      className="brutal-card raised-glass-soft relative w-full max-w-5xl rounded-[2rem] bg-[#b85d33]/90 p-6 md:p-10"
    >
      <h2 className="text-2xl md:text-4xl font-black text-[var(--ink)] mb-6 text-center">
        {content.instructions}
      </h2>

      {/* Items to drag */}
      <div className="mb-8">
        <h3 className="text-sm font-black text-[var(--ink-soft)] uppercase tracking-[0.2em] mb-4">Items</h3>
        <div className="flex flex-wrap gap-4 justify-center">
          {content.items.map((item) => (
            <button
              key={item.id}
              data-testid={`drag-item-${item.id}`}
              draggable={!showResult}
              onDragStart={() => handleDragStart(item.id)}
              onDragEnd={handleDragEnd}
              onClick={() => handleItemClick(item.id)}
              className={`brutal-tile pressable p-4 rounded-xl text-lg font-black cursor-pointer transition-all
                ${selectedItem === item.id
                  ? 'bg-[var(--surface-butter)] -translate-y-1'
                  : 'bg-white/85 hover:bg-[var(--surface-sky)]'
                }
                ${showResult ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              disabled={showResult}
            >
              {item.image && (
                <img src={item.image} alt={item.label} className="w-12 h-12 object-contain mb-2 mx-auto" />
              )}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Targets */}
      <div className="mb-8">
        <h3 className="text-sm font-black text-[var(--ink-soft)] uppercase tracking-[0.2em] mb-4">Targets</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {content.targets.map((target) => (
            <div
              key={target.id}
              data-testid={`drop-target-${target.id}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(target.id)}
              onClick={() => handleTargetClick(target.id)}
              className={`brutal-tile p-6 rounded-xl text-center cursor-pointer transition-all min-h-[100px]
                ${assignments[target.id]
                  ? 'bg-[var(--surface-mint)]'
                  : 'bg-white/60 border-dashed border-[3px] border-[var(--ink)]'
                }
                ${showResult && assignments[target.id] === target.correctItemId
                  ? 'bg-[var(--surface-mint)]'
                  : showResult && assignments[target.id]
                  ? 'bg-[var(--surface-coral)]'
                  : ''
                }
              `}
            >
              {target.image && (
                <img src={target.image} alt={target.label} className="w-16 h-16 object-contain mx-auto mb-2" />
              )}
              <p className="font-black text-[var(--ink)]">{target.label}</p>
              {assignments[target.id] && (
                <p className="text-sm mt-2 font-bold text-[var(--ink-soft)]">
                  → {content.items.find((i) => i.id === assignments[target.id])?.label}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {!showResult && (
        <button
          onClick={handleSubmit}
          disabled={!isComplete}
          className="w-full brutal-button pressable py-4 text-xl font-black text-[var(--ink)] bg-[var(--surface-coral)] uppercase tracking-[0.1em] disabled:opacity-50"
        >
          CHECK ANSWERS
        </button>
      )}
    </div>
  );
};

export default DragAndDropActivity;
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useDragAndDrop.js src/components/activities/DragAndDropActivity.jsx
git commit -m "feat: add DragAndDropActivity with tap and drag support"
```

---

### Task 4.3: PathTracingActivity

**Files:**
- Create: `src/hooks/usePathTracing.js`
- Create: `src/components/activities/PathTracingActivity.jsx`

- [ ] **Step 1: Create usePathTracing hook**

```js
import { useState, useCallback, useRef } from 'react';

export const usePathTracing = () => {
  const [strokes, setStrokes] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState([]);
  const svgRef = useRef(null);

  const getPointerPosition = useCallback((e) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
  }, []);

  const handlePointerDown = useCallback((e) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getPointerPosition(e);
    setCurrentStroke([pos]);
  }, [getPointerPosition]);

  const handlePointerMove = useCallback((e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPointerPosition(e);
    setCurrentStroke((prev) => [...prev, pos]);
  }, [isDrawing, getPointerPosition]);

  const handlePointerUp = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentStroke.length > 1) {
      setStrokes((prev) => [...prev, currentStroke]);
    }
    setCurrentStroke([]);
  }, [isDrawing, currentStroke]);

  const clearStrokes = useCallback(() => {
    setStrokes([]);
    setCurrentStroke([]);
  }, []);

  const undoStroke = useCallback(() => {
    setStrokes((prev) => prev.slice(0, -1));
  }, []);

  return {
    strokes,
    currentStroke,
    isDrawing,
    svgRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    clearStrokes,
    undoStroke,
  };
};
```

- [ ] **Step 2: Create PathTracingActivity**

```jsx
import React, { useState } from 'react';
import { usePathTracing } from '../../hooks/usePathTracing';

const PathTracingActivity = ({ content, onComplete }) => {
  const {
    strokes,
    currentStroke,
    isDrawing,
    svgRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    clearStrokes,
    undoStroke,
  } = usePathTracing();

  const [showResult, setShowResult] = useState(false);

  const strokeToPath = (points) => {
    if (points.length < 2) return '';
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  };

  const handleSubmit = () => {
    const totalStrokes = strokes.length + (currentStroke.length > 1 ? 1 : 0);
    const score = Math.min(100, totalStrokes * 20);
    setShowResult(true);
    setTimeout(() => onComplete(score), 1500);
  };

  return (
    <div
      data-testid="path-tracing-activity"
      className="brutal-card raised-glass-soft relative w-full max-w-5xl rounded-[2rem] bg-[#b85d33]/90 p-6 md:p-10"
    >
      <h2 className="text-2xl md:text-4xl font-black text-[var(--ink)] mb-6 text-center">
        {content.instructions}
      </h2>

      <div className="relative w-full aspect-video rounded-[24px] overflow-hidden bg-white border-[3px] border-[var(--ink)] mb-6">
        <svg
          ref={svgRef}
          viewBox="0 0 100 100"
          className="w-full h-full touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* Template paths */}
          {content.paths.map((path) => (
            <path
              key={path.id}
              d={path.d}
              fill="none"
              stroke="#ddd"
              strokeWidth={path.strokeWidth || 2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* User strokes */}
          {strokes.map((stroke, i) => (
            <path
              key={i}
              d={strokeToPath(stroke)}
              fill="none"
              stroke="#ff7a59"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Current stroke */}
          {currentStroke.length > 1 && (
            <path
              d={strokeToPath(currentStroke)}
              fill="none"
              stroke="#ff7a59"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.7}
            />
          )}
        </svg>
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={undoStroke}
          disabled={strokes.length === 0 || showResult}
          className="brutal-button pressable px-6 py-3 text-sm font-black uppercase disabled:opacity-50"
        >
          UNDO
        </button>
        <button
          onClick={clearStrokes}
          disabled={strokes.length === 0 || showResult}
          className="brutal-button pressable px-6 py-3 text-sm font-black uppercase disabled:opacity-50"
        >
          CLEAR
        </button>
        <button
          onClick={handleSubmit}
          disabled={strokes.length === 0 || showResult}
          className="brutal-button pressable px-8 py-3 text-sm font-black text-[var(--ink)] bg-[var(--surface-coral)] uppercase disabled:opacity-50"
        >
          DONE
        </button>
      </div>
    </div>
  );
};

export default PathTracingActivity;
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/usePathTracing.js src/components/activities/PathTracingActivity.jsx
git commit -m "feat: add PathTracingActivity with SVG drawing"
```

---

### Task 4.4: FreehandDrawingActivity

**Files:**
- Create: `src/components/activities/FreehandDrawingActivity.jsx`

- [ ] **Step 1: Create FreehandDrawingActivity**

```jsx
import React, { useState, useRef, useCallback, useEffect } from 'react';

const FreehandDrawingActivity = ({ content, onComplete }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDrawing = useCallback((e) => {
    e.preventDefault();
    setIsDrawing(true);
    setHasDrawn(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }, []);

  const draw = useCallback((e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = '#1f1a17';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.stroke();
  }, [isDrawing]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  }, []);

  const handleSubmit = () => {
    const score = hasDrawn ? 80 : 0;
    setShowResult(true);
    setTimeout(() => onComplete(score), 1500);
  };

  return (
    <div
      data-testid="freehand-drawing-activity"
      className="brutal-card raised-glass-soft relative w-full max-w-5xl rounded-[2rem] bg-[#b85d33]/90 p-6 md:p-10"
    >
      <h2 className="text-2xl md:text-4xl font-black text-[var(--ink)] mb-6 text-center">
        {content.instructions}
      </h2>

      <div className="relative w-full aspect-video rounded-[24px] overflow-hidden border-[3px] border-[var(--ink)] mb-6 bg-white">
        <canvas
          ref={canvasRef}
          width={800}
          height={450}
          className="w-full h-full touch-none cursor-crosshair"
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
        />
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={clearCanvas}
          disabled={!hasDrawn || showResult}
          className="brutal-button pressable px-6 py-3 text-sm font-black uppercase disabled:opacity-50"
        >
          CLEAR
        </button>
        <button
          onClick={handleSubmit}
          disabled={!hasDrawn || showResult}
          className="brutal-button pressable px-8 py-3 text-sm font-black text-[var(--ink)] bg-[var(--surface-coral)] uppercase disabled:opacity-50"
        >
          DONE
        </button>
      </div>
    </div>
  );
};

export default FreehandDrawingActivity;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/activities/FreehandDrawingActivity.jsx
git commit -m "feat: add FreehandDrawingActivity with canvas"
```

---

### Task 4.5: SortingActivity

**Files:**
- Create: `src/components/activities/SortingActivity.jsx`

- [ ] **Step 1: Create SortingActivity**

```jsx
import React, { useState, useCallback } from 'react';
import { calculateSortingScore } from '../../utils/scoring';

const SortingActivity = ({ content, onComplete }) => {
  const [items, setItems] = useState(() => {
    return content.items.map((item, index) => ({
      ...item,
      currentPosition: index,
    }));
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleItemClick = (index) => {
    if (showResult) return;
    if (selectedItem === null) {
      setSelectedItem(index);
    } else {
      // Swap items
      setItems((prev) => {
        const newItems = [...prev];
        const temp = newItems[selectedItem].currentPosition;
        newItems[selectedItem] = { ...newItems[selectedItem], currentPosition: newItems[index].currentPosition };
        newItems[index] = { ...newItems[index], currentPosition: temp };
        return newItems;
      });
      setSelectedItem(null);
    }
  };

  const sortedItems = [...items].sort((a, b) => a.currentPosition - b.currentPosition);

  const handleSubmit = () => {
    const score = calculateSortingScore(
      items.map((item) => ({
        position: item.currentPosition,
        correctPosition: item.order,
      }))
    );
    setShowResult(true);
    setTimeout(() => onComplete(score), 1500);
  };

  return (
    <div
      data-testid="sorting-activity"
      className="brutal-card raised-glass-soft relative w-full max-w-5xl rounded-[2rem] bg-[#b85d33]/90 p-6 md:p-10"
    >
      <h2 className="text-2xl md:text-4xl font-black text-[var(--ink)] mb-2 text-center">
        {content.instructions}
      </h2>
      <p className="text-sm font-bold text-[var(--ink-soft)] text-center mb-6">
        Direction: {content.direction} • Tap two items to swap them
      </p>

      <div className="flex flex-col gap-4 max-w-2xl mx-auto">
        {sortedItems.map((item, displayIndex) => {
          const isCorrect = showResult && item.currentPosition === item.order;
          const isWrong = showResult && item.currentPosition !== item.order;

          return (
            <button
              key={item.id}
              data-testid={`sort-item-${item.id}`}
              onClick={() => handleItemClick(displayIndex)}
              className={`brutal-tile pressable p-4 md:p-6 flex items-center gap-4 text-left transition-all
                ${selectedItem === displayIndex
                  ? 'bg-[var(--surface-butter)] -translate-y-1'
                  : isCorrect
                  ? 'bg-[var(--surface-mint)]'
                  : isWrong
                  ? 'bg-[var(--surface-coral)]'
                  : 'bg-white/85 hover:bg-[var(--surface-sky)]'
                }
                ${showResult ? 'cursor-not-allowed' : ''}
              `}
              disabled={showResult}
            >
              <span className="text-2xl font-black text-[var(--ink-soft)] w-8">{displayIndex + 1}.</span>
              {item.image && (
                <img src={item.image} alt={item.label} className="w-12 h-12 object-contain" />
              )}
              <span className="text-lg font-black text-[var(--ink)]">{item.label}</span>
            </button>
          );
        })}
      </div>

      {!showResult && (
        <button
          onClick={handleSubmit}
          className="mt-8 w-full brutal-button pressable py-4 text-xl font-black text-[var(--ink)] bg-[var(--surface-coral)] uppercase tracking-[0.1em]"
        >
          CHECK ORDER
        </button>
      )}
    </div>
  );
};

export default SortingActivity;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/activities/SortingActivity.jsx
git commit -m "feat: add SortingActivity with tap-to-swap"
```

---

### Task 4.6: MatchingActivity

**Files:**
- Create: `src/components/activities/MatchingActivity.jsx`

- [ ] **Step 1: Create MatchingActivity**

```jsx
import React, { useState, useCallback } from 'react';
import { calculateMatchingScore } from '../../utils/scoring';

const MatchingActivity = ({ content, onComplete }) => {
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matches, setMatches] = useState({});
  const [showResult, setShowResult] = useState(false);

  const handleLeftClick = (id) => {
    if (showResult) return;
    setSelectedLeft(id);
    if (selectedRight) {
      makeMatch(id, selectedRight);
    }
  };

  const handleRightClick = (id) => {
    if (showResult) return;
    setSelectedRight(id);
    if (selectedLeft) {
      makeMatch(selectedLeft, id);
    }
  };

  const makeMatch = (leftId, rightId) => {
    setMatches((prev) => ({ ...prev, [leftId]: rightId }));
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  const isAllMatched = content.pairs.every((pair) => matches[pair.left.id]);

  const handleSubmit = () => {
    const pairs = content.pairs.map((pair) => ({
      leftId: pair.left.id,
      rightId: matches[pair.left.id],
      correct: matches[pair.left.id] === pair.right.id,
    }));
    const score = calculateMatchingScore(pairs);
    setShowResult(true);
    setTimeout(() => onComplete(score), 1500);
  };

  return (
    <div
      data-testid="matching-activity"
      className="brutal-card raised-glass-soft relative w-full max-w-5xl rounded-[2rem] bg-[#b85d33]/90 p-6 md:p-10"
    >
      <h2 className="text-2xl md:text-4xl font-black text-[var(--ink)] mb-6 text-center">
        {content.instructions}
      </h2>

      <div className="grid grid-cols-2 gap-8 max-w-3xl mx-auto">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-black text-[var(--ink-soft)] uppercase tracking-[0.2em] text-center">Left</h3>
          {content.pairs.map((pair) => {
            const isCorrect = showResult && matches[pair.left.id] === pair.right.id;
            const isWrong = showResult && matches[pair.left.id] && matches[pair.left.id] !== pair.right.id;

            return (
              <button
                key={pair.left.id}
                data-testid={`match-left-${pair.left.id}`}
                onClick={() => handleLeftClick(pair.left.id)}
                className={`brutal-tile pressable p-4 rounded-xl text-center transition-all
                  ${selectedLeft === pair.left.id
                    ? 'bg-[var(--surface-butter)] -translate-y-1'
                    : matches[pair.left.id]
                    ? 'bg-[var(--surface-mint)] opacity-70'
                    : 'bg-white/85 hover:bg-[var(--surface-sky)]'
                  }
                  ${isCorrect ? 'bg-[var(--surface-mint)]' : ''}
                  ${isWrong ? 'bg-[var(--surface-coral)]' : ''}
                `}
                disabled={showResult}
              >
                {pair.left.image && (
                  <img src={pair.left.image} alt={pair.left.label} className="w-12 h-12 object-contain mx-auto mb-2" />
                )}
                <span className="font-black text-[var(--ink)]">{pair.left.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-black text-[var(--ink-soft)] uppercase tracking-[0.2em] text-center">Right</h3>
          {content.pairs.map((pair) => {
            const matchedLeft = Object.keys(matches).find((k) => matches[k] === pair.right.id);
            const isCorrect = showResult && matchedLeft && matches[matchedLeft] === pair.right.id;
            const isWrong = showResult && matchedLeft && matches[matchedLeft] !== pair.right.id;

            return (
              <button
                key={pair.right.id}
                data-testid={`match-right-${pair.right.id}`}
                onClick={() => handleRightClick(pair.right.id)}
                className={`brutal-tile pressable p-4 rounded-xl text-center transition-all
                  ${selectedRight === pair.right.id
                    ? 'bg-[var(--surface-butter)] -translate-y-1'
                    : matchedLeft
                    ? 'bg-[var(--surface-mint)] opacity-70'
                    : 'bg-white/85 hover:bg-[var(--surface-sky)]'
                  }
                  ${isCorrect ? 'bg-[var(--surface-mint)]' : ''}
                  ${isWrong ? 'bg-[var(--surface-coral)]' : ''}
                `}
                disabled={showResult}
              >
                {pair.right.image && (
                  <img src={pair.right.image} alt={pair.right.label} className="w-12 h-12 object-contain mx-auto mb-2" />
                )}
                <span className="font-black text-[var(--ink)]">{pair.right.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {!showResult && (
        <button
          onClick={handleSubmit}
          disabled={!isAllMatched}
          className="mt-8 w-full brutal-button pressable py-4 text-xl font-black text-[var(--ink)] bg-[var(--surface-coral)] uppercase tracking-[0.1em] disabled:opacity-50"
        >
          CHECK MATCHES
        </button>
      )}
    </div>
  );
};

export default MatchingActivity;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/activities/MatchingActivity.jsx
git commit -m "feat: add MatchingActivity with tap-to-match"
```

---

## Task 5: Progress System

### Task 5.1: Create ProgressContext

**Files:**
- Create: `src/contexts/ProgressContext.jsx`

- [ ] **Step 1: Create ProgressContext**

```jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';
import { calculateStars, calculateXP } from '../utils/scoring';
import { LEVELS } from '../data/levels';
import { BADGES } from '../data/badges';

const ProgressContext = createContext(null);

export const useProgress = () => useContext(ProgressContext);

export const ProgressProvider = ({ children }) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProgress(null);
      setLoading(false);
      return;
    }

    const loadProgress = async () => {
      try {
        const docRef = doc(db, 'userProgress', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProgress(docSnap.data());
        } else {
          const initialProgress = {
            totalXP: 0,
            currentLevel: 1,
            badges: [],
            activities: {},
            streak: 1,
            lastActiveDate: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
          };
          await setDoc(docRef, initialProgress);
          setProgress(initialProgress);
        }
      } catch (error) {
        console.error('Failed to load progress:', error);
        // Fallback to local storage
        const local = localStorage.getItem(`asd_progress_${user.uid}`);
        if (local) {
          setProgress(JSON.parse(local));
        } else {
          setProgress({
            totalXP: 0,
            currentLevel: 1,
            badges: [],
            activities: {},
            streak: 1,
            lastActiveDate: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
          });
        }
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [user]);

  const updateProgress = useCallback(async (activityId, score, stars, xp) => {
    if (!user || !progress) return;

    const newTotalXP = progress.totalXP + xp;
    const newLevel = LEVELS.reduce((max, level) => {
      return newTotalXP >= level.unlockXP ? level.order : max;
    }, 1);

    const updatedActivities = {
      ...progress.activities,
      [activityId]: {
        bestScore: Math.max(progress.activities[activityId]?.bestScore || 0, score),
        stars: Math.max(progress.activities[activityId]?.stars || 0, stars),
        attempts: (progress.activities[activityId]?.attempts || 0) + 1,
        completed: true,
        lastAttempted: new Date().toISOString(),
      },
    };

    const newProgress = {
      ...progress,
      totalXP: newTotalXP,
      currentLevel: Math.max(progress.currentLevel, newLevel),
      activities: updatedActivities,
    };

    setProgress(newProgress);

    // Save to Firestore
    try {
      const docRef = doc(db, 'userProgress', user.uid);
      await updateDoc(docRef, {
        totalXP: newTotalXP,
        currentLevel: Math.max(progress.currentLevel, newLevel),
        activities: updatedActivities,
      });
    } catch (error) {
      console.error('Failed to save progress:', error);
    }

    // Save to localStorage as backup
    localStorage.setItem(`asd_progress_${user.uid}`, JSON.stringify(newProgress));

    return { totalXP: newTotalXP, level: newLevel };
  }, [user, progress]);

  const getLevelProgress = useCallback((levelId) => {
    if (!progress) return { completed: 0, total: 0, percentage: 0 };
    const level = LEVELS.find((l) => l.id === levelId);
    if (!level) return { completed: 0, total: 0, percentage: 0 };
    // This would need activity counts from Firestore
    return { completed: 0, total: 10, percentage: 0 };
  }, [progress]);

  const isLevelUnlocked = useCallback((levelOrder) => {
    if (!progress) return levelOrder === 1;
    const level = LEVELS.find((l) => l.order === levelOrder);
    return progress.totalXP >= level.unlockXP;
  }, [progress]);

  const earnedBadges = useCallback(() => {
    if (!progress) return [];
    return BADGES.filter((b) => progress.badges.includes(b.id));
  }, [progress]);

  const value = {
    progress,
    loading,
    updateProgress,
    getLevelProgress,
    isLevelUnlocked,
    earnedBadges,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add src/contexts/ProgressContext.jsx
git commit -m "feat: add ProgressContext for XP, stars, badges tracking"
```

---

## Task 6: Dashboard & Navigation

### Task 6.1: Create DashboardScreen

**Files:**
- Create: `src/components/dashboard/DashboardScreen.jsx`

- [ ] **Step 1: Create DashboardScreen**

```jsx
import React from 'react';
import { useProgress } from '../../contexts/ProgressContext';
import LevelGrid from './LevelGrid';
import BadgeShelf from './BadgeShelf';
import QuickStats from './QuickStats';

const DashboardScreen = ({ user, onLogout }) => {
  const { progress, loading } = useProgress();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-black text-[var(--ink)]">LOADING...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-transparent p-4 md:p-8">
      {/* Header */}
      <div className="w-full max-w-6xl mx-auto mb-8">
        <div className="brutal-card raised-glass-soft bg-warm-butter/70 p-6 rounded-[2rem]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-[var(--ink)] tracking-tight">
                Welcome, {user.name}
              </h1>
              <p className="text-lg text-[var(--ink-soft)] font-bold mt-2">
                Level {progress?.currentLevel || 1} • {progress?.totalXP || 0} XP
              </p>
            </div>
            <button
              onClick={onLogout}
              className="brutal-button pressable px-6 py-3 text-sm font-black text-[var(--ink)] bg-[var(--surface-coral)] uppercase tracking-[0.15em]"
            >
              LOG OUT
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="w-full max-w-6xl mx-auto mb-8">
        <QuickStats progress={progress} />
      </div>

      {/* Level Grid */}
      <div className="w-full max-w-6xl mx-auto mb-8">
        <h2 className="text-2xl font-black text-[var(--ink)] mb-4">Levels</h2>
        <LevelGrid currentLevel={progress?.currentLevel || 1} totalXP={progress?.totalXP || 0} />
      </div>

      {/* Badges */}
      <div className="w-full max-w-6xl mx-auto mb-8">
        <h2 className="text-2xl font-black text-[var(--ink)] mb-4">Badges</h2>
        <BadgeShelf badges={progress?.badges || []} />
      </div>
    </div>
  );
};

export default DashboardScreen;
```

- [ ] **Step 2: Create LevelGrid**

```jsx
import React from 'react';
import LevelCard from './LevelCard';
import { LEVELS } from '../../data/levels';

const LevelGrid = ({ currentLevel, totalXP }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {LEVELS.map((level) => {
        const isUnlocked = totalXP >= level.unlockXP;
        const isCurrent = level.order === currentLevel;
        const isCompleted = level.order < currentLevel;

        return (
          <LevelCard
            key={level.id}
            level={level}
            isUnlocked={isUnlocked}
            isCurrent={isCurrent}
            isCompleted={isCompleted}
          />
        );
      })}
    </div>
  );
};

export default LevelGrid;
```

- [ ] **Step 3: Create LevelCard**

```jsx
import React from 'react';

const LevelCard = ({ level, isUnlocked, isCurrent, isCompleted }) => {
  return (
    <div
      className={`brutal-card p-6 rounded-[1.5rem] transition-all ${
        isUnlocked
          ? 'cursor-pointer hover:-translate-y-1'
          : 'opacity-50 cursor-not-allowed'
      }`}
      style={{ borderColor: isUnlocked ? level.color : undefined }}
    >
      <div className="flex items-center gap-4 mb-4">
        <span className="text-4xl">{level.icon}</span>
        <div>
          <h3 className="text-xl font-black text-[var(--ink)]">Level {level.order}</h3>
          <p className="text-sm font-bold text-[var(--ink-soft)]">{level.title}</p>
        </div>
      </div>

      <p className="text-sm text-[var(--ink-soft)] mb-4">{level.description}</p>

      {!isUnlocked && (
        <div className="brutal-card inline-block px-4 py-2 bg-white/50">
          <span className="text-sm font-black text-[var(--ink-soft)]">
            🔒 {level.unlockXP} XP needed
          </span>
        </div>
      )}

      {isCompleted && (
        <div className="brutal-card inline-block px-4 py-2 bg-[var(--surface-mint)]">
          <span className="text-sm font-black text-[var(--ink)]">✓ COMPLETED</span>
        </div>
      )}

      {isCurrent && isUnlocked && (
        <div className="brutal-card inline-block px-4 py-2 bg-[var(--surface-butter)]">
          <span className="text-sm font-black text-[var(--ink)]">▶ IN PROGRESS</span>
        </div>
      )}
    </div>
  );
};

export default LevelCard;
```

- [ ] **Step 4: Create BadgeShelf**

```jsx
import React from 'react';
import { BADGES } from '../../data/badges';

const BadgeShelf = ({ badges = [] }) => {
  return (
    <div className="flex flex-wrap gap-4">
      {BADGES.map((badge) => {
        const earned = badges.includes(badge.id);
        return (
          <div
            key={badge.id}
            className={`brutal-card p-4 rounded-xl text-center transition-all ${
              earned ? 'bg-white' : 'bg-white/30 opacity-50'
            }`}
          >
            <span className="text-3xl block mb-2">{badge.icon}</span>
            <p className="text-xs font-black text-[var(--ink)] uppercase">{badge.title}</p>
            {!earned && <p className="text-xs text-[var(--ink-soft)]">Locked</p>}
          </div>
        );
      })}
    </div>
  );
};

export default BadgeShelf;
```

- [ ] **Step 5: Create QuickStats**

```jsx
import React from 'react';

const QuickStats = ({ progress }) => {
  const stats = [
    { label: 'Total XP', value: progress?.totalXP || 0, icon: '⚡' },
    { label: 'Activities', value: Object.keys(progress?.activities || {}).length, icon: '🎯' },
    { label: 'Streak', value: `${progress?.streak || 0} days`, icon: '🔥' },
    { label: 'Badges', value: progress?.badges?.length || 0, icon: '🏆' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="brutal-card p-4 rounded-xl text-center bg-white">
          <span className="text-2xl block mb-1">{stat.icon}</span>
          <span className="text-2xl font-black text-[var(--ink)] block">{stat.value}</span>
          <span className="text-xs font-black text-[var(--ink-soft)] uppercase">{stat.label}</span>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;
```

- [ ] **Step 6: Commit**

```bash
git add src/components/dashboard/
git commit -m "feat: add DashboardScreen with level grid, badges, stats"
```

---

## Task 7: Level Content

### Task 7.1: Create sample activities for Level 1

**Files:**
- Create: `src/data/activities/level1/identify-fruits.json`
- Create: `src/data/activities/level1/identify-animals.json`
- Create: `src/data/activities/level1/match-body-parts.json`

- [ ] **Step 1: Create identify-fruits activity**

```json
{
  "id": "l1-identify-fruits",
  "levelId": "level1",
  "type": "multipleChoice",
  "title": "Identify the Fruit",
  "description": "What fruit is shown in the picture?",
  "difficulty": 1,
  "maxScore": 100,
  "timeLimit": null,
  "order": 1,
  "content": {
    "questionLabel": "What fruit is this?",
    "questionImage": null,
    "questionAlt": "A yellow banana",
    "options": [
      { "id": "a", "label": "Banana", "image": null, "correct": true },
      { "id": "b", "label": "Apple", "image": null, "correct": false },
      { "id": "c", "label": "Orange", "image": null, "correct": false },
      { "id": "d", "label": "Grape", "image": null, "correct": false }
    ],
    "feedback": {
      "correct": "Yes! That's a banana!",
      "incorrect": "Not quite. That's a banana!"
    }
  },
  "hints": ["It's yellow and curved"]
}
```

- [ ] **Step 2: Create identify-animals activity**

```json
{
  "id": "l1-identify-animals",
  "levelId": "level1",
  "type": "multipleChoice",
  "title": "Identify the Animal",
  "description": "What animal is shown?",
  "difficulty": 1,
  "maxScore": 100,
  "timeLimit": null,
  "order": 2,
  "content": {
    "questionLabel": "What animal is this?",
    "questionImage": null,
    "questionAlt": "A small dog",
    "options": [
      { "id": "a", "label": "Dog", "image": null, "correct": true },
      { "id": "b", "label": "Cat", "image": null, "correct": false },
      { "id": "c", "label": "Bird", "image": null, "correct": false },
      { "id": "d", "label": "Fish", "image": null, "correct": false }
    ],
    "feedback": {
      "correct": "Yes! That's a dog!",
      "incorrect": "Not quite. That's a dog!"
    }
  },
  "hints": ["It barks"]
}
```

- [ ] **Step 3: Create match-body-parts activity**

```json
{
  "id": "l1-match-body-parts",
  "levelId": "level1",
  "type": "matching",
  "title": "Match Body Parts",
  "description": "Match each body part to its name",
  "difficulty": 1,
  "maxScore": 100,
  "timeLimit": null,
  "order": 3,
  "content": {
    "instructions": "Tap a left item, then tap its match on the right",
    "pairs": [
      { "left": { "id": "l1", "label": "👁️ Eye", "image": null }, "right": { "id": "r1", "label": "Eye", "image": null } },
      { "left": { "id": "l2", "label": "👂 Ear", "image": null }, "right": { "id": "r2", "label": "Ear", "image": null } },
      { "left": { "id": "l3", "label": "👃 Nose", "image": null }, "right": { "id": "r3", "label": "Nose", "image": null } },
      { "left": { "id": "l4", "label": "👄 Mouth", "image": null }, "right": { "id": "r4", "label": "Mouth", "image": null } }
    ],
    "feedback": {
      "correct": "Great matching!",
      "incorrect": "Not quite. Try again!"
    }
  },
  "hints": []
}
```

- [ ] **Step 4: Commit**

```bash
git add src/data/activities/level1/
git commit -m "feat: add Level 1 sample activities"
```

---

## Task 8: Refactor App.jsx with Providers

### Task 8.1: Update App.jsx with all providers

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Rewrite App.jsx with providers**

```jsx
import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ProgressProvider } from './contexts/ProgressContext';
import LoginPage from './components/auth/LoginPage';
import DashboardScreen from './components/dashboard/DashboardScreen';
import LevelScreen from './components/level/LevelScreen';
import ActivityPlayer from './components/activities/ActivityPlayer';
import { useAuth } from './contexts/AuthContext';
import { useState } from 'react';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [screen, setScreen] = useState('dashboard');
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-black text-[var(--ink)]">LOADING...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  if (selectedActivity) {
    return (
      <ActivityPlayer
        activity={selectedActivity}
        onComplete={(result) => {
          console.log('Activity completed:', result);
          setSelectedActivity(null);
        }}
        onBack={() => setSelectedActivity(null)}
      />
    );
  }

  if (selectedLevel) {
    return (
      <LevelScreen
        level={selectedLevel}
        onSelectActivity={setSelectedActivity}
        onBack={() => setSelectedLevel(null)}
      />
    );
  }

  return (
    <DashboardScreen
      user={user}
      onSelectLevel={setSelectedLevel}
      onLogout={() => {
        // Will be handled by AuthContext
      }}
    />
  );
};

function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <div className="App min-h-screen bg-warm-cream selection:bg-warm-coral/60 selection:text-ink transition-colors duration-500">
          <div className="relative w-full min-h-screen z-10 transition-all duration-500 max-w-[1440px] mx-auto">
            <AppContent />
          </div>

          {/* Background Effects */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden h-screen w-screen z-0">
            <div className="absolute -top-20 -left-24 w-[420px] h-[420px] bg-warm-peach/70 rounded-full blur-[110px]" />
            <div className="absolute top-[18%] right-[-8%] w-[360px] h-[360px] bg-warm-butter/65 rounded-full blur-[96px]" />
            <div className="absolute bottom-[-12%] left-[25%] w-[430px] h-[430px] bg-warm-mint/55 rounded-full blur-[110px]" />
          </div>
        </div>
      </ProgressProvider>
    </AuthProvider>
  );
}

export default App;
```

- [ ] **Step 2: Create LevelScreen placeholder**

```jsx
import React from 'react';

const LevelScreen = ({ level, onSelectActivity, onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-black text-[var(--ink)] mb-4">{level.title}</h1>
      <p className="text-lg text-[var(--ink-soft)] mb-8">{level.description}</p>
      <button onClick={onBack} className="brutal-button pressable px-6 py-3">
        Back to Dashboard
      </button>
    </div>
  );
};

export default LevelScreen;
```

- [ ] **Step 3: Run build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: integrate providers and screen routing in App.jsx"
```

---

## Task 9: Final Verification

- [ ] **Step 1: Run all tests**

```bash
npm test
```

- [ ] **Step 2: Run build**

```bash
npm run build
```

- [ ] **Step 3: Run lint**

```bash
npm run lint
```

- [ ] **Step 4: Start dev server and test manually**

```bash
npm run dev
```

- [ ] **Step 5: Verify login flow works**

- [ ] **Step 6: Verify dashboard displays correctly**

- [ ] **Step 7: Verify activity can be played**

- [ ] **Step 8: Final commit**

```bash
git add -A
git commit -m "feat: complete ASD motor-skill learning platform v1.0"
```

---

## Summary

This plan covers the complete transformation from a simple quiz app to a progressive motor-skill learning platform. The key components are:

1. **Firebase Auth** - Google + email/password authentication
2. **Activity Engine** - Data-driven rendering of 6 activity types
3. **Progress System** - XP, stars, badges, level unlocking
4. **Dashboard** - Level selection, stats, badges
5. **Accessibility** - WCAG 2.1 AA compliance

**Estimated effort:** 40-60 hours of focused development

**Next steps after this plan:**
1. Set up Firebase project and configure environment variables
2. Implement tasks in order (1 through 9)
3. Test each milestone before moving to the next
4. Iterate on UI/UX based on user feedback
