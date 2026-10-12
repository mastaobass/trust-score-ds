import { useState } from "react";
import ActionBarField from "./ActionBarField";

export default {
  title: "Primitives/ActionBarField",
  component: ActionBarField,
};

function NoteField() {
  const [value, setValue] = useState("");
  return <ActionBarField kind="note" value={value} onChange={setValue} width={320} />;
}

export const Note = {
  render: () => <NoteField />,
};

function SelectField() {
  const [value, setValue] = useState("");
  return (
    <ActionBarField
      kind="select"
      placeholder="Decision: Allow / Block / Escalate"
      value={value}
      onChange={setValue}
      width={220}
      options={[
        { value: "allow", label: "Allow" },
        { value: "block", label: "Block" },
        { value: "escalate", label: "Escalate" },
      ]}
    />
  );
}

export const Select = {
  render: () => <SelectField />,
};

export const Chip = {
  args: { kind: "chip", value: "Process: 2026-08-20", width: 180 },
};
