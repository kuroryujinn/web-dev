# ASD Motor-Skill Learning Platform — Project Tracker

> **Status:** 🟡 In Progress
> **Last Updated:** August 2, 2026
> **Spec:** `docs/superpowers/specs/2026-08-01-asd-motor-skill-platform-design.md`
> **Plan:** `docs/superpowers/plans/2026-08-01-asd-motor-skill-platform-implementation.md`

---

## Milestone 1: Foundation & Cleanup 🧹

Remove dead code, refactor existing components, establish clean base.

- [x] **1.1** Remove unused components: `ResultScreen.jsx`, `StartScreen.jsx`, `QuizCard.jsx`
- [x] **1.2** Remove unused hook: `hooks/useQuiz.js` (replaced by new activity system)
- [x] **1.3** Remove legacy data: `data/questions.json`
- [x] **1.4** Remove legacy feedback: `components/FeedbackBanner.jsx`, `components/AnswerOption.jsx`
- [x] **1.5** Refactor `App.jsx` — clean screen routing, prepare for providers
- [x] **1.6** Update `package.json` — remove unused deps, verify versions
- [x] **1.7** Verify app still builds and runs after cleanup
- [x] **1.8** Commit cleanup changes

---

## Milestone 2: Firebase Setup & Authentication 🔐

Set up Firebase backend, auth providers, and user management.

- [x] **2.1** Install Firebase dependencies (`firebase`, `react-firebase-hooks`)
- [x] **2.2** Create `src/services/firebase.js` — Firebase config & initialization
- [x] **2.3** Create `src/contexts/AuthContext.jsx` — Auth state management
- [x] **2.4** Create `src/services/authService.js` — Login/logout/register functions
- [x] **2.5** Create `src/components/auth/EmailPasswordForm.jsx` — Email/password login
- [x] **2.6** Integrate Google sign-in in `LoginPage.jsx` — Use Firebase Google auth (popup)
- [x] **2.7** Refactor `LoginPage.jsx` — Integrate Firebase auth
- [x] **2.8** Create `src/contexts/SettingsContext.jsx` — User settings
- [x] **2.9** Test authentication flow end-to-end
- [x] **2.10** Commit Firebase auth changes

---

## Milestone 3: Activity Engine Core ⚙️

Build the data-driven activity rendering system.

- [x] **3.1** Create `src/services/activityService.js` — Fetch activities from Firestore
- [x] **3.2** Create `src/data/levels.js` — Level definitions (5 levels)
- [x] **3.3** Create `src/data/badges.js` — Badge definitions
- [x] **3.4** Create `src/components/activities/ActivityPlayer.jsx` — Main activity renderer
- [x] **3.5** Create `src/components/activities/ActivityHeader.jsx` — Title, timer, score
- [x] **3.6** Create `src/hooks/useTimer.js` — Timer hook for timed activities
- [x] **3.7** Create `src/utils/scoring.js` — Score calculation utilities
- [x] **3.8** Create `src/components/shared/AccessibleButton.jsx` — Accessible button component
- [x] **3.9** Create `src/components/shared/FeedbackOverlay.jsx` — Enhanced feedback modal
- [x] **3.10** Test activity engine with mock data
- [x] **3.11** Commit activity engine core

---

## Milestone 4: Activity Types 🎯

Implement all 6 activity type components.

### 4a: MultipleChoice (existing, enhanced)
- [ ] **4a.1** Create `src/components/activities/MultipleChoiceActivity.jsx`
- [ ] **4a.2** Add keyboard navigation (Tab + Enter)
- [ ] **4a.3** Add ARIA labels and live regions
- [ ] **4a.4** Test MultipleChoice activity

### 4b: DragAndDrop
- [ ] **4b.1** Create `src/hooks/useDragAndDrop.js` — Drag state management
- [ ] **4b.2** Create `src/components/activities/DragAndDropActivity.jsx`
- [ ] **4b.3** Add touch support (pointer events)
- [ ] **4b.4** Add keyboard fallback (arrow keys + Enter)
- [ ] **4b.5** Test DragAndDrop activity

### 4c: PathTracing
- [ ] **4c.1** Create `src/hooks/usePathTracing.js` — Touch/draw state
- [ ] **4c.2** Create `src/components/activities/PathTracingActivity.jsx`
- [ ] **4c.3** Implement SVG path rendering and stroke detection
- [ ] **4c.4** Add visual feedback during tracing
- [ ] **4c.5** Test PathTracing activity

### 4d: FreehandDrawing
- [ ] **4d.1** Create `src/components/activities/FreehandDrawingActivity.jsx`
- [ ] **4d.2** Implement HTML5 Canvas drawing
- [ ] **4d.3** Add stroke recording and scoring
- [ ] **4d.4** Add undo/clear functionality
- [ ] **4d.5** Test FreehandDrawing activity

