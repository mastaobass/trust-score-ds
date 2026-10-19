/** One hundred reconstructed review-queue rows. Reasons are the pre-scripted vocabulary. */

const POS_VOCAB = [
  { label: "Established customer history · 2+ years", weight: 4.2, active: true },
  { label: "Strong issuer payment history", weight: 3.1, active: true },
  { label: "Device recognized from prior orders", weight: 2.8, active: true },
  { label: "Email address aged 3+ years", weight: 1.9, active: true },
  { label: "Basket matches customer profile", weight: 0.7, active: true },
  { label: "Billing and shipping addresses match", active: false },
  { label: "Full AVS match", active: false },
  { label: "Verified phone number on file", active: false },
  { label: "No prior chargebacks", active: false },
  { label: "Loyalty program member", active: false },
];

const NEG_VOCAB = [
  { label: "High order velocity · 3 in 24 hrs", weight: -3.5, active: true },
  { label: "IP location differs from billing region", weight: -2.2, active: true },
  { label: "Transaction outside typical hours", weight: -1.4, active: true },
  { label: "Proxy or VPN detected", active: false },
  { label: "Card BIN country mismatch", active: false },
  { label: "Multiple failed payment attempts", active: false },
  { label: "Recently created email domain", active: false },
  { label: "New shipping address", active: false },
  { label: "Device fingerprint anomaly", active: false },
  { label: "Unusual basket size or composition", active: false },
];

function reasons(source, activeLabels, weights = {}) {
  return source.map((row) => {
    const active = activeLabels.includes(row.label);
    const weight = weights[row.label] ?? row.weight ?? null;
    return { ...row, active, weight: active ? weight : null };
  });
}

const MERCHANTS = [
  "Northwind Outfitters",
  "Harbor & Co",
  "Lumen Digital",
  "Atlas Provisions",
];

const ASSIGNEES = ["Salvador Perez", "Camila Rios", "Jordan Hale"];

const PAYMENTS = [
  "Visa •••• 4021",
  "MC •••• 7742",
  "Visa •••• 1188",
  "Amex •••• 3002",
  "Visa •••• 8890",
  "Visa •••• 4410",
  "MC •••• 2201",
  "Visa •••• 9077",
  "MC •••• 5519",
  "Visa •••• 6623",
];

const STATUS_CYCLE = [
  "review",
  "review",
  "review",
  "approved",
  "held",
  "review",
  "declined",
  "review",
  "approved",
  "review",
];

