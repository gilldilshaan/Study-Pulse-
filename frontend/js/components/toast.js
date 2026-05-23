let root = null;

function ensureRoot() {
  if (root) return root;
  root = document.createElement("div");
  root.className = "toast-root";
  document.body.appendChild(root);
  return root;
}

export function toast({ title, message, variant = "info", timeoutMs = 3200 } = {}) {
  const r = ensureRoot();

  const el = document.createElement("div");
  el.className = "toast";

  const ico = document.createElement("div");
  ico.className = "toast-ico";
  ico.textContent = variant === "success" ? "✓" : variant === "danger" ? "!" : "•";

  const body = document.createElement("div");
  body.className = "toast-body";

  const h = document.createElement("p");
  h.className = "toast-title";
  h.textContent = title || "Notice";

  const p = document.createElement("p");
  p.className = "toast-text";
  p.textContent = message || "";

  body.appendChild(h);
  body.appendChild(p);

  el.appendChild(ico);
  el.appendChild(body);
  r.appendChild(el);

  requestAnimationFrame(() => el.classList.add("is-in"));

  const t = window.setTimeout(() => {
    el.classList.remove("is-in");
    window.setTimeout(() => el.remove(), 220);
  }, timeoutMs);

  el.addEventListener("click", () => {
    window.clearTimeout(t);
    el.classList.remove("is-in");
    window.setTimeout(() => el.remove(), 220);
  });
}