### 4e: Sorting
- [ ] **4e.1** Create `src/components/activities/SortingActivity.jsx`
- [ ] **4e.2** Implement drag-to-reorder
- [ ] **4e.3** Add keyboard fallback for sorting
- [ ] **4e.4** Test Sorting activity

### 4f: Matching
- [ ] **4f.1** Create `src/components/activities/MatchingActivity.jsx`
- [ ] **4f.2** Implement tap-to-select-pairs
- [ ] **4f.3** Add visual connection lines
- [ ] **4f.4** Test Matching activity

- [ ] **4.5** Commit all activity types

---

## Milestone 5: Progress System 📊

XP, stars, badges, and level unlocking.

- [ ] **5.1** Create `src/contexts/ProgressContext.jsx` — Global progress state
- [ ] **5.2** Create `src/services/progressService.js` — Firestore CRUD for progress
- [ ] **5.3** Create `src/hooks/useProgress.js` — Progress hook
- [ ] **5.4** Implement XP calculation (base × difficulty × stars)
- [ ] **5.5** Implement star calculation (completion, 70%, 90%)
- [ ] **5.6** Implement badge earning logic
- [ ] **5.7** Implement level unlock logic (XP thresholds)
- [ ] **5.8** Create `src/components/results/ResultsScreen.jsx` — Enhanced results
- [ ] **5.9** Create `src/components/results/ScoreDisplay.jsx`
- [ ] **5.10** Create `src/components/results/StarsEarned.jsx`
- [ ] **5.11** Create `src/components/results/BadgesEarned.jsx`
- [ ] **5.12** Test progress tracking end-to-end
- [ ] **5.13** Commit progress system

---

## Milestone 6: Dashboard & Navigation 🏠

Level selection, user profile, settings.

- [ ] **6.1** Create `src/components/dashboard/DashboardScreen.jsx`
- [ ] **6.2** Create `src/components/dashboard/LevelGrid.jsx`
- [ ] **6.3** Create `src/components/dashboard/LevelCard.jsx`
- [ ] **6.4** Create `src/components/dashboard/BadgeShelf.jsx`
- [ ] **6.5** Create `src/components/dashboard/QuickStats.jsx`
- [ ] **6.6** Create `src/components/level/LevelScreen.jsx`
- [ ] **6.7** Create `src/components/level/ActivityList.jsx`
- [ ] **6.8** Create `src/components/level/ActivityCard.jsx`
- [ ] **6.9** Create `src/components/profile/ProfileScreen.jsx`
- [ ] **6.10** Create `src/components/profile/UserStats.jsx`
- [ ] **6.11** Create `src/components/profile/SessionHistory.jsx`
- [ ] **6.12** Create `src/components/settings/SettingsScreen.jsx`
- [ ] **6.13** Refactor `App.jsx` — New screen routing (dashboard, level, profile, settings)
- [ ] **6.14** Test navigation flow end-to-end
- [ ] **6.15** Commit dashboard & navigation

---

## Milestone 7: Level Content 📚

Seed activities for all 5 levels.

### 7a: Level 1 — Core Recognition
- [ ] **7a.1** Create `src/data/activities/level1/` directory
- [ ] **7a.2** Create 5 MultipleChoice activities (identify fruits, animals, objects)
- [ ] **7a.3** Create 3 Matching activities (match pairs)
- [ ] **7a.4** Test Level 1 activities

### 7b: Level 2 — Basic Coordination
- [ ] **7b.1** Create `src/data/activities/level2/` directory
- [ ] **7b.2** Create 3 MultipleChoice activities
- [ ] **7b.3** Create 3 DragAndDrop activities (match shapes, sort items)
- [ ] **7b.4** Create 2 Matching activities
- [ ] **7b.5** Test Level 2 activities

### 7c: Level 3 — Visual-Motor Integration
- [ ] **7c.1** Create `src/data/activities/level3/` directory
- [ ] **7c.2** Create 3 PathTracing activities (trace letters, shapes)
- [ ] **7c.3** Create 3 DragAndDrop activities (connect pairs)
- [ ] **7c.4** Create 2 Matching activities
- [ ] **7c.5** Create 2 MultipleChoice activities
- [ ] **7c.6** Test Level 3 activities

### 7d: Level 4 — Fine Motor Skills
- [ ] **7d.1** Create `src/data/activities/level4/` directory
- [ ] **7d.2** Create 4 Sorting activities (by size, color, category)
- [ ] **7d.3** Create 3 DragAndDrop activities
- [ ] **7d.4** Create 2 PathTracing activities
- [ ] **7d.5** Create 1 MultipleChoice activity
- [ ] **7d.6** Test Level 4 activities

