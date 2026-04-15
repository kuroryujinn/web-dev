# ASD Quiz App

> One-sentence thesis: ASD Quiz App is a React + Vite single-page learning quiz that combines a visual question flow, local session persistence, and optional Google OAuth login into a reproducible front-end workflow.

## Abstract

This project implements a multi-screen quiz experience with three core phases: authentication, launch dashboard, and question/answer progression with immediate feedback and score tracking. The UI is being migrated toward a warm neo-brutalist visual system while preserving quiz behavior and data flow. The repository includes a runnable development setup, build pipeline, and component-level automated tests.

## Problem Context

The app targets a common educational UI problem: presenting simple, image-forward multiple-choice questions in a way that is easy to run locally, visually expressive, and resilient to missing external configuration.

The implementation addresses three practical constraints:

- Keep core quiz behavior deterministic and client-side (no backend dependency required for local use).
- Support authentication UX with and without Google OAuth configuration.
- Preserve clear test/build commands so contributors can validate changes quickly.

## Approach and Architecture

The application is a client-rendered React app built with Vite.

- Entry point: `src/main.jsx` mounts `App`.
- App shell and screen routing: `src/App.jsx` controls `login -> landing -> quiz` transitions.
- Login: `src/components/LoginPage.jsx` supports local alias/avatar login and optional Google login.
- Quiz runtime: `src/components/QuizScreen.jsx` drives question index, scoring, and feedback overlays.
- Question rendering: `src/components/QuestionCard.jsx` and `src/components/AnswerTile.jsx` render question media/options and result states.
- Data source: `src/data/questions.json` stores static quiz questions and feedback strings.
- Styling system: `src/index.css` and `src/styles/tokens.css` provide global styles and design tokens.

State model highlights:

- User profile is persisted in local storage under `asd_quiz_user`.
- Screen state is held in `App` and switched by explicit handlers.
- Quiz state (index, score, selection, feedback visibility) is held inside `QuizScreen`.

## Repository Layout

Top-level structure relevant to development:

- `src/`: React source code.
- `src/components/`: screen and UI components.
- `src/components/__tests__/`: component tests (Vitest + Testing Library).
- `src/data/questions.json`: quiz content.
- `src/styles/tokens.css`: global design token variables.
- `public/images/`: static image assets used by quiz questions/options.
- `docs/superpowers/specs/`: design specifications.
- `docs/superpowers/plans/`: implementation plans.

## Installation and Setup

Prerequisites:

- Node.js 20+ (recommended for modern Vite toolchains).
- npm (ships with Node.js).

Install dependencies:

```bash
npm install
```

Optional environment configuration for Google OAuth:

1. Create a `.env` file in the project root.
2. Add:

```bash
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

If `VITE_GOOGLE_CLIENT_ID` is not set, the app still runs and falls back to non-Google login paths.

## Usage

Start local development server:

```bash
npm run dev
```

Create production build:

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

Run linter:

```bash
npm run lint
```

## Validation and Testing

Run test suite:

```bash
npm run test
```

Watch mode for local development:

```bash
npm run test:watch
```

Current automated coverage includes at least one component-level regression test for `LandingScreen` behavior when Google OAuth is not configured.

Observed command status in this repository (2026-04-15):

- `npm run test`: pass.
- `npm run build`: pass.
- `npm run lint`: pass.

Minimum pre-merge validation workflow:

```bash
npm run test
npm run lint
npm run build
```

## Results and Demo Flow

When run locally, the primary flow is:

1. Login screen: choose alias/avatar (and optional Google sign-in).
2. Landing screen: review profile card and start the quiz.
3. Quiz screen: answer questions with immediate correctness feedback.
4. Results screen: review score and replay or return home.

The project includes static image assets and question metadata sufficient to demo the full flow without a backend service.

## Limitations and Tradeoffs

- Quiz data is static JSON bundled with the client; there is no persistence API for scores/history.
- Routing is state-based inside React components rather than URL-based routing.
- Google OAuth support depends on external environment configuration and provider behavior.
- Visual redesign work is in progress; some components still contain legacy style patterns alongside tokenized styles.

## Maintenance and Contributing

Recommended contribution loop:

1. Create a focused branch.
2. Implement small, verifiable changes.
3. Run `npm run test`, `npm run lint`, and `npm run build`.
4. Update docs when behavior, setup, or architecture changes.

When modifying UI, prefer updating tokenized styles (`src/styles/tokens.css`, `src/index.css`) before adding one-off utility overrides.

## License and Attribution

No explicit license file is currently included in this repository. Add a `LICENSE` file if redistribution terms are required.
