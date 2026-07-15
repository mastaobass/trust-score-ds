import BandGauge from "./BandGauge";

export default {
  title: "Components/BandGauge",
  component: BandGauge,
  tags: ["autodocs"],
  argTypes: { score: { control: { type: "range", min: 0, max: 99.9, step: 0.1 } } },
  args: { score: 85.6 },
};

export const HighBand = {};
export const MediumBand = { args: { score: 71.3 } };
export const LowBand = { args: { score: 42.8 } };
