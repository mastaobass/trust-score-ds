import ScoreHero from "../ScoreHero/ScoreHero";
import Widget from "../Widget/Widget";
import WidgetGrid from "./WidgetGrid";

export default {
  title: "Patterns/WidgetGrid",
  component: WidgetGrid,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Equal 1-column tracks for Widgets — four across on desktop, three at tablet (`max-width: 900px`). Use `WidgetGrid.Item` with `column` for explicit placement (e.g. Score Hero top-right). Below 900px, a fourth auto-flow cell wraps; an Item with `column={4}` clamps to the last tablet track.",
      },
    },
  },
};

const muted = {
  margin: 0,
  color: "var(--ts-color-text-muted)",
  fontSize: "var(--ts-font-size-sm)",
};

export const FourAcross = {
  name: "Four 1-col widgets",
  render: () => (
    <WidgetGrid aria-label="Widget grid demo">
      {["Signals", "Velocity", "Identity", "Network"].map((title) => (
        <Widget key={title} title={title} className="ts-widget--square">
          <p style={muted}>1-column cell</p>
        </Widget>
      ))}
    </WidgetGrid>
  ),
};

export const ScoreHeroColumnFour = {
  name: "Score Hero in column 4",
  render: () => (
    <WidgetGrid aria-label="Case widgets demo">
      <WidgetGrid.Item column={4}>
        <Widget title="Trust score" className="ts-widget--square">
          <ScoreHero score={71.3} confidence={84} />
        </Widget>
      </WidgetGrid.Item>
    </WidgetGrid>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Score Hero pinned to column 4 on desktop (last of four tracks). Resize the viewport under 900px to see three tracks; placement clamps to column 3.",
      },
    },
  },
};
