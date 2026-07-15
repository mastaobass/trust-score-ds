import Button from "../Button/Button";
import ScoreHero from "../ScoreHero/ScoreHero";
import WaterfallChart from "../WaterfallChart/WaterfallChart";
import ReasonRow from "../ReasonRow/ReasonRow";
import "./TrustScoreModal.css";

/**
 * The full explainer: lightboxed modal with header / content / footer.
 * Content: score hero + composition waterfall on top; the 20 pre-scripted
 * reason codes (10 positive / 10 negative, ~8 typically active) below.
 */
export default function TrustScoreModal({
  title = "Transaction Trust Score",
  transaction,
  score,
  confidence,
  baseline = 80.0,
  steps = [],
  positiveReasons = [],
  negativeReasons = [],
  onApprove,
  onHold,
  onDecline,
  onClose,
  onFeedback,
}) {
  const activeCount = [...positiveReasons, ...negativeReasons].filter((r) => r.active).length;
  const totalCount = positiveReasons.length + negativeReasons.length;
  const sorted = (rows) => [...rows].sort((a, b) => Number(b.active) - Number(a.active));

  return (
    <div className="ts-lightbox">
      <div className="ts-modal" role="dialog" aria-modal="true" aria-label={title}>
        <header className="ts-modal__header">
          <div>
            <h2 className="ts-modal__title">{title}</h2>
            {transaction && <p className="ts-modal__subtitle">{transaction}</p>}
          </div>
          <button type="button" className="ts-modal__close" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </header>

        <div className="ts-modal__content">
          <div className="ts-modal__overview">
            <ScoreHero score={score} confidence={confidence} />
            <div className="ts-modal__chart">
              <h3 className="ts-modal__section-title">How this score was built</h3>
              <p className="ts-modal__section-subtitle">
                Contribution by signal category, from the {baseline.toFixed(1)} baseline
              </p>
              <WaterfallChart baseline={baseline} steps={steps} />
            </div>
          </div>

          <div className="ts-modal__reasons">
            <div className="ts-modal__reasons-header">
              <h3 className="ts-modal__section-title">Score reasons</h3>
              <span className="ts-modal__section-subtitle">
                {activeCount} of {totalCount} reason codes active for this transaction
              </span>
            </div>
            <div className="ts-modal__columns">
              <div className="ts-modal__column">
                <p className="ts-modal__column-title ts-modal__column-title--positive">Increased score</p>
                {sorted(positiveReasons).map((r) => (
                  <ReasonRow key={r.label} direction="positive" {...r} />
                ))}
              </div>
              <div className="ts-modal__column">
                <p className="ts-modal__column-title ts-modal__column-title--negative">Decreased score</p>
                {sorted(negativeReasons).map((r) => (
                  <ReasonRow key={r.label} direction="negative" {...r} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <footer className="ts-modal__footer">
          <div className="ts-modal__feedback">
            <span>Was this explanation helpful?</span>
            <Button variant="ghost" size="sm" onClick={() => onFeedback?.(true)}>Yes</Button>
            <Button variant="ghost" size="sm" onClick={() => onFeedback?.(false)}>No</Button>
          </div>
          <div className="ts-modal__actions">
            <Button variant="danger" onClick={onDecline}>Decline</Button>
            <Button variant="secondary" onClick={onHold}>Hold for review</Button>
            <Button variant="primary" onClick={onApprove}>Approve</Button>
          </div>
        </footer>
      </div>
    </div>
  );
}
