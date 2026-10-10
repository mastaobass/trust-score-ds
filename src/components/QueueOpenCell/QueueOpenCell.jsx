import "./QueueOpenCell.css";

/** Explicit open control so the case can be reached without relying on the row click. */
export default function QueueOpenCell({ data, context }) {
  if (!data) return null;
  if (context?.productPath) {
    return (
      <a className="ts-queue-open" href={`#/case/${data.id}`} onClick={(event) => event.stopPropagation()}>
        Open case
      </a>
    );
  }
  return (
    <button
      type="button"
      className="ts-queue-open"
      onClick={(event) => {
        event.stopPropagation();
        context?.onOpen?.(data.id);
      }}
    >
      Open case
    </button>
  );
}
