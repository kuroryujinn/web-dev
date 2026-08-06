# ASD Motor-Skill Learning Platform — Project Tracker

> **Status:** 🟡 In Progress
> **Last Updated:** August 6, 2026
> **Spec:** `docs/superpowers/specs/2026-08-01-asd-motor-skill-platform-design.md`
> **Plan:** `docs/superpowers/plans/2026-08-01-asd-motor-skill-platform-implementation.md`

---

## Milestone 9: Styling & Polish 🎨 ✅

Refine neo-brutalism design, ensure consistency.

- [x] **9.1** Update `src/styles/tokens.css` — Add level-specific colors
- [x] **9.2** Update `src/index.css` — Add activity-specific styles
- [x] **9.3** Ensure consistent button styles across all screens
- [x] **9.4** Add hover/focus states to all interactive elements
- [x] **9.5** Add loading states (skeleton screens)
- [x] **9.6** Add error states (network errors, missing data)
- [x] **9.7** Test responsive layout (375px, 768px, 1024px, 1440px)
- [x] **9.8** Commit styling polish

---

## Milestone 10: Testing & Verification ✅

Comprehensive testing and final verification.

- [x] **10.2** Add unit tests for scoring utilities
- [x] **10.3** Add unit tests for progress calculations
- [x] **10.4** Add component tests for ActivityPlayer
- [x] **10.5** Add component tests for each activity type
- [x] **10.8** Manual test: Complete full user flow (login → dashboard → activity → results)
- [x] **10.9** Manual test: Verify progress persistence (refresh page, check data)
- [x] **10.10** Manual test: Verify level unlocking works
- [x] **10.11** Manual test: Verify accessibility (keyboard, screen reader basics)
- [x] **10.12** Final commit with all changes

---

## Milestone 11: Final Review 📋 ✅

Audit, optimize, and document.

- [x] **11.1** Remove any remaining dead code
- [x] **11.2** Verify bundle size is reasonable
- [x] **11.3** Check for console errors/warnings
- [x] **11.4** Update README.md with new setup instructions
- [x] **11.5** Update `.env.example` with required Firebase config
- [x] **11.6** Create architecture summary document
- [x] **11.7** Final commit

---

## Session Notes — August 6, 2026

### Milestone 11 — Final Review (complete) 🎉

Final audit, cleanup, and documentation pass:

- **11.1 — Dead code removed:** deleted 4 orphaned legacy components at `src/components/` root — `FeedbackOverlay.jsx`, `ResultsScreen.jsx`, `QuestionCard.jsx`, `ProgressBar.jsx` (zero production imports; the live variants live in `shared/` and `results/`) plus `__tests__/QuestionCard.depth-layer.test.jsx`, which only tested the dead card. Suite: 471 → **470** jsdom tests (deletion removes exactly 1).
- **11.2 — Bundle verified:** production JS **841 KB minified / 237.6 KB gzipped** + 7.8 KB CSS. The size is dominated by the Firebase SDK — reasonable for a Firebase-backed app; Vite's >500 KB chunk warning is cosmetic (documented in README + ARCHITECTURE).
- **11.3 — Console check:** browser agent verified the app boots with **zero console errors** (only Vite dev-server + React DevTools info messages).
- **11.4 — README rewritten:** replaced the stale quiz-app README (QuizScreen/questions.json/VITE_GOOGLE_CLIENT_ID, all gone) with the real platform: demo mode vs Firebase setup, 50 seeded activities (8/8/10/10/14), all 6 activity types, the two-tier test suite, project structure, and limitations.
- **11.5 — .env.example:** added comments explaining demo mode and how to obtain the Firebase vars.
- **11.6 — docs/ARCHITECTURE.md:** new architecture summary — app-shell routing, the three contexts, activity engine + 6 types, progress model & persistence, completion data flow, design system (Tailwind v4 @theme + @layer components), testing strategy, bundle, and known limitations.
- **Code review:** caught and fixed a stale test count in both new docs (471 → **470** after the deletion).
- **Suite:** ✅ **470 jsdom + 11 browser tests passing**, ESLint clean, build OK. Milestone 11 is **7/7 complete** — tracker total 161 → **168/168**. **All 11 milestones complete.** 🎉

### Milestone 10 — Testing & Verification (complete)

Completed the testing/verification milestone. Tasks 10.2–10.5 were already covered by suites written in Milestones 3–5 (scoring: 17 tests; progress: 24; ActivityPlayer: 9 + 2 integration; per-activity-type: 6 suites / 63 tests) — verified and marked complete. The remaining work (10.8–10.11) was executed as real-browser verification:

