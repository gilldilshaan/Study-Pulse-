import { getSession } from "../utils/storage.js";

const API = `http://${location.hostname}:5000`;

/* =========================
   USER
========================= */

function getUserId() {
  const session = getSession();
  return session?.userId || null;
}

/* ========================= */

const form = document.getElementById("task-form");
const listEl = document.getElementById("task-list");

const titleEl = document.getElementById("task-input");
const priorityEl = document.getElementById("task-priority");
const categoryEl = document.getElementById("task-category");

let tasks = [];

/* =========================
   LOAD TASKS
========================= */

async function load() {
  const userId = getUserId();

  if (!userId) {
    alert("No session found. Please login.");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch(`${API}/api/tasks/${userId}`);

    if (!res.ok) {
      console.error("API ERROR:", res.status);
      tasks = [];
      render();
      return;
    }

    const data = await res.json();
    tasks = Array.isArray(data) ? data : [];

    render();

  } catch (err) {
    console.error("LOAD ERROR:", err);
    tasks = [];
    render();
  }
}

/* =========================
   RENDER
========================= */

function render() {
  listEl.innerHTML = "";

  if (tasks.length === 0) {
    listEl.innerHTML = `<p style="opacity:.6">No tasks yet</p>`;
    return;
  }

  tasks.forEach(task => {
    const el = document.createElement("div");
    el.className = "task-card";

    /* 🔥 SMALL UI IMPROVEMENT ONLY */
    el.style.display = "flex";
    el.style.justifyContent = "space-between";
    el.style.alignItems = "center";
    el.style.padding = "14px 16px";

  el.innerHTML = `
  <div class="task-row" style="
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:16px;
    width:100%;
  ">

    <!-- LEFT -->
    <div style="display:flex;align-items:center;gap:12px;">

      <input type="checkbox" ${task.completed ? "checked" : ""} style="
        width:16px;
        height:16px;
        cursor:pointer;
      ">

      <div>
        <div style="
          font-weight:600;
          font-size:14px;
          ${task.completed ? "opacity:.5;text-decoration:line-through;" : ""}
        ">
          ${task.title}
        </div>

        <div style="
          font-size:12px;
          color:rgba(255,255,255,0.5);
          margin-top:2px;
        ">
          ${task.category || "—"}
        </div>
      </div>

    </div>

    <!-- RIGHT -->
    <div style="display:flex;align-items:center;gap:10px;">

      <!-- PRIORITY -->
      <span style="
        padding:4px 10px;
        border-radius:999px;
        font-size:11px;
        font-weight:600;
        backdrop-filter:blur(10px);

        background:${
          task.priority === "High" ? "rgba(251,113,133,0.15)" :
          task.priority === "Medium" ? "rgba(251,191,36,0.15)" :
          "rgba(52,211,153,0.15)"
        };

        color:${
          task.priority === "High" ? "#fb7185" :
          task.priority === "Medium" ? "#fbbf24" :
          "#34d399"
        };

        border:1px solid rgba(255,255,255,0.08);
      ">
        ${task.priority}
      </span>

      <!-- DELETE -->
      <button class="task-delete" style="
        border:none;
        background:rgba(255,255,255,0.05);
        border-radius:8px;
        padding:4px 8px;
        color:#aaa;
        cursor:pointer;
        transition:all .2s ease;
      ">✕</button>

    </div>

  </div>
`;
el.style.padding = "12px 14px";
el.style.borderRadius = "14px";
el.style.marginBottom = "10px";
el.style.background = "rgba(255,255,255,0.02)";
el.style.border = "1px solid rgba(255,255,255,0.06)";
el.style.transition = "all 0.2s ease";

el.onmouseenter = () => {
  el.style.background = "rgba(255,255,255,0.05)";
  el.style.transform = "translateY(-2px)";
};

el.onmouseleave = () => {
  el.style.background = "rgba(255,255,255,0.02)";
  el.style.transform = "translateY(0)";
};

    /* TOGGLE */
    el.querySelector("input").onchange = async () => {
      await fetch(`${API}/api/tasks/${task._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          completed: !task.completed
        })
      });

      window.dispatchEvent(new Event("dataChanged"));
      load();
    };

    /* DELETE */
    const delBtn = el.querySelector(".task-delete");

    delBtn.onmouseenter = () => delBtn.style.color = "#fb7185";
    delBtn.onmouseleave = () => delBtn.style.color = "#888";

    delBtn.onclick = async () => {
      await fetch(`${API}/api/tasks/${task._id}`, {
        method: "DELETE"
      });

      window.dispatchEvent(new Event("dataChanged"));
      load();
    };

    listEl.appendChild(el);
  });
}

/* =========================
   ADD TASK
========================= */

form.onsubmit = async (e) => {
  e.preventDefault();

  const userId = getUserId();

  if (!titleEl.value.trim()) return;

  await fetch(`${API}/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: titleEl.value,
      priority: priorityEl.value,
      category: categoryEl.value,
      userId
    })
  });

  form.reset();

  window.dispatchEvent(new Event("dataChanged"));
  load();
};

/* ========================= */

load();