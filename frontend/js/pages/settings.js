import { getSession } from "../api/auth.api.js";
import { apiFetch } from "../utils/http.js";
import { toast } from "../components/toast.js";
import { getTheme, setTheme } from "../utils/theme.js";

const profileName = document.getElementById("profile-name");
const profileEmail = document.getElementById("profile-email");

const themeSelect = document.getElementById("theme-select");
const reduceMotionBtn = document.getElementById("reduce-motion");

const focusForm = document.getElementById("focus-settings");
const focusMinutes = document.getElementById("s-focus");
const breakMinutes = document.getElementById("s-break");

let reduceMotion = false;

function applyReduceMotion(on) {
  reduceMotion = Boolean(on);
  reduceMotionBtn.textContent = reduceMotion ? "On" : "Off";
  document.documentElement.style.scrollBehavior = reduceMotion ? "auto" : "";
}

async function load() {
  const { user } = getSession();
  if (user) {
    profileName.textContent = user.name || "—";
    profileEmail.textContent = user.email || "—";
  }

  themeSelect.value = getTheme();

  try {
    const res = await apiFetch("/api/settings", { method: "GET", cacheTtlMs: 30000 });
    const settings = res.settings || res.data?.settings || res;

    if (settings?.theme) {
      themeSelect.value = settings.theme;
      setTheme(settings.theme);
    }

    if (settings?.focus) {
      focusMinutes.value = settings.focus.focusMinutes ?? 25;
      breakMinutes.value = settings.focus.breakMinutes ?? 5;
    }

    applyReduceMotion(Boolean(settings?.preferences?.reduceMotion));
  } catch (err) {
    toast({ title: "Settings", message: err.message || "Couldn’t load settings", variant: "danger" });
  }
}

themeSelect.addEventListener("change", async () => {
  const next = themeSelect.value;
  setTheme(next);

  try {
    await apiFetch("/api/settings", { method: "POST", body: { theme: next } });
    toast({ title: "Saved", message: "Theme updated.", variant: "success", timeoutMs: 1200 });
  } catch (err) {
    toast({ title: "Save failed", message: err.message || "Try again", variant: "danger" });
  }
});

reduceMotionBtn.addEventListener("click", async () => {
  const next = !reduceMotion;
  applyReduceMotion(next);

  try {
    await apiFetch("/api/settings", { method: "POST", body: { preferences: { reduceMotion: next } } });
    toast({ title: "Saved", message: "Motion preference updated.", variant: "success", timeoutMs: 1200 });
  } catch (err) {
    toast({ title: "Save failed", message: err.message || "Try again", variant: "danger" });
  }
});

focusForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const patch = {
    focus: {
      focusMinutes: Number(focusMinutes.value),
      breakMinutes: Number(breakMinutes.value)
    }
  };

  try {
    await apiFetch("/api/settings", { method: "POST", body: patch });
    toast({ title: "Saved", message: "Focus defaults updated.", variant: "success" });
  } catch (err) {
    toast({ title: "Save failed", message: err.message || "Try again", variant: "danger" });
  }
});

load();