- **10.11 — Automated axe-core audit (new, permanent):** `src/__tests__/Accessibility.axe.test.jsx` walks the login page, dashboard, level screen, a live activity, and settings through the full provider stack and asserts zero WCAG violations with `jest-axe` (`toHaveNoViolations` extended in the test file; devDeps `jest-axe@11`/`axe-core@4.13` were already staged). **Caught a real violation:** every screen failed axe's `region` rule — the app content lived in a plain `<div>` with no landmark. Fixed by wrapping `AppContent` in a `<main>` element and marking the decorative background layer `aria-hidden="true"` (`src/App.jsx`). All 5 audits now pass.
- **10.8/10.9/10.10 — Real-browser flow suite (new):** `src/__tests__/App.flow.browser.test.jsx` (4 tests, Playwright chromium via Vitest browser mode) walks the full user flow deterministically: dashboard → Level 1 → Identify the Fruit → correct answer → NICE WORK! overlay → CONTINUE → back → **15 XP awarded** (3 stars × difficulty 1) and recorded in the `asd_progress_demo-user` localStorage backup; **persistence** proven by unmounting + remounting the whole app (page refresh) and seeing the same 15 XP restored; **level unlocking** proven (fresh user: Level 1 enabled / 2–5 disabled; seeded 500 XP: Level 2 enabled / 3 disabled); accessibility basics checked (`<main>` landmark + `h1`, accessible button names, focus-visible outline classes).
- **Manual browser spot-check (10.8/10.11):** browser automation confirmed the live dev server boots to the dashboard with stat cards, 9 labeled buttons, Level 1 clickable / Levels 2–5 LOCKED, `<main>` present, and **zero console errors**.
- **Suite:** ✅ **471 jsdom + 11 browser tests passing** (up from 466/7), ESLint clean, build OK. Milestone 10 is **9/9 complete**; tracker total 152 → **161/161** across milestones 1–10. Next milestone: **11. Final Review** (7 tasks).

### Milestone 9 — Styling & Polish (complete)

Implemented the full styling milestone with TDD (red→green) plus a real-browser responsive suite:

- **9.1/9.2 — Level + activity-type theming:** `tokens.css` gained `--level-1..5` accent tokens (mirroring `levels.js`) and `--activity-<type>` tokens. `index.css` gained `.activity-chip` pill styles with per-type modifiers and a `.skeleton-block` shimmer utility. Level accent is threaded from `LevelScreen` → `ActivityList` → `ActivityCard` (chip background via inline accent, ink text for contrast) and `LevelCard` already borders in `level.color`; the level progress bar now fills with the level's accent.
- **9.5 — Skeleton loading states:** new `src/components/shared/LoadingSkeleton.jsx` with layout-matched `app`/`dashboard`/`profile` variants (`role="status"`, `aria-label="Loading"`). Wired into `App.jsx` (auth boot), `DashboardScreen`, and `ProfileScreen` replacing the plain "LOADING..." text.
- **9.6 — Error + retry:** `progressService.loadProgress` now **throws only when a backend is configured but unreachable** (db truthy) with no local backup — demo mode (db null) still seeds locally. `ProgressContext` exposes `error` + `retry` (retry resets uid so the load effect re-runs). New `ErrorState.jsx` (`role="alert"`, friendly card, ↻ RETRY via `AccessibleButton`). Screens show it in place of skeletons.
- **9.3/9.4 — Button consistency + hover/focus audit:** swept every `<button>`/`AccessibleButton` — all rendered interactives carry `focus-visible` rings + hover/active feedback (brutal-button/tile hover lifts, card `hover:-translate-y-1`, tile `hover:bg` tints).
- **🐛 Big regression found & fixed — warm palette silently missing:** only `warm-cream`/`warm-peach` compiled because Tailwind v4's `@theme` (CSS-first config; `tailwind.config.js` isn't loaded without `@config`) lacked `--color-warm-butter/coral/mint/sky`. All `bg-warm-*` tints on every screen were dropped. Fixed by adding the missing `@theme` tokens **and** moving `.brutal-card`/`.brutal-tile`/etc. into `@layer components` so utilities (later in layer order) win over the `background` shorthand that reset `background-color` to transparent. Verified in the built CSS (`bg-warm-butter/70{background-color:#ffc94ab3}…`) and locked in with a browser regression test.
- **9.7 — Responsive browser suite:** new `src/__tests__/App.responsive.browser.test.jsx` — real Chromium, viewports 375/768/1024/1440, asserts no horizontal overflow on dashboard, level, and settings screens (now imports the real `index.css` so layout checks are meaningful), plus the palette regression test.
- **Tests (TDD, +20 jsdom, +4 browser):** LoadingSkeleton (3), ErrorState (3), LevelCard accent (3), ProgressContext error/retry (+5), progressService throw (+1), DashboardScreen skeleton/error (+3), ProfileScreen skeleton/error (+2), App loading skeleton (+1), ActivityCard type-chip (+1), LevelScreen accent (+3). Color assertions use `toHaveStyle` (jsdom color normalization).
- **Suite:** ✅ **466 jsdom + 7 browser tests passing**, ESLint clean, build OK. Milestone 9 is **8/8 complete**; tracker total 128 → **152/152** across milestones 1–9. Next milestone: **10. Testing & Verification** (9 tasks).

