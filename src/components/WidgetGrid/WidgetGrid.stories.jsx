import { useState } from "react";
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
          "Content-agnostic equal-track grid for Widgets. Desktop: 4 columns; tablet (`max-width: 900px`): 3. Caps at `maxRows` (default 6) equal row tracks. `WidgetGrid.Item` accepts `column`/`row` starts and `colSpan`/`rowSpan` ∈ {1,2}; starts clamp so spans stay in bounds. Children are opaque — the grid only reads Item layout props.",
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
  name: "Four 1×1 widgets",
  render: () => (
    <WidgetGrid aria-label="Widget grid demo" maxRows={6}>
      {["Signals", "Velocity", "Identity", "Network"].map((title) => (
        <Widget key={title} title={title} colSpan={1} rowSpan={1}>
          <p style={muted}>1×1 cell</p>
        </Widget>
      ))}
    </WidgetGrid>
  ),
};

export const MixedSpans = {
  name: "Mixed spans",
  render: () => (
    <WidgetGrid aria-label="Mixed span demo" maxRows={6}>
      <WidgetGrid.Item column={1} row={1} colSpan={2} rowSpan={1}>
        <Widget title="Wide" colSpan={2} rowSpan={1}>
          <p style={muted}>2×1</p>
        </Widget>
      </WidgetGrid.Item>
      <WidgetGrid.Item column={3} row={1} colSpan={1} rowSpan={2}>
        <Widget title="Tall" colSpan={1} rowSpan={2}>
          <p style={muted}>1×2</p>
        </Widget>
      </WidgetGrid.Item>
      <WidgetGrid.Item column={4} row={1} colSpan={1} rowSpan={1}>
        <Widget title="Trust score" colSpan={1} rowSpan={1}>
          <ScoreHero score={71.3} confidence={84} />
        </Widget>
      </WidgetGrid.Item>
      <WidgetGrid.Item column={1} row={2} colSpan={2} rowSpan={2}>
        <Widget title="Large" colSpan={2} rowSpan={2}>
          <p style={muted}>2×2</p>
        </Widget>
      </WidgetGrid.Item>
    </WidgetGrid>
  ),
};

function ResizeSnapDemo() {
  const [size, setSize] = useState({ colSpan: 1, rowSpan: 1 });
  return (
    <WidgetGrid aria-label="Resize snap demo" maxRows={6}>
      <WidgetGrid.Item column={4} row={1} colSpan={size.colSpan} rowSpan={size.rowSpan}>
        <Widget
          title="Trust score"
          colSpan={size.colSpan}
          rowSpan={size.rowSpan}
          resizable
          onSizeChange={setSize}
        >
          <ScoreHero score={71.3} confidence={84} />
          <p style={{ ...muted, marginTop: 8 }}>
            Size {size.colSpan}×{size.rowSpan} — gear toggles or drag SE handle to snap.
          </p>
        </Widget>
      </WidgetGrid.Item>
    </WidgetGrid>
  );
}

export const ResizeSnap = {
  name: "Resize / snap demo",
  render: () => <ResizeSnapDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Gear opens size toggles (1×1 / 1×2 / 2×1 / 2×2). SE resize handle snaps to the same four states on pointer-up.",
      },
    },
  },
};

export const MaxSixRows = {
  name: "Max 6 rows",
  render: () => (
    <WidgetGrid aria-label="Six-row cap demo" maxRows={6}>
      {Array.from({ length: 12 }, (_, i) => (
        <WidgetGrid.Item key={i} column={(i % 4) + 1} row={Math.floor(i / 4) + 1} colSpan={1} rowSpan={1}>
          <Widget title={`R${Math.floor(i / 4) + 1}C${(i % 4) + 1}`} colSpan={1} rowSpan={1}>
            <p style={muted}>Cell {i + 1}</p>
          </Widget>
        </WidgetGrid.Item>
      ))}
    </WidgetGrid>
  ),
  parameters: {
    docs: {
      description: {
        story: "Twelve 1×1 items fill a 4×3 region inside the 6-row template; overflow beyond row 6 is clamped by Item start math.",
      },
    },
  },
};

export const ScoreHeroColumnFour = {
  name: "Score Hero in column 4",
  render: () => (
    <WidgetGrid aria-label="Case widgets demo" maxRows={6}>
      <WidgetGrid.Item column={4} row={1} colSpan={1} rowSpan={1}>
        <Widget title="Trust score" colSpan={1} rowSpan={1}>
          <ScoreHero score={71.3} confidence={84} />
        </Widget>
      </WidgetGrid.Item>
    </WidgetGrid>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Score Hero pinned to column 4 on desktop. Resize under 900px to see three tracks; placement clamps so span fits.",
      },
    },
  },
};
