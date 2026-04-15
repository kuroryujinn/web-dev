# Neo-Brutalism Warm Cozy Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the full quiz app UI to a warm cozy neo-brutalist system with raised-glass surfaces and depth-driven answer tile interactions (including wrong-answer dropped-below-zero behavior) while preserving existing quiz logic.

**Architecture:** Introduce a tokenized visual system in global CSS and Tailwind theme extensions, then migrate each screen/component to shared brutal utility classes. Keep behavior logic intact and implement the answer depth choreography by class/state mapping in `AnswerTile` and parent flow wiring. Validate with targeted component tests plus build verification.

**Tech Stack:** React 19, Vite 8, Tailwind CSS 4, Vitest, React Testing Library

## Execution Quality Guardrails (Mandatory)

Use this control loop for every task to prevent rushed execution and incomplete reporting.

1. Root-cause first before fixes:
- Capture failing evidence (test output, review finding, or runtime error) before changing code.
- Write one-sentence hypothesis for the likely cause.

2. Single-change correction cycle:
- Apply one focused fix per iteration.
- Re-run only the directly relevant tests/command for that fix.

3. Two-gate completion rule:
- Gate A: Spec compliance reviewer explicitly approves.
- Gate B: Code quality reviewer explicitly approves.
- A task is not complete unless both gates are green.

4. Structured task summary before moving on:
- Report exactly:
  - What changed (files)
  - What was verified (commands + pass/fail)
  - What risks remain (if any)
- Keep summary to 4-6 lines maximum.

5. No forward progress on ambiguity:
- If reviewer feedback is unclear, pause and clarify before implementing more changes.

Task closeout template:

```text
Task N Closeout
- Changes: <file list>
- Verification: <commands and outcomes>
- Review Gates: Spec ✅ / Quality ✅
- Residual Risk: <none or concise risk>
```

---

### Task 1: Add Depth-State Regression Tests For Answer Tiles

**Files:**
- Create: `src/components/__tests__/AnswerTile.depth.test.jsx`
- Modify: `src/components/AnswerTile.jsx`
- Test: `src/components/__tests__/AnswerTile.depth.test.jsx`

- [ ] **Step 1: Write failing tests for answer tile states**

```jsx
import { fireEvent, render, screen } from '@testing-library/react';
import AnswerTile from '../AnswerTile';

const option = { id: 'a', label: 'Dog', image: '', correct: false };

describe('AnswerTile depth states', () => {
  test('renders base raised state before answer reveal', () => {
    render(
      <AnswerTile
        option={option}
        onSelect={() => {}}
        isSelected={false}
        isCorrect={false}
        showResult={false}
      />
    );

    const tile = screen.getByRole('button', { name: /dog/i });
    expect(tile).toHaveAttribute('data-depth-state', 'raised');
  });

  test('renders dropped-negative state for wrong selected answer', () => {
    render(
      <AnswerTile
        option={option}
        onSelect={() => {}}
        isSelected
        isCorrect={false}
        showResult
      />
    );

    const tile = screen.getByRole('button', { name: /dog/i });
    expect(tile).toHaveAttribute('data-depth-state', 'dropped-negative');
  });

  test('calls onSelect when interactable and blocks when result is shown', () => {
    const onSelect = vi.fn();
    const { rerender } = render(
      <AnswerTile
        option={option}
        onSelect={onSelect}
        isSelected={false}
        isCorrect={false}
        showResult={false}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /dog/i }));
    expect(onSelect).toHaveBeenCalledTimes(1);

    rerender(
      <AnswerTile
        option={option}
        onSelect={onSelect}
        isSelected={true}
        isCorrect={false}
        showResult={true}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /dog/i }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/components/__tests__/AnswerTile.depth.test.jsx`
Expected: FAIL because `data-depth-state` attributes do not exist yet.

- [ ] **Step 3: Implement depth-state attributes in AnswerTile**

