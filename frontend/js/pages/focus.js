const ring = document.getElementById("ring");
const timeEl = document.getElementById("time");
const statusEl = document.getElementById("status");

const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");

const sessionList = document.getElementById("sessionList");
const totalTimeEl = document.getElementById("totalTime");

let mode = "focus";
let durations = {
  focus: 25,
  short: 5,
  long: 15
};

let timeLeft = durations[mode] * 60;
let timer = null;
let running = false;
let sessions = [];

/* FORMAT */
function format(t) {
  const m = Math.floor(t / 60).toString().padStart(2, "0");
  const s = (t % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/* UPDATE UI */
function updateUI() {
  timeEl.textContent = format(timeLeft);
  statusEl.textContent = running ? "Running" : "Idle";

  const total = durations[mode] * 60;
  const progress = 1 - timeLeft / total;
  const deg = progress * 360;

  ring.style.background = `conic-gradient(
    #7c6ff7 ${deg}deg,
    #4cc9f0 ${deg}deg,
    rgba(255,255,255,0.05) ${deg}deg
  )`;
}

/* START */
startBtn.onclick = () => {
  if (running) return;

  running = true;

  timer = setInterval(() => {
    timeLeft--;
    updateUI();

    if (timeLeft <= 0) {
      clearInterval(timer);
      running = false;

      sessions.push({
        mode,
        minutes: durations[mode]
      });

      renderSessions();
      resetTimer();
    }

  }, 1000);
};

/* RESET */
function resetTimer() {
  clearInterval(timer);
  running = false;
  timeLeft = durations[mode] * 60;
  updateUI();
}

resetBtn.onclick = resetTimer;

/* MODE SWITCH */
document.querySelectorAll(".mode-tabs button").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".mode-tabs button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    mode = btn.dataset.mode;
    resetTimer();
  };
});

/* RENDER SESSIONS */
function renderSessions() {
  if (!sessions.length) {
    sessionList.innerHTML = `<div class="muted">No sessions yet.</div>`;
    totalTimeEl.textContent = "0 min";
    return;
  }

  sessionList.innerHTML = "";

  let total = 0;

  sessions.forEach(s => {
    total += s.minutes;

    const el = document.createElement("div");
    el.className = "row";

    el.innerHTML = `
      <span>${s.mode}</span>
      <span>${s.minutes} min</span>
    `;

    sessionList.appendChild(el);
  });

  totalTimeEl.textContent = `${total} min`;
}

/* INIT */
updateUI();