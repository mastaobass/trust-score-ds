import { bandFor } from "./score";
import { QUEUE } from "./queue";

export const ANALYSTS = ["Salvador Perez", "Camila Rios", "Jordan Hale"];

const PERSONA = {
  "48291-C": { name: "Mara Ellison", email: "mara.ellison@example.com", shipping: "mara.ellison@example.com", created: "Mar 2, 2024 8:14 AM", emailAge: 842, shipAge: 842, assignee: "Salvador Perez", binCountry: "United States" },
  "11904-A": { name: "Ravi Chen", email: "r.chen.7742@mailtemp.example", shipping: "ravichen.ship@inbox.example", created: "Jul 13, 2026 4:02 PM", emailAge: 1, shipAge: 0, assignee: "Camila Rios", binCountry: "Canada" },
  "77320-F": { name: "Priya Nunez", email: "priya.nunez@example.com", shipping: "priya.nunez@example.com", created: "Nov 18, 2025 11:22 AM", emailAge: 268, shipAge: 268, assignee: "Jordan Hale", binCountry: "United States" },
  "33011-B": { name: "Helen Cho", email: "helen.cho@example.com", shipping: "helen.cho@example.com", created: "Jan 9, 2023 2:48 PM", emailAge: 1312, shipAge: 1312, assignee: "Salvador Perez", binCountry: "United States" },
  "90412-D": { name: "Dominic Hale", email: "d.hale@redwood.example", shipping: "guest.ship.90412@inbox.example", created: "Apr 4, 2025 9:01 AM", emailAge: 466, shipAge: 2, assignee: "Camila Rios", binCountry: "United Kingdom" },
  "55108-E": { name: "Noor Alavi", email: "n.alavi.new@inbox.example", shipping: "drop.ship.55108@inbox.example", created: "Jul 14, 2026 8:55 AM", emailAge: 0, shipAge: 0, assignee: "Jordan Hale", binCountry: "Nigeria" },
  "66217-G": { name: "Samira West", email: "samira.west@example.com", shipping: "samira.west@example.com", created: "Jun 21, 2024 10:16 AM", emailAge: 753, shipAge: 753, assignee: "Salvador Perez", binCountry: "United States" },
  "22845-H": { name: "Theo Grant", email: "theo.grant@brightline.example", shipping: "theo.grant@brightline.example", created: "Sep 30, 2025 6:41 PM", emailAge: 287, shipAge: 287, assignee: "Camila Rios", binCountry: "United States" },
  "81002-J": { name: "Chris Paloma", email: "c.paloma@mail.example", shipping: "c.paloma.alt@mail.example", created: "Feb 11, 2026 1:09 PM", emailAge: 153, shipAge: 12, assignee: "Jordan Hale", binCountry: "Mexico" },
  "44760-K": { name: "Elena Voss", email: "elena.voss@example.com", shipping: "elena.voss@example.com", created: "Aug 8, 2023 3:33 PM", emailAge: 1102, shipAge: 1102, assignee: "Salvador Perez", binCountry: "United States" },
};

function brandOf(payment) {
  if (payment.startsWith("MC")) return "Mastercard";
  if (payment.startsWith("Amex")) return "American Express";
  return "Visa";
}

function flagsFor(item) {
  if (item.status === "approved" || item.score >= 88) {
    return [
      { code: "AUTH", result: "pass" },
      { code: "AVSZ", result: "pass" },
      { code: "AVST", result: "pass" },
      { code: "CVV", result: "pass" },
    ];
  }
  if (item.status === "declined" || item.score < 50) {
    return [
      { code: "AUTH", result: "fail" },
      { code: "AVSZ", result: "fail" },
      { code: "AVST", result: "fail" },
      { code: "CVV", result: "fail" },
    ];
  }
  if (item.status === "held" || item.score < 70) {
    return [
      { code: "AUTH", result: "pass" },
      { code: "AVSZ", result: "fail" },
      { code: "AVST", result: "pass" },
      { code: "CVV", result: "fail" },
    ];
  }
  return [
    { code: "AUTH", result: "pass" },
    { code: "AVSZ", result: "fail" },
    { code: "AVST", result: "pass" },
    { code: "CVV", result: "na" },
  ];
}

function sosFor(item, persona) {
  const zip =
    persona.email === persona.shipping
      ? { tone: "pass", label: "Matching zip codes" }
      : { tone: "warn", label: "Billing and shipping regions differ" };
  const device = item.positiveReasons.some(
    (r) => r.active && r.label.includes("Device recognized"),
  )
    ? { tone: "pass", label: "Device recognized from prior orders" }
    : { tone: "warn", label: "New or anomalous device fingerprint" };
  const avs = item.positiveReasons.some((r) => r.active && r.label.includes("AVS"))
    ? { tone: "pass", label: "Full AVS match" }
    : { tone: "warn", label: "Flags on AVSZ / CVV" };
  const velocity = item.negativeReasons.some(
    (r) => r.active && r.label.toLowerCase().includes("velocity"),
  )
    ? { tone: "warn", label: "Elevated order velocity in 24 hours" }
    : { tone: "pass", label: "Velocity inside the merchant baseline" };
  const cb = item.status === "declined" || item.score < 55
    ? { tone: "warn", label: "Prior chargeback or incident density" }
    : { tone: "pass", label: "No open chargebacks on this customer" };
  return [zip, device, avs, velocity, cb].slice(0, item.score < 70 ? 5 : 3);
}

