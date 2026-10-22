import { useMemo, useState } from "react";
import ActionBar from "../ActionBar/ActionBar";
import Banner from "../Banner/Banner";
import Button from "../Button/Button";
import Drawer from "../Drawer/Drawer";
import FieldRow from "../FieldRow/FieldRow";
import NetworkStat from "../NetworkStat/NetworkStat";
import ScoreHero from "../ScoreHero/ScoreHero";
import SosRow from "../SosRow/SosRow";
import StatusChip from "../StatusChip/StatusChip";
import TrustScoreModal from "../TrustScoreModal/TrustScoreModal";
import VerificationChip from "../VerificationChip/VerificationChip";
import Widget from "../Widget/Widget";
import WidgetGrid from "../WidgetGrid/WidgetGrid";
import { ANALYSTS, neighborIds, seedCase } from "../../lib/cases";
import { money, transactionLine } from "../../lib/queue";
import {
  addWidgetItem,
  CASE_WIDGET_CATALOG,
  clampWidgetOrigin,
  getStoredWidgetLayoutId,
  loadWidgetLayout,
  moveWidgetItem,
  setStoredWidgetLayoutId,
  setStoredWidgetLayoutItems,
  WIDGET_LAYOUTS,
} from "../../lib/widgetLayouts";
import "./CaseDetail.css";

const NOTE_MAX = 250;
const GRID_MAX_ROWS = 6;
const GRID_COLS = 4;

function initialLayout() {
  return loadWidgetLayout(getStoredWidgetLayoutId());
}

function PageCogIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852 1.01 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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

function widgetChrome(layoutItem, {
  title,
  className,
  ariaLabel,
  children,
  onSizeChange,
  onPositionChange,
  onPositionPreview,
}) {
  return (
    <Widget
      title={title}
      className={className}
      aria-label={ariaLabel}
      colSpan={layoutItem.colSpan}
      rowSpan={layoutItem.rowSpan}
      resizable
      onSizeChange={onSizeChange}
      onPositionChange={onPositionChange}
      onPositionPreview={onPositionPreview}
    >
      {children}
    </Widget>
  );
}

