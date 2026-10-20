import ReviewQueue from "./ReviewQueue";

export default {
  title: "Patterns/ReviewQueue",
  component: ReviewQueue,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Case Queue built on AG Grid Community. A row opens the Payments Fraud case. The score explainer is on that case, not a modal from this table.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ height: "100vh", display: "flex", flexDirection: "column", minHeight: 0 }}>
        <Story />
      </div>
    ),
  ],
};

export const Loaded = {
  args: { initialState: "loaded" },
};

export const Loading = {
  args: { initialState: "loading" },
};

export const Empty = {
  args: { initialState: "empty" },
};

export const ErrorState = {
  name: "Error",
  args: { initialState: "error" },
};
