import "./Pill.css";

/** Compact status label, e.g. the risk band on the score hero. */
export default function Pill({ tone = "neutral", children }) {
  return <span className={`ts-pill ts-pill--${tone}`}>{children}</span>;
}
