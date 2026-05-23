(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const navToggle = $("#navToggle");
  const mobileNav = $("#mobileNav");

  function setMobileNav(open) {
    if (!navToggle || !mobileNav) return;
    navToggle.setAttribute("aria-expanded", String(open));
    mobileNav.hidden = !open;
    document.documentElement.style.overflow = open ? "hidden" : "";
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", () => {
      const open = navToggle.getAttribute("aria-expanded") !== "true";
      setMobileNav(open);
    });

    mobileNav.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (a) setMobileNav(false);
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMobileNav(false);
    });
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCount(el) {
    const targetRaw = el.getAttribute("data-count");
    if (!targetRaw) return;

    const clean = String(targetRaw).replace(/,/g, "");
    const target = Number(clean);
    if (!Number.isFinite(target)) return;

    const isCurrency = el.parentElement && el.parentElement.textContent.trim().startsWith("₹");
    const isMinutes = el.textContent.trim().endsWith("m");

    const duration = prefersReduced ? 1 : 900 + Math.min(900, Math.max(0, target / 30));
    const start = performance.now();

    const from = 0;
    const fmt = (v) => {
      const n = Math.round(v);
      if (isMinutes) return String(n);
      if (isCurrency) return n.toLocaleString("en-IN");
      return n.toLocaleString("en-US");
    };

    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const v = from + (target - from) * easeOutCubic(t);
      el.textContent = fmt(v);
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const revealedCounts = new WeakSet();

  function revealInit() {
    const items = $$(".reveal");
    if (!items.length) return;

    if (prefersReduced) {
      for (const el of items) el.classList.add("is-in");
      for (const el of $$("[data-count]")) animateCount(el);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target;
          el.classList.add("is-in");

          const counts = $$("[data-count]", el);
          for (const c of counts) {
            if (revealedCounts.has(c)) continue;
            revealedCounts.add(c);
            animateCount(c);
          }

          io.unobserve(el);
        }
      },
      { threshold: 0.18 }
    );

    for (const el of items) io.observe(el);
  }

  function smoothAnchors() {
    const anchors = $$('a[href^="#"]');
    for (const a of anchors) {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href");
        if (!href || href === "#") return;
        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 86;
        window.scrollTo({ top, behavior: prefersReduced ? "auto" : "smooth" });

        if (mobileNav && navToggle) setMobileNav(false);
        history.replaceState(null, "", href);
      });
    }
  }

  function subtleParallax() {
    if (prefersReduced) return;
    const mesh = $(".bg__mesh");
    if (!mesh) return;

    let raf = 0;
    function onMove(ev) {
      const x = (ev.clientX / window.innerWidth - 0.5) * 10;
      const y = (ev.clientY / window.innerHeight - 0.5) * 8;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        mesh.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.02)`;
      });
    }

    window.addEventListener("pointermove", onMove, { passive: true });
  }

  function start() {
    revealInit();
    smoothAnchors();
    subtleParallax();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();