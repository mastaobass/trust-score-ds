# Trust Score Design System

A $0-cost design system for a fraud-risk-score explainer, managed in code and
mirrored in Figma. Built with Vite + React + Storybook (all free/OSS).

## Run it

```bash
npm install
npm run storybook   # opens http://localhost:6006
```

## What's inside

- `src/tokens/tokens.json` — source-of-truth design tokens. Names mirror the
  **Trust Score Tokens** variable collection in the companion Figma file.
- `src/tokens/tokens.css` — the same tokens as CSS custom properties
  (hand-synced for now; wire up [Style Dictionary](https://styledictionary.com)
  to generate this file when the token count grows).
- `src/lib/score.js` — score-band logic: 0.0–59.9 low / 60.0–79.9 medium /
  80.0–99.9 high. Bands render at equal width by design: ~75% of transactions
  score 80+, so proportional bands would crush the actionable range.
- Primitives: `Button`, `Pill`, `ReasonRow`
- Components: `BandGauge`, `WaterfallChart` (pure SVG), `ScoreHero`
- Composition: `TrustScoreModal` — the full lightboxed explainer

## Figma ↔ code sync (the $0 replacement for Code Connect)

Code Connect requires a Figma Organization/Enterprise plan. Instead, this repo
pairs with Claude over the Figma MCP server as the sync layer:

- **Figma → code**: ask Claude to read the variable collection and regenerate
  `tokens.json` / `tokens.css`.
- **Code → Figma**: ask Claude to push token changes back into the variable
  collection, or rebuild screens from these components.

## Free deployment

- `npm run build-storybook` produces `storybook-static/` — host it on GitHub
  Pages, Netlify, or Vercel free tiers.
- Optional: Chromatic's free tier gives hosted Storybook + visual review, and
  enables the Storybook Connect plugin to embed stories inside Figma.
- `@storybook/addon-designs` (free) can embed the Figma frames beside each
  story: `npm i -D @storybook/addon-designs`, add it to `.storybook/main.js`,
  then set `parameters.design = { type: "figspec", url: "<figma-url>" }`.
