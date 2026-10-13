import OmniscoreGauge from "./OmniscoreGauge";

export default {
  title: "Components/OmniscoreGauge",
  component: OmniscoreGauge,
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "range", min: 0, max: 99.9, step: 0.1 } },
    onExpand: { action: "expand" },
  },
  args: {
    value: 63,
    label: "Omniscore",
    showCard: false,
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Gauge primitive. Case Detail wraps it in a Widget. Pass showCard for the standalone card chrome.",
      },
    },
  },
};

/** Medium band (~63) — matches the reference card. */
export const Medium = {};

/** Low band (~30). */
export const Low = {
  args: { value: 30 },
};

/** High band (~90). */
export const High = {
  args: { value: 90 },
};

/** Same medium readout on dark surfaces. */
export const Dark = {
  args: { value: 63 },
  globals: { theme: "dark" },
};

/** Standalone card chrome. The case page uses Widget instead. */
export const WithCard = {
  args: { value: 63, showCard: true },
};
