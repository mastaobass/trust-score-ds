import { Children, isValidElement } from "react";
import "./WidgetGrid.css";

const ALLOWED_SPANS = new Set([1, 2]);

function clampSpan(value, fallback = 1) {
  const n = Number(value);
  return ALLOWED_SPANS.has(n) ? n : fallback;
}

function usedRowCount(children, maxRows, columns) {
  let max = 0;
  let autoFlow = 0;
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (child.props.row != null || child.type === WidgetGridItem) {
      const row = Number(child.props.row) || 1;
      const span = clampSpan(child.props.rowSpan, 1);
      max = Math.max(max, row + span - 1);
      return;
    }
    autoFlow += 1;
  });
  if (autoFlow > 0) {
    max = Math.max(max, Math.ceil(autoFlow / Math.max(1, columns)));
  }
  return Math.min(maxRows, Math.max(1, max || 1));
}

/**
 * Explicit cell for WidgetGrid. Layout-only: children are opaque content.
 * `column` / `row` set start lines; `colSpan` / `rowSpan` ∈ {1,2}.
 * Starts clamp so the span fits within the current track count / maxRows.
 */
function WidgetGridItem({
  column,
  row,
  colSpan = 1,
  rowSpan = 1,
  children,
  className,
  style,
  ...rest
}) {
  const spanCols = clampSpan(colSpan);
  const spanRows = clampSpan(rowSpan);
  const classes = ["ts-widget-grid__item", className].filter(Boolean).join(" ");
  const itemStyle = {
    ...style,
    "--wg-col-span": spanCols,
    "--wg-row-span": spanRows,
  };
  if (column != null) itemStyle["--wg-item-col"] = column;
  if (row != null) itemStyle["--wg-item-row"] = row;

  return (
    <div
      className={classes}
      data-column={column != null ? String(column) : undefined}
      data-row={row != null ? String(row) : undefined}
      data-col-span={String(spanCols)}
      data-row-span={String(spanRows)}
      style={itemStyle}
      {...rest}
    >
      {children}
    </div>
  );
}

/**
 * Content-agnostic equal-track grid for Widgets.
 * Desktop: `columns` tracks; tablet (max-width 900px): `tabletColumns`.
 * Caps at `maxRows` equal row tracks. Only reads Item layout props — not widget types.
 */
export default function WidgetGrid({
  columns = 4,
  tabletColumns = 3,
  maxRows = 6,
  children,
  className,
  style,
  ...rest
}) {
  const cols = Math.max(1, Number(columns) || 4);
  const tabletCols = Math.max(1, Number(tabletColumns) || 3);
  const rows = Math.max(1, Number(maxRows) || 6);
  const usedRows = usedRowCount(children, rows, cols);
  const classes = ["ts-widget-grid", className].filter(Boolean).join(" ");

  return (
    <div
      className={classes}
      style={{
        "--wg-cols": cols,
        "--wg-tablet-cols": tabletCols,
        "--wg-rows": rows,
        "--wg-used-rows": usedRows,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

WidgetGrid.Item = WidgetGridItem;
