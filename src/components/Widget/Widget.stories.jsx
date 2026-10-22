import { useState } from "react";
import ScoreHero from "../ScoreHero/ScoreHero";
import Widget from "./Widget";

export default {
  title: "Components/Widget",
  component: Widget,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Raised widget chrome with optional title, headerActions (quiet icon CTAs before layout chrome), header move grip, settings gear (size toggles 1×1 / 1×2 / 2×1 / 2×2), remove X, and snap resize handle. 4∶3 aspect only for 1×1; larger sizes fill their grid cell.",
      },
    },
  },
};

const cellStyle = {
  width: 280,
  maxWidth: "100%",
};

export const EmptyRatio = {
  name: "Empty 4∶3",
  render: () => (
    <div style={cellStyle}>
      <Widget title="Empty" colSpan={1} rowSpan={1} aria-label="Empty widget">
        <p style={{ margin: 0, color: "var(--ts-color-text-muted)", fontSize: "var(--ts-font-size-sm)" }}>
          Placeholder body for an empty cell.
        </p>
      </Widget>
    </div>
  ),
};

export const SettingsAndSize = {
  name: "Settings gear + size toggles",
  render: function SettingsDemo() {
    const [size, setSize] = useState({ colSpan: 1, rowSpan: 1 });
    const width = size.colSpan === 1 ? 280 : 420;
    const height = size.rowSpan === 1 ? undefined : 360;
    return (
      <div style={{ width, height, maxWidth: "100%" }}>
        <Widget
          title="Trust score"
          colSpan={size.colSpan}
          rowSpan={size.rowSpan}
          resizable
          onSizeChange={setSize}
        >
          <ScoreHero score={71.3} confidence={84} />
          <p style={{ margin: "8px 0 0", color: "var(--ts-color-text-muted)", fontSize: "var(--ts-font-size-sm)" }}>
            {size.colSpan}×{size.rowSpan}
          </p>
        </Widget>
      </div>
    );
  },
};

function ExpandIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M9.5 2.5H13.5V6.5M6.5 13.5H2.5V9.5M13.5 2.5L9 7M2.5 13.5L7 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const WithHeaderActions = {
  name: "Header expand action",
  render: function HeaderActionsDemo() {
    const [expanded, setExpanded] = useState(false);
    return (
      <div style={cellStyle}>
        <Widget
          title="Trust score"
          colSpan={1}
          rowSpan={1}
          onSizeChange={() => {}}
          onRemove={() => {}}
          headerActions={
            <button
              type="button"
              className="ts-widget__action"
              aria-label="Expand Trust score"
              onClick={() => setExpanded(true)}
            >
              <ExpandIcon />
            </button>
          }
        >
          <ScoreHero score={71.3} confidence={84} />
          <p style={{ margin: "8px 0 0", color: "var(--ts-color-text-muted)", fontSize: "var(--ts-font-size-sm)" }}>
            {expanded
              ? "Expand fired (CaseDetail wires this to TrustScoreModal)."
              : "Quiet expand sits left of gear / remove."}
          </p>
        </Widget>
      </div>
    );
  },
};

export const WithRemove = {
  name: "Header remove X",
  render: function RemoveDemo() {
    const [removed, setRemoved] = useState(false);
    if (removed) {
      return (
        <button type="button" onClick={() => setRemoved(false)}>
          Restore widget
        </button>
      );
    }
    return (
      <div style={cellStyle}>
        <Widget
          title="Custom fields"
          colSpan={1}
          rowSpan={1}
          onRemove={() => setRemoved(true)}
          onSizeChange={() => {}}
        >
          <p style={{ margin: 0, color: "var(--ts-color-text-muted)", fontSize: "var(--ts-font-size-sm)" }}>
            Close removes the widget from the layout.
          </p>
        </Widget>
      </div>
    );
  },
};

export const GripGearRemove = {
  name: "Grip + gear + remove",
  render: function FullChromeDemo() {
    const [size, setSize] = useState({ colSpan: 1, rowSpan: 1 });
    const [gone, setGone] = useState(false);
    if (gone) {
      return (
        <button type="button" onClick={() => setGone(false)}>
          Restore widget
        </button>
      );
    }
    return (
      <div style={{ width: size.colSpan === 1 ? 280 : 420, maxWidth: "100%" }}>
        <Widget
          title="Payment"
          colSpan={size.colSpan}
          rowSpan={size.rowSpan}
          resizable
          onSizeChange={setSize}
          onPositionChange={() => {}}
          onRemove={() => setGone(true)}
        >
          <p style={{ margin: 0, color: "var(--ts-color-text-muted)", fontSize: "var(--ts-font-size-sm)" }}>
            Header grip moves; gear sets size; X removes.
          </p>
        </Widget>
      </div>
    );
  },
};

export const WithScoreHeroLow = {
  name: "With ScoreHero · Low risk",
  render: () => (
    <div style={cellStyle}>
      <Widget title="Trust score" colSpan={1} rowSpan={1}>
        <ScoreHero score={85.6} confidence={92} />
      </Widget>
    </div>
  ),
};

export const WithScoreHeroMedium = {
  name: "With ScoreHero · Medium risk",
  render: () => (
    <div style={cellStyle}>
      <Widget title="Trust score" colSpan={1} rowSpan={1}>
        <ScoreHero score={71.3} confidence={84} />
      </Widget>
    </div>
  ),
};

export const WithScoreHeroHigh = {
  name: "With ScoreHero · High risk",
  render: () => (
    <div style={cellStyle}>
      <Widget title="Trust score" colSpan={1} rowSpan={1}>
        <ScoreHero score={42.8} confidence={96} />
      </Widget>
    </div>
  ),
};
