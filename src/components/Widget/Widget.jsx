import "./Widget.css";

/**
 * Raised chrome for dashboard / case widgets.
 * Optional title; when omitted, pass aria-label for the region.
 */
export default function Widget({ title, children, className, "aria-label": ariaLabel, ...rest }) {
  const classes = ["ts-widget", className].filter(Boolean).join(" ");
  const label = title ? undefined : ariaLabel;

  return (
    <section className={classes} aria-label={label} {...rest}>
      {title ? <h2 className="ts-widget__title">{title}</h2> : null}
      <div className="ts-widget__body">{children}</div>
    </section>
  );
}
