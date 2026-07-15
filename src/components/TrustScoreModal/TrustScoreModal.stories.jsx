import TrustScoreModal from "./TrustScoreModal";
import {
  defaultTransaction,
  defaultSteps,
  defaultPositiveReasons,
  defaultNegativeReasons,
} from "./fixtures";

export default {
  title: "Compositions/TrustScoreModal",
  component: TrustScoreModal,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    transaction: defaultTransaction,
    score: 85.6,
    confidence: 92,
    baseline: 80.0,
    steps: defaultSteps,
    positiveReasons: defaultPositiveReasons,
    negativeReasons: defaultNegativeReasons,
  },
};

export const LowRiskApprove = {};

export const HighRiskDecline = {
  args: {
    score: 51.2,
    confidence: 88,
    steps: [
      { label: "History", delta: -6.1 },
      { label: "Device", delta: -4.8 },
      { label: "Velocity", delta: -7.5 },
      { label: "Email", delta: 1.2 },
      { label: "Geo", delta: -5.9 },
      { label: "Payment", delta: -3.4 },
      { label: "Timing", delta: -2.1 },
      { label: "Basket", delta: -0.2 },
    ],
    positiveReasons: [
      { label: "Email address aged 3+ years", weight: 1.2, active: true },
      ...defaultPositiveReasons.slice(5),
    ],
    negativeReasons: defaultNegativeReasons.map((r) => ({
      ...r,
      active: true,
      weight: r.weight ?? -1.1,
    })).slice(0, 7).concat(defaultNegativeReasons.slice(7)),
  },
};
