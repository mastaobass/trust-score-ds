import Button from "../Button/Button";
import "./QueueToolbar.css";

/** Quick filter, visible transaction count, and the table options control. */
export default function QueueToolbar({ value, onChange, optionsOpen, onToggleOptions, shown, total }) {
  const filtered = shown != null && total != null && shown !== total;
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
      {total != null ? (
        <p className="ts-queue-toolbar__count" aria-live="polite">
          {filtered ? (
            <>
              <strong>{shown}</strong> of {total}
            </>
          ) : (
            <>
              <strong>{total}</strong> {total === 1 ? "transaction" : "transactions"}
            </>
          )}
        </p>
      ) : null}
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