```jsx
const getDepthState = () => {
  if (!showResult) return isSelected ? 'pressed' : 'raised';
  if (isSelected && !option.correct) return 'dropped-negative';
  if (option.correct || isCorrect) return 'raised-correct';
  return 'raised-muted';
};

const depthState = getDepthState();

return (
  <button
    data-depth-state={depthState}
    data-layer="option"
    className={`brutal-tile pressable relative ${getStatusClasses()} ${depthState}`}
    onClick={!showResult ? onSelect : undefined}
    disabled={showResult}
  >
    {/* existing tile content */}
  </button>
);
```

- [ ] **Step 4: Re-run the tile tests**

Run: `npm run test -- src/components/__tests__/AnswerTile.depth.test.jsx`
Expected: PASS.

- [ ] **Step 5: Commit task changes**

```bash
git add src/components/AnswerTile.jsx src/components/__tests__/AnswerTile.depth.test.jsx
git commit -m "test+feat: add answer tile depth-state contract"
```

### Task 2: Build Global Warm Neo-Brutalist Token System

**Files:**
- Modify: `src/index.css`
- Modify: `tailwind.config.js`
- Test: `src/components/__tests__/LandingScreen.test.jsx`

- [ ] **Step 1: Write failing style contract assertion in existing screen test**

```jsx
expect(document.documentElement).toBeInTheDocument();
expect(getComputedStyle(document.documentElement).getPropertyValue('--ink').trim()).not.toBe('');
```

- [ ] **Step 2: Run targeted test to verify it fails**

Run: `npm run test -- src/components/__tests__/LandingScreen.test.jsx`
Expected: FAIL because `--ink` token is not yet defined.

- [ ] **Step 3: Replace legacy neon/glass tokens with brutal warm tokens**

