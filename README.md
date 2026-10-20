# Trust Score Design System

A fraud-risk-score explainer managed in code. Vite + React + Storybook.

**Live review console:** https://mastaobass.github.io/trust-score-ds/console/

Open a queue row to the Payments Fraud case. The score explainer lives on the case (Velocities → Explain score), not on the table.

**Live Storybook:** https://mastaobass.github.io/trust-score-ds/?path=/story/patterns-reviewqueue--loaded

Storybook groups the kit smallest → largest: Foundations → Primitives → Components → Patterns → Layouts → Pages. The console above is the product path.

## Constraints (read this first)

- The model is proprietary. This kit never exposes factor **weights** that would
  let someone reverse-engineer detection.
- Reason codes are **pre-scripted**, not generated per transaction. Inactive
  codes stay visible because absence is information.
- The visual waterfall baseline is **pinned at 80.0** even when the math starts
  elsewhere. A shifting origin makes the argument unreadable.

## Run it

```bash
npm install
npm run dev         # review console (queue → case)
npm run storybook   # component kit
```

## What's inside

Storybook taxonomy (see sidebar):

- **Foundations** — tokens: Color, Type, Spacing, Radius (`src/tokens/`)
- **Primitives** — `ActionBarField`, `ActionBarSection`
- **Components** — `Button`, `Pill`, chips, gauges, `SectionCard`, `Widget`, `ScoreHero`, …
- **Patterns** — `ActionBar`, `FieldRow`, `QueueGrid`, `ReviewQueue`, `TrustScoreModal`, …
- **Layouts** — `AppShell`, `Sidebar`, `TopBar`
- **Pages** — `CaseDetail`

## Design and code sync

Figma file: [Fraud-Risk-Score-Explainer](https://www.figma.com/design/4xUv7jvv0soZmmXwCo830e/Fraud-Risk-Score-Explainer)

- Page **Score Modal**: light/dark explainer. The `Modal` component lives here.
- Page **Case Detail View**: reconstructed case-management screens (mostly flattened frames).
- Page **Kit**: componentized primitives plus a ReviewQueue pattern.
- Page **Case Queue**: product queue pattern.
- Variable collection **Trust Score Tokens** (Light / Dark).

Code Connect needs an Organization plan, which this file does not have. Sync is a deliberate step.

## Free deployment

GitHub Actions deploys two surfaces to GitHub Pages:

- `/` Storybook
- `/console/` the review console (queue → case)
