# Trust Score Design System

A $0-cost design system for a fraud-risk-score explainer, managed in code and
mirrored in Figma. Built with Vite + React + Storybook (all free/OSS).

**Live Storybook:** https://mastaobass.github.io/trust-score-ds/
**Figma file:** https://www.figma.com/design/4xUv7jvv0soZmmXwCo830e

## Run it

```bash
npm install
npm run storybook   # opens http://localhost:6006
```

## What's inside

- `src/tokens/tokens.json` — source-of-truth design tokens.
- `src/tokens/tokens.css` — the same tokens as CSS custom properties.
- `src/lib/score.js` — score-band logic: 0.0–59.9 low / 60.0–79.9 medium /
  80.0–99.9 high. Bands render at equal width by design: ~75% of transactions
  score 80+, so proportional bands would crush the actionable range.
- Primitives: `Button`, `Pill`, `ReasonRow`
- Components: `BandGauge`, `WaterfallChart` (pure SVG), `ScoreHero`
- Composition: `TrustScoreModal` — the full lightboxed explainer

## Design ↔ code sync

This project keeps one design system expressed in two places — a Figma file
and this repo — instead of picking one and screenshotting the other. Here's
how the two stay aligned, and what's automated versus manual today.

**The shared vocabulary.** Every token has one name used on both sides:
`color/score/high`, `space/xl`, `radius/md`, `font/size/display`, etc.
- In code: `src/tokens/tokens.json` (source of truth) → `src/tokens/tokens.css`
  (CSS custom properties every component consumes).
- In Figma: the **Trust Score Tokens** variable collection, with the same
  names, bound directly to fills, strokes, and corner radii on the modal —
  not just documented as swatches. Changing a variable's value in Figma
  updates every bound layer instantly; there's nothing to manually recolor.

**Why this isn't Code Connect.** Figma's official design↔code bridge,
[Code Connect](https://www.figma.com/code-connect-docs/), requires an
Organization or Enterprise Figma plan. This project runs on a Pro plan, so
instead an AI agent (Claude, via the Figma MCP server) acts as the sync
layer: it can read the Figma variable collection and regenerate
`tokens.json`/`tokens.css`, or read the token files and push updated values
into the Figma variables — in both directions, on request, without a paid
integration.

**What's automatic vs. manual right now:**
| | Code → deployed site | Figma ↔ code tokens |
|---|---|---|
| Trigger | `git push` to `main` | Asking the agent to reconcile |
| Mechanism | GitHub Actions (`.github/workflows/deploy.yml`) | Figma MCP + repo file edits |
| Automatic? | Yes — every push rebuilds and redeploys Storybook | Not yet — a deliberate sync step, not a file watcher |

That second row is an honest limitation, not a hidden one: nothing currently
guarantees the two token sources drift together on their own. The near-term
fix is a small export/import script between `tokens.json` and Figma's
variable-import format, so a token change only has to be authored once.

## Free deployment

- `npm run build-storybook` produces `storybook-static/` — deployed here via
  the included GitHub Actions workflow, hosted on GitHub Pages at no cost.
- Optional: Chromatic's free tier adds hosted visual regression testing and
  enables the Storybook Connect plugin to embed live stories inside Figma.
- `@storybook/addon-designs` (free) can embed the Figma frames beside each
  story: `npm i -D @storybook/addon-designs`, add it to `.storybook/main.js`,
  then set `parameters.design = { type: "figspec", url: "<figma-url>" }`.