### Milestone 8 — Accessibility (complete)

Audited every component against the WCAG 2.1 AA checklist (8.1–8.6) and verified the remaining items in a real browser (8.9/8.10). Most of the milestone was already in place from prior sessions (live regions in all 6 activity types + FeedbackOverlay + ResultsScreen, ARIA labels, keyboard navigation, 48px targets, settings toggles); this session closed the actual gaps:

- **Focus indicators (8.5) + touch targets (8.1):** added `focus-visible:outline-4` rings and `min-h-[48px]` to the elements the audit found missing — `EmailPasswordForm` (inputs *and* both buttons — the inputs previously used `focus:outline-none` with no replacement, a real keyboard-focus bug), `LoginPage` Google button, `DashboardScreen` header buttons (PROFILE/SETTINGS/LOG OUT), `AnswerTile` (fixes MultipleChoice + legacy QuestionCard), and the `DragAndDrop`/`Sorting`/`Matching` item tiles. All other interactives already inherited rings via `AccessibleButton` or had them directly (LevelCard, ActivityCard, DnD targets, settings toggles).
- **`prefers-reduced-motion` (8.6) — the big gap, now implemented:** `src/index.css` gained a global kill-switch (both `@media (prefers-reduced-motion: reduce)` *and* `[data-reduced-motion='true']` selectors that collapse animation/transition durations to 0.01ms and stop infinite loops). `App.jsx` was restructured so an `AppShell` component inside `SettingsProvider` reads `useSettings()` and puts `data-reduced-motion` on the app root — the in-app Reduced Motion toggle now actually disables animations, and the OS preference is respected at CSS level too.
- **8.7/8.8 (toggles):** already complete — verified (sound default OFF with AudioContext cue gated behind the setting; reduced motion toggle present).
- **Tests (TDD red→green, +10):** EmailPasswordForm (+2), LoginPage (+1), DashboardScreen (+1), AnswerTile.depth (+1), DragAndDropActivity (+1), MatchingActivity (+1), SortingActivity (+1), App.test (+2 — asserts `data-reduced-motion="false"` by default and flips to `"true"` when the setting is on). All assertions follow the project's existing class-name convention (AccessibleButton.test asserts `min-h-[48px]`).
- **Browser verification (8.9/8.10):** demo-mode dev server (no Firebase config) boots to the dashboard; the browser agent confirmed the dashboard renders with all buttons carrying accessible names, level cards with descriptive aria-labels (e.g. "Level 1: Core Recognition — In Progress"), `data-reduced-motion="false"` present on the root, and **zero console errors**. Keyboard-only flows are covered by the existing activity suites (arrow-key sorting, Tab+Enter taps, aria-pressed selection).
- **Suite:** ✅ **446 tests / 47 files passing** (up from 436/47), ESLint clean, build OK. Committed `9a8f0ec` (Milestone 8). Milestone 8 is **11/11 complete**; tracker total 117 → **128/152**. Next milestone: **9. Styling & Polish**.

### Browser-mode reduced-motion test (complete)

Added real-browser end-to-end coverage for the reduced-motion wiring, per follow-up request:

- **`src/__tests__/App.reducedMotion.browser.test.jsx`** (new, 3 tests) — runs in real Chromium via Playwright: (1) boots to the dashboard in demo mode with `data-reduced-motion="false"` on the root `.App` element; (2) navigates to Settings, clicks the Reduced Motion toggle ON (asserts `aria-pressed` + root attribute → `"true"`), then back OFF; (3) imports the real `index.css` and proves the kill-switch via `getComputedStyle` — transition durations collapse from ~90ms to ≤0.02ms (reported as `1e-05s`). Mocks only the Firebase modules so it's deterministic regardless of `.env`; everything else (React, real DOM, real CSS) runs in the browser.
- **Infra:** `vite.config.js` split into two Vitest projects — `jsdom` (default fast suite, excludes `*.browser.test.*`) and `browser` (Playwright chromium via `@vitest/browser-playwright`). New scripts: `npm run test:browser` and `npm run test:all`. `.gitignore` covers `.vitest-attachments/` and `__screenshots__/`.
- **Deps:** `@vitest/browser@4.1.10`, `@vitest/browser-playwright@4.1.10`, `playwright@1.62.1` (+ chromium binary), plus `jest-axe@11` / `axe-core@4.13` staged for the upcoming accessibility audit.
- **Suite:** ✅ **446 jsdom + 3 browser tests passing**, ESLint clean, build OK.

---

## Session Notes — August 5, 2026

### DragAndDrop end-to-end integration test (complete)

Added an integration test that plays a real Level 2 DragAndDrop activity through the full `ActivityPlayer` stack:

