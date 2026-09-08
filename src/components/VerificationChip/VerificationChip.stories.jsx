import VerificationChip from "./VerificationChip";

export default {
  title: "Primitives/VerificationChip",
  component: VerificationChip,
  tags: ["autodocs"],
};

export const AuthPass = { args: { result: "pass", code: "AUTH" } };
export const AvsFail = { args: { result: "fail", code: "AVSZ" } };
export const CvvNa = { args: { result: "na", code: "CVV" } };

export const Set = {
  render: () => (
    <div style={{ display: "flex", gap: 8 }}>
      <VerificationChip result="pass" code="AUTH" />
      <VerificationChip result="fail" code="AVSZ" />
      <VerificationChip result="pass" code="AVST" />
      <VerificationChip result="na" code="CVV" />
    </div>
  ),
};
