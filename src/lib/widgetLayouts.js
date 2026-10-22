/** Saved widget layout presets for Case Detail. Mirrors queueViews.js persistence. */

export const WIDGET_LAYOUT_KEY = "ts-case-widget-layout";
export const WIDGET_LAYOUT_ITEMS_KEY = "ts-case-widget-layout-items";

/** Allowed sticky sizes: colSpan ∈ {1,2}, rowSpan ∈ {1,2}. */
export const WIDGET_SIZES = [
  { colSpan: 1, rowSpan: 1, label: "1×1" },
  { colSpan: 1, rowSpan: 2, label: "1×2" },
  { colSpan: 2, rowSpan: 1, label: "2×1" },
  { colSpan: 2, rowSpan: 2, label: "2×2" },
];

/** Registered Case Detail widget ids (renderer lives on CaseDetail). */
export const CASE_WIDGET_IDS = [
  "trust-score",
  "case-history",
  "sos",
  "network",
  "payment",
  "velocities",
  "identity",
  "transaction",
  "policies",
  "custom-fields",
  "email-insights",
  "order-history",
  "shopping-cart",
  "comparisons",
];

/**
 * Add-widget catalog for Case Detail drawer. Titles match widget headers;
 * all under Payments. Spans match Default preset defaults (or mock weight).
 */
export const CASE_WIDGET_CATALOG = [
  { id: "trust-score", title: "Trust score", category: "Payments", defaultColSpan: 1, defaultRowSpan: 1 },
  { id: "case-history", title: "Case history", category: "Payments", defaultColSpan: 2, defaultRowSpan: 1 },
  { id: "sos", title: "SOS", category: "Payments", defaultColSpan: 1, defaultRowSpan: 1 },
  { id: "network", title: "Across the network", category: "Payments", defaultColSpan: 1, defaultRowSpan: 1 },
  { id: "payment", title: "Payment", category: "Payments", defaultColSpan: 2, defaultRowSpan: 1 },
  { id: "velocities", title: "Velocities", category: "Payments", defaultColSpan: 2, defaultRowSpan: 1 },
  { id: "identity", title: "Identity check", category: "Payments", defaultColSpan: 2, defaultRowSpan: 1 },
  { id: "transaction", title: "Transaction info", category: "Payments", defaultColSpan: 2, defaultRowSpan: 1 },
  { id: "policies", title: "Policies triggered", category: "Payments", defaultColSpan: 2, defaultRowSpan: 1 },
  { id: "custom-fields", title: "Custom fields", category: "Payments", defaultColSpan: 2, defaultRowSpan: 1 },
  { id: "email-insights", title: "Email insights", category: "Payments", defaultColSpan: 1, defaultRowSpan: 1 },
  { id: "order-history", title: "Order history", category: "Payments", defaultColSpan: 2, defaultRowSpan: 2 },
  { id: "shopping-cart", title: "Shopping cart", category: "Payments", defaultColSpan: 2, defaultRowSpan: 1 },
  { id: "comparisons", title: "Comparisons", category: "Payments", defaultColSpan: 1, defaultRowSpan: 1 },
];

/**
 * Presets. Shape: `{ id, label, items: [{ id, column, row, colSpan, rowSpan }] }`.
 * Default fills the 4×6 grid without the APP-oriented banner strip.
 */
export const WIDGET_LAYOUTS = [
  {
    id: "default",
    label: "Default",
    items: [
      { id: "case-history", column: 1, row: 1, colSpan: 2, rowSpan: 1 },
      { id: "sos", column: 3, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "trust-score", column: 4, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "payment", column: 1, row: 2, colSpan: 2, rowSpan: 1 },
      { id: "network", column: 3, row: 2, colSpan: 1, rowSpan: 1 },
      { id: "velocities", column: 1, row: 3, colSpan: 2, rowSpan: 1 },
      { id: "identity", column: 3, row: 3, colSpan: 2, rowSpan: 1 },
      { id: "transaction", column: 1, row: 4, colSpan: 2, rowSpan: 1 },
      { id: "policies", column: 3, row: 4, colSpan: 2, rowSpan: 1 },
    ],
  },
  {
    id: "wide-score",
    label: "Wide score",
    items: [
      { id: "trust-score", column: 3, row: 1, colSpan: 2, rowSpan: 2 },
      { id: "case-history", column: 1, row: 1, colSpan: 2, rowSpan: 1 },
      { id: "sos", column: 1, row: 2, colSpan: 1, rowSpan: 1 },
      { id: "network", column: 2, row: 2, colSpan: 1, rowSpan: 1 },
      { id: "payment", column: 1, row: 3, colSpan: 2, rowSpan: 1 },
      { id: "velocities", column: 3, row: 3, colSpan: 2, rowSpan: 1 },
      { id: "identity", column: 1, row: 4, colSpan: 2, rowSpan: 1 },
      { id: "transaction", column: 3, row: 4, colSpan: 2, rowSpan: 1 },
      { id: "policies", column: 1, row: 5, colSpan: 2, rowSpan: 1 },
    ],
  },
  {
    id: "compact",
    label: "Compact",
    items: [
      { id: "trust-score", column: 4, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "sos", column: 1, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "network", column: 2, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "payment", column: 3, row: 1, colSpan: 1, rowSpan: 1 },
      { id: "case-history", column: 1, row: 2, colSpan: 2, rowSpan: 1 },
      { id: "velocities", column: 3, row: 2, colSpan: 2, rowSpan: 1 },
      { id: "identity", column: 1, row: 3, colSpan: 2, rowSpan: 1 },
      { id: "transaction", column: 3, row: 3, colSpan: 2, rowSpan: 1 },
      { id: "policies", column: 1, row: 4, colSpan: 2, rowSpan: 1 },
    ],
  },
];

