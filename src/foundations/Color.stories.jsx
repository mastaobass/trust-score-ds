import tokens from "../tokens/tokens.json";

const light = tokens.color;
const dark = tokens.dark.color;

function Swatch({ name, value }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 140 }}>
      <div
        style={{
          height: 64,
          borderRadius: "var(--ts-radius-md)",
          background: value,
          border: "1px solid var(--ts-color-border-default)",
        }}
      />
      <div style={{ fontFamily: "var(--ts-font-family)", fontSize: "var(--ts-font-size-sm)" }}>
        <div style={{ fontWeight: 600 }}>{name}</div>
        <code style={{ color: "var(--ts-color-text-muted)", fontSize: 11 }}>{value}</code>
      </div>
    </div>
  );
}

function Group({ title, colors }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h3
        style={{
          margin: "0 0 16px",
          fontFamily: "var(--ts-font-family)",
          fontSize: "var(--ts-font-size-lg)",
          fontWeight: 600,
        }}
      >
        {title}
      </h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {Object.entries(colors).map(([key, value]) =>
          typeof value === "string" ? (
            <Swatch key={key} name={key} value={value} />
          ) : (
            Object.entries(value).map(([sub, hex]) => (
              <Swatch key={`${key}.${sub}`} name={`${key}.${sub}`} value={hex} />
            ))
          )
        )}
      </div>
    </section>
  );
}

export default {
  title: "Foundations/Color",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Trust Score color tokens from `tokens.json` / `tokens.css`. Score and signal hues stay constant across themes; surfaces and text adapt.",
      },
    },
  },
};

export const Light = {
  render: () => (
    <div>
      <Group title="Text" colors={light.text} />
      <Group title="Surface" colors={light.surface} />
      <Group title="Border" colors={light.border} />
      <Group title="Score" colors={light.score} />
      <Group title="Signal" colors={light.signal} />
      <Group title="Accent" colors={light.accent} />
    </div>
  ),
};

export const Dark = {
  render: () => (
    <div>
      <Group title="Text" colors={dark.text} />
      <Group title="Surface" colors={dark.surface} />
      <Group title="Border" colors={dark.border} />
      <p
        style={{
          fontFamily: "var(--ts-font-family)",
          fontSize: "var(--ts-font-size-sm)",
          color: "var(--ts-color-text-muted)",
        }}
      >
        Score, signal, and accent hues match light (see Light story).
      </p>
    </div>
  ),
};
