import { getSession, logout } from "../api/auth.api.js";
import { toast } from "./toast.js";
import { setTheme, getTheme } from "../utils/theme.js";

const links = [
  { href: "index.html", label: "Dashboard", icon: "▦" },
  { href: "tasks.html", label: "Tasks", icon: "✓" },
  { href: "assignments.html", label: "Assignments", icon: "⧉" },
  { href: "finance.html", label: "Finance", icon: "$" },
  { href: "focus.html", label: "Focus", icon: "◷" },
  { href: "settings.html", label: "Settings", icon: "⚙" }
];

function isActive(current, href) {
  return current.endsWith(href);
}

export function renderSidebar(targetEl) {
  const { user } = getSession();
  const current = (window.location.pathname || "").split("/").pop() || "index.html";

  const shell = document.createElement("div");
  shell.className = "sidebar-card";

  const brand = document.createElement("div");
  brand.className = "brand";
  brand.innerHTML = `
    <div class="brand-mark">SP</div>
    <div class="brand-meta">
      <div class="brand-name">StudyPulse</div>
      <div class="brand-sub">Momentum OS for students</div>
    </div>
  `;

  const nav = document.createElement("nav");
  nav.className = "nav";

  for (const l of links) {
    const a = document.createElement("a");
    a.href = l.href;
    a.className = `nav-link${isActive(current, l.href) ? " is-active" : ""}`;
    a.innerHTML = `
      <div class="nav-left">
        <div class="nav-ico">${l.icon}</div>
        <div class="nav-text">${l.label}</div>
      </div>
    `;
    nav.appendChild(a);
  }

  const footer = document.createElement("div");
  footer.className = "sidebar-footer";

  const userRow = document.createElement("div");
  userRow.className = "user-row";
  userRow.innerHTML = `
    <div class="user-meta">
      <div class="user-name">${user ? user.name : "—"}</div>
      <div class="user-email">${user ? user.email : ""}</div>
    </div>
    <button class="btn btn-ghost btn-icon" type="button" data-action="toggle-theme" aria-label="Toggle theme">◐</button>
  `;

  const actions = document.createElement("div");
  actions.className = "row";
  actions.innerHTML = `
    <button class="btn btn-danger" type="button" data-action="logout">Logout</button>
  `;

  footer.appendChild(userRow);
  footer.appendChild(actions);

  shell.appendChild(brand);
  shell.appendChild(nav);
  shell.appendChild(footer);

  shell.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;

    const action = btn.getAttribute("data-action");

    if (action === "logout") {
      logout();
      window.location.href = "login.html";
      return;
    }

    if (action === "toggle-theme") {
      const cur = getTheme();
      setTheme(cur === "dark" ? "light" : "dark");
      toast({ title: "Theme", message: `Switched to ${getTheme()}`, timeoutMs: 1200 });
    }
  });

  targetEl.replaceChildren(shell);
}