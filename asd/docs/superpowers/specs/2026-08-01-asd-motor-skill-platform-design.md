# ASD Progressive Motor-Skill Learning Platform — Design Spec

> **Date:** August 1, 2026
> **Status:** Approved
> **Scope:** Full transformation from single-quiz app to progressive 5-level motor-skill learning platform

---

## 1. Overview

Transform the existing `asd-quiz-app` (React 19 + Vite + Tailwind) into a progressive, data-driven motor-skill learning platform for children with Autism Spectrum Disorder. The platform features 5 difficulty levels with 6 activity types, a Firebase backend for persistence, and strict accessibility compliance.

**Key Principles:**
- Data-driven activity engine (no hardcoded levels)
- Minimal distraction, calm colors, predictable interactions
- Progressive difficulty mirroring therapeutic motor-skill training
- Full persistence via Firebase (auth, progress, analytics)
- Keep existing neo-brutalism aesthetic

---

## 2. Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 19 + Vite 8 | SPA framework + build |
| Styling | Tailwind CSS 4 | Utility-first CSS |
| State | React Context + useReducer | Global app state |
| Auth | Firebase Auth | Google + email/password |
| Database | Firestore | User data, progress, activities |
| Storage | Firebase Storage | SVG assets, activity content |
| Testing | Vitest + React Testing Library | Unit/integration tests |
| Linting | ESLint 9 | Code quality |

---

## 3. Architecture

### 3.1 Screen Flow

```
login → dashboard → levelSelect → activity → results → dashboard
  │                   │                          │
  │                   └── profile ───────────────┘
  │                   └── settings ──────────────┘
  └── register
```

### 3.2 Component Hierarchy

```
App
├── AuthProvider (Firebase Auth context)
├── ProgressProvider (XP, stars, badges context)
├── SettingsProvider (sound, haptic, reducedMotion)
│
├── LoginPage
│   ├── GoogleLoginButton
│   └── EmailPasswordForm
│
├── DashboardScreen
│   ├── UserHeader (avatar, name, XP bar)
│   ├── LevelGrid (level cards)
│   ├── BadgeShelf (earned badges)
│   └── QuickStats (streak, total activities)
│
├── LevelScreen
│   ├── LevelHeader (title, description, progress)
│   ├── ActivityList (activity cards)
│   └── LevelProgress (completion percentage)
│
├── ActivityPlayer
│   ├── ActivityHeader (title, timer, score)
│   ├── ActivityRenderer (switch on type)
│   │   ├── MultipleChoiceActivity
│   │   ├── DragAndDropActivity
│   │   ├── PathTracingActivity
│   │   ├── FreehandDrawingActivity
│   │   ├── SortingActivity
│   │   └── MatchingActivity
│   └── FeedbackOverlay
│
├── ResultsScreen
│   ├── ScoreDisplay
│   ├── StarsEarned
│   ├── XPGained
│   ├── BadgesEarned
│   └── NextActivity / BackToLevel
│
├── ProfileScreen
│   ├── UserStats
│   ├── BadgeCollection
│   ├── SessionHistory
│   └── AchievementTimeline
│
└── SettingsScreen
    ├── SoundToggle
    ├── HapticToggle
    ├── ReducedMotionToggle
    ├──FontSizeSlider
    └── AccountSection
```

---

## 4. Data Model

### 4.1 Firestore Collections

