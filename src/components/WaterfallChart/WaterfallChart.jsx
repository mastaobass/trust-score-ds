import "./WaterfallChart.css";

/**
 * Score composition waterfall: a base bar, signed deltas per signal
 * category, and a final bar. Pure SVG, no chart library.
 */
export default function WaterfallChart({
  baseline = 80.0,
  steps = [],
  width = 568,
  height = 240,
  baseLabel = "Base",
  finalLabel = "Final",
}) {
  const cums = [baseline];
  steps.forEach((s) => cums.push(Math.round((cums[cums.length - 1] + s.delta) * 10) / 10));
  const finalValue = cums[cums.length - 1];
  const lo = Math.min(...cums) - 2;
  const hi = Math.max(...cums) + 1;

  const plotTop = 10;
  const plotBottom = height - 50;
  const y = (v) => plotBottom - ((v - lo) / (hi - lo)) * (plotBottom - plotTop);

  const n = steps.length + 2;
  const gap = 14;
  const barW = Math.floor((width - 42 - gap * (n - 1)) / n);
  const x = (i) => 21 + i * (barW + gap);

  const bars = [
    { x: x(0), top: y(baseline), h: plotBottom - y(baseline), cls: "neutral", val: baseline.toFixed(1), label: baseLabel, below: false },
    ...steps.map((s, i) => {
      const from = cums[i];
      const to = cums[i + 1];
      return {
        x: x(i + 1),
        top: y(Math.max(from, to)),
        h: Math.abs(y(from) - y(to)),
        cls: s.delta >= 0 ? "positive" : "negative",
        val: `${s.delta >= 0 ? "+" : ""}${s.delta.toFixed(1)}`,
        label: s.label,
        below: s.delta < 0,
      };
    }),
    { x: x(n - 1), top: y(finalValue), h: plotBottom - y(finalValue), cls: "final", val: finalValue.toFixed(1), label: finalLabel, below: false },
  ];

  return (
    <svg
      className="ts-waterfall"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={`Score built from ${baseline.toFixed(1)} baseline to ${finalValue.toFixed(1)}`}
    >
      <line className="ts-waterfall__baseline" x1={21} x2={width - 21} y1={y(baseline)} y2={y(baseline)} />
      {bars.map((b) => (
        <g key={b.label}>
          <rect className={`ts-waterfall__bar ts-waterfall__bar--${b.cls}`} x={b.x} y={b.top} width={barW} height={Math.max(b.h, 2)} rx={3} />
          <text
            className={`ts-waterfall__value ts-waterfall__value--${b.cls}`}
            x={b.x + barW / 2}
            y={b.below ? b.top + b.h + 14 : b.top - 6}
            textAnchor="middle"
          >
            {b.val}
          </text>
          <text className="ts-waterfall__label" x={b.x + barW / 2} y={height - 26} textAnchor="middle">
            {b.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
