import { useEffect, useMemo, useState } from "react";
import { AllCommunityModule } from "ag-grid-community";
import { AgGridProvider, AgGridReact } from "ag-grid-react";
import { subscribeTheme } from "../../lib/theme";
import { createQueueColumnDefs } from "./queueColumnDefs";
import { QUEUE_DENSITY } from "./queueMeta";
import { buildQueueTheme } from "./queueTheme";
import "./QueueGrid.css";

const columnDefs = createQueueColumnDefs();

const defaultColDef = {
  sortable: true,
  filter: true,
  resizable: true,
  suppressMovable: false,
};

/**
 * Community grid for the review queue.
 * Sort, filter, and column move are on by default. Row activation opens the case.
 */
export default function QueueGrid({
  rows,
  quickFilter = "",
  density = "comfortable",
  productPath = false,
  onOpen,
  onReady,
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
    if (target?.closest?.("a, button")) return;
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
          rowHeight={size.rowHeight}
          headerHeight={size.headerHeight}
          getRowId={(params) => params.data.id}
          animateRows={false}
          suppressCellFocus={false}
          overlayNoRowsTemplate='<span class="ts-queue-grid__empty">No matching transactions</span>'
          onGridReady={(event) => onReady?.(event.api)}
          onRowClicked={openFromEvent}
          onCellKeyDown={(event) => {
            if (event.event?.key === "Enter") openFromEvent(event);
          }}
        />
      </div>
    </AgGridProvider>
  );
}
