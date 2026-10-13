import { useEffect, useMemo, useState } from "react";
import ActionBar from "../ActionBar/ActionBar";
import Button from "../Button/Button";
import LayoutDrawer from "../WidgetGrid/LayoutDrawer";
import StatusChip from "../StatusChip/StatusChip";
import TrustScoreModal from "../TrustScoreModal/TrustScoreModal";
import WidgetGrid from "../WidgetGrid/WidgetGrid";
import { ANALYSTS, neighborIds, seedCase } from "../../lib/cases";
import { useCaseLayouts } from "../../lib/caseLayouts";
import { listCaseWidgets } from "../../lib/caseWidgetContent";
import { transactionLine } from "../../lib/queue";
import "./CaseDetail.css";

const NOTE_MAX = 250;

function GearIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="2.25" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8 1.5v1.6M8 12.9v1.6M1.5 8h1.6M12.9 8h1.6M3.2 3.2l1.1 1.1M11.7 11.7l1.1 1.1M12.8 3.2l-1.1 1.1M4.3 11.7l-1.1 1.1"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
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
  const [events, setEvents] = useState([]);
  const [note, setNote] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const layouts = useCaseLayouts();

  useEffect(() => {
    if (!flash) return;
    document.getElementById("case-widget-history")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [flash]);

  if (!item) {
    return (
      <div className="ts-case">
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
  const decisionLabel =
    item.status === "approved" ? "Approve" :
    item.status === "declined" ? "Decline" :
    item.status === "held" ? "Hold" : "Open";
  const caseStatus =
    item.status === "approved"
      ? "Closed · approved"
      : item.status === "declined"
        ? "Closed · declined"
        : item.status === "held"
          ? "Active review"
          : "Under investigation";

  function patch(partial, event) {
    onRowsChange((prevRows) => prevRows.map((entry) => (entry.id === item.id ? { ...entry, ...partial } : entry)));
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
    onFlash?.("Note added to the case.");
    document.getElementById("case-widget-history")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function cycleAssign() {
    const index = ANALYSTS.indexOf(item.assignee);
    const nextAnalyst = ANALYSTS[(index + 1) % ANALYSTS.length];
    patch({ assignee: nextAnalyst }, { kind: "Assign", detail: `Assigned to ${nextAnalyst}` });
  }

  function showHistory() {
    document.getElementById("case-widget-history")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function openEditor() {
    setEditMode(true);
    setDrawerOpen(true);
  }

  return (
    <div className="ts-case">
      <main className="ts-case__main">
        <div className="ts-case__header">
          <a href="#/" className="ts-case__back" onClick={(event) => { event.preventDefault(); onBack(); }}>
            ← Case details
          </a>
          <StatusChip status={item.status} />
          <span className="ts-meta">
            <span className="ts-meta__label">Decision</span>
            <span className="ts-meta__value">{decisionLabel}</span>
          </span>
          <span className="ts-meta">
            <span className="ts-meta__label">Case status</span>
            <span className="ts-meta__value">{caseStatus}</span>
          </span>
          <span className="ts-meta">
            <span className="ts-meta__label">Assignee</span>
            <span className="ts-meta__value">{item.assignee}</span>
          </span>
          <div className="ts-case__nav">
            <Button size="sm" variant="ghost" disabled={!prev} onClick={() => prev && onOpen(prev)}>
              Prev
            </Button>
            <Button size="sm" variant="ghost" disabled={!next} onClick={() => next && onOpen(next)}>
              Next
            </Button>
            <button type="button" className="ts-case__settings" aria-label="Settings" onClick={() => setDrawerOpen(true)}>
              <GearIcon />
            </button>
          </div>
        </div>

        <ActionBar
          variant="paymentsFraud"
          note={note}
          onNoteChange={setNote}
          onAddNote={submitNote}
          noteMax={NOTE_MAX}
          disabled={closed}
          onApprove={() => decide("approved")}
          onDecline={() => decide("declined")}
          onHold={() => decide("held")}
          onAssign={cycleAssign}
          onHistory={showHistory}
          onLists={() => {
            patch({}, { kind: "Lists", detail: "Opened linked lists for this case" });
            onFlash?.("Lists opened for this case.");
          }}
          onReasonCodes={() => {
            patch({}, { kind: "Reason codes", detail: item.topReason });
            onFlash?.(`Reason code: ${item.topReason}`);
          }}
          onChargeback={() => patch({}, { kind: "Chargeback", detail: "Chargeback marked on the case" })}
          onFraudStatus={() => patch({}, { kind: "Fraud", detail: "Fraud status updated" })}
          onRefunds={() => patch({}, { kind: "Refund", detail: "Refund recorded on the case" })}
        />

        <WidgetGrid
          items={layouts.active.items}
          editMode={editMode}
          context={{ item, events, onExplain: () => setExplain(true) }}
          onSizeChange={layouts.setSize}
          onRemove={layouts.removeItem}
          onReorder={layouts.reorder}
          onEditWidgets={openEditor}
          onEditContent={() => onFlash?.("Editing widget content is not available yet.")}
        />

        <p className="ts-case__footnote">
          Reconstruction of a payments-fraud case view. Queue rows open this screen, not the score modal.
          The explainer is still available from Velocities. Weights stay hidden. Reason codes stay pre-scripted.
          Shopping cart and Ekata are labeled stubs. Layouts are stored in this browser only.
        </p>
      </main>

      <LayoutDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        layouts={layouts.layouts}
        activeId={layouts.active.id}
        editMode={editMode}
        catalog={listCaseWidgets()}
        onSelect={layouts.select}
        onCreate={layouts.create}
        onRename={layouts.rename}
        onDelete={layouts.remove}
        onAdd={layouts.addItem}
        onEditModeChange={setEditMode}
      />

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