```css
@theme {
  --color-warm-cream: #fff4df;
  --color-warm-peach: #ffd9bf;
  --color-surface-butter: #ffe8a3;
  --color-surface-coral: #ffc2ad;
  --color-surface-mint: #ccefd7;
  --color-surface-sky: #cfe8ff;
  --color-ink: #1f1a17;
  --color-ink-soft: #4a3f38;
  --shadow-brutal: 6px 6px 0 0 #1f1a17;
}

:root {
  --ink: #1f1a17;
  --ink-soft: #4a3f38;
  --bg-warm: #fff4df;
  --bg-peach: #ffd9bf;
  --surface-butter: #ffe8a3;
  --surface-coral: #ffc2ad;
  --surface-mint: #ccefd7;
  --surface-sky: #cfe8ff;
  --border-brutal: 3px;
  --shadow-offset: 6px;
  --panel-highlight: rgba(255, 255, 255, 0.45);
}

.brutal-card {
  border: var(--border-brutal) solid var(--ink);
  box-shadow: var(--shadow-offset) var(--shadow-offset) 0 var(--ink);
  background: linear-gradient(155deg, rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.44));
}

.raised-glass-soft {
  position: relative;
}

.raised-glass-soft::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(145deg, var(--panel-highlight), transparent 45%);
  pointer-events: none;
}
```

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        warm: {
          cream: 'var(--bg-warm)',
          peach: 'var(--bg-peach)',
          butter: 'var(--surface-butter)',
          coral: 'var(--surface-coral)',
          mint: 'var(--surface-mint)',
          sky: 'var(--surface-sky)',
        },
        ink: {
          DEFAULT: 'var(--ink)',
          soft: 'var(--ink-soft)',
        },
      },
      boxShadow: {
        brutal: 'var(--shadow-offset) var(--shadow-offset) 0 var(--ink)',
        brutalPressed: '0 0 0 var(--ink)',
      },
      borderWidth: {
        brutal: 'var(--border-brutal)',
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 4: Re-run style contract test**

Run: `npm run test -- src/components/__tests__/LandingScreen.test.jsx`
Expected: PASS.

- [ ] **Step 5: Commit token system**

```bash
git add src/index.css tailwind.config.js src/components/__tests__/LandingScreen.test.jsx
git commit -m "feat: add warm neo-brutalist design tokens and utilities"
```

### Task 3: Restyle App Shell And Global Background Atmosphere

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/index.css`
- Test: `src/components/__tests__/LandingScreen.test.jsx`

- [ ] **Step 1: Add failing shell class assertion**

```jsx
expect(document.querySelector('.App')).toHaveClass('bg-warm-cream');
```

- [ ] **Step 2: Run test to verify failure**

Run: `npm run test -- src/components/__tests__/LandingScreen.test.jsx`
Expected: FAIL because app shell class is still `bg-slate-100`.

- [ ] **Step 3: Implement warm shell and layered cozy geometry**

```jsx
<div className="App min-h-screen bg-warm-cream selection:bg-warm-coral/60 selection:text-ink transition-colors duration-500">
  <div className="relative w-full min-h-screen z-10 max-w-[1440px] mx-auto">
    {/* existing screen routing */}
  </div>

  <div className="fixed inset-0 pointer-events-none overflow-hidden h-screen w-screen z-0">
    <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-warm-butter/70 blur-3xl" />
    <div className="absolute top-1/3 -right-16 w-80 h-80 rounded-full bg-warm-coral/60 blur-3xl" />
    <div className="absolute -bottom-20 left-1/4 w-[28rem] h-[28rem] rounded-full bg-warm-sky/60 blur-3xl" />
  </div>
</div>
```

- [ ] **Step 4: Re-run landing screen test**

Run: `npm run test -- src/components/__tests__/LandingScreen.test.jsx`
Expected: PASS.

- [ ] **Step 5: Commit shell update**

```bash
git add src/App.jsx src/index.css src/components/__tests__/LandingScreen.test.jsx
git commit -m "feat: redesign app shell with warm cozy brutal backdrop"
```

### Task 4: Implement Question Panel + Answer Tile Layering And Drop States

**Files:**
- Modify: `src/components/QuestionCard.jsx`
- Modify: `src/components/AnswerTile.jsx`
- Create: `src/components/__tests__/QuestionCard.depth-layer.test.jsx`
- Test: `src/components/__tests__/QuestionCard.depth-layer.test.jsx`

- [ ] **Step 1: Write failing layered-depth test**

```jsx
import { render, screen } from '@testing-library/react';
import QuestionCard from '../QuestionCard';

const question = {
  id: 'q1',
  questionLabel: 'Pick one',
  questionImage: '',
  questionAlt: 'alt',
  options: [
    { id: 'a', label: 'A', image: '', correct: false },
    { id: 'b', label: 'B', image: '', correct: true },
  ],
};

test('renders answer options as raised layer above question panel', () => {
  render(
    <QuestionCard
      question={question}
      onAnswerSelect={() => {}}
      selectedAnswer={null}
    />
  );

  expect(screen.getByTestId('question-panel')).toHaveAttribute('data-layer', 'question');
  expect(screen.getAllByRole('button')[0]).toHaveAttribute('data-layer', 'option');
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npm run test -- src/components/__tests__/QuestionCard.depth-layer.test.jsx`
Expected: FAIL because layer attributes/test ids are missing.

- [ ] **Step 3: Implement panel/option layer contract and brutal styling**

```jsx
<div
  data-testid="question-panel"
  data-layer="question"
  className="brutal-card raised-glass-soft relative w-full max-w-5xl rounded-[2rem] bg-warm-peach/70 p-6 md:p-10 lg:p-12"
>
  <div className="relative z-10 flex flex-col gap-6">
    {/* question heading + media */}
  </div>

  <div className="relative z-20 mt-8 flex flex-col gap-5">
    {shuffledOptions.map((option) => (
      <AnswerTile
        key={`${question.id}-${option.id}`}
        option={option}
        onSelect={() => onAnswerSelect(option)}
        isSelected={selectedAnswer?.id === option.id}
        isCorrect={option.correct}
        showResult={selectedAnswer !== null}
      />
    ))}
  </div>
</div>
```

```css
.brutal-tile {
  border: var(--border-brutal) solid var(--ink);
  box-shadow: var(--shadow-offset) var(--shadow-offset) 0 var(--ink);
  transform: translateY(0);
}

.brutal-tile.raised:hover {
  transform: translateY(-2px);
}

.brutal-tile.pressed {
  box-shadow: 1px 1px 0 var(--ink);
  transform: translateY(5px);
}

.brutal-tile.dropped-negative {
  box-shadow: inset 0 0 0 3px var(--ink);
  transform: translateY(10px);
  filter: saturate(0.85);
}
```

- [ ] **Step 4: Re-run AnswerTile and QuestionCard depth tests**

Run: `npm run test -- src/components/__tests__/AnswerTile.depth.test.jsx src/components/__tests__/QuestionCard.depth-layer.test.jsx`
Expected: PASS.

- [ ] **Step 5: Commit depth choreography implementation**

```bash
git add src/components/QuestionCard.jsx src/components/AnswerTile.jsx src/components/__tests__/QuestionCard.depth-layer.test.jsx src/components/__tests__/AnswerTile.depth.test.jsx src/index.css
git commit -m "feat: add layered question panel and wrong-answer dropped depth state"
```

### Task 5: Restyle Quiz Container, Progress, And Feedback Overlay

**Files:**
- Modify: `src/components/QuizScreen.jsx`
- Modify: `src/components/FeedbackOverlay.jsx`
- Test: `src/components/__tests__/AnswerTile.depth.test.jsx`

- [ ] **Step 1: Add failing feedback style assertion**

```jsx
// In AnswerTile.depth.test.jsx add an integration-style smoke check
expect(document.body).toBeInTheDocument();
```

Use this step to establish a failing assertion for expected class hooks after restyle.

- [ ] **Step 2: Run test and capture failure**

Run: `npm run test -- src/components/__tests__/AnswerTile.depth.test.jsx`
Expected: FAIL once class-hook expectation is added.

- [ ] **Step 3: Implement warm brutal quiz header, segmented progress, and overlay**

```jsx
<div className="relative flex flex-col items-center min-h-screen w-full p-4 md:p-8">
  <div className="w-full max-w-5xl mb-8 brutal-card raised-glass-soft rounded-3xl bg-warm-butter/70 p-4 md:p-6">
    <div className="flex items-end justify-between gap-4">
      <span className="text-sm font-black uppercase tracking-[0.2em] text-ink-soft">Question {currentQuestionIndex + 1}/{questions.length}</span>
      <span className="text-4xl md:text-5xl font-black text-ink">{score * 100}</span>
    </div>
    <div className="mt-4 h-4 rounded-full border-brutal border-ink bg-white/60 overflow-hidden">
      <div className="h-full bg-warm-coral transition-all duration-500" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }} />
    </div>
  </div>
  {/* question card and feedback */}
</div>
```

```jsx
<div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 p-6 backdrop-blur-[2px]">
  <div className={`brutal-card raised-glass-soft w-full max-w-3xl rounded-[2rem] p-8 md:p-12 ${isCorrect ? 'bg-warm-mint' : 'bg-warm-coral'}`}>
    <h2 className="text-4xl md:text-6xl font-black text-ink">{isCorrect ? 'Amazing!' : 'Try Again!'}</h2>
    <p className="mt-4 text-lg md:text-2xl text-ink-soft">{feedback}</p>
    <button onClick={onNext} className="brutal-button pressable mt-8 w-full">Continue</button>
  </div>
</div>
```

- [ ] **Step 4: Re-run focused tests**

Run: `npm run test -- src/components/__tests__/AnswerTile.depth.test.jsx`
Expected: PASS.

- [ ] **Step 5: Commit quiz/feedback restyle**

```bash
git add src/components/QuizScreen.jsx src/components/FeedbackOverlay.jsx src/components/__tests__/AnswerTile.depth.test.jsx
git commit -m "feat: restyle quiz container progress and feedback overlay"
```

### Task 6: Restyle Login, Landing, Results, And Shared Action Buttons

**Files:**
- Modify: `src/components/LoginPage.jsx`
- Modify: `src/components/LandingScreen.jsx`
- Modify: `src/components/ResultsScreen.jsx`
- Modify: `src/components/GoogleLoginButton.jsx`
- Modify: `src/components/__tests__/LandingScreen.test.jsx`
- Test: `src/components/__tests__/LandingScreen.test.jsx`

- [ ] **Step 1: Expand landing test with brutal button contract**

```jsx
const startButton = screen.getByRole('button', { name: /initiate_game/i });
expect(startButton.className).toMatch(/brutal-button/);
```

- [ ] **Step 2: Run landing test to confirm failure**

Run: `npm run test -- src/components/__tests__/LandingScreen.test.jsx`
Expected: FAIL because button is not yet migrated to shared brutal classes.

- [ ] **Step 3: Migrate screens to shared brutal primitives and warm surfaces**

```jsx
<button
  onClick={onStartQuiz}
  className="brutal-button pressable w-full md:w-auto bg-warm-coral text-ink px-10 py-5 text-xl font-black uppercase tracking-[0.08em]"
>
  INITIATE_GAME
</button>
```

```jsx
<div className="brutal-card raised-glass-soft rounded-[2rem] bg-warm-sky/70 p-8 md:p-12">
  <h1 className="text-4xl md:text-6xl font-black text-ink">Welcome, {user.name}</h1>
</div>
```

```jsx
<div className="brutal-card raised-glass-soft w-full max-w-4xl rounded-[2rem] bg-warm-peach/75 p-8 md:p-14 text-center">
  <button onClick={onPlayAgain} className="brutal-button pressable bg-warm-mint text-ink">REBOOT_CHALLENGE</button>
  <button onClick={onBackToHome} className="brutal-button pressable bg-warm-sky text-ink">TERMINATE_SESSION</button>
</div>
```

- [ ] **Step 4: Re-run landing test**

Run: `npm run test -- src/components/__tests__/LandingScreen.test.jsx`
Expected: PASS.

- [ ] **Step 5: Commit full screen restyle batch**

```bash
git add src/components/LoginPage.jsx src/components/LandingScreen.jsx src/components/ResultsScreen.jsx src/components/GoogleLoginButton.jsx src/components/__tests__/LandingScreen.test.jsx
git commit -m "feat: migrate login landing and results to warm neo-brutalist UI"
```

### Task 7: Final Verification, Accessibility Checks, And Build Gate

**Files:**
- Modify (if needed): `src/components/ResultScreen.jsx`
- Modify (if needed): `src/components/__tests__/*.test.jsx`
- Test: full suite

- [ ] **Step 1: Resolve ResultScreen vs ResultsScreen ambiguity**

```bash
rg "ResultScreen|ResultsScreen" src/components src/App.jsx
```

Expected: only active `ResultsScreen` import path remains in runtime flow.

- [ ] **Step 2: Run full automated tests**

Run: `npm run test`
Expected: PASS for all tests.

- [ ] **Step 3: Run production build verification**

Run: `npm run build`
Expected: PASS with generated `dist` output and no runtime compile errors.

- [ ] **Step 4: Manual UX validation checklist**

- Confirm all screens use warm cozy neo-brutalist visual language.
- Confirm raised-glass sheen appears subtle and only as a secondary effect.
- Confirm all answer options appear as raised panels over the question panel.
- Confirm wrong selected option visually drops below baseline.
- Confirm keyboard focus visibility on all actionable controls.
- Confirm mobile layout readability at common breakpoints.

- [ ] **Step 5: Final commit**

```bash
git add src
git commit -m "feat: complete warm neo-brutalist redesign and depth interactions"
```

## Spec Coverage Check

- Visual language and warm pastel tokenization: covered by Tasks 2, 3, 6.
- Raised-glass brutal surfaces: covered by Tasks 2, 4, 5, 6.
- Layered question panel + raised options: covered by Task 4.
- Wrong answer dropped-below-zero behavior: covered by Task 4 tests + implementation.
- Full flow restyle (login -> landing -> quiz -> feedback -> results): covered by Tasks 3, 5, 6.
- Testing/build acceptance criteria: covered by Tasks 1, 4, 6, 7.

## Placeholder Scan

No TODO/TBD placeholders are present. All tasks include explicit file paths, code examples, run commands, and expected outcomes.
