import SectionCard from "./SectionCard";
import SosRow from "../SosRow/SosRow";
import VerificationChip from "../VerificationChip/VerificationChip";

export default {
  title: "Primitives/SectionCard",
  component: SectionCard,
  tags: ["autodocs"],
};

export const Sos = {
  render: () => (
    <SectionCard title="SOS Card">
      <SosRow tone="pass">Matching Zip Codes</SosRow>
      <SosRow tone="warn">High number of Chargebacks</SosRow>
      <SosRow tone="warn">Flags - AVSZ, CVV</SosRow>
    </SectionCard>
  ),
};

export const Payment = {
  render: () => (
    <SectionCard title="Payment">
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <VerificationChip result="pass" code="AUTH" />
        <VerificationChip result="fail" code="AVSZ" />
        <VerificationChip result="pass" code="AVST" />
        <VerificationChip result="na" code="CVV" />
      </div>
    </SectionCard>
  ),
};
