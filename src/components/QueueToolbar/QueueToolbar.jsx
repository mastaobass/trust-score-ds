import Button from "../Button/Button";
import QueueViews from "../QueueViews/QueueViews";
import "./QueueToolbar.css";

function CogIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

/** Search, merchant filter, visible transaction count, and cog for table options. */
export default function QueueToolbar({
  value,
  onChange,
  optionsOpen,
  onToggleOptions,
  shown,
  total,
  merchantViewId,
  onMerchantViewChange,
}) {
  const filtered = shown != null && total != null && shown !== total;
  return (
    <div className="ts-queue-toolbar">
      <label className="ts-queue-toolbar__search">
        <span className="ts-queue-toolbar__label">Search</span>
        <input
          type="search"
          value={value}
          placeholder="Filter merchants, orders, agent, SLA, status…"
          aria-label="Quick filter"
          onChange={(event) => onChange(event.target.value)}
        />
      </label>
      <QueueViews value={merchantViewId} onChange={onMerchantViewChange} />
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
        className="ts-queue-toolbar__cog"
        aria-label="Table options"
        aria-pressed={optionsOpen}
        aria-expanded={optionsOpen}
        onClick={onToggleOptions}
      >
        <CogIcon />
      </Button>
    </div>
  );
}
