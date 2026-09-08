import "./SectionCard.css";

/** Card chrome used by SOS, Payment, Transaction Info, and Network. */
export default function SectionCard({ title, children }) {
  return (
    <section className="ts-card">
      {title && <h2 className="ts-card__title">{title}</h2>}
      <div className="ts-card__body">{children}</div>
    </section>
  );
}