export function getWidgetLayout(id) {
  return WIDGET_LAYOUTS.find((layout) => layout.id === id) ?? WIDGET_LAYOUTS[0];
}

export function getStoredWidgetLayoutId() {
  try {
    const stored = localStorage.getItem(WIDGET_LAYOUT_KEY);
    if (WIDGET_LAYOUTS.some((layout) => layout.id === stored)) return stored;
  } catch {
    /* private mode */
  }
  return WIDGET_LAYOUTS[0].id;
}

export function setStoredWidgetLayoutId(id) {
  const layout = getWidgetLayout(id);
  try {
    localStorage.setItem(WIDGET_LAYOUT_KEY, layout.id);
  } catch {
    /* private mode */
  }
  return layout.id;
}

function normalizeLayoutItems(items) {
  if (!Array.isArray(items)) return null;
  const normalized = items
    .filter((item) => item && typeof item.id === "string")
    .map((item) => ({
      id: item.id,
      column: Math.max(1, Number(item.column) || 1),
      row: Math.max(1, Number(item.row) || 1),
      colSpan: clampWidgetSpan(item.colSpan, 1),
      rowSpan: clampWidgetSpan(item.rowSpan, 1),
    }));
  return normalized.length ? normalized : null;
}

/** Per-preset item overrides (size + position) keyed by layout id. */
export function getStoredWidgetLayoutItems(layoutId) {
  try {
    const raw = localStorage.getItem(WIDGET_LAYOUT_ITEMS_KEY);
    if (!raw) return null;
    const all = JSON.parse(raw);
    return normalizeLayoutItems(all?.[layoutId]);
  } catch {
    return null;
  }
}

export function setStoredWidgetLayoutItems(layoutId, items) {
  const normalized = normalizeLayoutItems(items);
  if (!normalized) return;
  try {
    const raw = localStorage.getItem(WIDGET_LAYOUT_ITEMS_KEY);
    const all = raw ? JSON.parse(raw) : {};
    all[layoutId] = normalized;
    localStorage.setItem(WIDGET_LAYOUT_ITEMS_KEY, JSON.stringify(all));
  } catch {
    /* private mode */
  }
}

/** Deep-clone items for a layout so callers can mutate without touching presets. */
export function applyWidgetLayout(id) {
  const layout = getWidgetLayout(id);
  return {
    id: layout.id,
    label: layout.label,
    items: layout.items.map((item) => ({ ...item })),
  };
}

/** Load preset, overlaying any persisted item customizations for that id. */
export function loadWidgetLayout(id) {
  const base = applyWidgetLayout(id);
  const custom = getStoredWidgetLayoutItems(base.id);
  if (custom) {
    return { ...base, items: custom };
  }
  return base;
}

/** Clamp a span to 1|2. */
export function clampWidgetSpan(value, fallback = 1) {
  const n = Number(value);
  return n === 2 ? 2 : n === 1 ? 1 : fallback;
}

/**
 * Snap measured pixel size to nearest allowed { colSpan, rowSpan }
 * given column / row track sizes.
 */
export function snapWidgetSize(widthPx, heightPx, colTrackPx, rowTrackPx) {
  const colSpan = widthPx / Math.max(1, colTrackPx) >= 1.5 ? 2 : 1;
  const rowSpan = heightPx / Math.max(1, rowTrackPx) >= 1.5 ? 2 : 1;
  return { colSpan, rowSpan };
}

