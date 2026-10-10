import { useEffect, useState } from "react";
import Button from "../Button/Button";
import { QUEUE_DENSITY } from "../QueueGrid/queueMeta";
import "./QueueOptionsPanel.css";

function readColumns(api) {
  if (!api || api.isDestroyed?.()) return [];
  return (api.getColumns() ?? []).map((column) => ({
    id: column.getColId(),
    label: column.getColDef().headerName || column.getColId(),
    visible: column.isVisible(),
  }));
}

/** Right-hand table options: visibility, reset, and density. Community only — not the Enterprise sidebar. */
export default function QueueOptionsPanel({ api, density = "comfortable", onDensityChange, onHide }) {
  const [columns, setColumns] = useState(() => readColumns(api));

  useEffect(() => {
    if (!api) {
      setColumns([]);
      return undefined;
    }
    const refresh = () => setColumns(readColumns(api));
    refresh();
    api.addEventListener("columnVisible", refresh);
    api.addEventListener("columnMoved", refresh);
    api.addEventListener("newColumnsLoaded", refresh);
    return () => {
      if (api.isDestroyed?.()) return;
      api.removeEventListener("columnVisible", refresh);
      api.removeEventListener("columnMoved", refresh);
      api.removeEventListener("newColumnsLoaded", refresh);
    };
  }, [api]);

  function toggleColumn(id, visible) {
    api?.setColumnsVisible([id], visible);
  }

  function reset() {
    if (!api || api.isDestroyed?.()) return;
    api.resetColumnState();
    onDensityChange?.("comfortable");
  }

  return (
    <aside className="ts-queue-options" aria-label="Table options">
      <div className="ts-queue-options__head">
        <h2>Table options</h2>
        <button type="button" className="ts-queue-options__hide" onClick={onHide}>
          Hide
        </button>
      </div>

      <fieldset className="ts-queue-options__group">
        <legend>Columns</legend>
        <ul>
          {columns.map((column) => (
            <li key={column.id}>
              <label>
                <input
                  type="checkbox"
                  checked={column.visible}
                  onChange={(event) => toggleColumn(column.id, event.target.checked)}
                />
                <span>{column.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <fieldset className="ts-queue-options__group">
        <legend>Density</legend>
        <div className="ts-queue-options__density" role="radiogroup" aria-label="Row density">
          {Object.entries(QUEUE_DENSITY).map(([id, item]) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={density === id}
              onClick={() => onDensityChange?.(id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </fieldset>

      <Button size="sm" variant="secondary" onClick={reset} disabled={!api}>
        Reset columns
      </Button>
    </aside>
  );
}
