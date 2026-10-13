import { useEffect, useId, useState } from "react";
import Button from "../Button/Button";
import "./LayoutDrawer.css";

/** Settings drawer: content catalog, saved layouts, and edit mode. */
export default function LayoutDrawer({
  open,
  onClose,
  layouts,
  activeId,
  editMode,
  catalog,
  onSelect,
  onCreate,
  onRename,
  onDelete,
  onAdd,
  onEditModeChange,
}) {
  const titleId = useId();
  const [name, setName] = useState("");
  const [renaming, setRenaming] = useState(null);

  useEffect(() => {
    if (!open) return undefined;
    function onKey(event) {
      if (event.key === "Escape") onClose?.();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="ts-layout-drawer">
      <button type="button" className="ts-layout-drawer__backdrop" aria-label="Close settings" onClick={onClose} />
      <aside className="ts-layout-drawer__panel" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <header className="ts-layout-drawer__header">
          <h2 id={titleId} className="ts-layout-drawer__title">Settings</h2>
          <button type="button" className="ts-layout-drawer__close" onClick={onClose} aria-label="Close">
            Close
          </button>
        </header>
        <div className="ts-layout-drawer__body">
          <section>
            <h3 className="ts-layout-drawer__label">Edit</h3>
            <Button variant={editMode ? "accent" : "secondary"} size="sm" onClick={() => onEditModeChange?.(!editMode)}>
              {editMode ? "Done editing" : "Edit widgets"}
            </Button>
            <p className="ts-layout-drawer__hint">Edit mode obscures widget content so the layout can be rearranged.</p>
          </section>
          <section>
            <h3 className="ts-layout-drawer__label">Content catalog</h3>
            <ul className="ts-layout-drawer__catalog">
              {catalog.map((entry) => (
                <li key={entry.contentType}>
                  <span>{entry.label}</span>
                  <Button size="sm" variant="secondary" onClick={() => onAdd?.(entry.contentType, entry.defaultSize)}>
                    Add
                  </Button>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="ts-layout-drawer__label">Saved layouts</h3>
            <ul className="ts-layout-drawer__layouts">
              {layouts.map((layout) => {
                const selected = layout.id === activeId;
                return (
                  <li key={layout.id}>
                    {renaming === layout.id ? (
                      <form
                        className="ts-layout-drawer__rename"
                        onSubmit={(event) => {
                          event.preventDefault();
                          const next = new FormData(event.currentTarget).get("name");
                          onRename?.(layout.id, String(next ?? ""));
                          setRenaming(null);
                        }}
                      >
                        <input name="name" defaultValue={layout.name} aria-label={`Rename ${layout.name}`} autoFocus />
                        <Button size="sm" variant="accent" type="submit">Save</Button>
                      </form>
                    ) : (
                      <>
                        <button
                          type="button"
                          className={`ts-layout-drawer__layout${selected ? " ts-layout-drawer__layout--selected" : ""}`}
                          aria-pressed={selected}
                          onClick={() => onSelect?.(layout.id)}
                        >
                          {layout.name}
                        </button>
                        <Button size="sm" variant="ghost" onClick={() => setRenaming(layout.id)}>Rename</Button>
                        <Button size="sm" variant="ghost" disabled={layouts.length <= 1} onClick={() => onDelete?.(layout.id)}>
                          Delete
                        </Button>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
            <form
              className="ts-layout-drawer__create"
              onSubmit={(event) => {
                event.preventDefault();
                onCreate?.(name);
                setName("");
              }}
            >
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Layout name"
                aria-label="New layout name"
              />
              <Button size="sm" variant="accent" type="submit" disabled={!name.trim()}>
                Save current
              </Button>
            </form>
          </section>
        </div>
      </aside>
    </div>
  );
}