function networkFor(item) {
  const heat = Math.max(0, 100 - item.score);
  const emails = item.score > 80 ? 1 : item.score > 60 ? 2 : 4;
  const txns = item.score > 80 ? 48 : item.score > 60 ? 96 : 204;
  const devices = item.score > 80 ? 2 : item.score > 60 ? 7 : 23;
  const incidents = item.status === "approved" ? 0 : item.score > 70 ? 1 : item.score > 50 ? 3 : 6;
  return [
    { value: String(emails), label: "E-mails", share: Math.min(1, 0.15 + heat / 140) },
    { value: txns >= 200 ? "204+" : String(txns), label: "Transactions", share: Math.min(1, 0.25 + heat / 120) },
    { value: String(devices), label: "Devices", share: Math.min(1, 0.12 + devices / 40) },
    { value: String(incidents), label: "Incidents", share: Math.min(1, incidents / 8) },
  ];
}

function velocityFor(item) {
  const peak = item.score < 55 ? 42 : item.score < 75 ? 18 : 7;
  const seed = item.id.charCodeAt(0) + item.id.charCodeAt(1);
  return Array.from({ length: 24 }, (_, i) => {
    const pulse = Math.abs(Math.sin((seed + i) * 0.37));
    const burst = item.score < 60 && i > 16 ? 1.6 : 1;
    return Math.round(pulse * peak * burst);
  });
}

function caseStatusFor(status) {
  if (status === "approved") return "Closed · approved";
  if (status === "declined") return "Closed · declined";
  if (status === "held") return "Active review";
  return "Under investigation";
}

function priorityFor(item) {
  if (item.score < 55 || item.amount > 1500) return "Critical";
  if (item.score < 75 || item.amount > 400) return "High";
  return "Normal";
}

function topReason(item) {
  const hit = item.negativeReasons.find((r) => r.active);
  return hit?.label ?? "No negative reason codes active";
}

function caughtBy(item) {
  if (item.score < 55) return "Network floor";
  if (item.negativeReasons.some((r) => r.active && r.label.toLowerCase().includes("velocity"))) {
    return "Velocity rule";
  }
  if (item.status === "review") return "Model band";
  return "Merchant baseline";
}

function standing(item) {
  if (item.score >= 80) return "Confirm · Allow";
  if (item.score >= 60) return "Review · Hold";
  return "Decline · Escalate";
}

function policiesFor(item) {
  const pos = item.positiveReasons.filter((r) => r.active).slice(0, 3).map((r) => r.label);
  const neg = item.negativeReasons.filter((r) => r.active).slice(0, 3).map((r) => r.label);
  return [
    { heading: "Review policies", items: neg.length ? neg : ["None fired"] },
    { heading: "Approve policies", items: pos.length ? pos : ["None fired"] },
    {
      heading: item.score < 60 ? "Decline policies" : "Watch policies",
      items:
        item.score < 60
          ? ["Velocity floor", "Device fingerprint anomaly"]
          : ["BIN country check", "Email age review"],
    },
  ];
}

function buildCase(item) {
  const persona = PERSONA[item.id] ?? PERSONA["48291-C"];
  const compact = item.id.replace("-", "");
  return {
    ...item,
    assignee: persona.assignee,
    caseStatus: caseStatusFor(item.status),
    customerName: persona.name,
    customerEmail: persona.email,
    shippingEmail: persona.shipping,
    customerCreated: persona.created,
    emailAgeDays: persona.emailAge,
    shippingEmailAgeDays: persona.shipAge,
    customerId: `C-${compact}`,
    transactionId: `TS-${compact}`,
    orderNumber: compact.replace(/\D/g, "").padEnd(9, "0"),
    websiteId: "Default",
    priority: priorityFor(item),
    chargebackStatus:
      item.status === "declined"
        ? "Open dispute · reason 83"
        : item.score < 65
          ? "Watch · no open dispute"
          : "Clear",
    paymentMeta: {
      type: "Online",
      currency: "USD",
      binCountry: persona.binCountry,
      brand: brandOf(item.payment),
      flags: flagsFor(item),
    },
    sos: sosFor(item, persona),
    network: networkFor(item),
    velocity: velocityFor(item),
    identity: {
      score: Math.round(40 + item.score * 3.2),
      ip: item.negativeReasons.some((r) => r.active && r.label.includes("IP"))
        ? "IP 270 miles from billing"
        : "IP matches billing region",
      phone: item.score > 80 ? "Billing phone on file" : "No subscriber match on shipping phone",
    },
    policies: policiesFor(item),
    topReason: topReason(item),
    caughtBy: caughtBy(item),
    standing: standing(item),
  };
}

export const CASES = QUEUE.map(buildCase);

export function seedCase(id) {
  return CASES.find((c) => c.id === id) ?? null;
}

export function neighborIds(id) {
  const i = CASES.findIndex((c) => c.id === id);
  return {
    prev: i > 0 ? CASES[i - 1].id : null,
    next: i >= 0 && i < CASES.length - 1 ? CASES[i + 1].id : null,
  };
}

export function decisionLabel(status) {
  if (status === "approved") return "Decision: Approved";
  if (status === "declined") return "Decision: Declined";
  if (status === "held") return "Decision: Hold";
  return "Decision: Review";
}

export function bandTone(score) {
  const id = bandFor(score).id;
  return id === "high" ? "positive" : id === "medium" ? "warning" : "negative";
}