- **`src/components/activities/__tests__/ActivityPlayer.integration.test.jsx`** (new, 2 tests) — pulls the real registered `drag-food-to-plate` activity via `getActivitiesForLevel('level2')`, mounts it through `AuthProvider`/`ProgressProvider`/`SettingsProvider` (Firestore mocked), plays it to completion with all-correct drops, and asserts the **XP actually lands in the learner's progress** (3 stars on difficulty 2 → `10 × 1.5 × 1.5 = 22.5 → 23 XP`). Second test: an all-wrong playthrough awards the 0-star consolation XP (`10 × 1.5 × 1 = 15 XP`) — verifying no stars are earned and the feedback overlay still appears.
- Verifies the full chain end-to-end: seeded data → `getActivitiesForLevel` → `ActivityPlayer` registry → `DragAndDropActivity` + `useDragAndDrop` → `useProgress().recordActivityResult` → XP shown in a `ProgressConsumer`.
- **Suite:** ✅ **384 tests / 43 files passing** (up from 382/42), ESLint clean.

### Milestone 7c — Level 3 Content (complete)

Seeded all of Level 3's activities (Visual-Motor Integration, `difficulty: 3`) and registered them:

- **`src/data/activities/level3/*.json`** — 10 activity documents: 2 MultipleChoice (`follow-the-direction`, `complete-the-pattern`), 3 PathTracing (`trace-circle`, `trace-square`, `trace-letter-a` — SVG `d` paths in the 0–100 viewBox the component renders in, with `tolerance` and per-path `strokeWidth`/`label`), 3 DragAndDrop (`connect-animals-to-food`, `connect-people-to-tools`, `connect-things-to-rooms` — balanced items/targets), and 2 Matching (`match-emotions-to-faces`, `match-objects-to-uses`).
- **`src/data/activities/index.js`** — registered `level3` (10 entries).
- **Validator:** `levelContentValidator.js` gained a `pathTracing` block (instructions, positive `tolerance`, ≥1 path, unique path ids, non-empty `d` with a drawing command, positive `strokeWidth`, feedback).
- **Tests:** `level3.test.js` (21 tests) reuses the shared validator. Level 2 data verified untouched.
- **Suite:** ✅ **382 tests / 42 files passing** (up from 361/41), ESLint clean, build OK.

### Milestone 7b — Level 2 Content (complete)

Seeded all of Level 2's activities (Basic Coordination) and registered them:

- **`src/data/activities/level2/*.json`** — 8 activity documents at `difficulty: 2`: 3 MultipleChoice (`identify-vehicles`, `identify-food`, `count-objects`), 3 DragAndDrop (`match-shapes-to-outlines`, `drag-food-to-plate`, `sort-items-by-size` — each with unique items and targets whose `correctItemId` references a real, uniquely-used item), and 2 Matching (`match-numbers-to-counts`, `match-things-to-places`). Emoji labels (image-less, ASD-friendly).
- **`src/data/activities/index.js`** — registered `level2` in `ACTIVITIES_BY_LEVEL` (8 entries).
- **Tests:** `src/data/activities/__tests__/level2.test.js` (18 tests) plus a **shared validator** — `levelContentValidator.js` now runs the common structural checks for both level suites (count, type mix, unique ids, sequential order, type whitelist, difficulty, per-type content shapes, and DnD **balance**: every item is the answer to exactly one target so nothing is stranded unplaceable). Level 1's test was refactored onto the same helper (7c/7d/7e reuse it). Level 1 data verified untouched.
- **Suite:** ✅ **361 tests / 41 files passing** (up from 343/40), ESLint clean, build OK.

### Milestone 7a — Level 1 Content (complete)

Seeded all of Level 1's activities and wired them into the app:

- **`src/data/activities/level1/*.json`** — 8 activity documents mirroring the Firestore `activities/{activityId}` shape: 5 MultipleChoice (`identify-fruits`, `identify-animals`, `identify-objects`, `identify-colors`, `identify-shapes` — each with 4 options, exactly one correct, feedback, hints) and 3 Matching (`match-body-parts`, `match-animals-to-sounds`, `match-colors-to-objects` — 4 pairs each). Emoji labels used in place of image assets (image-less, ASD-friendly).
- **`src/data/activities/index.js`** — `getActivitiesForLevel(levelId)` returns a level's activities sorted by `order` (empty array for levels without content yet).
- **`src/App.jsx`** — selecting a level now loads its activities via `getActivitiesForLevel(level.id)` and passes them to `LevelScreen` (previously the level screen always showed "No activities available").
- **Tests:** `src/data/activities/__tests__/level1.test.js` (16 tests — counts 8 activities / 5 MC / 3 matching, unique ids, sequential order, type whitelist vs `levels.js`, MC content shape with exactly one correct option, matching pair shape with unique left/right ids, feedback presence, empty for unseeded levels). App routing test extended to assert the seeded activities render on the level screen.
- **Suite:** ✅ **298 tests / 37 files passing** (up from 281/36), ESLint clean, build OK.

### Profile edge-case test coverage (complete)

Extended `UserStats` and `SessionHistory` suites with 14 edge-case tests:

