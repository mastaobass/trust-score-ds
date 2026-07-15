/** Default data matching the Figma design — order #48291-C at 85.6. */
export const defaultTransaction = "Order #48291-C  ·  $412.80  ·  Visa •••• 4021  ·  Jul 14, 2026 9:42 AM";

export const defaultSteps = [
  { label: "History", delta: 4.2 },
  { label: "Device", delta: 2.8 },
  { label: "Velocity", delta: -3.5 },
  { label: "Email", delta: 1.9 },
  { label: "Geo", delta: -2.2 },
  { label: "Payment", delta: 3.1 },
  { label: "Timing", delta: -1.4 },
  { label: "Basket", delta: 0.7 },
];

export const defaultPositiveReasons = [
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

export const defaultNegativeReasons = [
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