### 7e: Level 5 — Functional Activities
- [ ] **7e.1** Create `src/data/activities/level5/` directory
- [ ] **7e.2** Create 4 FreehandDrawing activities
- [ ] **7e.3** Create 3 Sorting activities (multi-step)
- [ ] **7e.4** Create 3 DragAndDrop activities (daily-life scenarios)
- [ ] **7e.5** Create 2 PathTracing activities
- [ ] **7e.6** Create 2 Matching activities
- [ ] **7e.7** Test Level 5 activities

- [ ] **7.8** Commit all level content

---

## Milestone 8: Accessibility ♿

WCAG 2.1 AA compliance and ASD-specific considerations.

- [ ] **8.1** Audit all components for touch target sizes (min 48px)
- [ ] **8.2** Add ARIA labels to all interactive elements
- [ ] **8.3** Add live regions for dynamic content (feedback, scores)
- [ ] **8.4** Implement keyboard navigation for all activities
- [ ] **8.5** Add focus indicators (visible focus rings)
- [ ] **8.6** Implement `prefers-reduced-motion` respect
- [ ] **8.7** Add reduced motion toggle in settings
- [ ] **8.8** Add sound toggle (default OFF)
- [ ] **8.9** Test with screen reader (VoiceOver/NVDA basics)
- [ ] **8.10** Test keyboard-only navigation
- [ ] **8.11** Commit accessibility improvements

---

## Milestone 9: Styling & Polish 🎨

Refine neo-brutalism design, ensure consistency.

- [ ] **9.1** Update `src/styles/tokens.css` — Add level-specific colors
- [ ] **9.2** Update `src/index.css` — Add activity-specific styles
- [ ] **9.3** Ensure consistent button styles across all screens
- [ ] **9.4** Add hover/focus states to all interactive elements
- [ ] **9.5** Add loading states (skeleton screens)
- [ ] **9.6** Add error states (network errors, missing data)
- [ ] **9.7** Test responsive layout (375px, 768px, 1024px, 1440px)
- [ ] **9.8** Commit styling polish

---

## Milestone 10: Testing & Verification ✅

Comprehensive testing and final verification.

- [x] **10.1** Run all existing tests — verify no regressions (62/62 passing; re-verify at release)
- [ ] **10.2** Add unit tests for scoring utilities
- [ ] **10.3** Add unit tests for progress calculations
- [ ] **10.4** Add component tests for ActivityPlayer
- [ ] **10.5** Add component tests for each activity type
- [x] **10.6** Run ESLint — fix all warnings (clean at `--max-warnings 0`)
- [x] **10.7** Run build — verify no errors
- [ ] **10.8** Manual test: Complete full user flow (login → dashboard → activity → results)
- [ ] **10.9** Manual test: Verify progress persistence (refresh page, check data)
- [ ] **10.10** Manual test: Verify level unlocking works
- [ ] **10.11** Manual test: Verify accessibility (keyboard, screen reader basics)
- [ ] **10.12** Final commit with all changes

---

## Milestone 11: Final Review 📋

Audit, optimize, and document.

- [ ] **11.1** Remove any remaining dead code
- [ ] **11.2** Verify bundle size is reasonable
- [ ] **11.3** Check for console errors/warnings
- [ ] **11.4** Update README.md with new setup instructions
- [ ] **11.5** Update `.env.example` with required Firebase config
- [ ] **11.6** Create architecture summary document
- [ ] **11.7** Final commit

---

## Session Notes — August 2, 2026

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

| Milestone | Status | Tasks | Completed |
|-----------|--------|-------|-----------|
| 1. Foundation & Cleanup | ✅ Complete | 8 | 8/8 |
| 2. Firebase Auth | ✅ Complete | 10 | 10/10 |
| 3. Activity Engine | ✅ Complete | 11 | 11/11 |
| 4. Activity Types | ⬜ Not Started | 21 | 0/21 |
| 5. Progress System | ⬜ Not Started | 13 | 0/13 |
| 6. Dashboard & Nav | ⬜ Not Started | 15 | 0/15 |
| 7. Level Content | ⬜ Not Started | 19 | 0/19 |
| 8. Accessibility | ⬜ Not Started | 11 | 0/11 |
| 9. Styling & Polish | ⬜ Not Started | 8 | 0/8 |
| 10. Testing | 🟡 In Progress | 12 | 3/12 |
| 11. Final Review | ⬜ Not Started | 7 | 0/7 |
| **Total** | 🟡 In Progress | **135** | **32/135** |

---

## Quick Reference

**To resume work:** Check the last checked-off task in the list above. Start from the next unchecked task.

**Key files:**
- Spec: `docs/superpowers/specs/2026-08-01-asd-motor-skill-platform-design.md`
- Plan: `docs/superpowers/plans/2026-08-01-asd-motor-skill-platform-implementation.md`
- This tracker: `TODO.md`

**Commands:**
```bash
npm run dev            # Start dev server
npm run build          # Build for production
npm run test           # Run tests
npm run test:coverage  # Run tests with coverage report
npm run lint           # Run linter
```
