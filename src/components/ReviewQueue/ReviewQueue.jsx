import { useMemo, useState } from "react";
import Button from "../Button/Button";
import Pill from "../Pill/Pill";
import CaseDetail from "../CaseDetail/CaseDetail";
import { bandFor } from "../../lib/score";
import { QUEUE, money } from "../../lib/queue";
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
 * Review console table.
 * A row opens the Payments Fraud case. The score modal lives on that case.
 * Pass onOpenCase from the Vite app so the parent owns hash routing.
 * In Storybook, the case renders in place so the composition is the product path.
 */
export default function ReviewQueue({
  initialState = "loaded",
  rows: rowsProp,
  onRowsChange,
  onOpenCase,
  flash,
}) {
  const [view, setView] = useState(initialState);
  const [internalRows, setInternalRows] = useState(QUEUE);
  const [caseId, setCaseId] = useState(null);
  const [note, setNote] = useState(flash ?? null);

  const rows = rowsProp ?? internalRows;
  const setRows = onRowsChange ?? setInternalRows;
  const reviewCount = rows.filter((r) => r.status === "review").length;
  const productPath = typeof onOpenCase === "function";

  function openRow(id) {
    if (productPath) onOpenCase(id);
    else setCaseId(id);
  }

  if (!productPath && caseId) {
    return (
      <CaseDetail
        id={caseId}
        rows={rows}
        onRowsChange={setRows}
        flash={note}
        onFlash={setNote}
        onBack={() => setCaseId(null)}
        onOpen={openRow}
      />
    );
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
              <th>
                <span className="ts-queue__sr">Open</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const band = bandFor(row.score);
              return (
                <tr
                  key={row.id}
                  className="ts-queue-row"
                  tabIndex={0}
                  onClick={() => openRow(row.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openRow(row.id);
                    }
                  }}
                >
                  <td className="ts-queue__merchant">
                    {productPath ? (
                      <a
                        className="ts-queue-row__merchant"
                        href={`#/case/${row.id}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {row.merchant}
                      </a>
                    ) : (
                      row.merchant
                    )}
                  </td>
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
                  <td>
                    {productPath ? (
                      <a
                        className="ts-queue-row__link"
                        href={`#/case/${row.id}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Open case
                      </a>
                    ) : (
                      <button
                        type="button"
                        className="ts-queue-row__link"
                        onClick={(e) => {
                          e.stopPropagation();
                          openRow(row.id);
                        }}
                      >
                        Open case
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }, [view, rows, productPath]);

  return (
    <div className="ts-queue">
      <header className="ts-queue__header">
        <div>
          <p className="ts-queue__eyebrow">Payments fraud · Review console</p>
          <h1 className="ts-queue__title">Transaction queue</h1>
          <p className="ts-queue__lede">
            Open a row to work the payments-fraud case. The score explainer lives on the case, not on this table.
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
    </div>
  );
}
