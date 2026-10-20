import ScoreHero from "../ScoreHero/ScoreHero";
import Widget from "./Widget";

export default {
  title: "Components/Widget",
  component: Widget,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

const cellStyle = {
  width: 280,
  maxWidth: "100%",
};

export const EmptySquare = {
  name: "Empty square",
  render: () => (
    <div style={cellStyle}>
      <Widget title="Empty" className="ts-widget--square" aria-label="Empty widget">
        <p style={{ margin: 0, color: "var(--ts-color-text-muted)", fontSize: "var(--ts-font-size-sm)" }}>
          Placeholder body for an empty cell.
        </p>
      </Widget>
    </div>
  ),
};

export const WithScoreHeroLow = {
  name: "With ScoreHero · Low risk",
  render: () => (
    <div style={cellStyle}>
      <Widget title="Trust score" className="ts-widget--square">
        <ScoreHero score={85.6} confidence={92} />
      </Widget>
    </div>
  ),
};

export const WithScoreHeroMedium = {
  name: "With ScoreHero · Medium risk",
  render: () => (
    <div style={cellStyle}>
      <Widget title="Trust score" className="ts-widget--square">
        <ScoreHero score={71.3} confidence={84} />
      </Widget>
    </div>
  ),
};

export const WithScoreHeroHigh = {
  name: "With ScoreHero · High risk",
  render: () => (
    <div style={cellStyle}>
      <Widget title="Trust score" className="ts-widget--square">
        <ScoreHero score={42.8} confidence={96} />
      </Widget>
    </div>
  ),
};