- **`UserStats.test.jsx`** (+6) — empty `{}` progress object, missing optional keys (no badges/streak/activities), `activities: null`, zero XP while still counting completed activities, large XP values (no truncation), max level 5 with zero streak.
- **`SessionHistory.test.jsx`** (+8) — `progress: null`, missing `activities` key, missing `lastAttempted` (renders "Recently"), timestamped sessions sort before untimestamped ones, correct sorting across mixed formats (ISO UTC, `+05:30` offset, date-only strings — all TZ-independent assertions), unparseable timestamps don't crash, zero-star dash rendering, and a unicode-safe timestamp still renders its year.
- **Suite:** ✅ **312 tests / 37 files passing**, ESLint clean. No production code changed.

### Level screen edge-case test coverage (complete)

Extended `LevelScreen` and added a new `ActivityCard` suite with 18 edge-case tests:

- **`LevelScreen.test.jsx`** (+9) — `activities: undefined` treated like an empty list (placeholder, no progress bar), hidden progress bar for empty lists, 0% for an unplayed level (with `aria-valuenow` check), partial progress (1/2 = 50%) with a completed card showing its best score, 100% with every activity done, percentage rounding (1/3 = 33%), ignoring progress entries for activities outside the level, ignoring entries missing the `completed` flag, and a null progress document.
- **`ActivityCard.test.jsx`** (new, 9 tests) — title/description render, type fallback when description is missing, time-limit chip present/absent, play vs completion indicators, completed aria-label with best score, 0% for a zero best score, click handler, and an **undefined best score guard**.
- **Fix (RED→GREEN):** `ActivityCard` now defaults a missing `bestScore` to 0 via `?? 0` — previously an undefined score would have rendered "undefined%" in both the badge and the aria-label.
- **Suite:** ✅ **330 tests / 38 files passing**, ESLint clean, build OK.

### Dashboard widget edge-case test coverage (complete)

Added two new suites for the dashboard widgets:

- **`QuickStats.test.jsx`** (new, 7 tests) — null / empty-object progress, missing optional keys (only `totalXP` present), `activities: null`, counting all activity entries regardless of completion status, multi-day streaks ("12 days"), and full stat-card rendering.
- **`BadgeShelf.test.jsx`** (new, 6 tests) — default/empty arrays show all 8 badges locked, mixed earned/locked states with correct aria-labels, all-earned state, unknown badge ids ignored, and a **null `badges` guard**.
- **Fix (RED→GREEN):** `BadgeShelf` now normalizes a null `badges` prop via `badges ?? []` — previously `badges={null}` crashed with "Cannot read properties of null (reading 'includes')".
- **Suite:** ✅ **343 tests / 40 files passing**, ESLint clean, build OK.

### Milestone 6 — Dashboard & Navigation (14/15 complete)

Dashboard and level screens were built in the prior session (uncommitted); this session completed the profile/settings screens, wiring, and end-to-end navigation tests:

- **`src/components/profile/ProfileScreen.jsx`** — header (avatar, name, email), **My Stats** (UserStats), **Badges** (reuses dashboard `BadgeShelf`), **Session History** (SessionHistory), back-to-dashboard button.
- **`src/components/profile/UserStats.jsx`** — presentational stat cards: Total XP, Current Level, completed Activities, Badges, Day Streak (completed-only activity count).
- **`src/components/profile/SessionHistory.jsx`** — presentational list of completed activities, most-recent-first (sorted by `lastAttempted`), showing best score %, star count, attempts, and formatted date; falls back to the activity id when no title is known; empty state.
- **`src/components/settings/SettingsScreen.jsx`** — wired to `useSettings`: Sound / Haptic / Reduced Motion toggles (`aria-pressed`), Text Size segmented control (normal/large/extra-large), Account section, back button.
- **`src/App.jsx`** — added `screen` state (`dashboard | profile | settings`); profile/settings render above the dashboard fallback; level back button resets to dashboard.
- **`src/components/dashboard/DashboardScreen.jsx`** — added 👤 PROFILE and ⚙ SETTINGS nav buttons to the header (optional `onNavigate` prop).
- **Tests:** new `UserStats` (3), `SessionHistory` (5), `ProfileScreen` (4), `SettingsScreen` (6) suites (18 total, TDD red→green); App routing tests for profile/settings navigation (+2). Fixed pre-existing bugs in uncommitted milestone-6 tests: App sign-in test needed `waitFor` for the async progress load (the old committed dashboard rendered welcome text synchronously), QuickStats streak seeds as 1 day for fresh users, and 'Badges'/'Locked' text now has multiple matches (QuickStats label + section heading, 8 locked badges).
- **Suite:** ✅ **281 tests / 36 files passing** (up from 246/30), ESLint clean, build OK.
- **Committed:** `492e156` — `feat: Milestone 6 - Dashboard & Navigation` (23 files, +1691/−97). Working tree clean. Milestone 6 is **15/15 complete**. Next milestone: **7. Level Content**.

---

## Session Notes — August 2, 2026

