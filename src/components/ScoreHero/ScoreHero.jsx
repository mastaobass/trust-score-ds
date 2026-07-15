import Pill from "../Pill/Pill";
import BandGauge from "../BandGauge/BandGauge";
import { bandFor } from "../../lib/score";
import "./ScoreHero.css";

const TONE = { low: "negative", medium: "warning", high: "positive" };

/** Big score readout with risk band, model confidence, and the band gauge. */
export default function ScoreHero({ score, confidence, eyebrow = "TRUST SCORE" }) {
  const band = bandFor(score);
  return (
    <div className="ts-hero">
      <p className="ts-hero__eyebrow">{eyebrow}</p>
      <p className="ts-hero__score">
        <span className={`ts-hero__value ts-hero__value--${band.id}`}>{score.toFixed(1)}</span>
        <span className="ts-hero__denominator">/ 99.9</span>
      </p>
      <div className="ts-hero__meta">
        <Pill tone={TONE[band.id]}>{band.riskLabel}</Pill>
        {confidence != null && <span className="ts-hero__confidence">Model confidence {confidence}%</span>}
      </div>
      <BandGauge score={score} />
    </div>
  );
}
