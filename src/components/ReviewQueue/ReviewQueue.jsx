import { useCallback, useMemo, useRef, useState } from "react";
import Button from "../Button/Button";
import CaseDetail from "../CaseDetail/CaseDetail";
import Pill from "../Pill/Pill";
import QueueGrid from "../QueueGrid/QueueGrid";
import QueueOptionsPanel from "../QueueOptionsPanel/QueueOptionsPanel";
import QueueToolbar from "../QueueToolbar/QueueToolbar";
import { QUEUE } from "../../lib/queue";
import {
  applyQueueView,
  filterQueueRows,
  getStoredQueueViewId,
  setStoredQueueViewId,
} from "../../lib/queueViews";
import "./ReviewQueue.css";

const DEMO_STATES = ["loaded", "loading", "empty", "error"];

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
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [density, setDensity] = useState("comfortable");
  const [gridApi, setGridApi] = useState(null);
  const [shown, setShown] = useState(null);
  const [merchantViewId, setMerchantViewId] = useState(getStoredQueueViewId);
  const merchantViewIdRef = useRef(merchantViewId);
  merchantViewIdRef.current = merchantViewId;

  const rows = rowsProp ?? internalRows;
  const setRows = onRowsChange ?? setInternalRows;
  const viewRows = useMemo(() => filterQueueRows(rows, merchantViewId), [rows, merchantViewId]);
  const reviewCount = rows.filter((row) => row.status === "review").length;
  const productPath = typeof onOpenCase === "function";

  const openRow = useCallback(
    (id) => {
      if (productPath) onOpenCase(id);
      else setCaseId(id);
    },
    [productPath, onOpenCase],
  );

  // Stable callback so QueueGrid’s onReady cleanup does not clear the API on view change.
  const handleGridReady = useCallback((api) => {
    setGridApi(api);
    if (api) applyQueueView(api, merchantViewIdRef.current);
  }, []);

  const handleMerchantViewChange = useCallback(
    (viewId) => {
      const next = setStoredQueueViewId(viewId);
      setMerchantViewId(next);
      applyQueueView(gridApi, next);
    },
    [gridApi],
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
        <div className="ts-queue__heading">
          <h1 className="ts-queue__title">Transaction Queue</h1>
          {view === "loaded" ? (
            <Pill tone="warning">
              {reviewCount} need a decision
            </Pill>
          ) : (
            <p className="ts-queue__count">Demo state: {view}</p>
          )}
        </div>
      </header>

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
            shown={shown ?? viewRows.length}
            total={viewRows.length}
            merchantViewId={merchantViewId}
            onMerchantViewChange={handleMerchantViewChange}
          />
          <div className="ts-queue__workspace">
            <section className="ts-queue__panel ts-queue__panel--grid">
              <QueueGrid
                rows={viewRows}
                quickFilter={quickFilter}
                density={density}
                productPath={productPath}
                onOpen={openRow}
                onReady={handleGridReady}
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

      <div className="ts-queue__states" role="group" aria-label="Queue demo states">
        {DEMO_STATES.map((state) => {
          const selected = view === state;
          return (
            <Button
              key={state}
              size="sm"
              variant="ghost"
              className={selected ? "ts-queue__state-btn--selected" : undefined}
              aria-pressed={selected}
              onClick={() => setView(state)}
            >
              {state === "loaded" ? "Queue" : state[0].toUpperCase() + state.slice(1)}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
