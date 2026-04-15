# Neo-Brutalism Warm Cozy Redesign Spec

Date: 2026-04-15
Project: Quiz App UI/UX redesign
Scope: Full visual overhaul across all screens and components

## 1. Goal

Redesign the complete app UI/UX to a neo-brutalist style with a warm, cozy pastel palette while preserving existing quiz logic and flow.

Primary outcomes:
- Strong neo-brutalist structure (ink borders, hard shadows, blocky hierarchy).
- Cozy atmosphere through warm pastel colors, spacing, and calmer backgrounds.
- Subtle raised-glass sheen on surfaces without returning to glassmorphism aesthetics.
- Distinct physical depth behavior for answer options, including wrong-answer drop-below-zero feedback.

## 2. Chosen Approach

Chosen approach: Component-by-component rewrite.

Why this approach:
- Highest control and consistency for a full app-wide visual conversion.
- Lower regression risk than a global CSS swap.
- Clear incremental verification through existing user flow.

Out-of-scope:
- Quiz logic/data model changes.
- Feature additions unrelated to visual/interaction redesign.

## 3. Visual Language

### 3.1 Art Direction

- Neo-brutalism first: thick near-black outlines, hard offset shadows, flat color blocks, explicit hierarchy.
- Cozy adaptation: warm pastel surfaces, generous spacing, rounded brutality where it improves comfort.
- Motion style: short, snappy transitions and meaningful depth cues.

### 3.2 Color System (Tokenized)

Define all color usage through tokens; no hard-coded legacy sky/slate/neon utilities in component markup.

Core tokens:
- Background: warm cream and apricot blend.
- Surfaces: butter yellow, dusty peach, soft coral, muted mint, pale sky.
- Text/border ink: near-black with a softer companion tone for secondary text.

Semantic state mapping:
- Correct: mint family with ink border.
- Wrong: coral family with ink border.
- Neutral/info: pale sky family with ink border.

### 3.3 Typography

- Heading system: heavy, expressive display styling.
- Body system: clean readable sans.
- Rhythm: large bold headings, medium body copy, clear button labels.

### 3.4 Surface Treatment (Raised Glass + Brutal)

Surfaces (cards, tiles, buttons, inputs) use a hybrid style:
- 3-4px solid ink borders.
- Hard offset shadows (no blur) to establish physical depth.
- Subtle glazed feel via faint top-left highlight and restrained inner sheen.
- Optional tiny blur only on large container panels where needed.

Guardrails:
- Keep neo-brutalist readability dominant.
- No neon glow, no heavy blur fog, no cyber glass effects.

### 3.5 Interaction Depth

States for pressable surfaces:
- Rest: raised with full offset shadow.
- Hover: slight extra lift.
- Active: offset collapses toward zero, reading as physical press.
- Disabled: flatter and lower-contrast.

Respect reduced motion:
- Preserve state meaning with minimal animation.

## 4. Architecture and Implementation Strategy

### 4.1 High-Level Structure

Retain existing React component structure and quiz state flow. Apply visual redesign through:
- Global design tokens and utilities.
- Tailwind theme extensions.
- Component class-level styling updates.

Primary files:
- src/index.css
- tailwind.config.js
- src/App.jsx
- src/components/* (screen and tile components)

### 4.2 Design Tokens and Utility Classes

Token groups:
- Colors: warm backgrounds, surface families, ink tones.
- Depth: border width, shadow offsets, shadow color.
- Radius/shape: card and button radius values.
- Sheen: subtle panel highlight controls.

Utility families:
- .brutal-card
- .brutal-button
- .brutal-input
- .brutal-tile
- .raised-glass-soft
- .pressable

## 5. Screen-by-Screen UX Behavior

### 5.1 Login Screen

- Hero panel as a raised warm pastel brutal card.
- Google login action restyled with brutal button behavior and clear keyboard focus.
- Cozy abstract background shapes replace cyber gradients.

### 5.2 Landing Screen

- Intro/CTA composition with bold headline and warm supportive copy.
- Start action as primary brutal button with tactile press feedback.

### 5.3 Quiz Screen

- Question card is the central raised panel.
- Answer options are raised secondary panels layered above the question panel.
- Progress indicator redesigned to segmented/brutal visual language.

### 5.4 Feedback and Results

- Feedback overlays/banners restyled as raised pastel brutal surfaces.
- Results summary presented as a prominent score badge/card.
- Action buttons (retry/home) use consistent brutal button variants.

## 6. Answer Tile Depth Choreography (Critical Interaction)

All option tiles must read as physical panels in layered depth.

State model:
- Base: raised mini-panels above the central question panel.
- Hover: subtle additional lift.
- Correct selection: remains confidently raised with semantic success color.
- Wrong selection: tile drops below baseline (past zero offset), using negative-depth shadow treatment to read as sunk.
- Non-selected options during wrong feedback: remain raised with slightly reduced emphasis.

Required class/state primitives:
- raised
- lifted
- pressed
- dropped-negative

Behavior requirement:
- Wrong drop state remains visible long enough to communicate clear feedback before progression.

## 7. Risks and Mitigations

1. Styling sprawl across many components
- Mitigation: introduce reusable brutal utility classes and tokenized values first.

2. Naming confusion between ResultScreen and ResultsScreen
- Mitigation: ensure edits target active component path and remove ambiguity safely.

3. Mobile density and overlap risk
- Mitigation: enforce responsive spacing/type scaling and predictable tile height behavior.

4. Motion/accessibility conflicts
- Mitigation: support reduced-motion path while preserving clear state differences.

## 8. Testing and Verification

### 8.1 Automated

- Keep existing tests passing (including LandingScreen test coverage).
- Add/update targeted tests for answer tile state classes:
  - base raised state
  - hover/press transitions
  - wrong dropped-negative state
  - correct semantic raised state

### 8.2 Manual QA Checklist

- Full flow visual consistency: login -> landing -> quiz -> feedback -> results.
- Warm neo-brutalist visual language applied globally.
- Wrong answer drop-below-zero effect clearly perceivable.
- Option panels clearly layered above question panel.
- Keyboard focus visible on all interactive controls.
- Mobile readability and spacing validated.

## 9. Acceptance Criteria

1. Entire app UI is converted to warm cozy neo-brutalism.
2. Subtle raised-glass sheen is present but restrained.
3. All answer options are raised panels over the central question panel.
4. Wrong selected option drops lower than zero offset with clear sunk-depth feedback.
5. Legacy neon/cyber glass visual identity is removed from active UI.
6. No quiz-flow logic regressions are introduced.
7. Build succeeds and app runs without runtime errors.

## 10. Implementation Sequence

1. Define tokens/utilities in src/index.css and tailwind.config.js.
2. Restyle app shell/background in src/App.jsx.
3. Restyle screens in user flow order:
   - LoginPage
   - LandingScreen
   - QuizScreen/QuestionCard
   - ResultsScreen
4. Implement and tune answer tile depth choreography.
5. Update/expand tests and run build verification.