### ActivityPlayer → ProgressContext Wiring (complete)

Wired `recordActivityResult` from `useProgress()` into `ActivityPlayer.handleComplete` so activities actually award XP when the user completes them:

- **`src/components/activities/ActivityPlayer.jsx`** — `handleComplete` now computes stars/xp (via `calculateStars`/`calculateXP`) and calls `recordActivityResult({ activityId, score, stars, xp })` before showing the feedback overlay. Added an **idempotency guard** (`if (showFeedback) return;`) that prevents double-award when the timer expires and the activity's own delayed `onComplete` fires afterward — XP is awarded exactly once per playthrough.
- **`src/components/activities/__tests__/ActivityPlayer.test.jsx`** — Added `localStorage.clear()` in `beforeEach` (prevents XP leak from the progress service's localStorage backup). Added a regression test (`awards XP only once when the timer expiry and the activity completion overlap`) that simulates the exact double-fire scenario. Uses fake timers from mount (so the `useTimer` `setInterval` and `SlowActivity`'s `setTimeout` are both intercepted).
- **Suite:** ✅ **246 tests / 30 files passing** (up from 244), ESLint clean, build OK.

### Milestone 5.13 — Commit (complete)

Progress system committed as `cd153ed` (14 files, +1123/−26). Milestone 5 is **13/13 complete**. Working tree clean. Next milestone: **6. Dashboard & Navigation**.

### Milestone 5 — Progress System (complete)

- **`src/utils/progress.js`** — pure, side-effect-free progress logic: `createInitialProgress`, `getLevelForXP`, `isLevelUnlocked`, `applyActivityResult` (records an activity, accumulates XP, caps best score/stars, levels up, and returns newly earned badges), `checkEarnableBadges` (handles all 8 badge criteria types), `getEarnedBadgeObjects`, `updateLoginStreak` (same-day/next-day/gap), `getLevelProgress`.
- **`src/services/progressService.js`** — Firestore `userProgress/{uid}` upsert with a localStorage backup/fallback (offline-safe), mockable like `activityService`.
- **`src/contexts/ProgressContext.jsx`** — co-exports `useProgress` (AuthContext convention). State is **keyed by uid and derived at render time**, so account switches and sign-outs never show another user's data and no synchronous setState happens inside effects (avoids `react-hooks/set-state-in-effect`). Loads on sign-in (streak bump), seeds a fresh doc when none exists, and `recordActivityResult` updates + persists.
- **Results components** — `ResultsScreen` (SESSION COMPLETE / KEEP PRACTICING, aria-live summary), `ScoreDisplay`, `StarsEarned` (role="img" label), `BadgesEarned` (hidden when none).
- **Wiring:** `ProgressProvider` added to App (Auth → Progress → Settings); `App.test.jsx` gained a `firebase/firestore` mock.
- **Tests:** progress util (24), progressService (6), ProgressContext (6), ResultsScreen (7). Suite at **244 tests / 30 files**, all passing; lint clean; build OK.
- **Notes:** `sessionActivities` (Quick Learner) is a persisted counter, not a true per-session count (documented simplification); `level_completed` badges use reaching the level as a proxy; badges are awarded at record time (not retroactively on load).
- **⚠️ Uncommitted:** 5.13 is the commit point.

### Milestone 4.5 — Commit (complete)

All six activity types committed. Milestone 4 is **28/28 complete**: `b414553` (4a+4b) and `5d8780c` (4c–4f, 17 files, +2336/−24). Working tree clean. Next milestone: **5. Progress System**.

### Milestone 4f — MatchingActivity (complete) — all 6 activity types done 🎯

