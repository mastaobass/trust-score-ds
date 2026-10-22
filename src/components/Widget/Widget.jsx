import { useEffect, useId, useRef, useState } from "react";
import { pointerToGridCell, snapWidgetSize, WIDGET_SIZES } from "../../lib/widgetLayouts";
import "./Widget.css";

function CogIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852 1.01 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GripIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="9" cy="7" r="1.5" />
      <circle cx="15" cy="7" r="1.5" />
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <circle cx="9" cy="17" r="1.5" />
      <circle cx="15" cy="17" r="1.5" />
    </svg>
  );
}

/**
 * Raised chrome for dashboard / case widgets.
 * Optional title + settings gear (size toggles + move handle) and snap resize handle.
 * 4∶3 aspect only when colSpan===1 && rowSpan===1 (or className forces it).
 */
export default function Widget({
  title,
  children,
  className,
  "aria-label": ariaLabel,
  colSpan = 1,
  rowSpan = 1,
  resizable = false,
  onSizeChange,
  onPositionChange,
  onPositionPreview,
  showSettings = Boolean(onSizeChange || onPositionChange),
  ...rest
}) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [moving, setMoving] = useState(false);
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const gearRef = useRef(null);
  const dragRef = useRef(null);
  const moveRef = useRef(null);
  const panelId = useId();

  const isRatio = Number(colSpan) === 1 && Number(rowSpan) === 1;
  const classes = [
    "ts-widget",
    isRatio ? "ts-widget--ratio" : "ts-widget--fill",
    moving ? "ts-widget--moving" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const label = title ? undefined : ariaLabel;

  useEffect(() => {
    if (!settingsOpen) return undefined;
    const onPointer = (e) => {
      const t = e.target;
      if (panelRef.current?.contains(t) || gearRef.current?.contains(t)) return;
      setSettingsOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setSettingsOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [settingsOpen]);

  function emitSize(next) {
    onSizeChange?.({
      colSpan: next.colSpan,
      rowSpan: next.rowSpan,
    });
  }

  function readTrackSizes() {
    const grid = rootRef.current?.closest(".ts-widget-grid");
    if (!grid) {
      const rect = rootRef.current?.getBoundingClientRect();
      return {
        colTrack: (rect?.width ?? 160) / Math.max(1, Number(colSpan) || 1),
        rowTrack: (rect?.height ?? 120) / Math.max(1, Number(rowSpan) || 1),
      };
    }
    const styles = getComputedStyle(grid);
    const gap = parseFloat(styles.gap) || 12;
    const cols = Number(styles.getPropertyValue("--wg-cols")) || 4;
    const rows = Number(styles.getPropertyValue("--wg-used-rows")) || 6;
    const gridRect = grid.getBoundingClientRect();
    const colTrack = (gridRect.width - gap * (cols - 1)) / cols;
    const rowTrack = (gridRect.height - gap * (rows - 1)) / Math.max(1, rows);
    return { colTrack, rowTrack };
  }

  function onResizePointerDown(e) {
    if (!resizable || !onSizeChange) return;
    e.preventDefault();
    e.stopPropagation();
    const el = rootRef.current;
    if (!el) return;
    const startRect = el.getBoundingClientRect();
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startW: startRect.width,
      startH: startRect.height,
    };
    el.setPointerCapture?.(e.pointerId);
    el.classList.add("ts-widget--resizing");
  }

  function onResizePointerMove(e) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    const el = rootRef.current;
    if (!el) return;
    const nextW = Math.max(80, drag.startW + (e.clientX - drag.startX));
    const nextH = Math.max(60, drag.startH + (e.clientY - drag.startY));
    el.style.width = `${nextW}px`;
    el.style.height = `${nextH}px`;
    el.style.aspectRatio = "auto";
  }

  function finishResize(e) {
    const drag = dragRef.current;
    if (!drag || (e.pointerId != null && drag.pointerId !== e.pointerId)) return;
    dragRef.current = null;
    const el = rootRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const { colTrack, rowTrack } = readTrackSizes();
    const snapped = snapWidgetSize(rect.width, rect.height, colTrack, rowTrack);
    el.style.width = "";
    el.style.height = "";
    el.style.aspectRatio = "";
    el.classList.remove("ts-widget--resizing");
    emitSize(snapped);
  }

  function onMovePointerDown(e) {
    if (!onPositionChange) return;
    e.preventDefault();
    e.stopPropagation();
    const el = rootRef.current;
    if (!el) return;
    moveRef.current = { pointerId: e.pointerId };
    setMoving(true);
    setSettingsOpen(false);
    el.setPointerCapture?.(e.pointerId);
  }

  function onMovePointerMove(e) {
    const move = moveRef.current;
    if (!move || move.pointerId !== e.pointerId) return;
    if (!onPositionPreview) return;
    const el = rootRef.current;
    const grid = el?.closest(".ts-widget-grid");
    if (!grid) return;
    const cell = pointerToGridCell(e.clientX, e.clientY, grid);
    onPositionPreview({ column: cell.column, row: cell.row, cols: cell.cols });
  }

  function finishMove(e) {
    const move = moveRef.current;
    if (!move || (e.pointerId != null && move.pointerId !== e.pointerId)) return;
    moveRef.current = null;
    setMoving(false);
    onPositionPreview?.(null);
    const el = rootRef.current;
    const grid = el?.closest(".ts-widget-grid");
    if (!grid || !onPositionChange) return;
    const cell = pointerToGridCell(e.clientX, e.clientY, grid);
    onPositionChange({ column: cell.column, row: cell.row, cols: cell.cols });
  }

  function onRootPointerMove(e) {
    onResizePointerMove(e);
    onMovePointerMove(e);
  }

  function onRootPointerUp(e) {
    if (dragRef.current) finishResize(e);
    if (moveRef.current) finishMove(e);
  }

  return (
    <section
      ref={rootRef}
      className={classes}
      aria-label={label}
      data-col-span={String(colSpan)}
      data-row-span={String(rowSpan)}
      onPointerMove={onRootPointerMove}
      onPointerUp={onRootPointerUp}
      onPointerCancel={onRootPointerUp}
      {...rest}
    >
      {(title || showSettings) && (
        <div className="ts-widget__header">
          {title ? <h2 className="ts-widget__title">{title}</h2> : <span />}
          {showSettings ? (
            <div className="ts-widget__settings">
              <button
                ref={gearRef}
                type="button"
                className="ts-widget__gear"
                aria-label="Widget settings"
                aria-expanded={settingsOpen}
                aria-controls={panelId}
                onClick={() => setSettingsOpen((v) => !v)}
              >
                <CogIcon />
              </button>
              {settingsOpen ? (
                <div
                  ref={panelRef}
                  id={panelId}
                  className="ts-widget__size-panel"
                  role="group"
                  aria-label="Widget settings"
                >
                  {onPositionChange ? (
                    <button
                      type="button"
                      className="ts-widget__move"
                      aria-label="Move widget"
                      onPointerDown={onMovePointerDown}
                    >
                      <GripIcon />
                      <span>Move</span>
                    </button>
                  ) : null}
                  {onSizeChange
                    ? WIDGET_SIZES.map((size) => {
                        const selected =
                          Number(colSpan) === size.colSpan && Number(rowSpan) === size.rowSpan;
                        return (
                          <button
                            key={size.label}
                            type="button"
                            className="ts-widget__size-btn"
                            aria-pressed={selected}
                            onClick={() => {
                              emitSize({ colSpan: size.colSpan, rowSpan: size.rowSpan });
                              setSettingsOpen(false);
                            }}
                          >
                            {size.label}
                          </button>
                        );
                      })
                    : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      )}
      <div className="ts-widget__body">{children}</div>
      {resizable && onSizeChange ? (
        <button
          type="button"
          className="ts-widget__resize"
          aria-label="Resize widget"
          onPointerDown={onResizePointerDown}
        />
      ) : null}
    </section>
  );
}
