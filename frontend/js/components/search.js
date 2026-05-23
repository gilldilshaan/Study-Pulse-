import { initTheme, setTheme, getTheme } from "./utils/theme.js";
import { getSession, me, logout } from "./api/auth.api.js";
import { renderSidebar } from "./components/navbar.js";
import { bindSearchShortcut } from "./components/search.js";
import { toast } from "./components/toast.js";

initTheme();
bindSearchShortcut();

const pathname = (window.location.pathname || "").split("/").pop() || "index.html";
const isAuthPage = pathname === "login.html" || pathname === "register.html";

function go(file) {
  window.location.href = file;
}

async function guard() {
  if (isAuthPage) return;

  const { token } = getSession();
  if (!token) {
    go("login.html");
    return;
  }

  try {
    await me();
  } catch (err) {
    if (err && err.statusCode === 401) {
      logout();
      go("login.html");
      return;
    }
    toast({ title: "Offline", message: "Using cached data where available." });
  }
}

await guard();

const sidebarTarget = document.getElementById("app-sidebar");
if (sidebarTarget) {
  renderSidebar(sidebarTarget);
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;

  const action = btn.getAttribute("data-action");

  if (action === "logout") {
    logout();
    go("login.html");
    return;
  }

  if (action === "toggle-theme") {
    const cur = getTheme();
    setTheme(cur === "dark" ? "light" : "dark");
    toast({ title: "Theme", message: `Switched to ${getTheme()}`, timeoutMs: 1200 });
  }
});