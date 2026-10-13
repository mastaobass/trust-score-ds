/** Seeded merchant column presets for the Case Queue. Columns only — no row filtering. */

export const QUEUE_VIEW_KEY = "ts-queue-view";

/** All queue colIds from createQueueColumnDefs(), in default order. */
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

/**
 * Merchant presets derived from names already present in QUEUE.
 * `visibleColIds` is the source of truth when the preset is applied;
 * optional `order` reorders columns when present.
 */
export const QUEUE_VIEWS = [
  {
    id: "northwind-outfitters",
    label: "Northwind Outfitters",
    visibleColIds: ["merchant", "id", "amount", "payment", "score", "status", "time", "open"],
  },
  {
    id: "harbor-co",
    label: "Harbor & Co",
    visibleColIds: ["merchant", "id", "amount", "score", "status", "open"],
    order: ["merchant", "id", "amount", "score", "status", "open", "payment", "time"],
  },
  {
    id: "atlas-provisions",
    label: "Atlas Provisions",
    visibleColIds: ["merchant", "id", "amount", "status", "time", "open"],
    order: ["merchant", "id", "amount", "status", "time", "open", "payment", "score"],
  },
  {
    id: "lumen-digital",
    label: "Lumen Digital",
    visibleColIds: ["merchant", "id", "amount", "payment", "score", "status", "open"],
    order: ["merchant", "id", "score", "amount", "payment", "status", "open", "time"],
  },
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

/** Apply a preset’s visibility (and optional order) via AG Grid Community column state. */
export function applyQueueView(api, viewId) {
  if (!api || api.isDestroyed?.()) return null;
  const view = getQueueView(viewId);
  const visible = new Set(view.visibleColIds);
  const orderedIds = view.order ?? QUEUE_COL_IDS;
  const state = orderedIds.map((colId) => ({
    colId,
    hide: !visible.has(colId),
  }));
  // Include any colIds missing from order so nothing is left unstated.
  for (const colId of QUEUE_COL_IDS) {
    if (!orderedIds.includes(colId)) {
      state.push({ colId, hide: !visible.has(colId) });
    }
  }
  api.applyColumnState({ state, applyOrder: Boolean(view.order) });
  return view.id;
}
