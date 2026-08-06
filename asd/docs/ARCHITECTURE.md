# ASD Learn — Architecture Summary

> A warm neo-brutalist React (Vite) app delivering 5 levels of progressive motor-skill activities for children with ASD. This document summarizes the system: app shell, state contexts, activity engine, progress model, data flow, and the two-tier test suite.

## 1. Overview

```
┌─────────────────────────────────────────────────────────────┐
│ App (AuthProvider → ProgressProvider → SettingsProvider)      │
│  └─ AppShell (reads settings; sets data-reduced-motion)       │
│      └─ <main> AppContent — state-based screen router          │
│           ├─ loading → LoadingSkeleton                        │
│           ├─ no user → LoginPage                              │
│           ├─ selectedActivity → ActivityPlayer                │
│           ├─ selectedLevel → LevelScreen → ActivityList       │
│           │                      └ ActivityCard               │
│           ├─ screen=profile → ProfileScreen                   │
│           ├─ screen=settings → SettingsScreen                 │
│           └─ else → DashboardScreen (LevelGrid/QuickStats/…)  │
└─────────────────────────────────────────────────────────────┘
```

**Routing is state-based** (no URL router): `App` holds `screen`, `selectedLevel`, and `selectedActivity` state and renders the matching screen. Level activities are loaded client-side from seeded JSON via `getActivitiesForLevel(level.id)`.

## 2. Contexts (state layer)

| Context | Responsibility |
|---|---|
| `AuthContext` | Firebase `onAuthStateChanged` subscription; normalizes the Firebase user into `{ uid, name, email, avatar }`. **Demo mode** (dev, no Firebase config) signs in a static `DEMO_USER` synchronously and never touches Firebase. |
| `ProgressContext` | Loads/owns the learner's progress document, keyed by `uid` and derived at render time. Exposes `progress`, `loading`, `error`, `retry`, and `recordActivityResult`. Loads on sign-in (streak bump), seeds a fresh doc when none exists, and throws a retry-able error when a configured backend is unreachable with no local backup. |
| `SettingsContext` | Sound, haptics, reduced motion, text size. Persisted in `localStorage` (`asd-settings-v1`); `reducedMotion` drives the `data-reduced-motion` attribute that CSS kill-switches animations. |

## 3. Activity engine

- **`ActivityPlayer`** is a registry-driven renderer: `DEFAULT_REGISTRY` maps `type → component` for all six types. It renders the header (title/timer/score), the activity component, and on completion shows the shared `FeedbackOverlay`, computes stars/XP, and calls `recordActivityResult` exactly once (idempotency guard against timer-expiry + delayed completion double-firing).
- **Six activity types** — all touch/keyboard/mouse accessible, gated after results, with polite live regions:
  - `MultipleChoiceActivity` — select one option (`AnswerTile`, `aria-pressed`).
  - `DragAndDropActivity` — native HTML5 drag, tap-to-assign, and keyboard (Tab+Enter) over `useDragAndDrop` assignment state.
  - `SortingActivity` — ID-based swap semantics via drag, tap-tap, or ArrowUp/Down.
  - `MatchingActivity` — tap-to-pair between two columns with SVG connection lines.
  - `PathTracingActivity` — SVG template paths sampled by `utils/pathTracing.js`; live coverage feedback.
  - `FreehandDrawingActivity` — HTML5 canvas strokes with UNDO/CLEAR (ref-based guard).

## 4. Progress model

Pure utilities in `src/utils/progress.js` (fully unit-tested):

- `createInitialProgress()` → level 1, 0 XP, empty badges/activities, streak 1.
- `getLevelForXP` / `isLevelUnlocked` — XP thresholds (500/1500/3000/5000) gate levels 2–5.
- `applyActivityResult` — records an activity (best score/stars/attempts), accumulates XP, levels up, and returns newly earned badges (awarded once).
- Badges: 8 definitions with rarity tiers (`data/badges.js`); earned at record time via `checkEarnableBadges`.
- Streaks via `updateLoginStreak` (same-day/next-day/gap semantics).

**Persistence** (`services/progressService.js`): Firestore `userProgress/{uid}` upsert with a `localStorage` backup (`asd_progress_<uid>`). `loadProgress` reads Firestore first, falls back to the local backup, and throws only when a configured backend is unreachable with no backup (surfacing the `ErrorState` retry card). Demo mode (db null) seeds locally — the offline path is the intended behavior.

**Scoring** (`utils/scoring.js`): stars (≥90/≥70/>0), XP = `10 × difficulty × stars`, plus per-type 0–100 scorers. XP 10 × 1.5 × 1.5 = 22.5 → 23 for a perfect difficulty-2 activity.

## 5. Data flow (completing an activity)

```
user taps answer → activity component computes score (0–100)
  → onComplete({ score, stars, xp, activityId })
  → ActivityPlayer.handleComplete: guard → recordActivityResult
  → ProgressContext: applyActivityResult (pure) → persistProgress (Firestore + localStorage)
  → FeedbackOverlay (aria-live) → CONTINUE → back to LevelScreen
  → Dashboard/LevelScreen re-render from updated progress (derived at render time)
```

## 6. Design system

- `src/styles/tokens.css` — CSS custom properties: ink/ink-soft, warm surface palette (`surface-*`), level accents (`--level-1..5`), activity-type accents, spacing.
- `src/index.css` — Tailwind v4 **CSS-first config** (`@theme` in CSS; `tailwind.config.js` is not loaded without `@config`). Utilities, `.brutal-card/.brutal-button/.brutal-tile` in `@layer components`, `.activity-chip`, skeleton shimmer, and the reduced-motion kill-switch (`[data-reduced-motion='true']` + `@media (prefers-reduced-motion: reduce)`).
- Shared UI: `AccessibleButton` (≥48px, focus-visible ring), `AnswerTile`, `FeedbackOverlay` (dialog + focus management + live region), `LoadingSkeleton` (layout-matched variants), `ErrorState` (role=alert + retry).

## 7. Testing strategy

Two Vitest projects in `vite.config.js`:

| Project | Environment | Scope |
|---|---|---|
| `jsdom` (`npm test`) | jsdom | 470 unit/integration tests — pure utilities, contexts, services, every component/screen, seeded-data validators, App routing |
| `browser` (`npm run test:browser`) | Playwright chromium | 11 real-browser tests — reduced-motion kill-switch, responsive at 375/768/1024/1440, full user flow + persistence + level unlocking, axe-core audit (5 screens, zero violations), real keyboard focus-visible |

Conventions: TDD (red→green), class-name assertions, `toHaveStyle` for jsdom color normalization, fake timers for the 1500ms reveal, `localStorage.clear()` in `beforeEach` for progress isolation, and Firebase modules mocked so demo mode is deterministic.

## 8. Bundle & performance

- Production JS ≈ **841 KB minified / 237.6 KB gzipped** + 7.8 KB CSS — dominated by the Firebase SDK; reasonable for a Firebase-backed app. Vite's >500 KB chunk warning is cosmetic (Firebase vendor chunk).
- The warm pastel palette regression test guards against Tailwind v4 `@theme` utilities being silently dropped.

## 9. Key limitations

- Demo mode is dev-only (`import.meta.env.DEV && !isConfigured`); production requires real Firebase env vars.
- "Session activities" is a persisted total counter, not per-session; level-completion badges proxy on XP thresholds; badges are not awarded retroactively.
- State-based routing (no shareable URLs).
