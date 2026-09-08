# Trust Score Design System

A fraud-risk-score explainer managed in code. Vite + React + Storybook.

**Live Storybook:** https://mastaobass.github.io/trust-score-ds/?path=/story/compositions-reviewqueue--loaded

The product slice is a review console: ten reconstructed payments, click a row,
get the explainer modal. That is the Design Engineer proof. Isolated components
still live in Storybook.

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
npm run dev         # review console
npm run storybook   # component kit
```

## What's inside

- `src/tokens/tokens.json` — source-of-truth design tokens.
- `src/tokens/tokens.css` — the same tokens as CSS custom properties.
- `src/lib/score.js` — score-band logic: 0.0–59.9 low / 60.0–79.9 medium /
  80.0–99.9 high. Bands render at equal width by design: ~75% of transactions
  score 80+, so proportional bands would crush the actionable range.
- `src/lib/queue.js` — reconstructed review-queue fixtures.
- Primitives: `Button`, `Pill`, `ReasonRow`
- Components: `BandGauge`, `WaterfallChart` (pure SVG), `ScoreHero`
- Compositions: `TrustScoreModal`, `ReviewQueue`
  (`Loaded` / `Loading` / `Empty` / `Error` stories)

## Design ↔ code sync

This project keeps one design system expressed in two places — a Figma file
and this repo — instead of picking one and screenshotting the other.

**The shared vocabulary.** Every token has one name used on both sides:
`color/score/high`, `space/xl`, `radius/md`, `font/size/display`, etc.
- In code: `src/tokens/tokens.json` (source of truth) → `src/tokens/tokens.css`
- In Figma: the **Trust Score Tokens** variable collection

Figma Code Connect requires an Organization plan. Sync is a deliberate step,
not a file watcher.

## Free deployment

`npm run build-storybook` produces `storybook-static/`, deployed on GitHub
Pages via `.github/workflows/deploy.yml`.
