import { useEffect, useRef } from "react";
import "./Drawer.css";

/**
 * Right panel. `mode="overlay"` (default) is a fixed slide-over with scrim.
 * `mode="push"` docks beside content (no overlay) for layout placement.
 */
export default function Drawer({
  open = false,
  title = "Settings",
  onClose,
  children,
  className,
  mode = "overlay",
  ...rest
}) {
  const closeRef = useRef(null);
  const isPush = mode === "push";

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    let original;
    if (!isPush) {
      original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      if (!isPush) document.body.style.overflow = original;
      prev?.focus?.();
    };
  }, [open, onClose, isPush]);

  if (!open) return null;

  const rootClasses = ["ts-drawer", isPush ? "ts-drawer--push" : "ts-drawer--overlay"]
    .filter(Boolean)
    .join(" ");
  const panelClasses = ["ts-drawer__panel", className].filter(Boolean).join(" ");

  return (
    <div className={rootClasses} {...rest}>
      {!isPush ? (
        <button
          type="button"
          className="ts-drawer__overlay"
          aria-label="Close drawer"
          onClick={onClose}
        />
      ) : null}
      <aside
        className={panelClasses}
        role="dialog"
        aria-modal={!isPush}
        aria-label={title}
      >
        <div className="ts-drawer__head">
          <h2 className="ts-drawer__title">{title}</h2>
          <button
            ref={closeRef}
            type="button"
            className="ts-drawer__close"
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="ts-drawer__body">{children}</div>
      </aside>
    </div>
  );
}
