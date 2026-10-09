export const THEME_KEY = "ts-theme";
export const THEMES = ["light", "dark", "system"];

export function getTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (THEMES.includes(stored)) return stored;
  } catch {
    /* private mode */
  }
  return "system";
}

export function applyTheme(theme) {
  const next = THEMES.includes(theme) ? theme : "system";
  document.documentElement.dataset.theme = next;
  return next;
}

export function setTheme(theme) {
  const next = applyTheme(theme);
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {
    /* private mode */
  }
  window.dispatchEvent(new CustomEvent("ts-theme-change", { detail: next }));
  return next;
}

export function initTheme() {
  return applyTheme(getTheme());
}

/** Resolved appearance, following the OS when the preference is system. */
export function resolvedTheme(theme = getTheme()) {
  if (theme === "light" || theme === "dark") return theme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function subscribeTheme(onChange) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const notify = () => onChange(getTheme(), resolvedTheme());
  media.addEventListener("change", notify);
  window.addEventListener("ts-theme-change", notify);
  return () => {
    media.removeEventListener("change", notify);
    window.removeEventListener("ts-theme-change", notify);
  };
}
