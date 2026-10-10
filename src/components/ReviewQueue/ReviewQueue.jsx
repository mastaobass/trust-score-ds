import { useCallback, useState } from "react";
import Button from "../Button/Button";
import CaseDetail from "../CaseDetail/CaseDetail";
import QueueGrid from "../QueueGrid/QueueGrid";
import QueueOptionsPanel from "../QueueOptionsPanel/QueueOptionsPanel";
import QueueToolbar from "../QueueToolbar/QueueToolbar";
import { QUEUE } from "../../lib/queue";
import "./ReviewQueue.css";

/**
 * Review console composition.
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
  const [quickFilter, setQuickFilter] = useState("");
  const [optionsOpen, setOptionsOpen] = useState(true);
  const [density, setDensity] = useState("comfortable");
  const [gridApi, setGridApi] = useState(null);
  const [shown, setShown] = useState(null);

  const rows = rowsProp ?? internalRows;
  const setRows = onRowsChange ?? setInternalRows;
  const reviewCount = rows.filter((row) => row.status === "review").length;
  const productPath = typeof onOpenCase === "function";

  const openRow = useCallback(
    (id) => {
      if (productPath) onOpenCase(id);
      else setCaseId(id);
    },
    [productPath, onOpenCase],
  );

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

  return (
    <div className="ts-queue">
      <header className="ts-queue__header">
        <h1 className="ts-queue__title">Transaction queue</h1>
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
        {["loaded", "loading", "empty", "error"].map((state) => (
          <Button key={state} size="sm" variant={view === state ? "primary" : "ghost"} onClick={() => setView(state)}>
            {state === "loaded" ? "Queue" : state[0].toUpperCase() + state.slice(1)}
          </Button>
        ))}
      </div>

      {note && view === "loaded" ? (
        <p className="ts-queue__note" role="status">
          {note}
        </p>
      ) : null}

      {view === "loading" ? (
        <section className="ts-queue__panel">
          <div className="ts-queue__skeletons" aria-busy="true" aria-live="polite">
            <span className="ts-queue__sr">Loading review queue</span>
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="ts-queue__skeleton" />
            ))}
          </div>
        </section>
      ) : null}

      {view === "empty" ? (
        <section className="ts-queue__panel">
          <div className="ts-queue__state">
            <p className="ts-queue__state-title">Queue is clear</p>
            <p className="ts-queue__state-copy">
              No payments waiting for a human decision. New flags will land here as the model scores live traffic.
            </p>
          </div>
        </section>
      ) : null}

      {view === "error" ? (
        <section className="ts-queue__panel">
          <div className="ts-queue__state">
            <p className="ts-queue__state-title">Could not load the queue</p>
            <p className="ts-queue__state-copy">
              The review surface is downstream of the scoring service. Retry after the feed recovers. No decision was recorded.
            </p>
            <Button variant="secondary" onClick={() => setView("loaded")}>
              Retry
            </Button>
          </div>
        </section>
      ) : null}

      {view === "loaded" ? (
        <>
          <QueueToolbar
            value={quickFilter}
            onChange={setQuickFilter}
            optionsOpen={optionsOpen}
            onToggleOptions={() => setOptionsOpen((open) => !open)}
            shown={shown ?? rows.length}
            total={rows.length}
          />
          <div className="ts-queue__workspace">
            <section className="ts-queue__panel ts-queue__panel--grid">
              <QueueGrid
                rows={rows}
                quickFilter={quickFilter}
                density={density}
                productPath={productPath}
                onOpen={openRow}
                onReady={setGridApi}
                onDisplayedCount={setShown}
              />
            </section>
            {optionsOpen ? (
              <QueueOptionsPanel
                api={gridApi}
                density={density}
                onDensityChange={setDensity}
                onHide={() => setOptionsOpen(false)}
              />
            ) : null}
          </div>
        </>
      ) : null}

      <p className="ts-queue__footnote">
        Reconstruction of the Kount review surface. The model is proprietary, so this kit never exposes
        factor weights that would let someone reverse-engineer detection. Inactive reason codes stay visible
        because absence is information.
      </p>
    </div>
  );
}
