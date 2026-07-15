import Button from "./Button";

export default {
  title: "Primitives/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "danger", "ghost"] },
    size: { control: "radio", options: ["md", "sm"] },
  },
  args: { children: "Approve", variant: "primary", size: "md" },
};

export const Primary = {};
export const Secondary = { args: { variant: "secondary", children: "Hold for review" } };
export const Danger = { args: { variant: "danger", children: "Decline" } };
export const Ghost = { args: { variant: "ghost", size: "sm", children: "Yes" } };