- **`src/components/activities/MatchingActivity.jsx`** — tap-to-select pairs between two columns. Either order works (left→right or right→left); re-tapping the selected item deselects it; matches can be changed freely before checking (orphaned partners lose their matched styling). **Visual connection lines** (4f.3 — not in the plan's draft) drawn as an SVG overlay between matched button centers, measured via `getBoundingClientRect` in a `useLayoutEffect` (pointer-events-none, aria-hidden, beneath the z-10 columns). Correct pairs highlight mint, wrong pairs coral after submit. `aria-pressed` selection state, polite `role="status"` live region (announces each match and the result), 1500ms completion timer cleaned up on unmount, interactions gated after results, CHECK MATCHES via `AccessibleButton` disabled until every left item is matched. Hardcoded "Left/Right" headers from the plan dropped (child-friendly).
- **Wiring:** `matching` added to `ActivityPlayer` registry — the final slot; the placeholder test now uses an unknown `futureType` since all six real types are wired (placeholder kept as a defensive safety net).
- **Tests:** `MatchingActivity.test.jsx` (14 tests — both tap orders, deselect, re-match + orphan styling, perfect/partial scoring, stubbed-rect connection-line coordinates, one-line-per-match, announcements, gating, unmount). Suite at **206 tests / 26 files**, all passing; lint clean; build OK.
- **4.5 remains:** all six activity types are implemented and **uncommitted** — 4.5 is the commit point for the full Milestone 4 (4a–4f).

### Milestone 4e — SortingActivity (complete)

- **`src/components/activities/SortingActivity.jsx`** — reorder items to match a target order (ascending/descending). **Three equivalent input modes converging on the same ID-based swap semantics** (predictable for ASD): (1) drag item A onto item B, (2) tap/click two items, (3) ArrowUp/ArrowDown on a focused item (position-aware announcements, focus retained via stable keys). The swap is keyed by item **ID**, deliberately fixing a bug in the plan's draft that indexed the stable `items` array by display position and swapped the wrong items after the first reorder. Correct-position items highlight mint, wrong coral after submit. Semantic `<ol>`, `aria-pressed` selection state, polite `role="status"` live region (announces swaps, moves, and results), 1500ms completion timer cleaned up on unmount, interactions gated after results.
- **Wiring:** `sorting` added to `ActivityPlayer` registry.
- **Tests:** `SortingActivity.test.jsx` (14 tests — swap by ID, drag-and-drop swap, arrow reorder + boundary, focus retention after reorder, perfect/partial scoring, announcements, gating, unmount). Suite at **193 tests / 25 files**, all passing; lint clean; build OK.
- **📊 Table correction:** Milestone 4's task count in the progress summary was corrected from 21 → 28 (the actual checkbox total through 4f + the 4.5 commit); grand total 135 → 142.

### Milestone 4d — FreehandDrawingActivity (complete)

- **`src/utils/scoring.js`** — added `calculateFreehandDrawingScore(strokeCount)` = `min(100, max(0, n) × 20)` — effort-based, per the design spec's "score based on strokes made."
- **`src/components/activities/FreehandDrawingActivity.jsx`** — HTML5 canvas drawing with unified pointer events (finger/stylus/mouse; `touch-none` + `setPointerCapture` so strokes continue past the canvas edge). Strokes recorded as point data; canvas redraws from state on every commit (enables **UNDO** by replaying all but the last stroke). Optional light SVG template overlay from `content.template`. CLEAR/UNDO/DONE via `AccessibleButton`, polite `role="status"` live region, drawing gated after results, 1500ms completion timer cleaned up on unmount. Ref-based drawing guard (no dropped move events on fast strokes).
- **Wiring:** `freehandDrawing` added to `ActivityPlayer` registry (placeholder test still uses `matching`).
- **Tests:** `FreehandDrawingActivity.test.jsx` (12 tests — mocked canvas 2D context since jsdom lacks canvas), scoring tests added. Suite at **179 tests / 24 files**, all passing; lint clean; build OK.

### Milestone 4c — PathTracingActivity (complete)

- **`src/utils/pathTracing.js`** — pure (jsdom-safe) SVG path sampler supporting M/L/H/V/C/S/Q/T/A/Z (absolute + relative, implicit lineto after moveto, arc sampling) plus distance-based stroke detection: `samplePathPoints`, `getPathSegments`, `distanceToSegment`, `calculateTraceScore` (reuses `calculatePathTracingScore`), and `getPathCoverage` (fraction of template path covered — drives live feedback).
- **`src/hooks/usePathTracing.js`** — pointer-event drawing state normalized to a 0–100 coordinate space; supports touch, stylus, mouse; undo/clear.
- **`src/components/activities/PathTracingActivity.jsx`** — SVG tracing area with template paths that light up mint as they're covered (progressive visual feedback), user strokes in coral, UNDO/CLEAR/DONE controls, polite `role="status"` live region, timer cleanup on unmount, drawing gated after results.
- **Wiring:** `pathTracing` added to `ActivityPlayer` registry.
- **Tests:** `pathTracing.test.js` (17 tests incl. parser edge cases), `usePathTracing.test.jsx` (6), `PathTracingActivity.test.jsx` (7). Suite at **165 tests / 23 files**, all passing; lint clean; build OK.

### Milestone 4b — DragAndDropActivity (complete)

- **`src/hooks/useDragAndDrop.js`** — assignment state (targetId → itemId), drag start/end/drop, tap-to-assign, placements with correct flags, `isComplete`, `reset`. Items live in exactly one target (re-placing moves them).
- **`src/components/activities/DragAndDropActivity.jsx`** — items (draggable buttons) + targets (drop zones). Three input modes: native HTML5 drag (mouse), tap-to-assign (touch), and keyboard (Tab + Enter via native buttons). Targets announce empty/contains state via `aria-label`; results announced via polite `role="status"` live region; 1500ms completion timer cleaned up on unmount.
- **Wiring:** `dragAndDrop` added to `ActivityPlayer` registry.
- **Tests:** `useDragAndDrop.test.js` (8 tests) + `DragAndDropActivity.test.jsx` (9 tests). Suite at **135 tests / 20 files**, all passing; lint clean; build OK.

### Milestone 4a — MultipleChoiceActivity (complete)

First real activity type wired into the engine:

- **`src/components/shared/AnswerTile.jsx`** — moved from `src/components/AnswerTile.jsx` (final plan structure); added `aria-pressed` for selection state. References updated: `QuestionCard.jsx`, `AnswerTile.depth.test.jsx`.
- **`src/components/activities/MultipleChoiceActivity.jsx`** — one question + selectable options using shared `AnswerTile`. Keyboard accessible (native buttons, Tab + Enter), `role="group"` labelled by the question heading, polite `role="status"` live region announcing results, deterministic option rotation, 1500ms reveal delay before `onComplete` (timer cleaned up on unmount).
- **Wiring:** `multipleChoice` added to `ActivityPlayer` `DEFAULT_REGISTRY` — the player now renders the real component instead of the placeholder.
- **Tests:** new `MultipleChoiceActivity.test.jsx` (6 tests); `ActivityPlayer.test.jsx` updated to use the real component. Suite at **118 tests / 18 files**, all passing; lint clean; build OK.
- **⚠️ Uncommitted:** 4a changes are uncommitted — milestone 4.5 is the planned commit point (after all activity types land).

### Milestone 3 — Activity Engine Core (complete)

Built the data-driven activity engine foundation:

- **`src/data/badges.js`** — 8 badge definitions with rarity tiers (`RARITY_ORDER`, `getBadgeById`, `getBadgesByRarity`).
- **`src/utils/scoring.js`** — stars (≥90/≥70/>0), XP (base × difficulty × stars), and per-type 0–100 scorers (multipleChoice, dragAndDrop, sorting, matching, pathTracing).
- **`src/hooks/useTimer.js`** — reusable countdown hook (autoStart, start/pause/reset, formatted mm:ss, onTimeUp).
- **`src/components/shared/AccessibleButton.jsx`** — ≥48px touch target, focus-visible ring, ARIA-label, disabled handling, variants.
- **`src/components/shared/FeedbackOverlay.jsx`** — enhanced modal: dialog semantics, focus management, polite live region, optional sound cue (OFF by default).
- **`src/components/activities/ActivityHeader.jsx`** — title, countdown timer, optional score chip, back nav.
- **`src/components/activities/ActivityPlayer.jsx`** — registry-driven renderer with graceful "COMING SOON" placeholder for types not yet implemented (Milestone 4 plugs components in). Handles completion → FeedbackOverlay → `onComplete({ score, stars, xp, activityId })` and timer-expiry.
- **Tests:** 5 new test files (badges, scoring, useTimer, ActivityPlayer, ActivityHeader, AccessibleButton, FeedbackOverlay) — suite at **112 tests / 17 files**, all passing; lint clean; build OK.
- **⚠️ Note:** `ActivityPlayer` was intentionally built registry-first (per plan review) so the engine is testable before activity-type components exist.

### Prior session notes

Auxiliary work completed earlier this session (not milestone tasks, tracked for context):

- **Test suite:** 10 files / **62 tests** passing. Covers the full auth flow
  (EmailPasswordForm, LoginPage, authService, AuthContext, App routing), SettingsContext,
  activityService, levels, and the legacy quiz components.
- **Coverage:** v8 provider configured via `npm run test:coverage` (report in `coverage/`).
  Overall ≈62% lines; auth flow, SettingsContext, levels, activityService at 100%.
- **Auth hardening:** client-side validation in `EmailPasswordForm` (email format, min 6-char
  password, required name); `onLogin` prop removed from `LoginPage` — navigation is fully
  driven by `AuthContext`; `SettingsContext.reducedMotion` defaults to the OS preference.
- **Infra:** `@vitest/coverage-v8` installed; `test:coverage` script added; ESLint ignores
  `coverage/` and allows co-located provider/hook exports in `src/contexts`.
- **⚠️ Uncommitted:** all session changes are uncommitted — commit when ready.

---

## Progress Summary

| Milestone | Status | Remaining |
|-----------|--------|-----------|
| 9. Styling & Polish | ✅ Complete | 0 |
| 10. Testing & Verification | ✅ Complete | 0 |
| 11. Final Review | ✅ Complete | 0 |
| **Total remaining** | ✅ **All milestones complete** | **0** |

All 11 milestones are **complete** — see Session Notes for the full history.

---

## Quick Reference

**To resume work:** Start from the first unchecked task in the lists above (Milestone 10).

**Key files:**
- Spec: `docs/superpowers/specs/2026-08-01-asd-motor-skill-platform-design.md`
- Plan: `docs/superpowers/plans/2026-08-01-asd-motor-skill-platform-implementation.md`
- This tracker: `TODO.md`

**Commands:**
```bash
npm run dev            # Start dev server
npm run build          # Build for production
npm run test           # Run tests (jsdom)
npm run test:browser   # Run browser-mode tests (Playwright chromium)
npm run test:all       # Run jsdom + browser tests
npm run test:coverage  # Run tests with coverage report
npm run lint           # Run linter
```
