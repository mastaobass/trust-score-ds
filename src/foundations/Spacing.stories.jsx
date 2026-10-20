import tokens from "../tokens/tokens.json";

const space = tokens.space;

export default {
  title: "Foundations/Spacing",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Spacing scale (`--ts-space-*`) from Trust Score tokens.",
      },
    },
  },
};

export const Scale = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, fontFamily: "var(--ts-font-family)" }}>
      {Object.entries(space).map(([name, px]) => (
        <div key={name} style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <code style={{ width: 72, fontSize: 12, color: "var(--ts-color-text-muted)" }}>
            {name} · {px}px
          </code>
          <div
            style={{
              width: px,
              height: 24,
              background: "var(--ts-color-accent-primary)",
              borderRadius: 2,
            }}
          />
        </div>
      ))}
    </div>
  ),
};
