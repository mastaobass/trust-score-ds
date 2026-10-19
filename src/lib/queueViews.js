/** Merchant filter presets for the Case Queue. All vs single-merchant; columns + row filter. */

export const QUEUE_VIEW_KEY = "ts-queue-view";

/** AG Grid Community selection column id — never hide via applyQueueView. */
export const QUEUE_SELECT_COL_ID = "ag-Grid-SelectionColumn";

/** Data column ids from createQueueColumnDefs(), in the All-view default order. */
export const QUEUE_COL_IDS = [
  "merchant",
  "id",
  "amount",
  "payment",
  "score",
  "status",
  "time",
  "open",
];

/** Order when a single merchant is selected: Order first, Merchant hidden. */
const MERCHANT_ORDER = ["id", "amount", "payment", "score", "status", "time", "open", "merchant"];

/**
 * Merchant filter options. `all` shows every row + Merchant column;
 * other ids filter rows to that merchant and hide Merchant.
 */
export const QUEUE_VIEWS = [
  { id: "all", label: "All" },
  { id: "northwind-outfitters", label: "Northwind Outfitters" },
  { id: "harbor-co", label: "Harbor & Co" },
  { id: "atlas-provisions", label: "Atlas Provisions" },
  { id: "lumen-digital", label: "Lumen Digital" },
];

export function getQueueView(id) {
  return QUEUE_VIEWS.find((view) => view.id === id) ?? QUEUE_VIEWS[0];
}

export function getStoredQueueViewId() {
  try {
    const stored = localStorage.getItem(QUEUE_VIEW_KEY);
    if (QUEUE_VIEWS.some((view) => view.id === stored)) return stored;
  } catch {
    /* private mode */
  }
  return QUEUE_VIEWS[0].id;
}

export function setStoredQueueViewId(id) {
  const view = getQueueView(id);
  try {
    localStorage.setItem(QUEUE_VIEW_KEY, view.id);
  } catch {
    /* private mode */
  }
  return view.id;
}

/** Rows for the current merchant filter (All = unfiltered). */
export function filterQueueRows(rows, viewId) {
  const view = getQueueView(viewId);
  if (view.id === "all") return rows;
  return rows.filter((row) => row.merchant === view.label);
}

/**
 * Apply All vs merchant column layout via AG Grid Community column state.
 * Selection column stays visible and pinned; never listed as hideable data.
 */
export function applyQueueView(api, viewId) {
  if (!api || api.isDestroyed?.()) return null;
  const view = getQueueView(viewId);
  const isAll = view.id === "all";
  const orderedIds = isAll ? QUEUE_COL_IDS : MERCHANT_ORDER;
  const state = orderedIds.map((colId) => ({
    colId,
    hide: !isAll && colId === "merchant",
  }));
  // Keep the pinned selection column visible regardless of merchant filter.
  state.unshift({ colId: QUEUE_SELECT_COL_ID, hide: false });
  api.applyColumnState({ state, applyOrder: true });
  return view.id;
}