const TEMPLATES = [
  {
    score: 85.6,
    confidence: 92,
    steps: [
      { label: "History", delta: 4.2 },
      { label: "Device", delta: 2.8 },
      { label: "Velocity", delta: -3.5 },
      { label: "Email", delta: 1.9 },
      { label: "Geo", delta: -2.2 },
      { label: "Payment", delta: 3.1 },
      { label: "Timing", delta: -1.4 },
      { label: "Basket", delta: 0.7 },
    ],
    positiveReasons: POS_VOCAB,
    negativeReasons: NEG_VOCAB,
  },
  {
    score: 51.2,
    confidence: 88,
    steps: [
      { label: "History", delta: -6.1 },
      { label: "Device", delta: -4.8 },
      { label: "Velocity", delta: -7.5 },
      { label: "Email", delta: 1.2 },
      { label: "Geo", delta: -5.9 },
      { label: "Payment", delta: -3.4 },
      { label: "Timing", delta: -2.1 },
      { label: "Basket", delta: -0.2 },
    ],
    positiveReasons: reasons(POS_VOCAB, ["Email address aged 3+ years"], {
      "Email address aged 3+ years": 1.2,
    }),
    negativeReasons: reasons(
      NEG_VOCAB,
      [
        "High order velocity · 3 in 24 hrs",
        "IP location differs from billing region",
        "Transaction outside typical hours",
        "Proxy or VPN detected",
        "Card BIN country mismatch",
        "Multiple failed payment attempts",
        "Device fingerprint anomaly",
      ],
      {
        "High order velocity · 3 in 24 hrs": -7.5,
        "IP location differs from billing region": -5.9,
        "Transaction outside typical hours": -2.1,
        "Proxy or VPN detected": -4.8,
        "Card BIN country mismatch": -3.4,
        "Multiple failed payment attempts": -6.1,
        "Device fingerprint anomaly": -4.8,
      },
    ),
  },
  {
    score: 73.4,
    confidence: 81,
    steps: [
      { label: "History", delta: 2.1 },
      { label: "Device", delta: -1.8 },
      { label: "Velocity", delta: -2.4 },
      { label: "Email", delta: 1.1 },
      { label: "Geo", delta: -3.0 },
      { label: "Payment", delta: 0.8 },
      { label: "Timing", delta: -1.1 },
      { label: "Basket", delta: -2.3 },
    ],
    positiveReasons: reasons(
      POS_VOCAB,
      [
        "Established customer history · 2+ years",
        "Email address aged 3+ years",
        "Strong issuer payment history",
      ],
      {
        "Established customer history · 2+ years": 2.1,
        "Email address aged 3+ years": 1.1,
        "Strong issuer payment history": 0.8,
      },
    ),
    negativeReasons: reasons(
      NEG_VOCAB,
      [
        "IP location differs from billing region",
        "High order velocity · 3 in 24 hrs",
        "Unusual basket size or composition",
        "New shipping address",
      ],
      {
        "IP location differs from billing region": -3.0,
        "High order velocity · 3 in 24 hrs": -2.4,
        "Unusual basket size or composition": -2.3,
        "New shipping address": -1.8,
      },
    ),
  },
  {
    score: 91.2,
    confidence: 96,
    steps: [
      { label: "History", delta: 5.1 },
      { label: "Device", delta: 3.4 },
      { label: "Velocity", delta: 0.4 },
      { label: "Email", delta: 2.2 },
      { label: "Geo", delta: 0.6 },
      { label: "Payment", delta: 2.8 },
      { label: "Timing", delta: -0.4 },
      { label: "Basket", delta: 1.1 },
    ],
    positiveReasons: reasons(POS_VOCAB, [
      "Established customer history · 2+ years",
      "Strong issuer payment history",
      "Device recognized from prior orders",
      "Email address aged 3+ years",
      "Basket matches customer profile",
      "Billing and shipping addresses match",
      "No prior chargebacks",
      "Loyalty program member",
    ]),
    negativeReasons: reasons(NEG_VOCAB, ["Transaction outside typical hours"], {
      "Transaction outside typical hours": -0.4,
    }),
  },
  {
    score: 64.8,
    confidence: 79,
    steps: [
      { label: "History", delta: 1.4 },
      { label: "Device", delta: -3.2 },
      { label: "Velocity", delta: -4.1 },
      { label: "Email", delta: 0.6 },
      { label: "Geo", delta: -4.8 },
      { label: "Payment", delta: 1.2 },
      { label: "Timing", delta: -2.6 },
      { label: "Basket", delta: -3.7 },
    ],
    positiveReasons: reasons(
      POS_VOCAB,
      [
        "Established customer history · 2+ years",
        "Strong issuer payment history",
        "Email address aged 3+ years",
      ],
      {
        "Established customer history · 2+ years": 1.4,
        "Strong issuer payment history": 1.2,
        "Email address aged 3+ years": 0.6,
      },
    ),
    negativeReasons: reasons(
      NEG_VOCAB,
      [
        "High order velocity · 3 in 24 hrs",
        "IP location differs from billing region",
        "Transaction outside typical hours",
        "New shipping address",
        "Unusual basket size or composition",
      ],
      {
        "High order velocity · 3 in 24 hrs": -4.1,
        "IP location differs from billing region": -4.8,
        "Transaction outside typical hours": -2.6,
        "New shipping address": -3.2,
        "Unusual basket size or composition": -3.7,
      },
    ),
  },
  {
    score: 42.1,
    confidence: 90,
    steps: [
      { label: "History", delta: -8.4 },
      { label: "Device", delta: -6.2 },
      { label: "Velocity", delta: -9.1 },
      { label: "Email", delta: -3.3 },
      { label: "Geo", delta: -5.0 },
      { label: "Payment", delta: -2.8 },
      { label: "Timing", delta: -1.6 },
      { label: "Basket", delta: -1.5 },
    ],
    positiveReasons: reasons(POS_VOCAB, []),
    negativeReasons: NEG_VOCAB.map((r) => ({ ...r, active: true, weight: r.weight ?? -2.4 })),
  },
  {
    score: 88.0,
    confidence: 94,
    steps: [
      { label: "History", delta: 3.8 },
      { label: "Device", delta: 3.0 },
      { label: "Velocity", delta: -1.2 },
      { label: "Email", delta: 2.4 },
      { label: "Geo", delta: 0.2 },
      { label: "Payment", delta: 2.6 },
      { label: "Timing", delta: -0.8 },
      { label: "Basket", delta: 0.0 },
    ],
    positiveReasons: reasons(POS_VOCAB, [
      "Established customer history · 2+ years",
      "Strong issuer payment history",
      "Device recognized from prior orders",
      "Email address aged 3+ years",
      "Full AVS match",
    ]),
    negativeReasons: reasons(
      NEG_VOCAB,
      ["High order velocity · 3 in 24 hrs", "Transaction outside typical hours"],
      {
        "High order velocity · 3 in 24 hrs": -1.2,
        "Transaction outside typical hours": -0.8,
      },
    ),
  },
  {
    score: 77.5,
    confidence: 84,
    steps: [
      { label: "History", delta: 2.6 },
      { label: "Device", delta: 1.4 },
      { label: "Velocity", delta: -2.0 },
      { label: "Email", delta: 0.9 },
      { label: "Geo", delta: -1.8 },
      { label: "Payment", delta: 1.5 },
      { label: "Timing", delta: -1.3 },
      { label: "Basket", delta: -3.8 },
    ],
    positiveReasons: reasons(
      POS_VOCAB,
      [
        "Established customer history · 2+ years",
        "Device recognized from prior orders",
        "Strong issuer payment history",
        "Email address aged 3+ years",
      ],
      {
        "Established customer history · 2+ years": 2.6,
        "Device recognized from prior orders": 1.4,
        "Strong issuer payment history": 1.5,
        "Email address aged 3+ years": 0.9,
      },
    ),
    negativeReasons: reasons(
      NEG_VOCAB,
      [
        "High order velocity · 3 in 24 hrs",
        "IP location differs from billing region",
        "Transaction outside typical hours",
        "Unusual basket size or composition",
      ],
      {
        "High order velocity · 3 in 24 hrs": -2.0,
        "IP location differs from billing region": -1.8,
        "Transaction outside typical hours": -1.3,
        "Unusual basket size or composition": -3.8,
      },
    ),
  },
  {
    score: 58.9,
    confidence: 86,
    steps: [
      { label: "History", delta: -2.4 },
      { label: "Device", delta: -3.6 },
      { label: "Velocity", delta: -5.2 },
      { label: "Email", delta: 0.4 },
      { label: "Geo", delta: -4.1 },
      { label: "Payment", delta: -1.8 },
      { label: "Timing", delta: -1.9 },
      { label: "Basket", delta: -2.5 },
    ],
    positiveReasons: reasons(POS_VOCAB, ["Email address aged 3+ years"], {
      "Email address aged 3+ years": 0.4,
    }),
    negativeReasons: reasons(
      NEG_VOCAB,
      [
        "High order velocity · 3 in 24 hrs",
        "IP location differs from billing region",
        "Transaction outside typical hours",
        "New shipping address",
        "Device fingerprint anomaly",
        "Unusual basket size or composition",
      ],
      {
        "High order velocity · 3 in 24 hrs": -5.2,
        "IP location differs from billing region": -4.1,
        "Transaction outside typical hours": -1.9,
        "New shipping address": -3.6,
        "Device fingerprint anomaly": -2.4,
        "Unusual basket size or composition": -2.5,
      },
    ),
  },
  {
    score: 82.3,
    confidence: 91,
    steps: [
      { label: "History", delta: 3.2 },
      { label: "Device", delta: 2.1 },
      { label: "Velocity", delta: -1.6 },
      { label: "Email", delta: 1.4 },
      { label: "Geo", delta: -0.8 },
      { label: "Payment", delta: 2.0 },
      { label: "Timing", delta: -0.9 },
      { label: "Basket", delta: 0.9 },
    ],
    positiveReasons: reasons(POS_VOCAB, [
      "Established customer history · 2+ years",
      "Device recognized from prior orders",
      "Email address aged 3+ years",
      "Strong issuer payment history",
      "Basket matches customer profile",
    ]),
    negativeReasons: reasons(
      NEG_VOCAB,
      [
        "High order velocity · 3 in 24 hrs",
        "IP location differs from billing region",
        "Transaction outside typical hours",
      ],
      {
        "High order velocity · 3 in 24 hrs": -1.6,
        "IP location differs from billing region": -0.8,
        "Transaction outside typical hours": -0.9,
      },
    ),
  },
];