```
users/{uid}
  ├── name: string
  ├── avatar: string (emoji)
  ├── email: string
  ├── totalXP: number
  ├── currentLevel: number (1-5)
  ├── badges: string[] (earned badge IDs)
  ├── settings: {
  │     sound: boolean (default: false)
  │     haptic: boolean (default: true)
  │     reducedMotion: boolean (default: false)
  │     fontSize: 'normal' | 'large' | 'extra-large'
  │   }
  ├── streak: number (consecutive days)
  ├── lastActiveDate: timestamp
  └── createdAt: timestamp

levels/{levelId}
  ├── id: string
  ├── order: number (1-5)
  ├── title: string
  ├── description: string
  ├── unlockXP: number (XP threshold to unlock)
  ├── icon: string (SVG reference)
  ├── color: string (theme color)
  └── activities: string[] (activity IDs, ordered)

activities/{activityId}
  ├── id: string
  ├── levelId: string
  ├── type: ActivityType
  ├── title: string
  ├── description: string
  ├── difficulty: 1 | 2 | 3
  ├── content: ActivityContent (type-specific)
  ├── maxScore: number
  ├── timeLimit: number | null (seconds)
  ├── order: number
  └── hints: string[]

userProgress/{uid}_{activityId}
  ├── userId: string
  ├── activityId: string
  ├── bestScore: number
  ├── stars: 0 | 1 | 2 | 3
  ├── attempts: number
  ├── completed: boolean
  ├── lastAttempted: timestamp
  └── history: Array<{ score, stars, timestamp }>

badges/{badgeId}
  ├── id: string
  ├── title: string
  ├── description: string
  ├── icon: string (emoji/SVG)
  ├── criteria: BadgeCriteria
  └── rarity: 'common' | 'rare' | 'epic' | 'legendary'
```

### 4.2 Activity Types

```typescript
type ActivityType =
  | 'multipleChoice'
  | 'dragAndDrop'
  | 'pathTracing'
  | 'freehandDrawing'
  | 'sorting'
  | 'matching';

// Each type has its own content structure:
interface MultipleChoiceContent {
  questionLabel: string;
  questionImage: string | null;
  questionAlt: string;
  options: Array<{
    id: string;
    label: string;
    image: string | null;
    correct: boolean;
  }>;
  feedback: { correct: string; incorrect: string };
}

interface DragAndDropContent {
  instructions: string;
  items: Array<{ id: string; label: string; image: string | null }>;
  targets: Array<{
    id: string;
    label: string;
    image: string | null;
    correctItemId: string;
  }>;
  feedback: { correct: string; incorrect: string };
}

interface PathTracingContent {
  instructions: string;
  paths: Array<{
    id: string;
    d: string; // SVG path data
    label: string;
    strokeWidth: number;
  }>;
  tolerance: number; // pixels
  feedback: { correct: string; incorrect: string };
}

interface FreehandDrawingContent {
  instructions: string;
  template: string; // SVG path data to trace
  canvasWidth: number;
  canvasHeight: number;
  strokeWidth: number;
  feedback: { correct: string; incorrect: string };
}

interface SortingContent {
  instructions: string;
  items: Array<{
    id: string;
    label: string;
    image: string | null;
    order: number;
  }>;
  direction: 'ascending' | 'descending';
  feedback: { correct: string; incorrect: string };
}

interface MatchingContent {
  instructions: string;
  pairs: Array<{
    left: { id: string; label: string; image: string | null };
    right: { id: string; label: string; image: string | null };
  }>;
  feedback: { correct: string; incorrect: string };
}
```

---

## 5. Level Progression

### Level 1 — Core Recognition
**Unlock:** 0 XP (starting level)
**Focus:** Object identification, basic matching, simple counting
**Activity Types:** MultipleChoice, Matching
**Activities:** 8-10 activities
**Examples:** Identify fruits, match animals to sounds, count objects

### Level 2 — Basic Coordination
**Unlock:** 500 XP
**Focus:** Drag-and-drop matching, shape recognition, object placement
**Activity Types:** MultipleChoice, DragAndDrop, Matching
**Activities:** 8-10 activities
**Examples:** Match shapes to outlines, drag food to plate, pair colors

### Level 3 — Visual-Motor Integration
**Unlock:** 1500 XP
**Focus:** Path tracing, directional following, pattern connection
**Activity Types:** MultipleChoice, PathTracing, DragAndDrop, Matching
**Activities:** 10-12 activities
**Examples:** Trace letters, follow maze paths, connect matching pairs, arrange story sequence

### Level 4 — Fine Motor Skills
**Unlock:** 3000 XP
**Focus:** Precision sorting, sequencing, pattern completion, color sorting
**Activity Types:** All types except FreehandDrawing
**Activities:** 10-12 activities
**Examples:** Sort by size, complete patterns, sequence numbers, sort by category

### Level 5 — Functional Activities
**Unlock:** 5000 XP
**Focus:** Daily-life simulations, multi-step activities, freehand drawing
**Activity Types:** All types including FreehandDrawing
**Activities:** 12-15 activities
**Examples:** Dress-up sequence, meal preparation steps, draw a house, multi-step puzzles

