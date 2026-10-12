import "./ActionBarSection.css";

/** Uppercase group label with a row of controls, e.g. DECISION or REVIEW ACTION. */
export default function ActionBarSection({ label, children, className = "" }) {
  return (
    <section className={`ts-action-section ${className}`.trim()}>
      <h3 className="ts-action-section__label">{label}</h3>
      <div className="ts-action-section__row">{children}</div>
    </section>
  );
}
