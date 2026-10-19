import { QUEUE_VIEWS } from "../../lib/queueViews";
import "./QueueViews.css";

/** Compact merchant-preset switcher for the Case Queue. */
export default function QueueViews({ value, onChange }) {
  return (
    <div className="ts-queue-views">
      <span className="ts-queue-views__label" id="ts-queue-views-label">
        Merchant
      </span>
      <div
        className="ts-queue-views__options"
        role="radiogroup"
        aria-labelledby="ts-queue-views-label"
      >
        {QUEUE_VIEWS.map((view) => {
          const selected = value === view.id;
          return (
            <button
              key={view.id}
              type="button"
              role="radio"
              aria-checked={selected}
              className="ts-queue-views__option"
              onClick={() => onChange?.(view.id)}
            >
              {view.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
