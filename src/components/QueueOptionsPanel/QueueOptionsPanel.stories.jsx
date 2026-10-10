import { useState } from "react";
import QueueGrid from "../QueueGrid/QueueGrid";
import QueueOptionsPanel from "./QueueOptionsPanel";
import { QUEUE } from "../../lib/queue";

export default {
  title: "Components/QueueOptionsPanel",
  component: QueueOptionsPanel,
  parameters: { layout: "fullscreen" },
};

export const BesideTheGrid = {
  render: () => {
    const [api, setApi] = useState(null);
    const [density, setDensity] = useState("comfortable");
    return (
      <div style={{ display: "flex", gap: 12, height: 560, padding: 24, background: "var(--ts-color-surface-page)" }}>
        <div style={{ flex: 1, minWidth: 0, display: "flex", border: "1px solid var(--ts-color-border-default)", borderRadius: 8, overflow: "hidden" }}>
          <QueueGrid rows={QUEUE} density={density} onReady={setApi} onOpen={() => {}} />
        </div>
        <QueueOptionsPanel api={api} density={density} onDensityChange={setDensity} onHide={() => {}} />
      </div>
    );
  },
};
