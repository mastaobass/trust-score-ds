import ReasonRow from "./ReasonRow";

export default {
  title: "Components/ReasonRow",
  component: ReasonRow,
  tags: ["autodocs"],
  argTypes: { direction: { control: "radio", options: ["positive", "negative"] } },
  args: { label: "Established customer history · 2+ years", weight: 4.2, active: true, direction: "positive" },
};

export const ActivePositive = {};
export const ActiveNegative = {
  args: { label: "High order velocity · 3 in 24 hrs", weight: -3.5, direction: "negative" },
};
export const Inactive = { args: { label: "Proxy or VPN detected", active: false, weight: null } };
