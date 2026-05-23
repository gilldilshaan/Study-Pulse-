const KEY = "sp:theme";

function readTheme() {
  try {
    return localStorage.getItem(KEY) || "system";
  } catch {
    return "system";
  }
}

function writeTheme(theme) {
  try {
    localStorage.setItem(KEY, theme);
  } catch {}
}

function applyTheme(theme) {
  const root = document.documentElement;
  const prefersDark =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

  const actual = theme === "system" ? (prefersDark ? "dark" : "light") : theme;
  root.classList.toggle("is-dark", actual === "dark");
}

export function getTheme() {
  return readTheme();
}

export function setTheme(theme) {
  writeTheme(theme);
  applyTheme(theme);
}

export function initTheme() {
  applyTheme(readTheme());
}