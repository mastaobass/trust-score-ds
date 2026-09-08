import "./StatusChip.css";

const LABEL = {
  review: "Decision: Review",
  approved: "Decision: Approved",
  held: "Decision: Hold",
  declined: "Decision: Declined",
};

/** Case-header decision chip. Same four states as the review queue. */
export default function StatusChip({ status = "review", children }) {
  return <span className={`ts-status ts-status--${status}`}>{children ?? LABEL[status]}</span>;
}
