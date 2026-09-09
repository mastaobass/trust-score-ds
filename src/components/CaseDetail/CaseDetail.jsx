import { useMemo, useState } from "react";
import Button from "../Button/Button";
import FieldRow from "../FieldRow/FieldRow";
import NetworkStat from "../NetworkStat/NetworkStat";
import SectionCard from "../SectionCard/SectionCard";
import SosRow from "../SosRow/SosRow";
import StatusChip from "../StatusChip/StatusChip";
import TrustScoreModal from "../TrustScoreModal/TrustScoreModal";
import VerificationChip from "../VerificationChip/VerificationChip";
import { ANALYSTS, neighborIds, seedCase } from "../../lib/cases";
import { money, transactionLine } from "../../lib/queue";
import "./CaseDetail.css";

const NOTE_MAX = 250;

function VelocityChart({ series }) {
  const w = 520;
  const h = 120;
  const pad = 10;
  const max = Math.max(1, ...series);
  const pts = series
    .map((value, i) => {
      const x = pad + (i / Math.max(1, series.length - 1)) * (w - pad * 2);
      const y = h - pad - (value / max) * (h - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg className="ts-velocity" viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Order velocity over 24 hours">
      <polyline fill="none" stroke="currentColor" strokeWidth="2.5" points={pts} />
    </svg>
  );
}

export default function CaseDetail({ id, rows, onRowsChange, flash, onFlash, onBack, onOpen }) {
  const row = rows.find((r) => r.id === id);
  const item = useMemo(() => {
    const seed = seedCase(id);
    if (!seed || !row) return null;
    return { ...seed, ...row };
  }, [id, row]);

  const [explain, setExplain] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(Boolean(flash));
  const [events, setEvents] = useState([]);
  const [note, setNote] = useState("");

  if (!item) {
    return (
      <div className="ts-case">
        <header className="ts-case__top">
          <p>Trust Score | Review console</p>
        </header>
        <main className="ts-case__missing">
          <h1>No case for that order</h1>
          <p>The queue only holds the reconstructed payments in this console.</p>
          <a href="#/">Back to transaction queue</a>
        </main>
      </div>
    );
  }

  const closed = item.status === "approved" || item.status === "declined";
  const { prev, next } = neighborIds(id);

  function patch(partial, event) {
    onRowsChange((prevRows) => prevRows.map((r) => (r.id === item.id ? { ...r, ...partial } : r)));
    if (event) {
      setEvents((curr) => [
        { id: `${Date.now()}`, at: new Date().toLocaleString(), ...event },
        ...curr,
      ]);
    }
  }

  function decide(status) {
    patch({ status }, { kind: "Decision", detail: `Marked ${status}` });
    onFlash?.(`Order #${item.id} marked ${status}.`);
    setExplain(false);
  }

  function submitNote() {
    const text = note.trim();
    if (!text) return;
    patch({}, { kind: "Note", detail: text });
    setNote("");
    setHistoryOpen(true);
    onFlash?.("Note added to the case.");
  }

  function cycleAssign() {
    const i = ANALYSTS.indexOf(item.assignee);
    const nextAnalyst = ANALYSTS[(i + 1) % ANALYSTS.length];
    patch({ assignee: nextAnalyst }, { kind: "Assign", detail: `Assigned to ${nextAnalyst}` });
  }

  const caseStatus =
    item.status === "approved"
      ? "Closed · approved"
      : item.status === "declined"
        ? "Closed · declined"
        : item.status === "held"
          ? "Active review"
          : "Under investigation";

  return (
    <div className="ts-case">
      <header className="ts-case__top">
        <p className="ts-case__brand">
          Trust Score <span>|</span> Review console
        </p>
        <p>Payments fraud reconstruction</p>
      </header>
      <div className="ts-case__crumb">
        <a href="#/" onClick={(e) => { e.preventDefault(); onBack(); }}>
          Transaction queue
        </a>
        <span>/</span>
        <span>Case #{item.id}</span>
      </div>

      <main className="ts-case__main">
        <div className="ts-case__header">
          <a href="#/" className="ts-case__back" onClick={(e) => { e.preventDefault(); onBack(); }}>
            ← Case details
          </a>
          <StatusChip status={item.status} />
          <span className="ts-meta">
            <span className="ts-meta__label">Case status</span>
            <span className="ts-meta__value">{caseStatus}</span>
          </span>
          <span className="ts-meta">
            <span className="ts-meta__label">Assignee</span>
            <span className="ts-meta__value">{item.assignee}</span>
          </span>
          <span className="ts-meta">
            <span className="ts-meta__label">Priority</span>
            <span className="ts-meta__value">{item.priority}</span>
          </span>
          <div className="ts-case__nav">
            <Button size="sm" variant="ghost" disabled={!prev} onClick={() => prev && onOpen(prev)}>
              Prev
            </Button>
            <Button size="sm" variant="ghost" disabled={!next} onClick={() => next && onOpen(next)}>
              Next
            </Button>
          </div>
        </div>

        <div className="ts-abar">
          <section>
            <h3 className="ts-abar__label">Decision</h3>
            <div className="ts-abar__row">
              <Button variant="primary" size="sm" disabled={closed} onClick={() => decide("approved")}>
                Approve
              </Button>
              <Button variant="danger" size="sm" disabled={closed} onClick={() => decide("declined")}>
                Decline
              </Button>
              <Button variant="secondary" size="sm" disabled={closed} onClick={() => decide("held")}>
                Hold
              </Button>
            </div>
          </section>
          <section className="ts-abar__note">
            <h3 className="ts-abar__label">Note</h3>
            <div className="ts-abar__row">
              <input
                value={note}
                maxLength={NOTE_MAX}
                placeholder={`Enter note  ${note.length}/${NOTE_MAX}`}
                onChange={(e) => setNote(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    submitNote();
                  }
                }}
              />
              <Button variant="secondary" size="sm" disabled={!note.trim()} onClick={submitNote}>
                Add note
              </Button>
            </div>
          </section>
          <section>
            <h3 className="ts-abar__label">Controls</h3>
            <div className="ts-abar__row">
              <Button variant="ghost" size="sm" onClick={cycleAssign}>
                Assign user
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setHistoryOpen((v) => !v)}>
                History
              </Button>
            </div>
          </section>
          <section>
            <h3 className="ts-abar__label">Reversals</h3>
            <div className="ts-abar__row">
              <Button variant="ghost" size="sm" onClick={() => patch({}, { kind: "Chargeback", detail: "Chargeback marked on the case" })}>
                Chargeback
              </Button>
              <Button variant="ghost" size="sm" onClick={() => patch({}, { kind: "Fraud", detail: "Fraud status updated" })}>
                Fraud status
              </Button>
              <Button variant="ghost" size="sm" onClick={() => patch({}, { kind: "Refund", detail: "Refund recorded on the case" })}>
                Refunds
              </Button>
            </div>
          </section>
        </div>

        <div className="ts-banner">
          <span>
            <b>Queued</b> {item.time}
          </span>
          <span>
            <b>Score</b> {item.score.toFixed(1)}
          </span>
          <span>
            <b>Top reason</b> {item.topReason}
          </span>
          <span>
            <b>Caught by</b> {item.caughtBy}
          </span>
          <span>
            <b>Standing</b> {item.standing}
          </span>
        </div>

        {historyOpen && (
          <SectionCard title="Case history">
            {events.length === 0 ? (
              <p className="ts-case__muted">No analyst notes or decisions yet.</p>
            ) : (
              <ul className="ts-history">
                {events.map((ev) => (
                  <li key={ev.id}>
                    <strong>{ev.kind}</strong> · {ev.at}
                    <div>{ev.detail}</div>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        )}

        <div className="ts-summary">
          <SectionCard title="SOS">
            {item.sos.map((row) => (
              <SosRow key={row.label} tone={row.tone}>
                {row.label}
              </SosRow>
            ))}
          </SectionCard>
          <SectionCard title="Across the network">
            {item.network.map((row) => (
              <NetworkStat key={row.label} {...row} />
            ))}
          </SectionCard>
          <SectionCard title="Payment">
            <div className="ts-verify-row">
              {item.paymentMeta.flags.map((f) => (
                <VerificationChip key={f.code} code={f.code} result={f.result} />
              ))}
            </div>
            <dl className="ts-payfields">
              <FieldRow label="Total" value={money(item.amount)} />
              <FieldRow label="Type" value={item.paymentMeta.type} />
              <FieldRow label="Currency" value={item.paymentMeta.currency} />
              <FieldRow label="BIN country" value={item.paymentMeta.binCountry} />
              <FieldRow label="Brand" value={item.paymentMeta.brand} />
              <FieldRow label="Instrument" value={item.payment} />
            </dl>
          </SectionCard>
        </div>

        <div className="ts-case__grid">
          <SectionCard title="Velocities">
            <div className="ts-card__head-row">
              <Button size="sm" variant="ghost" onClick={() => setExplain(true)}>
                Explain score {item.score.toFixed(1)}
              </Button>
            </div>
            <VelocityChart series={item.velocity} />
          </SectionCard>
          <SectionCard title="Identity check">
            <p className="ts-case__muted">Score {item.identity.score} / 500. Reconstructed identity signals, not a live bureau call.</p>
            <div className="ts-idmeter" aria-hidden="true">
              <span style={{ width: `${Math.min(100, (item.identity.score / 500) * 100)}%` }} />
            </div>
            <FieldRow label="IP" value={item.identity.ip} />
            <FieldRow label="Phone" value={item.identity.phone} />
          </SectionCard>
        </div>

        <div className="ts-case__grid">
          <SectionCard title="Transaction info">
            <dl className="ts-fields">
              <FieldRow label="Customer name" value={item.customerName} />
              <FieldRow label="Customer e-mail" value={item.customerEmail} />
              <FieldRow label="Shipping e-mail" value={item.shippingEmail} />
              <FieldRow label="Transaction date" value={item.time} />
              <FieldRow label="Customer created" value={item.customerCreated} />
              <FieldRow label="E-mail age (days)" value={String(item.emailAgeDays)} />
              <FieldRow label="Priority" value={item.priority} />
              <FieldRow label="Customer ID" value={item.customerId} />
              <FieldRow label="Transaction ID" value={item.transactionId} />
              <FieldRow label="Order number" value={item.orderNumber} />
              <FieldRow label="Chargeback status" value={item.chargebackStatus} />
            </dl>
          </SectionCard>
          <SectionCard title="Policies triggered">
            {item.policies.map((block) => (
              <div key={block.heading}>
                <p className="ts-case__policy-h">{block.heading}</p>
                <ul>
                  {block.items.map((entry) => (
                    <li key={entry}>{entry}</li>
                  ))}
                </ul>
              </div>
            ))}
          </SectionCard>
        </div>

        <p className="ts-case__footnote">
          Reconstruction of a payments-fraud case view. Queue rows open this screen, not the score modal.
          The explainer is still available from Velocities. Weights stay hidden. Reason codes stay pre-scripted.
        </p>
      </main>

      {explain && (
        <TrustScoreModal
          transaction={transactionLine(item)}
          score={item.score}
          confidence={item.confidence}
          baseline={80}
          steps={item.steps}
          positiveReasons={item.positiveReasons}
          negativeReasons={item.negativeReasons}
          onClose={() => setExplain(false)}
          onApprove={() => decide("approved")}
          onHold={() => decide("held")}
          onDecline={() => decide("declined")}
        />
      )}
    </div>
  );
}
