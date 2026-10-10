import Button from "../Button/Button";
import "./QueueToolbar.css";

/** Quick filter and the control that shows the table options panel. */
export default function QueueToolbar({ value, onChange, optionsOpen, onToggleOptions }) {
  return (
    <div className="ts-queue-toolbar">
      <label className="ts-queue-toolbar__search">
        <span className="ts-queue-toolbar__label">Search</span>
        <input
          type="search"
          value={value}
          placeholder="Filter merchants, orders, status…"
          aria-label="Quick filter"
          onChange={(event) => onChange(event.target.value)}
        />
      </label>
      <Button
        size="sm"
        variant="secondary"
        aria-pressed={optionsOpen}
        aria-expanded={optionsOpen}
        onClick={onToggleOptions}
      >
        Table options
      </Button>
    </div>
  );
}
