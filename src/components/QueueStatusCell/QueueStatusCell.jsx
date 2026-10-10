import Pill from "../Pill/Pill";
import { STATUS_LABEL, STATUS_TONE } from "../QueueGrid/queueMeta";

/** Decision status pill. */
export default function QueueStatusCell({ data }) {
  if (!data?.status) return null;
  return <Pill tone={STATUS_TONE[data.status]}>{STATUS_LABEL[data.status] ?? data.status}</Pill>;
}
