import "./Pill.css";

/** Compact status label, e.g. the risk band on the score hero. */
export default function Pill({
  tone = "neutral",
  icon,
  iconPosition = "left",
  children,
}) {
  const iconEl = icon ? (
    <span className="ts-pill__icon" aria-hidden="true">
      {icon}
    </span>
  ) : null;

  return (
    <span className={`ts-pill ts-pill--${tone}`}>
      {iconPosition === "left" && iconEl}
      {children}
      {iconPosition === "right" && iconEl}
    </span>
  );
}
