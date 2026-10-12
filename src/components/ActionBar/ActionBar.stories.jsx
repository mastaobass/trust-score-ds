import ActionBar from "./ActionBar";

const paymentsFraudDesign =
  "https://www.figma.com/design/4xUv7jvv0soZmmXwCo830e/Fraud-Risk-Score-Explainer?node-id=114-227";
const appDesign =
  "https://www.figma.com/design/4xUv7jvv0soZmmXwCo830e/Fraud-Risk-Score-Explainer?node-id=141-381";

export default {
  title: "Compositions/ActionBar",
  component: ActionBar,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { variant: "paymentsFraud" },
};

export const PaymentsFraud = {
  args: { variant: "paymentsFraud" },
  parameters: {
    design: { type: "figma", url: paymentsFraudDesign },
    docs: {
      description: {
        story:
          "Payments fraud case bar: Approve and Decline, a 250-character note, assign and history, and reversal actions. Pass onHold to add Hold under Controls.",
      },
    },
  },
};

export const APP = {
  args: { variant: "app" },
  parameters: {
    design: { type: "figma", url: appDesign },
    docs: {
      description: {
        story:
          "APP review bar. Decision, reason code, and reviewer note keep Storybook-local state until a parent controls them.",
      },
    },
  },
};
