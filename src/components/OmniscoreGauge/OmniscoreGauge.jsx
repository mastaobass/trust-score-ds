import { BANDS } from "../../lib/score";
import "./OmniscoreGauge.css";

const SCORE_MIN = 0;
const SCORE_MAX = 99.9;

/** Default thresholds aligned with kit bands in `src/lib/score.js`. */
const DEFAULT_THRESHOLDS = {
  mediumMin: BANDS[1].min,
  highMin: BANDS[2].min,
};

const BAND_IDS = ["low", "medium", "high"];

function clampScore(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return SCORE_MIN;
  return Math.min(SCORE_MAX, Math.max(SCORE_MIN, n));
}

function bandIdFor(value, thresholds) {
  if (value < thresholds.mediumMin) return "low";
  if (value < thresholds.highMin) return "medium";
  return "high";
}

/** Polar point; angles in degrees, 0 = east, clockwise (SVG y-down). */
function polar(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

/** Arc path from startAngle → endAngle (degrees, clockwise). */
function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polar(cx, cy, r, startAngle);
  const end = polar(cx, cy, r, endAngle);
  const delta = ((endAngle - startAngle) % 360 + 360) % 360;
  const large = delta > 180 ? 1 : 0;
  return `M ${start.x.toFixed(3)} ${start.y.toFixed(3)} A ${r} ${r} 0 ${large} 1 ${end.x.toFixed(3)} ${end.y.toFixed(3)}`;
}

/**
 * Outer horseshoe: left (red) → top (yellow) → right (green).
 * Span 270° from 135° (SW) through north to 45° (SE).
 */
const ARC_START = 135;
const ARC_SPAN = 270;
const BAND_SPAN = ARC_SPAN / 3;

const CX = 100;
const CY = 100;
const OUTER_R = 72;
const INNER_R = 52;
const RAISE_R = 76;

function ExpandIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M9.5 2.5H13.5V6.5M6.5 13.5H2.5V9.5M13.5 2.5L9 7M2.5 13.5L7 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Radial Omniscore readout: full inner ring tinted by the active band,
 * outer three-band arc, raised active-band cap, centered X.X value.
 * Distinct from the linear `BandGauge`.
 */
export default function OmniscoreGauge({
  value = 63,
  thresholds = DEFAULT_THRESHOLDS,
  label = "Omniscore",
  onExpand,
  className = "",
  showCard = true,
}) {
  const score = clampScore(value);
  const resolved = {
    mediumMin: thresholds.mediumMin ?? DEFAULT_THRESHOLDS.mediumMin,
    highMin: thresholds.highMin ?? DEFAULT_THRESHOLDS.highMin,
  };
  const activeId = bandIdFor(score, resolved);
  const display = score.toFixed(1);
  const meterName = `${label} ${display} of ${SCORE_MAX}`;

  const bands = BAND_IDS.map((id, i) => ({
    id,
    start: ARC_START + i * BAND_SPAN,
    end: ARC_START + (i + 1) * BAND_SPAN,
    active: id === activeId,
  }));

  const gauge = (
    <div
      className="ts-omni__meter"
      role="meter"
      aria-valuemin={SCORE_MIN}
      aria-valuemax={SCORE_MAX}
      aria-valuenow={Number(display)}
      aria-label={meterName}
    >
      <svg className="ts-omni__svg" viewBox="0 0 200 200" width="200" height="200" aria-hidden="true">
        {/* Full inner ring tinted by active band */}
        <circle
          className={`ts-omni__inner ts-omni__inner--${activeId}`}
          cx={CX}
          cy={CY}
          r={INNER_R}
          fill="none"
        />

        {/* Outer three-band arc (base) */}
        {bands.map((b) => (
          <path
            key={b.id}
            className={`ts-omni__band ts-omni__band--${b.id}${b.active ? " ts-omni__band--muted" : ""}`}
            d={describeArc(CX, CY, OUTER_R, b.start, b.end)}
            fill="none"
          />
        ))}

        {/* Raised active-band cap */}
        {bands
          .filter((b) => b.active)
          .map((b) => (
            <path
              key={`cap-${b.id}`}
              className={`ts-omni__cap ts-omni__cap--${b.id}`}
              d={describeArc(CX, CY, RAISE_R, b.start, b.end)}
              fill="none"
            />
          ))}

        <text className="ts-omni__value" x={CX} y={CY + 8} textAnchor="middle">
          {display}
        </text>
      </svg>
    </div>
  );

  if (!showCard) return gauge;

  return (
    <section className={`ts-omni ${className}`.trim()}>
      <header className="ts-omni__header">
        <h2 className="ts-omni__title">{label}</h2>
        <button
          type="button"
          className="ts-omni__expand"
          aria-label={`Expand ${label}`}
          onClick={onExpand}
        >
          <ExpandIcon />
        </button>
      </header>
      {gauge}
    </section>
  );
}
