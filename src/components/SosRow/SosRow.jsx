import "./SosRow.css";

const MARK = { pass: "✓", warn: "!" };

/** One row from the case SOS card. Pass/warn only. Analyst signals, not model reason codes. */
export default function SosRow({ tone = "pass", children }) {
  return (
    <div className={`ts-sos ts-sos--${tone}`}>
      <span className="ts-sos__badge" aria-hidden="true">{MARK[tone] ?? MARK.warn}</span>
      <span className="ts-sos__label">{children}</span>
    </div>
  );
}
