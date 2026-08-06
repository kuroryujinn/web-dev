# ASD Learn — Motor-Skill Training Platform

> A warm neo-brutalist React app with 5 levels of progressive motor-skill activities designed for children with ASD. Runs fully offline in demo mode, or with Firebase auth + Firestore for real accounts and persisted progress.

## Abstract

ASD Learn is a client-rendered React (Vite) single-page app that turns fine-motor practice into a structured game: users sign in, progress through 5 difficulty-scaled levels, and earn stars, XP, and badges for completing activities. Six activity types are built on a shared engine — multiple choice, drag-and-drop, sorting, matching, path tracing, and freehand drawing — with keyboard, touch, and mouse input, live-region announcements, and a reduced-motion mode.

The app is **demo-mode first**: with no Firebase configuration it boots straight to a local demo user and persists progress in `localStorage`, so the entire product can be run and tested without any backend credentials. When `VITE_FIREBASE_*` env vars are present, Firebase Auth (email/password + Google) and Firestore take over.

## Features

- **5 levels × seeded activities** — 50 activity documents (8/8/10/10/14) across `Core Recognition` → `Advanced Coordination`, scaled by difficulty (XP multipliers, star thresholds).
- **Six activity types** on a registry-driven engine: MultipleChoice, DragAndDrop, Sorting, Matching, PathTracing, FreehandDrawing — all with touch/keyboard/mouse input.
- **Progress system** — XP, stars, streaks, level unlocking, and 8 badges with rarity tiers; persisted to Firestore with a `localStorage` offline backup.
- **Dashboard & navigation** — stats, level grid, badge shelf, profile with session history, and settings (sound, haptics, text size, reduced motion).
- **Accessibility (WCAG 2.1 AA)** — keyboard-complete, 48px targets, focus-visible rings, polite live regions, `prefers-reduced-motion` + in-app toggle, and an automated axe-core audit in CI tests.
- **Warm neo-brutalist design system** — design tokens, level/activity accent colors, skeletons, error cards with retry.

## Installation and Setup

Prerequisites: Node.js 20+, npm.

```bash
npm install
```

### Run in demo mode (no config needed)

```bash
npm run dev
```

With no `.env`, the dev server detects missing Firebase config and signs in a local **Demo** user — no account or credentials required. Progress persists in `localStorage`.

### Enable Firebase (auth + persisted progress)

1. Create a Firebase project and enable **Email/Password** and **Google** sign-in (Authentication → Sign-in method).
2. Copy `.env.example` to `.env` and fill in your web-app credentials:

```bash
cp .env.example .env
```

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

3. Restart `npm run dev` — the login page appears and progress syncs to Firestore (`userProgress/{uid}`).

## Usage

```bash
npm run dev            # Start dev server (demo mode without Firebase config)
npm run build          # Production build
npm run preview        # Preview the production build
npm run lint           # ESLint
```

## Validation and Testing

Two-tier test suite (see `vite.config.js`):

| Command | Scope |
|---|---|
| `npm test` | Fast **jsdom** suite — 470 unit/integration tests |
| `npm run test:browser` | **Real-browser** (Playwright chromium) suite — reduced-motion, responsive, full user flow, accessibility basics |
| `npm run test:all` | Both suites |
| `npm run test:coverage` | jsdom suite with v8 coverage report (`coverage/`) |

Minimum pre-merge validation:

```bash
npm test
npm run test:browser
npm run lint
npm run build
```

Coverage highlights: pure utilities (`scoring`, `progress`, `pathTracing`) have deep edge-case suites; every activity type, context, and screen has component tests; `Accessibility.axe.test.jsx` audits login/dashboard/level/activity/settings with zero WCAG violations; `App.flow.browser.test.jsx` walks the real user flow end-to-end in Chromium.

## Project Structure

```
src/
├── main.jsx / App.jsx        # Bootstrap; state-based screen routing
├── components/
│   ├── auth/                 # LoginPage, EmailPasswordForm
│   ├── dashboard/            # DashboardScreen, LevelGrid, LevelCard, QuickStats, BadgeShelf
│   ├── level/                # LevelScreen, ActivityList, ActivityCard
│   ├── activities/           # ActivityPlayer (registry) + 6 activity types
│   ├── results/              # ResultsScreen, ScoreDisplay, StarsEarned, BadgesEarned
│   ├── profile/ settings/    # ProfileScreen, SettingsScreen
│   └── shared/               # AccessibleButton, AnswerTile, FeedbackOverlay, LoadingSkeleton, ErrorState
├── contexts/                 # AuthContext, ProgressContext, SettingsContext
├── services/                 # firebase (demo-mode aware), authService, progressService, activityService
├── data/                     # levels.js, badges.js, activities/ (seeded level 1–5 content)
├── hooks/ utils/             # useTimer, useDragAndDrop, usePathTracing; scoring, progress, pathTracing
├── styles/                   # tokens.css (design tokens), index.css (utilities/components)
└── __tests__/                # App routing, axe audit, browser-mode suites
```

See `docs/ARCHITECTURE.md` for the full architecture and data-flow summary.

## Limitations and Tradeoffs

- **Demo vs Firebase**: demo mode (dev only, no config) uses a local user + `localStorage`; real persistence requires the `.env` Firebase setup above.
- **Session activities**: the Quick Learner badge counts total completed activities (a persisted counter), not per-session play — a documented simplification.
- **Level-completion badges**: reaching a level's XP threshold stands in for "completing" it.
- **Routing** is state-based inside `App` rather than URL-based.
- **Badges** are awarded at activity-record time, not retroactively on load.

## License and Attribution

No explicit license file is currently included in this repository.
