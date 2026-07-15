/**
 * Score bands for the 0.0–99.9 trust scale.
 * Numeric ranges are unequal by design (distribution skews high — ~75% of
 * transactions score 80+), but the gauge renders all three at equal width.
 */
export const BANDS = [
  { id: "low", min: 0, max: 59.9, riskLabel: "HIGH RISK" },
  { id: "medium", min: 60, max: 79.9, riskLabel: "MEDIUM RISK" },
  { id: "high", min: 80, max: 99.9, riskLabel: "LOW RISK" },
];

export function bandFor(score) {
  if (score < 60) return BANDS[0];
  if (score < 80) return BANDS[1];
  return BANDS[2];
}

/** Marker position as a 0–100 percentage across the equal-width gauge. */
export function gaugePosition(score) {
  const band = bandFor(score);
  const index = BANDS.indexOf(band);
  const frac = (score - band.min) / (band.max - band.min);
  return ((index + Math.min(Math.max(frac, 0), 1)) / 3) * 100;
}
