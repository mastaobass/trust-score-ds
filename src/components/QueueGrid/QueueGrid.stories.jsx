import { useState } from "react";
import QueueGrid from "./QueueGrid";
import { QUEUE } from "../../lib/queue";

export default {
  title: "Components/QueueGrid",
  component: QueueGrid,
  parameters: { layout: "fullscreen" },
};

export const SortFilterAndMove = {
  render: () => {
    const [opened, setOpened] = useState(null);
    return (
      <div style={{ height: 560, display: "flex", padding: 24, background: "var(--ts-color-surface-page)" }}>
        <div style={{ flex: 1, minWidth: 0, display: "flex", border: "1px solid var(--ts-color-border-default)", borderRadius: 8, overflow: "hidden", background: "var(--ts-color-surface-default)" }}>
          <QueueGrid rows={QUEUE} onOpen={setOpened} />
        </div>
        {opened ? <p style={{ margin: "0 0 0 16px" }}>Opened {opened}</p> : null}
      </div>
    );
  },
};
