import { useState } from "react";
import Button from "../Button/Button";
import ActionBarField from "../ActionBarField/ActionBarField";
import ActionBarSection from "../ActionBarSection/ActionBarSection";
import "./ActionBar.css";

const DECISIONS = [
  { value: "allow", label: "Allow" },
  { value: "block", label: "Block" },
  { value: "escalate", label: "Escalate" },
];

const REASONS = [
  { value: "mule", label: "Mule pattern" },
  { value: "ato", label: "Account takeover" },
  { value: "synthetic", label: "Synthetic identity" },
  { value: "velocity", label: "Velocity abuse" },
];

function useOptionalState(value, onChange) {
  const [local, setLocal] = useState("");
  const current = value !== undefined ? value : local;
  function set(next) {
    if (value === undefined) setLocal(next);
    onChange?.(next);
  }
  return [current, set];
}

/**
 * Case action strip. `paymentsFraud` matches the payments case bar.
 * `app` is the APP review bar (selects and dates stay local unless controlled).
 */
export default function ActionBar({
  variant = "paymentsFraud",
  note,
  onNoteChange,
  onAddNote,
  noteMax = 250,
  disabled = false,
  onApprove,
  onDecline,
  onHold,
  onAssign,
  onHistory,
  onChargeback,
  onFraudStatus,
  onRefunds,
  decision,
  onDecisionChange,
  reason,
  onReasonChange,
  reviewerNote,
  onReviewerNoteChange,
  onSubmit,
  processDate = "2026-08-20",
  reviewDate = "2026-08-20",
  onAssignAgent,
  onCaseHistory,
  onCloseCase,
}) {
  const [noteValue, setNote] = useOptionalState(note, onNoteChange);
  const [decisionValue, setDecision] = useOptionalState(decision, onDecisionChange);
  const [reasonValue, setReason] = useOptionalState(reason, onReasonChange);
  const [reviewValue, setReview] = useOptionalState(reviewerNote, onReviewerNoteChange);

  function addNote() {
    if (!noteValue.trim()) return;
    onAddNote?.();
  }

  if (variant === "app") {
    return (
      <div className="ts-action-bar ts-action-bar--app">
        <ActionBarSection label="Review action" className="ts-action-bar__review">
          <ActionBarField
            kind="select"
            width={200}
            placeholder="Decision: Allow / Block / Escalate"
            ariaLabel="Decision"
            value={decisionValue}
            onChange={setDecision}
            options={DECISIONS}
          />
          <ActionBarField
            kind="select"
            width={180}
            placeholder="Reason code (e.g. Mule pattern)"
            ariaLabel="Reason code"
            value={reasonValue}
            onChange={setReason}
            options={REASONS}
          />
          <ActionBarField
            kind="text"
            width={160}
            placeholder="Reviewer note"
            ariaLabel="Reviewer note"
            value={reviewValue}
            onChange={setReview}
          />
          <Button variant="accent" size="sm" onClick={() => onSubmit?.()}>
            Submit
          </Button>
        </ActionBarSection>
        <ActionBarSection label="Dates">
          <ActionBarField kind="chip" width={180} value={`Process: ${processDate}`} />
          <ActionBarField kind="chip" width={180} value={`Review: ${reviewDate}`} />
        </ActionBarSection>
        <ActionBarSection label="Case">
          <Button variant="raised" size="sm" onClick={() => onAssignAgent?.()}>
            Assign Agent
          </Button>
          <Button variant="raised" size="sm" onClick={() => onCaseHistory?.()}>
            Case History
          </Button>
          <Button variant="critical" size="sm" onClick={() => onCloseCase?.()}>
            Close Case
          </Button>
        </ActionBarSection>
      </div>
    );
  }

  return (
    <div className="ts-action-bar">
      <ActionBarSection label="Decision">
        <Button variant="accent" size="sm" disabled={disabled} onClick={onApprove}>
          Approve
        </Button>
        <Button variant="critical" size="sm" disabled={disabled} onClick={onDecline}>
          Decline
        </Button>
      </ActionBarSection>
      <ActionBarSection label="Note" className="ts-action-bar__note">
        <ActionBarField
          kind="note"
          value={noteValue}
          onChange={setNote}
          maxLength={noteMax}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addNote();
            }
          }}
        />
        <Button variant="accent" size="sm" disabled={!noteValue.trim()} onClick={addNote}>
          Add Note
        </Button>
      </ActionBarSection>
      <ActionBarSection label="Controls">
        <Button variant="accent" size="sm" disabled={disabled} onClick={onAssign}>
          Assign User
        </Button>
        <Button variant="accent" size="sm" disabled={disabled} onClick={onHistory}>
          History
        </Button>
        {onHold ? (
          <Button variant="raised" size="sm" disabled={disabled} onClick={onHold}>
            Hold
          </Button>
        ) : null}
      </ActionBarSection>
      <ActionBarSection label="Reversals">
        <Button variant="accent" size="sm" disabled={disabled} onClick={onChargeback}>
          Chargeback
        </Button>
        <Button variant="accent" size="sm" disabled={disabled} onClick={onFraudStatus}>
          Fraud Status
        </Button>
        <Button variant="accent" size="sm" disabled={disabled} onClick={onRefunds}>
          Refunds
        </Button>
      </ActionBarSection>
    </div>
  );
}
