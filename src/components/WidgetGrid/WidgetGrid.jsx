import "./WidgetGrid.css";

/**
 * Explicit cell for WidgetGrid. Use `column` / `row` to place a widget
 * (e.g. Score Hero in the last track) without ghost empty Widgets.
 */
function WidgetGridItem({ column, row, children, className, style, ...rest }) {
  const classes = ["ts-widget-grid__item", className].filter(Boolean).join(" ");
  const itemStyle = { ...style };
  if (column != null) itemStyle["--wg-item-col"] = column;
  if (row != null) itemStyle["--wg-item-row"] = row;

  return (
    <div
      className={classes}
      data-column={column != null ? String(column) : undefined}
      data-row={row != null ? String(row) : undefined}
      style={itemStyle}
      {...rest}
    >
      {children}
    </div>
  );
}

/**
 * Constrained equal-column grid for arranging Widgets in a page region.
 * Desktop defaults to 4 tracks; tablet (max-width 900px) uses `tabletColumns`.
 */
export default function WidgetGrid({
  columns = 4,
  tabletColumns = 3,
  children,
  className,
  style,
  ...rest
}) {
  const classes = ["ts-widget-grid", className].filter(Boolean).join(" ");

  return (
    <div
      className={classes}
      style={{
        "--wg-cols": columns,
        "--wg-tablet-cols": tabletColumns,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

WidgetGrid.Item = WidgetGridItem;
