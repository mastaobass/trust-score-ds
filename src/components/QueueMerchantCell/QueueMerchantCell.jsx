import "./QueueMerchantCell.css";

/** Merchant name. On the product path it is a case link; otherwise it opens in place. */
export default function QueueMerchantCell({ data, context }) {
  if (!data) return null;
  if (context?.productPath) {
    return (
      <a className="ts-queue-merchant" href={`#/case/${data.id}`} onClick={(event) => event.stopPropagation()}>
        {data.merchant}
      </a>
    );
  }
  return (
    <button
      type="button"
      className="ts-queue-merchant"
      onClick={(event) => {
        event.stopPropagation();
        context?.onOpen?.(data.id);
      }}
    >
      {data.merchant}
    </button>
  );
}
