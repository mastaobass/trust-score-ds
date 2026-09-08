import "./VerificationChip.css";

const MARK = { pass: "✓", fail: "✕", na: "—" };

/** Payment verification flag from the case-detail surface. AUTH / AVS / CVV. */
export default function VerificationChip({ result = "na", code }) {
  return (
    <span className={`ts-verify ts-verify--${result}`}>
      <span className="ts-verify__mark" aria-hidden="true">{MARK[result] ?? MARK.na}</span>
      <span className="ts-verify__code">{code}</span>
    </span>
  );
}
