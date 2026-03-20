# 🧩 Antigravity ASD Quiz — Rebuild Specification

**Project:** Interactive Quiz App for Children with ASD  
**Target Level:** 3rd–4th Grade  
**Stack:** React + Vite, Tailwind CSS, Local JSON Data  
**Scope of this doc:** Login Page + Picture-Based Quiz Rebuild

---

## 📋 Table of Contents

1. [Overview of Changes](#overview-of-changes)
2. [Login Page — New Feature](#login-page--new-feature)
3. [Picture-Based Quiz — Rebuild](#picture-based-quiz--rebuild)
4. [Question Data Format (JSON)](#question-data-format-json)
5. [Sample Questions](#sample-questions)
6. [App Flow (Updated)](#app-flow-updated)
7. [ASD UX Guidelines (Reminder)](#asd-ux-guidelines-reminder)
8. [File Structure Changes](#file-structure-changes)

---

## Overview of Changes

| Area | Before | After |
|---|---|---|
| Login | Not present | Simple name + avatar login screen |
| Questions | Text-based MCQ | Picture-based MCQ (image as question prompt) |
| Answer Options | Text labels only | Image tiles OR image + short label |
| Question JSON | `question` string field | `questionImage`, `questionAlt`, `answerImages` fields |
| Feedback | Text only | Image + text encouraging feedback |

---

## Login Page — New Feature

### Purpose
Give each child a personal identity in the app. Keeps it friendly and familiar across sessions (stored in `localStorage`).

### UI Layout

```
┌────────────────────────────────────────┐
│          👋 Welcome!                   │
│      What's your name?                 │
│                                        │
│   [ Input: Type your name... ]         │
│                                        │
│      Pick your avatar:                 │
│   🐶  🐱  🐸  🦊  🐼  🐧            │
│   (emoji avatar selector — tap to pick)│
│                                        │
│         [ Let's Start! ]               │
└────────────────────────────────────────┘
```

### Behaviour Rules

- **Name field:** Plain text input, max 20 characters. No special characters needed.
- **Avatar:** A horizontal scrollable row of 6–8 emoji/icon choices. Selected avatar gets a **highlighted border** (calm blue `#4A90D9`).
- **Validation:** Both name and avatar must be selected before the button is enabled.
- **On submit:** Save `{ name, avatar }` to `localStorage` under key `"asd_quiz_user"`. Navigate to the Landing Screen.
- **Returning users:** If `"asd_quiz_user"` exists in `localStorage`, skip the Login Page and go straight to Landing Screen, greeting them by name.
- **No passwords.** No email. Keep it friction-free.

### Component: `LoginPage.jsx`

```jsx
// Props: onLogin(user) — callback after successful login
// State: name (string), selectedAvatar (string emoji)
// localStorage key: "asd_quiz_user"
```

### Styling Notes (ASD)

- Background: soft off-white `#F9F7F3`
- Font: rounded, large — `text-2xl` for heading, `text-lg` for label
- Input border: `rounded-2xl`, calm stroke, no red error colors
- Button: large, full-width on mobile, calm green `#5CB85C`, disabled state is grey
- No animations on this page — keep it still and calm

---

## Picture-Based Quiz — Rebuild

### Core Idea

Each question presents **an image as the prompt** (e.g., a photo of an animal, object, action, or scene). The child picks the correct answer from **4 image-based answer tiles**.

### Three Question Types

#### Type 1 — `identify`
> "What is this?" — Show an image, pick the correct label image.

- Question image: photo of a single object or animal
- Answer options: 4 image tiles, each with a short label below
- Example: Image of a banana → options: 🍌 Banana | 🍎 Apple | 🍇 Grapes | 🍊 Orange

#### Type 2 — `match`
> "Which one goes with this?" — Match concept to related image.

- Question image: e.g., a bed
- Answer options: e.g., 😴 Sleep | 🍽️ Eat | 🛁 Bath | 📖 Read
- Tests associative understanding

#### Type 3 — `count`
> "How many are there?" — Show an image with countable objects.

- Question image: e.g., 3 ducks in a pond
- Answer options: image tiles showing the numbers 1, 2, 3, 4 (large, clear digits with matching dot patterns)
- Max count: 5 (appropriate for 3rd grade)

---

## Question Data Format (JSON)

### File: `src/data/questions.json`

```json
[
  {
    "id": 1,
    "type": "identify",
    "questionImage": "/images/questions/banana.jpg",
    "questionAlt": "A yellow fruit",
    "questionLabel": "What is this?",
    "options": [
      { "id": "a", "image": "/images/options/banana.jpg", "label": "Banana", "correct": true },
      { "id": "b", "image": "/images/options/apple.jpg",  "label": "Apple",  "correct": false },
      { "id": "c", "image": "/images/options/grapes.jpg", "label": "Grapes", "correct": false },
      { "id": "d", "image": "/images/options/orange.jpg", "label": "Orange", "correct": false }
    ],
    "feedback": {
      "correct": "Yes! That's a banana! 🌟",
      "incorrect": "Oops! That's a banana! Let's keep going! 😊"
    }
  }
]
```

### Field Reference

| Field | Type | Description |
|---|---|---|
| `id` | number | Unique question ID |
| `type` | `"identify"` \| `"match"` \| `"count"` | Question type |
| `questionImage` | string (path) | Main image shown as the question |
| `questionAlt` | string | Screen-reader alt text for question image |
| `questionLabel` | string | Short text above the image (e.g., "What is this?") |
| `options[].id` | string | Option identifier (a/b/c/d) |
| `options[].image` | string (path) | Image for this answer option |
| `options[].label` | string | Short text label below the option image |
| `options[].correct` | boolean | Whether this option is correct |
| `feedback.correct` | string | Shown on correct answer |
| `feedback.incorrect` | string | Shown on wrong answer |

---

## Sample Questions

Below are 10 sample questions across all three types. Populate `questions.json` with these (swap in real image paths).

### Identify (6 questions)

| # | Question Image | Correct Answer | Distractors |
|---|---|---|---|
| 1 | Banana | Banana | Apple, Grapes, Orange |
| 2 | Dog | Dog | Cat, Rabbit, Horse |
| 3 | Sun | Sun | Moon, Star, Cloud |
| 4 | Chair | Chair | Table, Bed, Door |
| 5 | Bus | Bus | Car, Train, Bicycle |
| 6 | Book | Book | Pencil, Bag, Ruler |

### Match (2 questions)

| # | Question Image | Correct Answer | Distractors |
|---|---|---|---|
| 7 | Bed (bedroom) | Sleep (child sleeping) | Eating, Playing, Swimming |
| 8 | Rain cloud | Umbrella | Sunglasses, Gloves, Hat |

### Count (2 questions)

| # | Question Image | Correct Answer | Distractors |
|---|---|---|---|
| 9 | 3 apples on a plate | 3 | 1, 2, 4 |
| 10 | 2 dogs sitting | 2 | 1, 3, 4 |

---

## App Flow (Updated)

```
App Load
   │
   ▼
Check localStorage for "asd_quiz_user"
   │
   ├── Found ──────────────────────────────────┐
   │                                           │
   └── Not Found                               │
          │                                    │
          ▼                                    │
     LoginPage.jsx                             │
     (name + avatar)                           │
          │                                    │
          └── onLogin() ──────────────────────►│
                                               ▼
                                        LandingScreen.jsx
                                        "Hi [Name]! Ready to play?"
                                               │
                                               ▼
                                        QuizScreen.jsx
                                        (picture questions)
                                               │
                                               ▼
                                        ResultsScreen.jsx
                                        (score + encouragement)
```

---

## ASD UX Guidelines (Reminder)

These apply across **all pages including the new login**:

- ✅ **No timers** — never show a countdown
- ✅ **Calm color palette** — blues, greens, soft yellows only; no harsh reds except subtle wrong-answer tint
- ✅ **Large tap targets** — minimum `64px × 64px` for answer image tiles
- ✅ **One thing at a time** — show one question per screen, no sidebars
- ✅ **Consistent layout** — question always at top, 2×2 answer grid always below
- ✅ **Encouraging feedback only** — wrong answer: "Almost! Try again!" not "Wrong!"
- ✅ **No auto-advance** — child taps a "Next" button to move forward after seeing feedback
- ✅ **Alt text on all images** — for screen reader and image-load failure fallback
- ✅ **Large, rounded fonts** — avoid sharp or serif fonts
- ✅ **Minimal text** — images carry the meaning; text is supportive only

---

## File Structure Changes

```
src/
├── components/
│   ├── LoginPage.jsx          ← NEW
│   ├── LandingScreen.jsx      (update: greet by name)
│   ├── QuizScreen.jsx         (update: picture-based layout)
│   ├── QuestionCard.jsx       ← NEW — renders questionImage + 2×2 answer grid
│   ├── AnswerTile.jsx         ← NEW — single image option tile
│   ├── FeedbackOverlay.jsx    (update: add image to feedback)
│   └── ResultsScreen.jsx      (minor update: show avatar + name)
│
├── data/
│   └── questions.json         (rebuild: use new picture-based schema)
│
└── assets/
    └── images/
        ├── questions/          ← NEW folder — question images
        └── options/            ← NEW folder — answer option images
```

### QuestionCard Layout (2×2 Grid)

```
┌─────────────────────────────────┐
│   "What is this?"               │
│  ┌───────────────────────────┐  │
│  │    [Question Image]       │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌──────────┐  ┌──────────┐     │
│  │  🍌      │  │  🍎      │     │
│  │ Banana   │  │  Apple   │     │
│  └──────────┘  └──────────┘     │
│  ┌──────────┐  ┌──────────┐     │
│  │  🍇      │  │  🍊      │     │
│  │  Grapes  │  │  Orange  │     │
│  └──────────┘  └──────────┘     │
└─────────────────────────────────┘
```

---

## Implementation Notes for Dev

1. **Image sourcing:** Use free, child-appropriate image libraries (e.g., [Unsplash](https://unsplash.com), [Pixabay](https://pixabay.com), or simple emoji-rendered images via Canvas for MVP).
2. **Fallback:** If an image fails to load, show the `label` text in a styled box so the question is still answerable.
3. **Shuffle options:** Randomize option order on each render to avoid position memorization.
4. **localStorage key:** `"asd_quiz_user"` — store `{ name: string, avatar: string }`.
5. **Quiz state reset:** On "Play Again" in ResultsScreen, reset question index + score but do NOT clear the login user.

---

*Document version: 1.0 — Ready for implementation.*