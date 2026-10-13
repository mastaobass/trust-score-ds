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
    showCard: true,
  },
  parameters: {
    layout: "centered",
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

/** Gauge without card chrome. */
export const GaugeOnly = {
  args: { value: 63, showCard: false },
};
