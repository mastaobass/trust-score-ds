import "./FieldRow.css";

/** Label + value pair from the case Transaction Info card. */
export default function FieldRow({ label, value }) {
  return (
    <div className="ts-field">
      <dt className="ts-field__label">{label}</dt>
      <dd className="ts-field__value">{value}</dd>
    </div>
  );
}
