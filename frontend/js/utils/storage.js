export function getSession() {
  try {
    const raw = localStorage.getItem("session");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setSession(data) {
  localStorage.setItem("session", JSON.stringify(data));
}

export function clearSession() {
  localStorage.removeItem("session");
}