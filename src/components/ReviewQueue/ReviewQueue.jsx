import { useMemo, useState } from "react";
import Button from "../Button/Button";
import Pill from "../Pill/Pill";
import TrustScoreModal from "../TrustScoreModal/TrustScoreModal";
import { bandFor } from "../../lib/score";
import { QUEUE, money, transactionLine } from "../../lib/queue";
import "./ReviewQueue.css";

const STATUS_LABEL = {
  review: "Needs review",
  approved: "Approved",
  held: "On hold",
  declined: "Declined",
};

const STATUS_TONE = {
  review: "warning",
  approved: "positive",
  held: "neutral",
  declined: "negative",
};

const SCORE_TONE = { low: "negative", medium: "warning", high: "positive" };

/**
 * Thin review console: ten reconstructed payments, click a row for the
 * explainer modal. Demo states (loading / empty / error) are first-class
 * because those are the states Figma-only kits skip.
 */
export default function ReviewQueue({ initialState = "loaded" }) {
  const [view, setView] = useState(initialState);
  const [rows, setRows] = useState(QUEUE);
  const [openId, setOpenId] = useState(null);
  const [note, setNote] = useState(null);

  const open = rows.find((r) => r.id === openId) ?? null;
  const reviewCount = rows.filter((r) => r.status === "review").length;

  function decide(id, status) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    setOpenId(null);
    setNote(`Order #${id} marked ${STATUS_LABEL[status].toLowerCase()}.`);
  }

  const body = useMemo(() => {
    if (view === "loading") {
      return (
        <div className="ts-queue__skeletons" aria-busy="true" aria-live="polite">
          <span className="ts-queue__sr">Loading review queue</span>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="ts-queue__skeleton" />
          ))}
        </div>
      );
    }
    if (view === "empty") {
      return (
        <div className="ts-queue__state">
          <p className="ts-queue__state-title">Queue is clear</p>
          <p className="ts-queue__state-copy">
            No payments waiting for a human decision. New flags will land here as the model scores live traffic.
          </p>
        </div>
      );
    }
    if (view === "error") {
      return (
        <div className="ts-queue__state">
          <p className="ts-queue__state-title">Could not load the queue</p>
          <p className="ts-queue__state-copy">
            The review surface is downstream of the scoring service. Retry after the feed recovers. No decision was recorded.
          </p>
          <Button variant="secondary" onClick={() => setView("loaded")}>
            Retry
          </Button>
        </div>
      );
    }
    return (
      <div className="ts-queue__table-wrap">
        <table className="ts-queue__table">
          <thead>
            <tr>
              <th>Merchant</th>
              <th>Order</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Score</th>
              <th>Status</th>
              <th>When</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const band = bandFor(row.score);
              const selected = openId === row.id;
              return (
                <tr
                  key={row.id}
                  tabIndex={0}
                  aria-selected={selected}
                  className={selected ? "is-selected" : undefined}
                  onClick={() => setOpenId(row.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setOpenId(row.id);
                    }
                  }}
                >
                  <td className="ts-queue__merchant">{row.merchant}</td>
                  <td className="ts-queue__mono">#{row.id}</td>
                  <td>{money(row.amount)}</td>
                  <td className="ts-queue__muted">{row.payment}</td>
                  <td>
                    <span className="ts-queue__score">
                      <strong>{row.score.toFixed(1)}</strong>
                      <Pill tone={SCORE_TONE[band.id]}>{band.riskLabel}</Pill>
                    </span>
                  </td>
                  <td>
                    <Pill tone={STATUS_TONE[row.status]}>{STATUS_LABEL[row.status]}</Pill>
                  </td>
                  <td className="ts-queue__muted ts-queue__nowrap">{row.time}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }, [view, rows, openId]);

  return (
    <div className="ts-queue">
      <header className="ts-queue__header">
        <div>
          <p className="ts-queue__eyebrow">Payments fraud · Review console</p>
          <h1 className="ts-queue__title">Transaction queue</h1>
          <p className="ts-queue__lede">
            Open a row to see the score as an argument. Weights stay hidden. Reasons are pre-scripted.
            Visual baseline is pinned at 80.0 so the waterfall is readable.
          </p>
        </div>
        <p className="ts-queue__count">
          {view === "loaded" ? (
            <>
              <strong>{reviewCount}</strong> need a decision
            </>
          ) : (
            <>Demo state: {view}</>
          )}
        </p>
      </header>

      <div className="ts-queue__states" role="group" aria-label="Queue demo states">
        {["loaded", "loading", "empty", "error"].map((s) => (
          <Button key={s} size="sm" variant={view === s ? "primary" : "ghost"} onClick={() => setView(s)}>
            {s === "loaded" ? "Queue" : s[0].toUpperCase() + s.slice(1)}
          </Button>
        ))}
      </div>

      {note && view === "loaded" && (
        <p className="ts-queue__note" role="status">
          {note}
        </p>
      )}

      <section className="ts-queue__panel">{body}</section>

      <p className="ts-queue__footnote">
        Reconstruction of the Kount review surface. The model is proprietary, so this kit never exposes
        factor weights that would let someone reverse-engineer detection. Inactive reason codes stay visible
        because absence is information.
      </p>

      {open && view === "loaded" && (
        <TrustScoreModal
          transaction={transactionLine(open)}
          score={open.score}
          confidence={open.confidence}
          baseline={80}
          steps={open.steps}
          positiveReasons={open.positiveReasons}
          negativeReasons={open.negativeReasons}
          onClose={() => setOpenId(null)}
          onApprove={() => decide(open.id, "approved")}
          onHold={() => decide(open.id, "held")}
          onDecline={() => decide(open.id, "declined")}
          onFeedback={() => setNote("Feedback sent to reason-code tuning. The score itself did not change.")}
        />
      )}
    </div>
  );
}
