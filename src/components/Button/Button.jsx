import "./Button.css";

/** Action button. Variants map to the modal footer roles. */
export default function Button({ variant = "secondary", size = "md", children, ...rest }) {
  return (
    <button type="button" className={`ts-btn ts-btn--${variant} ts-btn--${size}`} {...rest}>
      {children}
    </button>
  );
}
