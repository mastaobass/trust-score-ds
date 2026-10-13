import { useState } from "react";
import { seedCase } from "../../lib/cases";
import { useCaseLayouts } from "../../lib/caseLayouts";
import { listCaseWidgets } from "../../lib/caseWidgetContent";
import { QUEUE } from "../../lib/queue";
import LayoutDrawer from "./LayoutDrawer";
import WidgetGrid from "./WidgetGrid";

function WidgetGridDemo() {
  const layouts = useCaseLayouts();
  const [editMode, setEditMode] = useState(false);
  const [open, setOpen] = useState(true);
  const row = QUEUE.find((entry) => entry.id === "48291-C");
  const item = { ...seedCase("48291-C"), ...row };
  return (
    <div style={{ minHeight: "100vh", padding: 24 }}>
      <WidgetGrid
        items={layouts.active.items}
        editMode={editMode}
        context={{ item, events: [], onExplain: () => {} }}
        onSizeChange={layouts.setSize}
        onRemove={layouts.removeItem}
        onReorder={layouts.reorder}
        onEditWidgets={() => { setEditMode(true); setOpen(true); }}
        onEditContent={() => {}}
      />
      <LayoutDrawer
        open={open}
        onClose={() => setOpen(false)}
        layouts={layouts.layouts}
        activeId={layouts.active.id}
        editMode={editMode}
        catalog={listCaseWidgets()}
        onSelect={layouts.select}
        onCreate={layouts.create}
        onRename={layouts.rename}
        onDelete={layouts.remove}
        onAdd={layouts.addItem}
        onEditModeChange={setEditMode}
      />
    </div>
  );
}

export default {
  title: "Compositions/WidgetGrid",
  component: WidgetGrid,
  parameters: { layout: "fullscreen" },
};

export const EditModeAndDrawer = {
  render: () => <WidgetGridDemo />,
};
