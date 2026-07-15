import Pill from "./Pill";

export default {
  title: "Primitives/Pill",
  component: Pill,
  tags: ["autodocs"],
  argTypes: { tone: { control: "select", options: ["positive", "negative", "warning", "neutral"] } },
  args: { tone: "positive", children: "LOW RISK" },
};

export const LowRisk = {};
export const MediumRisk = { args: { tone: "warning", children: "MEDIUM RISK" } };
export const HighRisk = { args: { tone: "negative", children: "HIGH RISK" } };
