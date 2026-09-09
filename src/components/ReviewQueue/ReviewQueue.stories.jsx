import ReviewQueue from "./ReviewQueue";

export default {
  title: "Compositions/ReviewQueue",
  component: ReviewQueue,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Transaction queue. A row opens the Payments Fraud case. The score explainer is on that case, not a modal from this table.",
      },
    },
  },
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
