import { BANDS, gaugePosition } from "../../lib/score";
import "./BandGauge.css";

/**
 * The 0.0–99.9 scale as three EQUAL-WIDTH bands (low 0–59.9, medium
 * 60.0–79.9, high 80.0–99.9). Widths are intentionally non-proportional:
 * ~75% of transactions score 80+, so proportional bands would crush the
 * range where nearly all real decisions happen.
 */
export default function BandGauge({ score, caption = "Bands shown at equal width — 75% of transactions score 80+" }) {
  const pos = gaugePosition(score);
  return (
    <div className="ts-gauge" role="img" aria-label={`Score ${score.toFixed(1)} of 99.9`}>
      <div className="ts-gauge__track">
        {BANDS.map((b) => (
          <div key={b.id} className={`ts-gauge__band ts-gauge__band--${b.id}`} />
        ))}
        <div className="ts-gauge__marker" style={{ left: `${pos}%` }} />
      </div>
      <div className="ts-gauge__ticks" aria-hidden="true">
        <span>0</span>
        <span>60.0</span>
        <span>80.0</span>
        <span>99.9</span>
      </div>
      {caption && <p className="ts-gauge__caption">{caption}</p>}
    </div>
  );
}