---

## 6. Progress System

### 6.1 Scoring

| Metric | Calculation |
|--------|-------------|
| **Activity Score** | 0-100 based on accuracy |
| **Stars** | 1★ = completed, 2★ = >70%, 3★ = >90% |
| **XP** | base(10) × difficulty(1/1.5/2) × stars(1/1.2/1.5) |
| **Level Progress** | Sum of best scores across all activities in level |

### 6.2 Badges

| Badge | Criteria | Rarity |
|-------|----------|--------|
| First Steps | Complete first activity | Common |
| Quick Learner | Complete 5 activities in one session | Common |
| Perfectionist | Get 3★ on any activity | Rare |
| Level Up | Unlock a new level | Rare |
| Streak Master | 7-day login streak | Epic |
| Badge Collector | Earn 10 badges | Epic |
| Motor Skills Pro | Complete Level 4 | Legendary |
| Master Artist | Complete Level 5 | Legendary |

### 6.3 Level Unlocking

- Levels unlock when cumulative `totalXP` reaches the threshold
- Unlock animation plays on first access
- Locked levels show preview with lock icon and XP requirement
- Activities within an unlocked level are always accessible

---

## 7. Activity Engine Design

### 7.1 Core Pattern

```jsx
// ActivityPlayer.jsx
const ActivityPlayer = ({ activity, onComplete }) => {
  const ActivityComponent = ACTIVITY_REGISTRY[activity.type];

  return (
    <div className="activity-player">
      <ActivityHeader
        title={activity.title}
        timer={activity.timeLimit}
        onTimeUp={handleTimeUp}
      />
      <ActivityComponent
        content={activity.content}
        onAnswer={handleAnswer}
        settings={settings}
      />
    </div>
  );
};
```

### 7.2 Activity Registry

```js
const ACTIVITY_REGISTRY = {
  multipleChoice: MultipleChoiceActivity,
  dragAndDrop: DragAndDropActivity,
  pathTracing: PathTracingActivity,
  freehandDrawing: FreehandDrawingActivity,
  sorting: SortingActivity,
  matching: MatchingActivity,
};
```

### 7.3 Scoring Per Activity Type

| Activity Type | Scoring Method |
|---------------|----------------|
| MultipleChoice | (correct answers / total) × 100 |
| DragAndDrop | (correct placements / total) × 100 |
| PathTracing | (points within tolerance / total points) × 100 |
| FreehandDrawing | Completion percentage (user draws for N seconds, score based on strokes made). Simplified scoring — no complex overlap detection needed. |
| Sorting | (items in correct position / total) × 100 |
| Matching | (correct pairs / total pairs) × 100 |

---

## 8. File Structure

### 8.1 Files to Create

```
src/
├── contexts/
│   ├── AuthContext.jsx
│   ├── ProgressContext.jsx
│   └── SettingsContext.jsx
├── services/
│   ├── firebase.js
│   ├── authService.js
│   ├── progressService.js
│   └── activityService.js
├── components/
│   ├── auth/
│   │   ├── LoginPage.jsx
│   │   ├── GoogleLoginButton.jsx
│   │   └── EmailPasswordForm.jsx
│   ├── dashboard/
│   │   ├── DashboardScreen.jsx
│   │   ├── LevelGrid.jsx
│   │   ├── LevelCard.jsx
│   │   ├── BadgeShelf.jsx
│   │   └── QuickStats.jsx
│   ├── level/
│   │   ├── LevelScreen.jsx
│   │   ├── ActivityList.jsx
│   │   └── ActivityCard.jsx
│   ├── activities/
│   │   ├── ActivityPlayer.jsx
│   │   ├── ActivityHeader.jsx
│   │   ├── MultipleChoiceActivity.jsx
│   │   ├── DragAndDropActivity.jsx
│   │   ├── PathTracingActivity.jsx
│   │   ├── FreehandDrawingActivity.jsx
│   │   ├── SortingActivity.jsx
│   │   └── MatchingActivity.jsx
│   ├── results/
│   │   ├── ResultsScreen.jsx
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
│       ├── ProgressBar.jsx
│       ├── FeedbackOverlay.jsx
│       ├── AnswerTile.jsx
│       └── AccessibleButton.jsx
├── data/
│   ├── levels.js
│   ├── activities/
│   │   ├── level1/
│   │   ├── level2/
│   │   ├── level3/
│   │   ├── level4/
│   │   └── level5/
│   └── badges.js
├── hooks/
│   ├── useQuiz.js (refactored → useActivity.js)
│   ├── useProgress.js
│   ├── useTimer.js
│   ├── useDragAndDrop.js
│   ├── usePathTracing.js
│   └── useSettings.js
├── utils/
│   ├── scoring.js
│   ├── accessibility.js
│   └── storage.js
├── App.jsx (refactored)
└── main.jsx
```

