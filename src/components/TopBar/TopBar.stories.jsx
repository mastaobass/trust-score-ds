import TopBar from "./TopBar";

export default {
  title: "Primitives/TopBar",
  component: TopBar,
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
  },
};

export const Default = {
  parameters: {
    docs: {
      description: {
        story:
          "Right cluster, left to right: Search, notification bell, bank name (switch banks), then user icon with email (profile and sign out).",
      },
    },
  },
};

export const CustomAccount = {
  args: {
    email: "analyst@kount.com",
    org: "Acme Payments",
  },
};
