import { useEffect, useRef } from "react";
import "./Drawer.css";

/**
 * Right slide-over panel with overlay. Esc / overlay / close dismiss.
 * Pattern sibling to queue options — overlay instead of a docked aside.
 */
export default function Drawer({
  open = false,
  title = "Settings",
  onClose,
  children,
  className,
  ...rest
}) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = original;
      prev?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  const panelClasses = ["ts-drawer__panel", className].filter(Boolean).join(" ");

  return (
    <div className="ts-drawer" {...rest}>
      <button
        type="button"
        className="ts-drawer__overlay"
        aria-label="Close drawer"
        onClick={onClose}
      />
      <aside
        className={panelClasses}
        role="dialog"
        aria-modal="true"
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
