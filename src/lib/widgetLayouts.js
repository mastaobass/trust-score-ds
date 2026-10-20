/** Saved widget layout presets for Case Detail. Mirrors queueViews.js persistence. */

export const WIDGET_LAYOUT_KEY = "ts-case-widget-layout";

/** Allowed sticky sizes: colSpan ∈ {1,2}, rowSpan ∈ {1,2}. */
export const WIDGET_SIZES = [
  { colSpan: 1, rowSpan: 1, label: "1×1" },
  { colSpan: 1, rowSpan: 2, label: "1×2" },
  { colSpan: 2, rowSpan: 1, label: "2×1" },
  { colSpan: 2, rowSpan: 2, label: "2×2" },
];

/**
 * Presets. Shape: `{ id, label, items: [{ id, column, row, colSpan, rowSpan }] }`.
 * Default pins Score Hero (trust-score) at column 4, 1×1.
 */
export const WIDGET_LAYOUTS = [
  {
    id: "default",
    label: "Default",
    items: [{ id: "trust-score", column: 4, row: 1, colSpan: 1, rowSpan: 1 }],
  },
  {
    id: "wide-score",
    label: "Wide score",
    items: [{ id: "trust-score", column: 3, row: 1, colSpan: 2, rowSpan: 2 }],
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

/** Deep-clone items for a layout so callers can mutate without touching presets. */
export function applyWidgetLayout(id) {
  const layout = getWidgetLayout(id);
  return {
    id: layout.id,
    label: layout.label,
    items: layout.items.map((item) => ({ ...item })),
  };
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
