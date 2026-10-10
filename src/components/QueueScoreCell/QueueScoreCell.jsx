import Pill from "../Pill/Pill";
import { bandFor } from "../../lib/score";
import { SCORE_TONE } from "../QueueGrid/queueMeta";
import "./QueueScoreCell.css";

/** Score number plus the risk band pill. */
export default function QueueScoreCell({ data }) {
  if (!data || data.score == null) return null;
  const band = bandFor(data.score);
  return (
    <span className="ts-queue-score">
      <strong>{Number(data.score).toFixed(1)}</strong>
      <Pill tone={SCORE_TONE[band.id]}>{band.riskLabel}</Pill>
    </span>
  );
}
