import Button from "../components/Button/Button";
import OmniscoreGauge from "../components/OmniscoreGauge/OmniscoreGauge";
import {
  EkataPanel,
  HistoryPanel,
  IdentityPanel,
  NetworkPanel,
  OrderPanel,
  PaymentPanel,
  PersonaPanel,
  PoliciesPanel,
  ReversalsPanel,
  ShoppingCartPanel,
  VelocitiesPanel,
} from "../components/CaseDetail/casePanels";

/** Case Detail widget catalog. `render` receives `{ item, events, onExplain }`. */
export const CASE_WIDGETS = {
  omniscore: {
    label: "Omniscore",
    defaultSize: "small",
    headerActions: (ctx) => (
      <button type="button" className="ts-widget__icon-btn" aria-label="Expand Omniscore" onClick={ctx.onExplain}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M9.5 2.5H13.5V6.5M6.5 13.5H2.5V9.5M13.5 2.5L9 7M2.5 13.5L7 9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    ),
    render: (ctx) => <OmniscoreGauge value={ctx.item.score} label="Omniscore" />,
  },
  order: {
    label: "Order information",
    defaultSize: "medium",
    render: (ctx) => <OrderPanel item={ctx.item} />,
  },
  reversals: {
    label: "Reversals",
    defaultSize: "small",
    info: "Seeded chargeback status. Actions stay on the action bar.",
    render: (ctx) => <ReversalsPanel item={ctx.item} events={ctx.events} />,
  },
  persona: {
    label: "Persona",
    defaultSize: "medium",
    render: (ctx) => <PersonaPanel item={ctx.item} />,
  },
  payment: {
    label: "Payment",
    defaultSize: "medium",
    render: (ctx) => <PaymentPanel item={ctx.item} />,
  },
  network: {
    label: "Network",
    defaultSize: "medium",
    render: (ctx) => <NetworkPanel item={ctx.item} />,
  },
  velocities: {
    label: "Velocities",
    defaultSize: "medium",
    headerActions: (ctx) => (
      <Button size="sm" variant="ghost" onClick={ctx.onExplain}>
        Explain score {ctx.item.score.toFixed(1)}
      </Button>
    ),
    render: (ctx) => <VelocitiesPanel item={ctx.item} />,
  },
  identity: {
    label: "Identity check",
    defaultSize: "medium",
    render: (ctx) => <IdentityPanel item={ctx.item} />,
  },
  policies: {
    label: "Policies triggered",
    defaultSize: "medium",
    render: (ctx) => <PoliciesPanel item={ctx.item} />,
  },
  history: {
    label: "Case history",
    defaultSize: "medium",
    render: (ctx) => <HistoryPanel events={ctx.events} />,
  },
  shoppingCart: {
    label: "Shopping cart",
    defaultSize: "small",
    info: "Stub. Line items are not stored on this case.",
    render: (ctx) => <ShoppingCartPanel item={ctx.item} />,
  },
  ekata: {
    label: "Ekata",
    defaultSize: "small",
    info: "Stub. Ekata is not connected.",
    render: (ctx) => <EkataPanel item={ctx.item} />,
  },
};

export function getCaseWidget(contentType) {
  return CASE_WIDGETS[contentType] ?? null;
}

export function listCaseWidgets() {
  return Object.entries(CASE_WIDGETS).map(([contentType, spec]) => ({
    contentType,
    label: spec.label,
    defaultSize: spec.defaultSize,
  }));
}