/** Clamp start cell so span fits within cols × maxRows. */
export function clampWidgetOrigin(column, row, colSpan, rowSpan, cols = 4, maxRows = 6) {
  const cs = clampWidgetSpan(colSpan);
  const rs = clampWidgetSpan(rowSpan);
  const maxCol = Math.max(1, cols - cs + 1);
  const maxRow = Math.max(1, maxRows - rs + 1);
  return {
    column: Math.min(Math.max(1, Number(column) || 1), maxCol),
    row: Math.min(Math.max(1, Number(row) || 1), maxRow),
    colSpan: cs,
    rowSpan: rs,
  };
}

export function rectsOverlap(a, b) {
  const aColEnd = a.column + a.colSpan - 1;
  const aRowEnd = a.row + a.rowSpan - 1;
  const bColEnd = b.column + b.colSpan - 1;
  const bRowEnd = b.row + b.rowSpan - 1;
  return !(aColEnd < b.column || bColEnd < a.column || aRowEnd < b.row || bRowEnd < a.row);
}

/**
 * Scan row-major for the first origin that fits colSpan×rowSpan without
 * overlapping any existing item (after clampWidgetOrigin).
 */
export function findNextFreeCell(items, { colSpan = 1, rowSpan = 1 } = {}, cols = 4, maxRows = 6) {
  const cs = clampWidgetSpan(colSpan);
  const rs = clampWidgetSpan(rowSpan);
  const maxCol = Math.max(1, cols - cs + 1);
  const maxRow = Math.max(1, maxRows - rs + 1);
  for (let row = 1; row <= maxRow; row += 1) {
    for (let column = 1; column <= maxCol; column += 1) {
      const candidate = clampWidgetOrigin(column, row, cs, rs, cols, maxRows);
      const overlaps = (items ?? []).some((item) => rectsOverlap(candidate, item));
      if (!overlaps) return candidate;
    }
  }
  return null;
}

/**
 * Append a catalog entry at the next free cell. No-op (returns items) if the
 * id is already present or no free cell fits.
 */
export function addWidgetItem(items, catalogEntry, cols = 4, maxRows = 6) {
  if (!catalogEntry?.id) return items;
  const list = items ?? [];
  if (list.some((item) => item.id === catalogEntry.id)) return list;
  const cell = findNextFreeCell(
    list,
    {
      colSpan: catalogEntry.defaultColSpan ?? 1,
      rowSpan: catalogEntry.defaultRowSpan ?? 1,
    },
    cols,
    maxRows,
  );
  if (!cell) return list;
  return [...list, { id: catalogEntry.id, ...cell }];
}

/** Remove a widget by id. Returns items unchanged if id is absent. */
export function removeWidgetItem(items, widgetId) {
  if (!widgetId) return items ?? [];
  return (items ?? []).filter((item) => item.id !== widgetId);
}

/**
 * Move widget to column/row (spans kept). On overlap, swap start cells with
 * the colliding widget; otherwise place in the clamped cell.
 */
export function moveWidgetItem(items, widgetId, column, row, cols = 4, maxRows = 6) {
  const idx = items.findIndex((item) => item.id === widgetId);
  if (idx < 0) return items;
  const moving = items[idx];
  const next = {
    ...moving,
    ...clampWidgetOrigin(column, row, moving.colSpan, moving.rowSpan, cols, maxRows),
  };
  const collision = items.find((item, j) => j !== idx && rectsOverlap(next, item));
  return items.map((item, j) => {
    if (j === idx) return next;
    if (collision && item.id === collision.id) {
      return { ...item, column: moving.column, row: moving.row };
    }
    return item;
  });
}

/** Map pointer position inside a WidgetGrid element to 1-based column/row. */
export function pointerToGridCell(clientX, clientY, gridEl, cols = 4, maxRows = 6) {
  const rect = gridEl.getBoundingClientRect();
  const styles = getComputedStyle(gridEl);
  const gap = parseFloat(styles.gap) || 12;
  const gridCols = Number(styles.getPropertyValue("--wg-cols")) || cols;
  const usedRows = Number(styles.getPropertyValue("--wg-used-rows")) || maxRows;
  const colTrack = (rect.width - gap * (gridCols - 1)) / gridCols;
  const rowTrack = (rect.height - gap * (usedRows - 1)) / Math.max(1, usedRows);
  const strideCol = colTrack + gap;
  const strideRow = rowTrack + gap;
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const column = Math.min(gridCols, Math.max(1, Math.floor(x / strideCol) + 1));
  const row = Math.min(maxRows, Math.max(1, Math.floor(y / strideRow) + 1));
  return { column, row, cols: gridCols };
}
