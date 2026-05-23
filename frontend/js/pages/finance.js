const API = `${location.protocol}//${location.hostname}:5000`;

function getUserId(){
  try{
    return JSON.parse(localStorage.getItem("session"))?.userId;
  }catch{
    return null;
  }
}

const userId = getUserId();

/* ================= ELEMENTS ================= */
let donutChart = null;
let trendChart = null;
const el = {
  list: document.getElementById("tx-list"),
  net: document.getElementById("fin-net"),
  sub: document.getElementById("fin-sub"),
  insight: document.getElementById("fin-insight"),

  form: document.getElementById("tx-quick-form"),
  type: document.getElementById("qa-type"), // 🔥 now used
  category: document.getElementById("qa-category"),
  amount: document.getElementById("qa-amount"),
  date: document.getElementById("qa-date"),

  search: document.getElementById("tx-search"),
  filterType: document.getElementById("tx-type"),
  filterCategory: document.getElementById("tx-category"),
  filterDate: document.getElementById("tx-date")
};

/* ================= HELPERS ================= */

function inr(n){
  return (Number(n)||0).toLocaleString("en-IN",{style:"currency",currency:"INR"});
}

/* ================= API ================= */

async function fetchData(){
  const res = await fetch(`${API}/api/transactions/${userId}`);
  const json = await res.json();

  console.log("FETCH:", json);

  if(Array.isArray(json)) return json;
  if(Array.isArray(json.transactions)) return json.transactions;

  return [];
}

async function addTx(payload){
  const res = await fetch(`${API}/api/transactions`,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify(payload)
  });
  return res.json();
}

