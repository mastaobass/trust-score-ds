import FieldRow from "../FieldRow/FieldRow";
import NetworkStat from "../NetworkStat/NetworkStat";
import SosRow from "../SosRow/SosRow";
import VerificationChip from "../VerificationChip/VerificationChip";
import { money } from "../../lib/queue";
import "./CaseDetail.css";

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

export function PersonaPanel({ item }) {
  return item.sos.map((row) => (
    <SosRow key={row.label} tone={row.tone}>
      {row.label}
    </SosRow>
  ));
}

export function NetworkPanel({ item }) {
  return item.network.map((row) => <NetworkStat key={row.label} {...row} />);
}

export function PaymentPanel({ item }) {
  return (
    <>
      <div className="ts-verify-row">
        {item.paymentMeta.flags.map((flag) => (
          <VerificationChip key={flag.code} code={flag.code} result={flag.result} />
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
  );
}

export function VelocitiesPanel({ item }) {
  return <VelocityChart series={item.velocity} />;
}

export function IdentityPanel({ item }) {
  return (
    <>
      <p className="ts-case__muted">Score {item.identity.score} / 500. Reconstructed identity signals, not a live bureau call.</p>
      <div className="ts-idmeter" aria-hidden="true">
        <span style={{ width: `${Math.min(100, (item.identity.score / 500) * 100)}%` }} />
      </div>
      <FieldRow label="IP" value={item.identity.ip} />
      <FieldRow label="Phone" value={item.identity.phone} />
    </>
  );
}

export function OrderPanel({ item }) {
  return (
    <dl className="ts-fields">
      <FieldRow label="Customer name" value={item.customerName} />
      <FieldRow label="Customer e-mail" value={item.customerEmail} />
      <FieldRow label="Shipping e-mail" value={item.shippingEmail} />
      <FieldRow label="Queued" value={item.time} />
      <FieldRow label="Top reason" value={item.topReason} />
      <FieldRow label="Caught by" value={item.caughtBy} />
      <FieldRow label="Standing" value={item.standing} />
      <FieldRow label="Customer created" value={item.customerCreated} />
      <FieldRow label="E-mail age (days)" value={String(item.emailAgeDays)} />
      <FieldRow label="Priority" value={item.priority} />
      <FieldRow label="Customer ID" value={item.customerId} />
      <FieldRow label="Transaction ID" value={item.transactionId} />
      <FieldRow label="Order number" value={item.orderNumber} />
    </dl>
  );
}

export function PoliciesPanel({ item }) {
  return item.policies.map((block) => (
    <div key={block.heading}>
      <p className="ts-case__policy-h">{block.heading}</p>
      <ul>
        {block.items.map((entry) => (
          <li key={entry}>{entry}</li>
        ))}
      </ul>
    </div>
  ));
}

export function HistoryPanel({ events }) {
  if (events.length === 0) {
    return <p className="ts-case__muted">No analyst notes or decisions yet.</p>;
  }
  return (
    <ul className="ts-history">
      {events.map((event) => (
        <li key={event.id}>
          <strong>{event.kind}</strong> · {event.at}
          <div>{event.detail}</div>
        </li>
      ))}
    </ul>
  );
}

export function ReversalsPanel({ item, events }) {
  const reversalEvents = events.filter((event) => ["Chargeback", "Fraud", "Refund"].includes(event.kind));
  return (
    <>
      <p className="ts-case__muted">Seeded reversal status. Chargeback, fraud, and refund actions stay on the action bar.</p>
      <FieldRow label="Chargeback" value={item.chargebackStatus} />
      <FieldRow label="Standing" value={item.standing} />
      {reversalEvents.length > 0 ? (
        <ul className="ts-history">
          {reversalEvents.map((event) => (
            <li key={event.id}>
              <strong>{event.kind}</strong>
              <div>{event.detail}</div>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

export function ShoppingCartPanel({ item }) {
  return (
    <>
      <p className="ts-case__muted">Shopping cart is not in this reconstruction. No line items are stored.</p>
      <FieldRow label="Order" value={item.orderNumber} />
      <FieldRow label="Total" value={money(item.amount)} />
    </>
  );
}

export function EkataPanel({ item }) {
  return (
    <>
      <p className="ts-case__muted">Ekata is not connected. No bureau payload is stored on this case.</p>
      <FieldRow label="Identity score" value={`${item.identity.score} / 500`} />
      <FieldRow label="IP" value={item.identity.ip} />
    </>
  );
}
