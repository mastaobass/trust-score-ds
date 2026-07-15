import ScoreHero from "./ScoreHero";

export default {
  title: "Components/ScoreHero",
  component: ScoreHero,
  tags: ["autodocs"],
  argTypes: { score: { control: { type: "range", min: 0, max: 99.9, step: 0.1 } } },
  args: { score: 85.6, confidence: 92 },
};

export const LowRisk = {};
export const MediumRisk = { args: { score: 71.3, confidence: 84 } };
export const HighRisk = { args: { score: 42.8, confidence: 96 } };
