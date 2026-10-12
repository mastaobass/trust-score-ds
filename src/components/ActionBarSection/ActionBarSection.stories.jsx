import Button from "../Button/Button";
import ActionBarSection from "./ActionBarSection";

export default {
  title: "Primitives/ActionBarSection",
  component: ActionBarSection,
  args: { label: "Decision" },
};

export const WithButtons = {
  render: (args) => (
    <ActionBarSection {...args}>
      <Button variant="accent" size="sm">Approve</Button>
      <Button variant="critical" size="sm">Decline</Button>
    </ActionBarSection>
  ),
};
