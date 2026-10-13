import { useEffect, useState } from "react";

export const CASE_LAYOUTS_KEY = "ts-case-layouts";

export const WIDGET_SIZES = [
  { id: "small", label: "Small", colSpan: 1, rowSpan: 1 },
  { id: "medium", label: "Medium", colSpan: 2, rowSpan: 1 },
  { id: "large", label: "Large", colSpan: 2, rowSpan: 2 },
  { id: "xlPortrait", label: "Extra Large Portrait", colSpan: 1, rowSpan: 2 },
];

const SIZE_IDS = WIDGET_SIZES.map((size) => size.id);

export function spanFor(size) {
  return WIDGET_SIZES.find((entry) => entry.id === size) ?? WIDGET_SIZES[0];
}

export function defaultLayoutItems() {
  return [
    { id: "omniscore", contentType: "omniscore", size: "small" },
    { id: "order", contentType: "order", size: "medium" },
    { id: "reversals", contentType: "reversals", size: "small" },
    { id: "persona", contentType: "persona", size: "medium" },
    { id: "payment", contentType: "payment", size: "medium" },
    { id: "network", contentType: "network", size: "medium" },
    { id: "velocities", contentType: "velocities", size: "medium" },
    { id: "identity", contentType: "identity", size: "medium" },
    { id: "policies", contentType: "policies", size: "medium" },
    { id: "history", contentType: "history", size: "medium" },
    { id: "shopping-cart", contentType: "shoppingCart", size: "small" },
    { id: "ekata", contentType: "ekata", size: "small" },
  ];
}

function withOrder(items) {
  return items.map((item, order) => ({ ...item, order }));
}

export function seedCaseLayouts() {
  return {
    activeId: "case-overview",
    layouts: [
      {
        id: "case-overview",
        name: "Case overview",
        items: withOrder(defaultLayoutItems()),
      },
    ],
  };
}

function normalizeItem(raw, index) {
  if (!raw || typeof raw.id !== "string" || typeof raw.contentType !== "string") return null;
  const size = SIZE_IDS.includes(raw.size) ? raw.size : "small";
  const order = Number.isFinite(raw.order) ? raw.order : index;
  return { id: raw.id, contentType: raw.contentType, size, order };
}

function normalizeState(raw) {
  if (!raw || !Array.isArray(raw.layouts) || raw.layouts.length === 0) return seedCaseLayouts();
  const layouts = raw.layouts
    .map((layout) => {
      if (!layout || typeof layout.id !== "string" || typeof layout.name !== "string") return null;
      const items = withOrder(
        (Array.isArray(layout.items) ? layout.items : [])
          .map(normalizeItem)
          .filter(Boolean)
          .sort((a, b) => a.order - b.order),
      );
      return { id: layout.id, name: layout.name, items };
    })
    .filter(Boolean);
  if (layouts.length === 0) return seedCaseLayouts();
  const activeId = layouts.some((layout) => layout.id === raw.activeId) ? raw.activeId : layouts[0].id;
  return { activeId, layouts };
}

export function loadCaseLayouts() {
  try {
    const stored = localStorage.getItem(CASE_LAYOUTS_KEY);
    if (!stored) return seedCaseLayouts();
    return normalizeState(JSON.parse(stored));
  } catch {
    return seedCaseLayouts();
  }
}

export function saveCaseLayouts(state) {
  try {
    localStorage.setItem(CASE_LAYOUTS_KEY, JSON.stringify(state));
  } catch {
    /* private mode */
  }
}

export function useCaseLayouts() {
  const [state, setState] = useState(loadCaseLayouts);

  useEffect(() => {
    saveCaseLayouts(state);
  }, [state]);

  const active = state.layouts.find((layout) => layout.id === state.activeId) ?? state.layouts[0];

  function updateActive(mutator) {
    setState((curr) => ({
      ...curr,
      layouts: curr.layouts.map((layout) => (layout.id === curr.activeId ? mutator(layout) : layout)),
    }));
  }

  return {
    layouts: state.layouts,
    active,
    select(id) {
      setState((curr) => (curr.layouts.some((layout) => layout.id === id) ? { ...curr, activeId: id } : curr));
    },
    create(name) {
      const id = `layout-${Date.now()}`;
      setState((curr) => {
        const source = curr.layouts.find((layout) => layout.id === curr.activeId);
        const next = {
          id,
          name: name.trim() || "Untitled layout",
          items: withOrder((source?.items ?? defaultLayoutItems()).map((item) => ({ ...item }))),
        };
        return { activeId: id, layouts: [...curr.layouts, next] };
      });
    },
    rename(id, name) {
      const trimmed = name.trim();
      if (!trimmed) return;
      setState((curr) => ({
        ...curr,
        layouts: curr.layouts.map((layout) => (layout.id === id ? { ...layout, name: trimmed } : layout)),
      }));
    },
    remove(id) {
      setState((curr) => {
        if (curr.layouts.length <= 1) return curr;
        const layouts = curr.layouts.filter((layout) => layout.id !== id);
        return { activeId: curr.activeId === id ? layouts[0].id : curr.activeId, layouts };
      });
    },
    reorder(fromId, toId) {
      if (!fromId || !toId || fromId === toId) return;
      updateActive((layout) => {
        const items = [...layout.items];
        const from = items.findIndex((item) => item.id === fromId);
        const to = items.findIndex((item) => item.id === toId);
        if (from < 0 || to < 0) return layout;
        const [moved] = items.splice(from, 1);
        items.splice(to, 0, moved);
        return { ...layout, items: withOrder(items) };
      });
    },
    setSize(id, size) {
      if (!SIZE_IDS.includes(size)) return;
      updateActive((layout) => ({
        ...layout,
        items: layout.items.map((item) => (item.id === id ? { ...item, size } : item)),
      }));
    },
    removeItem(id) {
      updateActive((layout) => ({
        ...layout,
        items: withOrder(layout.items.filter((item) => item.id !== id)),
      }));
    },
    addItem(contentType, size = "small") {
      const nextSize = SIZE_IDS.includes(size) ? size : "small";
      updateActive((layout) => ({
        ...layout,
        items: withOrder([
          ...layout.items,
          { id: `${contentType}-${Date.now()}`, contentType, size: nextSize },
        ]),
      }));
    },
  };
}
