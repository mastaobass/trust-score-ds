import Banner from "./Banner";

export default {
  title: "Patterns/Banner",
  component: Banner,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Case meta strip with ActionBar-style variants. `paymentsFraud` shows queued / score / reason / caught-by / standing. `app` shows process / review dates and decision standing.",
      },
    },
  },
  args: { variant: "paymentsFraud" },
};

export const PaymentsFraud = {
  args: {
    variant: "paymentsFraud",
    queued: "14:22",
    score: 71.3,
    topReason: "Velocity spike",
    caughtBy: "Rules · velocity",
    standing: "Review · Hold",
  },
  parameters: {
    docs: {
      description: {
        story: "Payments fraud case banner — the five meta cells from Case Detail.",
      },
    },
  },
};

export const APP = {
  args: {
    variant: "app",
    processDate: "2026-08-20",
    reviewDate: "2026-08-22",
    decision: "Escalate",
    standing: "Review · Hold",
  },
  parameters: {
    docs: {
      description: {
        story:
          "APP review banner. Process/Review dates and decision standing — Storybook-only until an APP Case Detail path exists.",
      },
    },
  },
};
