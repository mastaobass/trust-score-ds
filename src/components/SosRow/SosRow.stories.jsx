import SosRow from "./SosRow";

export default {
  title: "Components/SosRow",
  component: SosRow,
  tags: ["autodocs"],
};

export const Pass = { args: { tone: "pass", children: "Matching Zip Codes" } };
export const Warn = { args: { tone: "warn", children: "High number of Chargebacks" } };