async function deleteTx(id){
  await fetch(`${API}/api/transactions/${id}`,{method:"DELETE"});
}
function renderCharts(data){

  const ctx1 = document.getElementById("financeChart");
  const ctx2 = document.getElementById("trendChart");

  if(!ctx1 || !ctx2) return;

  /* ===== CATEGORY DISTRIBUTION ===== */
  const map = {};

  data.forEach(t=>{
    if(t.type === "expense"){
      map[t.category] = (map[t.category] || 0) + t.amount;
    }
  });

  const labels = Object.keys(map);
  const values = Object.values(map);

  /* destroy old */
  if(donutChart) donutChart.destroy();

  donutChart = new Chart(ctx1, {
    type: "doughnut",
    data: {
      labels: labels.length ? labels : ["No Data"],
      datasets: [{
        data: values.length ? values : [1],
        backgroundColor: [
          "#7c6ff7",
          "#38bdf8",
          "#34d399",
          "#fbbf24",
          "#fb7185"
        ]
      }]
    },
    options: {
      cutout: "70%",
      plugins: {
        legend: { display: true }
      }
    }
  });

  /* ===== TREND ===== */
  const trendMap = {};

  data.forEach(t=>{
    const d = (t.date || "").slice(0,10);
    if(!trendMap[d]) trendMap[d] = 0;
    if(t.type === "expense") trendMap[d] += t.amount;
  });

  const trendLabels = Object.keys(trendMap).sort();
  const trendValues = trendLabels.map(d => trendMap[d]);

  if(trendChart) trendChart.destroy();

  trendChart = new Chart(ctx2, {
    type: "line",
    data: {
      labels: trendLabels,
      datasets: [{
        data: trendValues,
        borderColor: "#7c6ff7",
        tension: 0.4,
        fill: false
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { display: true },
        y: { display: true }
      }
    }
  });
}
/* ================= FILTER ================= */

function applyFilters(data){
  let result = [...data];

  const s = (el.search?.value || "").toLowerCase();

  if(s){
    result = result.filter(t =>
      (t.category || "").toLowerCase().includes(s) ||
      (t.note || "").toLowerCase().includes(s)
    );
  }

  if(el.filterType?.value !== "all"){
    result = result.filter(t => t.type === el.filterType.value);
  }

  if(el.filterCategory?.value){
    result = result.filter(t =>
      (t.category || "").toLowerCase().includes(el.filterCategory.value.toLowerCase())
    );
  }

  if(el.filterDate?.value){
    result = result.filter(t =>
      (t.date || "").startsWith(el.filterDate.value)
    );
  }

  return result;
}

/* ================= RENDER ================= */

async function render(){

  if(!userId) return;

  const raw = await fetchData();
  renderCharts(raw);
  const data = applyFilters(raw);

  let income = 0, expense = 0;

  raw.forEach(t=>{
    if(t.type === "income") income += Number(t.amount);
    else expense += Number(t.amount);
  });

  el.net.textContent = inr(income - expense);
  el.sub.textContent = `Income ${inr(income)} · Spend ${inr(expense)}`;

  const weeklyEl = document.getElementById("weekly-spend");
  if(weeklyEl) weeklyEl.textContent = inr(expense);

  /* TOP CATEGORY */
  const map = {};
  raw.forEach(t=>{
    if(t.type === "expense"){
      map[t.category] = (map[t.category] || 0) + t.amount;
    }
  });

  let top = "—", max = 0;
  for(const c in map){
    if(map[c] > max){
      max = map[c];
      top = c;
    }
  }

  const topName = document.getElementById("top-category-name");
  const topVal = document.getElementById("top-category-percent");

  if(topName) topName.textContent = top;
  if(topVal) topVal.textContent = max ? inr(max) : "—";

  /* CLEAR LIST */
  el.list.innerHTML = "";

  if(!data.length){
    el.list.innerHTML = `<div style="padding:20px;color:#777">No transactions</div>`;
    return;
  }

  /* LIST RENDER */
  data.forEach(t=>{
    const div = document.createElement("div");

    div.style.display = "flex";
    div.style.justifyContent = "space-between";
    div.style.alignItems = "center";
    div.style.padding = "12px 16px";
    div.style.borderRadius = "12px";
    div.style.marginBottom = "8px";
    div.style.background = "rgba(255,255,255,0.02)";
    div.style.border = "1px solid rgba(255,255,255,0.05)";

    const left = document.createElement("div");
    left.innerHTML = `
      <div style="font-weight:600">${t.category}</div>
      <div style="font-size:12px;color:#888">${t.note || "—"}</div>
    `;

    const right = document.createElement("div");
    right.style.display = "flex";
    right.style.alignItems = "center";
    right.style.gap = "10px";

    const amt = document.createElement("div");
    amt.textContent = `${t.type==="expense"?"-":"+"}${inr(t.amount)}`;
    amt.style.color = t.type==="expense" ? "#fb7185" : "#34d399";
    amt.style.fontWeight = "600";

    const btn = document.createElement("button");
    btn.textContent = "✕";
    btn.style.border = "none";
    btn.style.background = "transparent";
    btn.style.color = "#888";
    btn.style.cursor = "pointer";

    btn.onclick = async ()=>{
      await deleteTx(t._id);
      render();
    };

    right.appendChild(amt);
    right.appendChild(btn);

    div.appendChild(left);
    div.appendChild(right);

    el.list.appendChild(div);
  });

  /* INSIGHT */
  if(el.insight){
    el.insight.innerHTML = `
      Spent ${inr(expense)} this week.<br>
      Top category: <b>${top}</b>
    `;
  }
}

/* ================= ADD ================= */

el.form?.addEventListener("submit", async (e)=>{
  e.preventDefault();

  const payload = {
    type: el.type?.value || "expense",
    category: el.category.value.trim(),
    amount: Number(el.amount.value),
    date: el.date.value 
  ? new Date(el.date.value).toISOString()
  : new Date().toISOString(),
    userId
  };

  if(!payload.category){
    alert("Enter category");
    return;
  }

  if(!payload.amount || payload.amount <= 0){
    alert("Enter valid amount");
    return;
  }

  console.log("SENDING:", payload);

  await addTx(payload);

  el.form.reset();

  await render(); // 🔥 ensures no duplicate UI glitch
});

/* ================= EVENTS ================= */

["input","change"].forEach(evt=>{
  el.search?.addEventListener(evt, render);
  el.filterType?.addEventListener(evt, render);
  el.filterCategory?.addEventListener(evt, render);
  el.filterDate?.addEventListener(evt, render);
});

/* ================= INIT ================= */

render();