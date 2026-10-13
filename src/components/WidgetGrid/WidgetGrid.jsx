import { useState } from "react";
import Widget from "../Widget/Widget";
import { getCaseWidget } from "../../lib/caseWidgetContent";
import "./WidgetGrid.css";

/** Four-column case grid. Edit mode reorders by HTML5 drag in row-major order. */
export default function WidgetGrid({
  items,
  context,
  editMode = false,
  onSizeChange,
  onRemove,
  onReorder,
  onEditWidgets,
  onEditContent,
}) {
  const [dragId, setDragId] = useState(null);
  const [overId, setOverId] = useState(null);

  return (
    <div className={`ts-widget-grid${editMode ? " ts-widget-grid--edit" : ""}`}>
      {items.map((item) => {
        const spec = getCaseWidget(item.contentType);
        const title = spec?.label ?? "Unavailable";
        return (
          <Widget
            key={item.id}
            id={item.id}
            title={title}
            size={item.size}
            info={spec?.info}
            editMode={editMode}
            draggable={editMode}
            dragging={dragId === item.id}
            dropTarget={overId === item.id && dragId !== item.id}
            headerActions={spec?.headerActions?.(context)}
            onSizeChange={(size) => onSizeChange?.(item.id, size)}
            onRemove={() => onRemove?.(item.id)}
            onEditWidgets={onEditWidgets}
            onEditContent={onEditContent}
            onDragStart={(id) => setDragId(id)}
            onDragEnd={() => { setDragId(null); setOverId(null); }}
            onDragOver={(id) => setOverId(id)}
            onDrop={(fromId, toId) => {
              setDragId(null);
              setOverId(null);
              onReorder?.(fromId, toId);
            }}
          >
            {spec ? spec.render(context) : <p className="ts-case__muted">This widget is not in the catalog.</p>}
          </Widget>
        );
      })}
    </div>
  );
}
