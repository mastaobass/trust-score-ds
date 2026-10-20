import tokens from "../tokens/tokens.json";

const sizes = tokens.font.size;
const family = tokens.font.family;

const sample = "The quick brown fox jumps over the lazy dog";

export default {
  title: "Foundations/Type",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Typography scale and family from Trust Score tokens.",
      },
    },
  },
};

export const Scale = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, fontFamily: family }}>
      <p style={{ margin: 0, color: "var(--ts-color-text-muted)", fontSize: 13 }}>
        Family: <code>{family}</code>
      </p>
      {Object.entries(sizes).map(([name, px]) => (
        <div key={name} style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
          <code
            style={{
              width: 88,
              flexShrink: 0,
              fontSize: 12,
              color: "var(--ts-color-text-muted)",
            }}
          >
            {name} · {px}px
          </code>
          <span style={{ fontSize: px, color: "var(--ts-color-text-primary)", lineHeight: 1.3 }}>
            {sample}
          </span>
        </div>
      ))}
    </div>
  ),
};
