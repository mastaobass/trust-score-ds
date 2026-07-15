import "./ReasonRow.css";

/**
 * One pre-scripted reason code. `active` rows carry a weight and a tinted
 * surface; inactive rows stay visible but dimmed, so reviewers always see
 * the full reason vocabulary.
 */
export default function ReasonRow({ label, weight = null, active = false, direction = "positive" }) {
  const cls = ["ts-reason", `ts-reason--${direction}`, active ? "is-active" : "is-inactive"].join(" ");
  return (
    <div className={cls}>
      <span className="ts-reason__lead">
        <span className="ts-reason__dot" aria-hidden="true" />
        <span className="ts-reason__label">{label}</span>
      </span>
      {active && weight != null && (
        <span className="ts-reason__weight">{weight > 0 ? `+${weight.toFixed(1)}` : weight.toFixed(1)}</span>
      )}
    </div>
  );
}
