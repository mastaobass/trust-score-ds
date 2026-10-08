import Sidebar from "./Sidebar";

export default {
  title: "Primitives/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/4xUv7jvv0soZmmXwCo830e/Fraud-Risk-Score-Explainer?node-id=198-350",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 480, display: "flex", background: "#edf0f4" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    activeId: "case-management",
  },
};

export const CaseManagementActive = {};

export const DashboardActive = {
  args: { activeId: "dashboard" },
};
