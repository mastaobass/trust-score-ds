import chevron from "../ActionBar/assets/chevron-down.svg";
import "./ActionBarField.css";

/**
 * Bordered action-bar control.
 * `select` shows the chevron. `note` keeps a live counter. `chip` is read-only.
 */
export default function ActionBarField({
  kind = "text",
  value = "",
  onChange,
  placeholder = "",
  options = [],
  maxLength = 250,
  width,
  ariaLabel,
  onKeyDown,
}) {
  const style = width ? { width } : undefined;

  if (kind === "chip") {
    return (
      <span className="ts-action-field ts-action-field--chip" style={style}>
        {value}
      </span>
    );
  }

  if (kind === "select") {
    return (
      <label className="ts-action-field" style={style}>
        <select
          aria-label={ariaLabel || placeholder}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <img className="ts-action-field__chevron" src={chevron} alt="" />
      </label>
    );
  }

  if (kind === "note") {
    return (
      <label className="ts-action-field ts-action-field--note" style={style}>
        <input
          type="text"
          aria-label={ariaLabel || "Enter note"}
          placeholder="Enter note"
          maxLength={maxLength}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          onKeyDown={onKeyDown}
        />
        <span className="ts-action-field__count">
          {value.length}/{maxLength}
        </span>
      </label>
    );
  }

  return (
    <label className="ts-action-field ts-action-field--text" style={style}>
      <input
        type="text"
        aria-label={ariaLabel || placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
      />
    </label>
  );
}
