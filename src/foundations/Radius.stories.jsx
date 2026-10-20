import tokens from "../tokens/tokens.json";

const radius = tokens.radius;

export default {
  title: "Foundations/Radius",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Corner radius tokens (`--ts-radius-*`).",
      },
    },
  },
};

export const Scale = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 24, fontFamily: "var(--ts-font-family)" }}>
      {Object.entries(radius).map(([name, px]) => (
        <div key={name} style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
          <div
            style={{
              width: 80,
              height: 80,
              background: "var(--ts-color-surface-raised)",
              border: "1px solid var(--ts-color-border-default)",
              borderRadius: px,
            }}
          />
          <code style={{ fontSize: 12, color: "var(--ts-color-text-muted)" }}>
            {name} · {px}
          </code>
        </div>
      ))}
    </div>
  ),
};
