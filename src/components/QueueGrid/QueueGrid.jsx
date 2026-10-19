import { useEffect, useMemo, useState } from "react";
import { AllCommunityModule } from "ag-grid-community";
import { AgGridProvider, AgGridReact } from "ag-grid-react";
import { subscribeTheme } from "../../lib/theme";
import { createQueueColumnDefs, getQueueSelectionColumnDef } from "./queueColumnDefs";
import { QUEUE_DENSITY } from "./queueMeta";
import { buildQueueTheme } from "./queueTheme";
import "./QueueGrid.css";

const columnDefs = createQueueColumnDefs();
const selectionColumnDef = getQueueSelectionColumnDef();

const defaultColDef = {
  sortable: true,
  filter: true,
  resizable: true,
  suppressMovable: false,
};

const rowSelection = {
  mode: "multiRow",
  checkboxes: true,
  headerCheckbox: true,
  enableClickSelection: false,
  selectAll: "filtered",
};

/**
 * Community grid for the review queue.
 * Sort, filter, and column move are on by default. Row activation opens the case.
 * Multi-row checkboxes live in a pinned selection column (AG Grid 36).
 */
export default function QueueGrid({
  rows,
  quickFilter = "",
  density = "comfortable",
  productPath = false,
  onOpen,
  onReady,
  onDisplayedCount,
  onSelectionChanged,
}) {
  const [theme, setTheme] = useState(buildQueueTheme);
  const size = QUEUE_DENSITY[density] ?? QUEUE_DENSITY.comfortable;
  const context = useMemo(() => ({ productPath, onOpen }), [productPath, onOpen]);

  useEffect(() => {
    const sync = () => setTheme(buildQueueTheme());
    const unsubscribe = subscribeTheme(sync);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    media.addEventListener("change", sync);
    return () => {
      unsubscribe();
      observer.disconnect();
      media.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => () => onReady?.(null), [onReady]);

  function openFromEvent(event) {
    const target = event.event?.target;
    // Ignore interactive cells and selection checkboxes so select does not open the case.
    if (target?.closest?.("a, button, input, .ag-checkbox, .ag-selection-checkbox, .ag-header-select-all")) {
      return;
    }
    if (event.column?.getColId?.() === "ag-Grid-SelectionColumn") return;
    if (event.data?.id) onOpen?.(event.data.id);
  }

  return (
    <AgGridProvider modules={[AllCommunityModule]}>
      <div className="ts-queue-grid">
        <AgGridReact
          theme={theme}
          rowData={rows}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          context={context}
          quickFilterText={quickFilter}
          includeHiddenColumnsInQuickFilter
          rowHeight={size.rowHeight}
          headerHeight={size.headerHeight}
          getRowId={(params) => params.data.id}
          animateRows={false}
          suppressCellFocus={false}
          rowSelection={rowSelection}
          selectionColumnDef={selectionColumnDef}
          overlayNoRowsTemplate='<span class="ts-queue-grid__empty">No matching transactions</span>'
          onGridReady={(event) => onReady?.(event.api)}
          onModelUpdated={(event) => onDisplayedCount?.(event.api.getDisplayedRowCount())}
          onSelectionChanged={(event) => {
            const selected = event.api.getSelectedRows() ?? [];
            onSelectionChanged?.(selected);
          }}
          onRowClicked={openFromEvent}
          onCellKeyDown={(event) => {
            if (event.event?.key === "Enter") openFromEvent(event);
          }}
        />
      </div>
    </AgGridProvider>
  );
}
