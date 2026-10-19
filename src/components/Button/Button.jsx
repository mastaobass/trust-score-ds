import "./Button.css";

/** Action button. Variants map to the modal footer roles. */
export default function Button({ variant = "secondary", size = "md", className, children, ...rest }) {
  const classes = ["ts-btn", `ts-btn--${variant}`, `ts-btn--${size}`, className].filter(Boolean).join(" ");
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
