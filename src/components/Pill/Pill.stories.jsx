import Pill from "./Pill";

/** Simple checkmark — kit has no shared icon set yet. */
function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.5 8.5L6.5 11.5L12.5 4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Simple alert triangle. */
function AlertIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 2.5L14 13.5H2L8 2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M8 7V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

export default {
  title: "Primitives/Pill",
  component: Pill,
  tags: ["autodocs"],
  argTypes: {
    tone: { control: "select", options: ["positive", "negative", "warning", "neutral"] },
    iconPosition: { control: "select", options: ["left", "right"] },
  },
  args: { tone: "positive", children: "LOW RISK" },
};

export const LowRisk = {};
export const MediumRisk = { args: { tone: "warning", children: "MEDIUM RISK" } };
export const HighRisk = { args: { tone: "negative", children: "HIGH RISK" } };

export const WithLeftIcon = {
  name: "With left icon",
  args: {
    tone: "positive",
    children: "LOW RISK",
    icon: <CheckIcon />,
    iconPosition: "left",
  },
};

export const WithRightIcon = {
  name: "With right icon",
  args: {
    tone: "warning",
    children: "MEDIUM RISK",
    icon: <AlertIcon />,
    iconPosition: "right",
  },
};

export const WithoutIcon = {
  name: "Without icon",
  args: {
    tone: "neutral",
    children: "PENDING",
  },
};
