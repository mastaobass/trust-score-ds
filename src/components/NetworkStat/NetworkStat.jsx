import "./NetworkStat.css";

/** One Across the Kount Network stat. share is 0-1 for bar length only. */
export default function NetworkStat({ value, label, share = 0.5 }) {
  const width = Math.max(0, Math.min(1, share)) * 100;
  return (
    <div className="ts-stat">
      <span className="ts-stat__value">{value}</span>
      <span className="ts-stat__label">{label}</span>
      <span className="ts-stat__track" aria-hidden="true">
        <span className="ts-stat__fill" style={{ width: `${width}%` }} />
      </span>
    </div>
  );
}
