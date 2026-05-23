const KEY = "sp_theme";

export function getTheme() {
  try {
    return localStorage.getItem(KEY) || "dark";
  } catch {
    return "dark";
  }
}

export function setTheme(theme) {
  try {
    localStorage.setItem(KEY, theme);
  } catch {}
  applyTheme(theme);
}

export function applyTheme(theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
}

export function initTheme() {
  applyTheme(getTheme());
}