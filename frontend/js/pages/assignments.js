/* =========================
   CONFIG
========================= */

const API = `http://${location.hostname}:5000`;

/* =========================
   USER
========================= */

function getUserId() {
  try {
    const session = JSON.parse(localStorage.getItem("session"));
    return session?.userId;
  } catch {
    return null;
  }
}

const userId = getUserId();

/* =========================
   ELEMENTS
========================= */

const list = document.getElementById("task-list");
const form = document.getElementById("task-form");
const stats = document.getElementById("task-stats");

let tasks = [];
let filter = "all";

/* =========================
   LOAD FROM BACKEND
========================= */

async function load() {
  if (!userId) return;

  try {
    const res = await fetch(`${API}/api/tasks/${userId}`);
    const json = await res.json();

    tasks = Array.isArray(json) ? json : [];
    render();

  } catch (e) {
    console.error("Load error:", e);
  }
}

/* =========================
   RENDER
========================= */

function render() {

  const filtered = tasks.filter(t => {
    if(filter === "open") return !t.completed;
    if(filter === "done") return t.completed;
    return true;
  });

  list.innerHTML = "";

  filtered.forEach((t) => {

    const el = document.createElement("div");
    el.className = "task-card";

    el.innerHTML = `
      <div class="task-left">
        <input type="checkbox" ${t.completed ? "checked" : ""} />

        <div class="task-title ${t.completed ? "done" : ""}">
          ${t.title}
        </div>
      </div>

      <div class="task-actions">

        <span class="badge ${t.priority?.toLowerCase() || "medium"}">
          ${t.priority || "Medium"}
        </span>

        <span class="badge category">
          ${t.category || "General"}
        </span>

        <button class="btn btn-danger btn-sm">✕</button>

      </div>
    `;

    /* TOGGLE COMPLETE */
    el.querySelector("input").onchange = async () => {
      await fetch(`${API}/api/tasks/${t._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !t.completed })
      });

      load();
    };

    /* DELETE */
    el.querySelector("button").onclick = async () => {
      await fetch(`${API}/api/tasks/${t._id}`, {
        method: "DELETE"
      });

      load();
    };

    list.appendChild(el);
  });

  /* STATS */
  const done = tasks.filter(t=>t.completed).length;
  stats.textContent = `${done}/${tasks.length} done`;
}

/* =========================
   ADD TASK (SAVE TO DB)
========================= */

form.onsubmit = async (e) => {
  e.preventDefault();

  const title = document.getElementById("t-title").value;
  const priority = document.getElementById("t-priority").value;
  const category = document.getElementById("t-category").value;

  if (!title) return;

  try {
    await fetch(`${API}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        priority,
        category,
        completed: false,
        userId
      })
    });

    form.reset();
    load();

  } catch (e) {
    console.error("Add error:", e);
  }
};

/* =========================
   FILTER
========================= */

document.querySelectorAll(".task-filter button").forEach(btn=>{
  btn.onclick = () => {
    document.querySelectorAll(".task-filter button")
      .forEach(b=>b.classList.remove("active"));

    btn.classList.add("active");

    filter = btn.dataset.f;
    render();
  };
});

/* =========================
   INIT
========================= */

load();