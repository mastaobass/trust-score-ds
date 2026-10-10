import { money } from "../../lib/queue";
import QueueMerchantCell from "../QueueMerchantCell/QueueMerchantCell";
import QueueOpenCell from "../QueueOpenCell/QueueOpenCell";
import QueueScoreCell from "../QueueScoreCell/QueueScoreCell";
import QueueStatusCell from "../QueueStatusCell/QueueStatusCell";
import { STATUS_LABEL } from "./queueMeta";

export { QUEUE_DENSITY, SCORE_TONE, STATUS_LABEL, STATUS_TONE } from "./queueMeta";

/** Column definition factory for the review queue. */
export function createQueueColumnDefs() {
  return [
    {
      colId: "merchant",
      field: "merchant",
      headerName: "Merchant",
      flex: 1.5,
      minWidth: 180,
      filter: "agTextColumnFilter",
      cellRenderer: QueueMerchantCell,
    },
    {
      colId: "id",
      field: "id",
      headerName: "Order",
      width: 130,
      filter: "agTextColumnFilter",
      valueFormatter: (params) => (params.value ? `#${params.value}` : ""),
      getQuickFilterText: (params) => `#${params.value ?? ""} ${params.value ?? ""}`,
    },
    {
      colId: "amount",
      field: "amount",
      headerName: "Amount",
      width: 130,
      filter: "agNumberColumnFilter",
      valueFormatter: (params) => (params.value == null ? "" : money(params.value)),
      getQuickFilterText: (params) => (params.value == null ? "" : `${params.value} ${money(params.value)}`),
    },
    {
      colId: "payment",
      field: "payment",
      headerName: "Payment",
      flex: 1,
      minWidth: 150,
      filter: "agTextColumnFilter",
    },
    {
      colId: "score",
      field: "score",
      headerName: "Score",
      width: 220,
      minWidth: 200,
      filter: "agNumberColumnFilter",
      cellRenderer: QueueScoreCell,
    },
    {
      colId: "status",
      field: "status",
      headerName: "Status",
      width: 168,
      minWidth: 150,
      filter: "agTextColumnFilter",
      valueGetter: (params) => STATUS_LABEL[params.data?.status] ?? params.data?.status ?? "",
      cellRenderer: QueueStatusCell,
    },
    {
      colId: "time",
      field: "time",
      headerName: "When",
      width: 190,
      filter: "agTextColumnFilter",
    },
    {
      colId: "open",
      headerName: "Open",
      width: 120,
      sortable: false,
      filter: false,
      resizable: false,
      cellRenderer: QueueOpenCell,
    },
  ];
}
