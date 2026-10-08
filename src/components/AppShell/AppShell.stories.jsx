import AppShell from "./AppShell";

export default {
  title: "Compositions/AppShell",
  component: AppShell,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/4xUv7jvv0soZmmXwCo830e/Fraud-Risk-Score-Explainer?node-id=198-353",
    },
  },
  args: {
    email: "email@example.com",
    org: "Bancolombia",
    activeNavId: "case-management",
  },
};

export const EmptyMain = {
  render: (args) => (
    <AppShell {...args}>
      <div style={{ padding: 24 }}>
        <h1 style={{ margin: "0 0 8px", fontSize: 20 }}>Case Management</h1>
        <p style={{ margin: 0, color: "#6b7382" }}>
          Queue and case views render here inside the console chrome.
        </p>
      </div>
    </AppShell>
  ),
};

export const WithPlaceholderPanel = {
  render: (args) => (
    <AppShell {...args}>
      <div
        style={{
          margin: 20,
          padding: 24,
          background: "#fff",
          border: "1px solid #e3e6eb",
          borderRadius: 8,
          minHeight: 320,
        }}
      >
        Content region
      </div>
    </AppShell>
  ),
};
