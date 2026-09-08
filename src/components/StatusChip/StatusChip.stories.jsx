import StatusChip from "./StatusChip";

export default {
  title: "Primitives/StatusChip",
  component: StatusChip,
  tags: ["autodocs"],
};

export const Review = { args: { status: "review" } };
export const Approved = { args: { status: "approved" } };
export const Held = { args: { status: "held" } };
export const Declined = { args: { status: "declined" } };