function RadioGlyph({ checked }) {
  return (
    <span className="ts-case__radio-glyph" data-checked={checked ? "true" : "false"} aria-hidden="true">
      {checked ? <span className="ts-case__radio-glyph-fill" /> : null}
    </span>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg
      className="ts-case__widgets-chevron"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      data-open={open ? "true" : "false"}
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** id → renderer. Grid stays content-agnostic; CaseDetail owns the map. */
function renderCaseWidget(itemId, ctx) {
  const { item, layoutItem, events, onSizeChange, onPositionChange, onPositionPreview, onExplain } = ctx;
  const chrome = (props) =>
    widgetChrome(layoutItem, {
      ...props,
      onSizeChange,
      onPositionChange,
      onPositionPreview,
    });

  switch (itemId) {
    case "trust-score":
      return chrome({
        title: "Trust score",
        children: <ScoreHero score={item.score} confidence={item.confidence} />,
      });
    case "banner":
      return chrome({
        className: "ts-widget--banner",
        ariaLabel: "Case banner",
        children: (
          <Banner
            variant="paymentsFraud"
            queued={item.time}
            score={item.score}
            topReason={item.topReason}
            caughtBy={item.caughtBy}
            standing={item.standing}
          />
        ),
      });
    case "case-history":
      return chrome({
        title: "Case history",
        children:
          events.length === 0 ? (
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
          ),
      });
    case "sos":
      return chrome({
        title: "SOS",
        children: item.sos.map((row) => (
          <SosRow key={row.label} tone={row.tone}>
            {row.label}
          </SosRow>
        )),
      });
    case "network":
      return chrome({
        title: "Across the network",
        children: item.network.map((row) => <NetworkStat key={row.label} {...row} />),
      });
    case "payment":
      return chrome({
        title: "Payment",
        children: (
          <>
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
          </>
        ),
      });
    case "velocities":
      return chrome({
        title: "Velocities",
        children: (
          <>
            <div className="ts-card__head-row">
              <Button size="sm" variant="ghost" onClick={onExplain}>
                Explain score {item.score.toFixed(1)}
              </Button>
            </div>
            <VelocityChart series={item.velocity} />
          </>
        ),
      });
    case "identity":
      return chrome({
        title: "Identity check",
        children: (
          <>
            <p className="ts-case__muted">
              Score {item.identity.score} / 500. Reconstructed identity signals, not a live bureau call.
            </p>
            <div className="ts-idmeter" aria-hidden="true">
              <span style={{ width: `${Math.min(100, (item.identity.score / 500) * 100)}%` }} />
            </div>
            <FieldRow label="IP" value={item.identity.ip} />
            <FieldRow label="Phone" value={item.identity.phone} />
          </>
        ),
      });
    case "transaction":
      return chrome({
        title: "Transaction info",
        children: (
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
        ),
      });
    case "policies":
      return chrome({
        title: "Policies triggered",
        children: item.policies.map((block) => (
          <div key={block.heading}>
            <p className="ts-case__policy-h">{block.heading}</p>
            <ul>
              {block.items.map((entry) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>
          </div>
        )),
      });
    default:
      return null;
  }
}

export default function CaseDetail({ id, rows, onRowsChange, flash, onFlash, onBack, onOpen }) {
  const row = rows.find((r) => r.id === id);
  const item = useMemo(() => {
    const seed = seedCase(id);
    if (!seed || !row) return null;
    return { ...seed, ...row };
  }, [id, row]);

  const [explain, setExplain] = useState(false);
  // `flash` is owned by the parent toast; case-history lives in the widget grid.
  void flash;
  const [events, setEvents] = useState([]);
  const [note, setNote] = useState("");
  const [viewsOpen, setViewsOpen] = useState(false);
  const [paymentsOpen, setPaymentsOpen] = useState(true);
  const [layoutId, setLayoutId] = useState(() => initialLayout().id);
  const [layoutItems, setLayoutItems] = useState(() => initialLayout().items);
  const [dropTarget, setDropTarget] = useState(null);

  if (!item) {
    return (
      <div className="ts-case">
        <main className="ts-case__missing">
          <h1>No case for that order</h1>
          <p>The queue only holds the reconstructed payments in this console.</p>
          <a href="#/">Back to case queue</a>
        </main>
      </div>
    );
  }

  const closed = item.status === "approved" || item.status === "declined";
  const { prev, next } = neighborIds(id);

  function persistItems(nextItems) {
    setLayoutItems(nextItems);
    setStoredWidgetLayoutItems(layoutId, nextItems);
  }

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
    onFlash?.("Note added to the case.");
  }

  function cycleAssign() {
    const i = ANALYSTS.indexOf(item.assignee);
    const nextAnalyst = ANALYSTS[(i + 1) % ANALYSTS.length];
    patch({ assignee: nextAnalyst }, { kind: "Assign", detail: `Assigned to ${nextAnalyst}` });
  }

  function selectLayout(nextId) {
    const next = setStoredWidgetLayoutId(nextId);
    const loaded = loadWidgetLayout(next);
    setLayoutId(loaded.id);
    setLayoutItems(loaded.items);
  }

  function updateWidgetSize(widgetId, size) {
    persistItems(
      layoutItems.map((entry) =>
        entry.id === widgetId
          ? { ...entry, colSpan: size.colSpan, rowSpan: size.rowSpan }
          : entry,
      ),
    );
  }

  function updateWidgetPosition(widgetId, { column, row: nextRow, cols }) {
    setDropTarget(null);
    persistItems(moveWidgetItem(layoutItems, widgetId, column, nextRow, cols ?? GRID_COLS, GRID_MAX_ROWS));
  }

  function previewWidgetPosition(widgetId, preview) {
    if (!preview) {
      setDropTarget(null);
      return;
    }
    const layoutItem = layoutItems.find((entry) => entry.id === widgetId);
    if (!layoutItem) {
      setDropTarget(null);
      return;
    }
    const cols = preview.cols ?? GRID_COLS;
    const origin = clampWidgetOrigin(
      preview.column,
      preview.row,
      layoutItem.colSpan,
      layoutItem.rowSpan,
      cols,
      GRID_MAX_ROWS,
    );
    setDropTarget(origin);
  }

  function addCatalogWidget(catalogEntry) {
    persistItems(addWidgetItem(layoutItems, catalogEntry, GRID_COLS, GRID_MAX_ROWS));
  }

  const placedWidgetIds = new Set(layoutItems.map((entry) => entry.id));

  const caseStatus =
    item.status === "approved"
      ? "Closed · approved"
      : item.status === "declined"
        ? "Closed · declined"
        : item.status === "held"
          ? "Active review"
          : "Under investigation";

  const workspaceClass = ["ts-case__workspace", viewsOpen ? "ts-case__workspace--drawer-open" : null]
    .filter(Boolean)
    .join(" ");
  const mainClass = ["ts-case__main", viewsOpen ? "ts-case__main--drawer-open" : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="ts-case">
      <div className={workspaceClass}>
        <main className={mainClass}>
          <div className="ts-case__blur-zone">
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
                <Button
                  size="sm"
                  variant="secondary"
                  className="ts-case__nav-cog"
                  aria-label="Page views"
                  aria-pressed={viewsOpen}
                  aria-expanded={viewsOpen}
                  onClick={() => setViewsOpen(true)}
                >
                  <PageCogIcon />
                </Button>
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
              onHistory={() => {
                /* case-history is a grid widget; flash scroll target via flash helper */
                onFlash?.("Case history is in the widget grid.");
              }}
              onChargeback={() => patch({}, { kind: "Chargeback", detail: "Chargeback marked on the case" })}
              onFraudStatus={() => patch({}, { kind: "Fraud", detail: "Fraud status updated" })}
              onRefunds={() => patch({}, { kind: "Refund", detail: "Refund recorded on the case" })}
            />
          </div>

          <WidgetGrid
            className="ts-case__widget-grid"
            aria-label="Case widgets"
            maxRows={GRID_MAX_ROWS}
          >
            {layoutItems.map((layoutItem) => {
              const content = renderCaseWidget(layoutItem.id, {
                item,
                layoutItem,
                events,
                onSizeChange: (size) => updateWidgetSize(layoutItem.id, size),
                onPositionChange: (pos) => updateWidgetPosition(layoutItem.id, pos),
                onPositionPreview: (preview) => previewWidgetPosition(layoutItem.id, preview),
                onExplain: () => setExplain(true),
              });
              if (!content) return null;
              return (
                <WidgetGrid.Item
                  key={layoutItem.id}
                  column={layoutItem.column}
                  row={layoutItem.row}
                  colSpan={layoutItem.colSpan}
                  rowSpan={layoutItem.rowSpan}
                >
                  {content}
                </WidgetGrid.Item>
              );
            })}
            {dropTarget ? (
              <WidgetGrid.DropTarget
                column={dropTarget.column}
                row={dropTarget.row}
                colSpan={dropTarget.colSpan}
                rowSpan={dropTarget.rowSpan}
              />
            ) : null}
          </WidgetGrid>

          <p className="ts-case__footnote ts-case__blur-zone">
            Reconstruction of a payments-fraud case view. Queue rows open this screen, not the score modal.
            The explainer is still available from Velocities. Weights stay hidden. Reason codes stay pre-scripted.
          </p>
        </main>

        <Drawer
          mode="push"
          open={viewsOpen}
          title="Settings"
          onClose={() => setViewsOpen(false)}
        >
          <div className="ts-case__drawer-body">
            <section className="ts-case__drawer-section" aria-labelledby="ts-case-views-label">
              <h3 className="ts-case__drawer-heading" id="ts-case-views-label">
                Saved Views
              </h3>
              <div
                className="ts-case__views-options"
                role="radiogroup"
                aria-labelledby="ts-case-views-label"
              >
                {WIDGET_LAYOUTS.map((layout) => {
                  const selected = layoutId === layout.id;
                  return (
                    <button
                      key={layout.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      className="ts-case__views-option"
                      onClick={() => selectLayout(layout.id)}
                    >
                      <RadioGlyph checked={selected} />
                      <span className="ts-case__views-option-label">{layout.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="ts-case__drawer-section" aria-labelledby="ts-case-widgets-label">
              <h3 className="ts-case__drawer-heading" id="ts-case-widgets-label">
                Widgets
              </h3>
              <div className="ts-case__widgets-category">
                <button
                  type="button"
                  className="ts-case__widgets-category-toggle"
                  aria-expanded={paymentsOpen}
                  aria-controls="ts-case-widgets-payments"
                  onClick={() => setPaymentsOpen((open) => !open)}
                >
                  <span>Payments</span>
                  <ChevronIcon open={paymentsOpen} />
                </button>
                {paymentsOpen ? (
                  <div
                    id="ts-case-widgets-payments"
                    className="ts-case__widgets-list"
                    role="group"
                    aria-label="Payments widgets"
                  >
                    {CASE_WIDGET_CATALOG.map((entry) => {
                      const alreadyPlaced = placedWidgetIds.has(entry.id);
                      return (
                        <button
                          key={entry.id}
                          type="button"
                          className="ts-case__widget-add"
                          disabled={alreadyPlaced}
                          aria-label={
                            alreadyPlaced
                              ? `${entry.title} already on the grid`
                              : `Add ${entry.title}`
                          }
                          onClick={() => addCatalogWidget(entry)}
                        >
                          <span className="ts-case__widget-add-plus" aria-hidden="true">
                            +
                          </span>
                          <span>{entry.title}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </section>
          </div>
        </Drawer>
      </div>

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
