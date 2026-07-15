import WaterfallChart from "./WaterfallChart";

const defaultSteps = [
  { label: "History", delta: 4.2 },
  { label: "Device", delta: 2.8 },
  { label: "Velocity", delta: -3.5 },
  { label: "Email", delta: 1.9 },
  { label: "Geo", delta: -2.2 },
  { label: "Payment", delta: 3.1 },
  { label: "Timing", delta: -1.4 },
  { label: "Basket", delta: 0.7 },
];

export default {
  title: "Components/WaterfallChart",
  component: WaterfallChart,
  tags: ["autodocs"],
  args: { baseline: 80.0, steps: defaultSteps },
};

export const EightSignals = {};
export const RiskyTransaction = {
  args: {
    steps: [
      { label: "History", delta: -6.1 },
      { label: "Device", delta: -4.8 },
      { label: "Velocity", delta: -7.5 },
      { label: "Email", delta: 1.2 },
      { label: "Geo", delta: -5.9 },
      { label: "Payment", delta: -3.4 },
      { label: "Timing", delta: -2.1 },
      { label: "Basket", delta: -1.8 },
    ],
  },
};
