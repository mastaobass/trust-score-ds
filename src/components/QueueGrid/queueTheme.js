import { themeQuartz } from "ag-grid-community";
import { resolvedTheme } from "../../lib/theme";

const COLOR_PARAMS = {
  backgroundColor: "--ts-color-surface-default",
  foregroundColor: "--ts-color-text-primary",
  borderColor: "--ts-color-border-default",
  chromeBackgroundColor: "--ts-color-surface-raised",
  headerBackgroundColor: "--ts-color-surface-default",
  headerTextColor: "--ts-color-text-muted",
  oddRowBackgroundColor: "--ts-color-surface-default",
  rowHoverColor: "--ts-color-surface-page",
  selectedRowBackgroundColor: "--ts-color-surface-page",
  accentColor: "--ts-color-accent-primary",
  menuBackgroundColor: "--ts-color-surface-default",
  subtleTextColor: "--ts-color-text-muted",
  iconColor: "--ts-color-text-muted",
};

/** Quartz theme painted from the active light/dark tokens. */
export function buildQueueTheme() {
  const style = getComputedStyle(document.documentElement);
  const params = {
    fontFamily: style.getPropertyValue("--ts-font-family").trim() || "Inter, system-ui, sans-serif",
    fontSize: 14,
    headerFontSize: 11,
    headerFontWeight: 600,
    wrapperBorderRadius: 0,
    spacing: 8,
    browserColorScheme: resolvedTheme() === "dark" ? "dark" : "light",
  };
  for (const [param, token] of Object.entries(COLOR_PARAMS)) {
    const value = style.getPropertyValue(token).trim();
    if (value) params[param] = value;
  }
  return themeQuartz.withParams(params);
}
