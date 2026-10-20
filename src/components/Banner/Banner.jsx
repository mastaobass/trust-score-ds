import "./Banner.css";

/**
 * Case meta strip. `paymentsFraud` matches the payments case banner.
 * `app` mirrors ActionBar APP date / standing fields for Storybook parity.
 */
export default function Banner({
  variant = "paymentsFraud",
  items,
  queued,
  score,
  topReason,
  caughtBy,
  standing,
  processDate = "2026-08-20",
  reviewDate = "2026-08-20",
  decision,
  className,
  ...rest
}) {
  const classes = ["ts-banner", `ts-banner--${variant}`, className].filter(Boolean).join(" ");

  let cells = items;
  if (!cells) {
    if (variant === "app") {
      cells = [
        { label: "Process", value: processDate },
        { label: "Review", value: reviewDate },
        { label: "Decision", value: decision ?? standing ?? "—" },
        { label: "Standing", value: standing ?? "Review · Hold" },
      ];
    } else {
      const scoreValue =
        typeof score === "number" && Number.isFinite(score) ? score.toFixed(1) : score;
      cells = [
        { label: "Queued", value: queued },
        { label: "Score", value: scoreValue },
        { label: "Top reason", value: topReason },
        { label: "Caught by", value: caughtBy },
        { label: "Standing", value: standing },
      ];
    }
  }

  return (
    <div className={classes} {...rest}>
      {cells.map((cell) => (
        <span key={cell.label}>
          <b>{cell.label}</b> {cell.value}
        </span>
      ))}
    </div>
  );
}
