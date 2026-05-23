import { clearSession } from "./utils/storage.js";

function go(file) {
  window.location.href = file;
}

/* =========================
   SAFE SESSION (NO REDIRECT)
========================= */
function getSession() {
  try {
    return JSON.parse(localStorage.getItem("session"));
  } catch {
    return null;
  }
}

/* ========================= */

function initials(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] || "S") + (parts[1]?.[0] || "P")).toUpperCase();
}

function pageName() {
  return (window.location.pathname || "").split("/").pop() || "index.html";
}

function isAuthPage() {
  const p = pageName();
  return p === "login.html" || p === "register.html";
}

function navLink(href, label, icon) {
  const active = pageName() === href ? " is-active" : "";
  return `
    <a class="topnav-link${active}" href="${href}">
      <span class="topnav-ico">${icon}</span>
      <span class="topnav-text">${label}</span>
    </a>
  `;
}

/* =========================
   ORIGINAL NAVBAR (RESTORED)
========================= */

function injectTopNav() {
  if (isAuthPage()) return;

  const session = getSession();

  const name = session?.name || "Student";
  const email = session?.email || "";

  const el = document.createElement("div");
  el.className = "topnav";

  el.innerHTML = `
    <div class="topnav-inner">

      <a href="index.html" class="topnav-brand">
        <div class="topnav-mark">SP</div>
        <div class="topnav-brandtext">
          <div class="topnav-brandname">StudyPulse</div>
          <div class="topnav-brandsub">Aurora</div>
        </div>
      </a>

      <div class="topnav-links">
        ${navLink("index.html", "Dashboard", "📊")}
        ${navLink("tasks.html", "Tasks", "✅")}
        ${navLink("assignments.html", "Assignments", "📚")}
        ${navLink("focus.html", "Focus", "🎯")}
        ${navLink("finance.html", "Finance", "💰")}
      </div>

      <div class="topnav-right">
        <div class="topnav-user" title="${email}">
          <div class="topnav-avatar">${initials(name)}</div>
          <div class="topnav-usertext">
            <div class="topnav-username">${name}</div>
            <div class="topnav-useremail">${email}</div>
          </div>
        </div>

        <button class="btn btn-danger" id="btn-logout">Logout</button>
      </div>

    </div>
  `;

  document.body.prepend(el);

  document.getElementById("btn-logout").onclick = () => {
    clearSession();
    go("login.html");
  };
}
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key.toLowerCase() === "k") {
    e.preventDefault();
    alert("Search coming soon 🔍"); // replace with modal later
  }
});
/* =========================
   BOOT (NO REDIRECT)
========================= */

window.addEventListener("DOMContentLoaded", () => {
  const session = getSession();

  console.log("SESSION:", session);

  // ❌ NO REDIRECT ANYMORE
  if (!session) {
    console.warn("No session — navbar still loads");
  }

  if (!isAuthPage()) {
    injectTopNav();
  }
});