(function () {
  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const byId = (id) => document.getElementById(id);
  const qs = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => Array.from(r.querySelectorAll(s));

  function numFromText(text) {
    const t = String(text || "").trim();
    const cleaned = t.replace(/[^\d.-]/g, "");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
  }

  function formatLike(original, value) {
    const o = String(original || "");
    const hasInr = o.includes("₹");
    const hasDollar = o.includes("$");
    const hasPercent = o.includes("%");
    const n = Math.round(value);
    let out = n.toLocaleString(hasInr ? "en-IN" : "en-US");
    if (hasInr) out = `₹${out}`;
    if (hasDollar) out = `$${out}`;
    if (hasPercent) out = `${out}%`;
    return out;
  }

  function animateCount(el, target, originalText) {
    if (!el) return;
    if (prefersReduced) {
      el.textContent = formatLike(originalText, target);
      return;
    }

    const duration = 820;
    const start = performance.now();
    const from = 0;

    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = from + (target - from) * eased;
      el.textContent = formatLike(originalText, v);
      if (t < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  function animateAllCounts() {
    const candidates = qsa("[data-count]");
    for (const el of candidates) {
      const raw = el.getAttribute("data-count");
      const n = Number(String(raw || "").replace(/,/g, ""));
      if (!Number.isFinite(n)) continue;
      animateCount(el, n, el.textContent);
    }

    const auto = qsa("[data-animate-count]");
    for (const el of auto) {
      const n = numFromText(el.textContent);
      if (n === null) continue;
      const original = el.textContent;
      el.textContent = formatLike(original, 0);
      animateCount(el, n, original);
    }
  }

  function rotateWeeklyInsight() {
    const el =
      byId("insightText") ||
      qs("[data-insight]") ||
      qs(".weekly-insight .insight-text") ||
      qs(".insight-text");
    if (!el) return;

    const insights = [
      "You focus more after 8 PM 🌙",
      "Your streak drops mid-week 📉",
      "You spend most on food 🍔",
      "You are more productive on weekends 🚀",
      "Plan tomorrow in 2 minutes to protect your streak 🔥",
      "Your best deep-work window is 8–10 PM ⏱️"
    ];

    const i = Math.floor(Math.random() * insights.length);
    el.textContent = insights[i];
  }

  function staggerActivity() {
    const items = qsa(".activity-item, .activity-feed li, .activity-feed .row, .feed__row");
    if (!items.length) return;

    items.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(10px)";
    });

    items.forEach((el, i) => {
      const delay = prefersReduced ? 0 : i * 80;
      setTimeout(() => {
        el.style.transition = "opacity 300ms cubic-bezier(.2,.8,.2,1), transform 300ms cubic-bezier(.2,.8,.2,1)";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, delay);
    });
  }

  function injectCommandPalette() {
    if (byId("commandPalette") || qs(".dp-command")) return;

    const wrap = document.createElement("div");
    wrap.className = "dp-command";
    wrap.hidden = true;
    wrap.innerHTML = `
      <div class="dp-command__backdrop" data-close></div>
      <div class="dp-command__panel" role="dialog" aria-modal="true" aria-label="Command palette">
        <div class="dp-command__top">
          <span class="dp-command__k">Ctrl + K</span>
          <input class="dp-command__input" id="dpCmdInput" type="text" placeholder="Search: Tasks, Finance, Focus…" autocomplete="off" />
        </div>
        <div class="dp-command__list" id="dpCmdList"></div>
      </div>
    `;

    document.body.appendChild(wrap);

    const input = byId("dpCmdInput");
    const list = byId("dpCmdList");

    const commands = [
      { label: "Dashboard", icon: "📊", href: "index.html" },
      { label: "Tasks", icon: "✅", href: "tasks.html" },
      { label: "Assignments", icon: "📚", href: "assignments.html" },
      { label: "Focus", icon: "🎯", href: "focus.html" },
      { label: "Finance", icon: "💰", href: "finance.html" },
      { label: "Settings", icon: "⚙️", href: "settings.html" },
      { label: "Sign in", icon: "🔐", href: "login.html" },
      { label: "Create account", icon: "✨", href: "register.html" }
    ];

    function render(query) {
      const q = String(query || "").trim().toLowerCase();
      const items = commands.filter((c) => c.label.toLowerCase().includes(q));
      list.innerHTML = "";
      for (const c of items.slice(0, 8)) {
        const item = document.createElement("div");
        item.className = "dp-command__item";
        item.tabIndex = 0;
        item.dataset.href = c.href;
        item.innerHTML = `
          <div class="dp-command__left">
            <div class="dp-command__icon">${c.icon}</div>
            <div class="dp-command__label">${c.label}</div>
          </div>
          <div class="dp-command__hint">${c.href}</div>
        `;
        list.appendChild(item);
      }
    }

    function open() {
      wrap.hidden = false;
      document.documentElement.style.overflow = "hidden";
      render("");
      setTimeout(() => input && input.focus(), 0);
    }

    function close() {
      wrap.hidden = true;
      document.documentElement.style.overflow = "";
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !wrap.hidden) close();
    });

    wrap.addEventListener("click", (e) => {
      if (e.target && e.target.matches("[data-close]")) close();
      const item = e.target && e.target.closest(".dp-command__item");
      if (!item) return;
      const href = item.dataset.href;
      if (href) window.location.href = href;
    });

    input.addEventListener("input", (e) => render(e.target.value));
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const first = qs(".dp-command__item", list);
        if (first && first.dataset.href) window.location.href = first.dataset.href;
      }
    });

    return { open, close, node: wrap };
  }

  function bindGlobalHotkeys(palette) {
    document.addEventListener("keydown", (e) => {
      const k = String(e.key || "").toLowerCase();
      if ((e.ctrlKey || e.metaKey) && k === "k") {
        e.preventDefault();
        palette && palette.open && palette.open();
      }
    });
  }

  function markTargets() {
    const ids = ["streak", "tasksDone", "focusMinutes", "net", "balance", "weekSpend"];
    for (const id of ids) {
      const el = byId(id);
      if (el && !el.hasAttribute("data-animate-count")) el.setAttribute("data-animate-count", "1");
    }
  }

  function init() {
    markTargets();
    rotateWeeklyInsight();
    staggerActivity();
    animateAllCounts();
    const palette = injectCommandPalette();
    bindGlobalHotkeys(palette);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

