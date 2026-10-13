import { useEffect, useId, useRef, useState } from "react";
import { WIDGET_SIZES, spanFor } from "../../lib/caseLayouts";
import "./Widget.css";

function CheckIcon() {
  return (
    <svg className="ts-widget__check" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path d="M3.5 8.5 6.5 11.5 12.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 7.2V11.2M8 5.1v.6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Content-agnostic widget chrome. Size controls the grid span; children are the body.
 */
export default function Widget({
  id,
  title,
  size = "small",
  editMode = false,
  obscureContent,
  info,
  headerActions,
  onSizeChange,
  onRemove,
  onEditWidgets,
  onEditContent,
  draggable = false,
  dragging = false,
  dropTarget = false,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  children,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const rootRef = useRef(null);
  const menuId = useId();
  const obscured = obscureContent ?? editMode;
  const span = spanFor(size);

  useEffect(() => {
    if (!editMode) setMenuOpen(false);
  }, [editMode]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    function onKey(event) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    function onPointer(event) {
      if (!rootRef.current?.contains(event.target)) setMenuOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [menuOpen]);

  function chooseSize(next) {
    setMenuOpen(false);
    onSizeChange?.(next);
  }

  return (
    <article
      ref={rootRef}
      id={id ? `case-widget-${id}` : undefined}
      className={[
        "ts-widget",
        `ts-widget--${size}`,
        editMode ? "ts-widget--edit" : "",
        obscured ? "ts-widget--obscure" : "",
        dragging ? "ts-widget--dragging" : "",
        dropTarget ? "ts-widget--over" : "",
        menuOpen ? "ts-widget--menu" : "",
      ].filter(Boolean).join(" ")}
      style={{ "--ts-widget-col": span.colSpan, "--ts-widget-row": span.rowSpan }}
      data-size={size}
      aria-label={title}
      onDragOver={(event) => {
        if (!draggable) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        onDragOver?.(id);
      }}
      onDrop={(event) => {
        if (!draggable) return;
        event.preventDefault();
        onDrop?.(event.dataTransfer.getData("text/plain"), id);
      }}
    >
      <header
        className="ts-widget__header"
        draggable={draggable}
        onDragStart={(event) => {
          if (event.target.closest("button")) {
            event.preventDefault();
            return;
          }
          event.dataTransfer.setData("text/plain", id ?? "");
          event.dataTransfer.effectAllowed = "move";
          onDragStart?.(id);
        }}
        onDragEnd={() => onDragEnd?.()}
      >
        <h2 className="ts-widget__title">{title}</h2>
        <div className="ts-widget__actions">
          {headerActions}
          {info ? (
            <button type="button" className="ts-widget__icon-btn" aria-label={`About ${title}`} title={info}>
              <InfoIcon />
            </button>
          ) : null}
          {editMode ? (
            <button
              type="button"
              className="ts-widget__edit"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              onClick={() => setMenuOpen((open) => !open)}
            >
              Edit
            </button>
          ) : null}
        </div>
      </header>
      {menuOpen ? (
        <div className="ts-widget__menu" id={menuId} role="menu" aria-label={`${title} options`}>
          <button type="button" role="menuitem" className="ts-widget__menu-item" onClick={() => { setMenuOpen(false); onEditContent?.(); }}>
            Edit…
          </button>
          <p className="ts-widget__menu-label">Size</p>
          {WIDGET_SIZES.map((option) => {
            const selected = option.id === size;
            return (
              <button
                key={option.id}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                className={`ts-widget__menu-item${selected ? " ts-widget__menu-item--selected" : ""}`}
                onClick={() => chooseSize(option.id)}
              >
                <span>{option.label}</span>
                {selected ? <CheckIcon /> : <span className="ts-widget__check ts-widget__check--empty" />}
              </button>
            );
          })}
          <button
            type="button"
            role="menuitem"
            className="ts-widget__menu-item"
            onClick={() => { setMenuOpen(false); onRemove?.(); }}
          >
            Remove Widget
          </button>
          <button
            type="button"
            role="menuitem"
            className="ts-widget__menu-item"
            onClick={() => { setMenuOpen(false); onEditWidgets?.(); }}
          >
            Edit Widgets…
          </button>
        </div>
      ) : null}
      <div className="ts-widget__body">{children}</div>
    </article>
  );
}