### 8.2 Files to Modify

| File | Changes |
|------|---------|
| `App.jsx` | Add providers, new screen routing |
| `src/components/AnswerTile.jsx` | Keep, enhance accessibility |
| `src/components/FeedbackOverlay.jsx` | Keep, add sound support |
| `src/components/ProgressBar.jsx` | Keep, enhance with XP |
| `src/styles/tokens.css` | Add new tokens for levels |
| `src/index.css` | Add activity-specific styles |
| `package.json` | Add firebase dependency |

### 8.3 Files to Remove

| File | Reason |
|------|--------|
| `src/components/ResultScreen.jsx` | Replaced by ResultsScreen.jsx |
| `src/components/StartScreen.jsx` | Unused |
| `src/components/QuizCard.jsx` | Replaced by ActivityPlayer |
| `src/components/QuizScreen.jsx` | Replaced by ActivityPlayer |
| `src/components/QuestionCard.jsx` | Replaced by MultipleChoiceActivity |
| `src/components/AnswerOption.jsx` | Replaced by AnswerTile |
| `src/components/FeedbackBanner.jsx` | Replaced by FeedbackOverlay |
| `src/hooks/useQuiz.js` | Replaced by useActivity.js |
| `src/data/questions.json` | Replaced by activities/ directory |

---

## 9. Accessibility Requirements

### 9.1 WCAG 2.1 AA Compliance

- **Touch targets:** Minimum 48px × 48px (WCAG 2.5.8)
- **Color contrast:** 4.5:1 for normal text, 3:1 for large text
- **Focus indicators:** Visible focus ring on all interactive elements
- **Keyboard navigation:** Full tab navigation, Enter/Space to activate
- **Screen reader:** ARIA labels, live regions for dynamic content
- **Reduced motion:** Respect `prefers-reduced-motion` and manual toggle

### 9.2 ASD-Specific Considerations

- **No flashing:** Zero strobing or rapid color changes
- **Calm palette:** Warm, muted colors (no bright neon)
- **Single focus:** One activity at a time, minimal background distraction
- **Predictable:** Same action always produces same result
- **Positive reinforcement:** Encouraging messages, never punitive
- **Optional sound:** Sound OFF by default, toggle in settings
- **Consistent layout:** Same screen structure across all activities
- **Clear boundaries:** Strong borders on all interactive elements (neo-brutalism)

### 9.3 Responsive Design

| Breakpoint | Layout |
|------------|--------|
| 375px+ | Mobile phone, stacked layout |
| 768px+ | Tablet, 2-column grids |
| 1024px+ | Desktop, 3-column grids, side panels |
| 1440px+ | Large desktop, max-width container |

---

## 10. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Firebase cost at scale | Medium | Use Firestore security rules, client-side caching with React Query, batch writes for progress updates, offline persistence enabled |
| Canvas performance on old devices | High | Fallback to simplified rendering, test on low-end devices |
| Drag-and-drop on touch devices | Medium | Use pointer events, test on actual tablets |
| SVG path tracing accuracy | Medium | Generous tolerance, visual feedback during tracing |
| Activity content creation | High | Seed with 5 activities per level, expand incrementally |
| State management complexity | Medium | Use React Context sparingly, keep state local when possible |

---

## 11. Future Enhancements (Out of Scope)

- Parent/therapist dashboard with analytics
- Custom activity creator
- Multiplayer/collaborative activities
- Voice instructions
- AR-based motor skill activities
- Export progress reports
- Internationalization (i18n)