const SUFFIXES = "ABCDEFGHJKLMNPQRSTUVWXYZ";

function formatQueueTime(index) {
  const totalMinutes = 9 * 60 + 42 - index;
  const hour24 = Math.floor(((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60) / 60);
  const minute = ((totalMinutes % 60) + 60) % 60;
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;
  return `Jul 14, 2026 ${hour12}:${String(minute).padStart(2, "0")} ${period}`;
}

function buildQueueRow(index) {
  const template = TEMPLATES[index % TEMPLATES.length];
  const idNum = 10000 + ((index * 997) % 90000);
  const suffix = SUFFIXES[index % SUFFIXES.length];
  const scoreJitter = ((index * 7) % 17) - 8;
  const score = Math.max(18, Math.min(98, Number((template.score + scoreJitter * 0.35).toFixed(1))));
  const amountBase = [412.8, 1288.0, 86.4, 54.0, 640.15, 2199.0, 198.5, 311.2, 975.0, 27.9][index % 10];
  const amount = Number((amountBase * (0.85 + (index % 7) * 0.05)).toFixed(2));

  return {
    id: `${idNum}-${suffix}`,
    merchant: MERCHANTS[index % MERCHANTS.length],
    amount,
    payment: PAYMENTS[index % PAYMENTS.length],
    time: formatQueueTime(index),
    score,
    confidence: Math.max(70, Math.min(98, template.confidence + (index % 5) - 2)),
    status: STATUS_CYCLE[index % STATUS_CYCLE.length],
    assignee: ASSIGNEES[index % ASSIGNEES.length],
    // Spread 24:00 → 00:00 across the demo set for sort + display.
    slaMinutes: Math.round(1440 - (index * 1440) / 99),
    steps: template.steps,
    positiveReasons: template.positiveReasons,
    negativeReasons: template.negativeReasons,
  };
}

export const QUEUE = Array.from({ length: 100 }, (_, index) => buildQueueRow(index));

/** Format SLA minutes (0–1440) as HH:MM, including 24:00. */
export function formatSlaMinutes(minutes) {
  if (minutes == null || Number.isNaN(Number(minutes))) return "";
  const clamped = Math.max(0, Math.min(1440, Math.round(Number(minutes))));
  const hours = Math.floor(clamped / 60);
  const mins = clamped % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

export function money(n) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function transactionLine(item) {
  return `Order #${item.id}  ·  ${money(item.amount)}  ·  ${item.payment}  ·  ${item.time}`;
}
