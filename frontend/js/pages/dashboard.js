import { getSession } from "../utils/storage.js";

const API = `http://${location.hostname}:5000`;
const $ = (id) => document.getElementById(id);

function money(n){
  return new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(Number(n)||0);
}
function getUserId(){ return getSession()?.userId || null; }

async function fetchSafe(url){
  try{
    const r = await fetch(url);
    if(!r.ok) return [];
    const d = await r.json();
    return Array.isArray(d) ? d : [];
  }catch{ return []; }
}

/* ===================== HELPERS ===================== */

function lastNDaysLabels(n=7){
  const arr=[];
  for(let i=n-1;i>=0;i--){
    const d=new Date(); d.setDate(d.getDate()-i);
    arr.push(d.toLocaleDateString());
  }
  return arr;
}

function groupByDay(items, getDate, getVal){
  const map={};
  items.forEach(x=>{
    const d=new Date(getDate(x)).toLocaleDateString();
    map[d]=(map[d]||0)+Number(getVal(x));
  });
  return map;
}

function computeFinance(txs){
  let income=0, expense=0;
  txs.forEach(t=>{
    if(t.type==="income") income+=Number(t.amount);
    else expense+=Number(t.amount);
  });
  return {income, expense, net: income-expense};
}

function computeTasks(tasks){
  const done=tasks.filter(t=>t.completed).length;
  return {done, total:tasks.length, pct: tasks.length? Math.round(done*100/tasks.length):0};
}

function computeFocus(focus){
  const total=focus.reduce((a,b)=>a+(b.duration||0),0);
  return total;
}

/* ===================== TRENDS (Δ) ===================== */

function delta7(txs){
  const now=new Date();
  const d7=new Date(); d7.setDate(now.getDate()-7);

  let recent=0, older=0;
  txs.forEach(t=>{
    const d=new Date(t.date);
    if(d>=d7) recent+=Number(t.amount);
    else older+=Number(t.amount);
  });
  return recent-older;
}

function setDelta(elId, val){
  const el=$(elId);
  if(!el) return;
  const up = val>=0;
  el.textContent = `${up?"↑":"↓"} ${money(Math.abs(val))}`;
  el.style.color = up ? "#34d399" : "#fb7185";
}

/* ===================== INSIGHT ===================== */

function renderInsight(tasks, txs, focus){
  const title=$("headline-title");
  const sub=$("headline-sub");
  if(!title||!sub) return;

  const f=computeFinance(txs);
  const t=computeTasks(tasks);
  const fm=computeFocus(focus);

  // top category
  const cat={};
  txs.forEach(x=>{
    if(x.type==="expense"){
      cat[x.category]=(cat[x.category]||0)+Number(x.amount);
    }
  });
  const top=Object.entries(cat).sort((a,b)=>b[1]-a[1])[0];

  title.textContent = `You spent ${money(f.expense)} · ${t.pct}% tasks done`;
  sub.textContent = `Top: ${top?top[0]:"—"} · Focus: ${fm} min`;
}

/* ===================== NEXT ACTION ===================== */

function renderNext(tasks, txs, focus){
  const box=$("next-action");
  if(!box) return;

  const f=computeFinance(txs);
  const t=computeTasks(tasks);
  const fm=computeFocus(focus);

  let text="";

  if(t.pct < 50){
    text = "Finish 1 pending task to push completion above 50%";
  } else if(f.expense > f.income){
    text = "Reduce spend today or add one income entry";
  } else if(fm < 60){
    text = "Do a 25 min focus session now (Pomodoro)";
  } else {
    text = "Great momentum—plan tomorrow’s top 3 tasks";
  }

  box.innerHTML = `<div style="font-size:14px">${text}</div>`;
}

/* ===================== ACTIVITY (GROUPED) ===================== */

function renderFeed(tasks, txs){
  const feed=$("feed");
  if(!feed) return;

  const groups={};

  // group by date
  function push(d, html){
    groups[d]=groups[d]||[];
    groups[d].push(html);
  }

  tasks.forEach(t=>{
    if(t.completed){
      const d=new Date(t.updatedAt||Date.now()).toLocaleDateString();
      push(d, `✅ ${t.title}`);
    }
  });

  txs.forEach(t=>{
    const d=new Date(t.date).toLocaleDateString();
    push(d, `${t.type==="expense"?"💸":"💰"} ₹${t.amount} • ${t.category}`);
  });

  const days=Object.keys(groups).sort((a,b)=>new Date(b)-new Date(a));

  feed.innerHTML = days.map(d=>`
    <div style="margin-bottom:10px">
      <div style="font-size:11px;color:#888">${d}</div>
      ${groups[d].map(x=>`<div style="font-size:13px;padding:4px 0">${x}</div>`).join("")}
    </div>
  `).join("") || `<div style="opacity:.5">No activity</div>`;
}

/* ===================== CHARTS ===================== */

let charts={};

function buildLine(ctx, labels, data){
  return new Chart(ctx, {
    type: "line",
    data: { labels, datasets: [{ data, tension: .4 }]},
    options: {
      responsive:true,
      plugins:{legend:{display:false}},
      scales:{
        x:{grid:{display:false}},
        y:{grid:{color:"rgba(255,255,255,.05)"}}
      }
    }
  });
}

function renderCharts(tasks, txs, focus){
  const labels=lastNDaysLabels(7);

  const spendMap=groupByDay(txs, t=>t.date, t=>t.amount);
  const taskMap=groupByDay(tasks.filter(t=>t.completed), t=>t.updatedAt||Date.now(), _=>1);
  const focusMap=groupByDay(focus, f=>f.date||Date.now(), f=>f.duration||0);

  const spendData=labels.map(d=>spendMap[d]||0);
  const taskData=labels.map(d=>taskMap[d]||0);
  const focusData=labels.map(d=>focusMap[d]||0);

  if(charts.spend) charts.spend.destroy();
  if(charts.tasks) charts.tasks.destroy();
  if(charts.focus) charts.focus.destroy();

  const s=$("chart-spend"), t=$("chart-tasks"), f=$("chart-focus");
  if(s) charts.spend=buildLine(s, labels, spendData);
  if(t) charts.tasks=buildLine(t, labels, taskData);
  if(f) charts.focus=buildLine(f, labels, focusData);
}

/* ===================== WEEKLY LIST (keep yours) ===================== */

function renderWeeklyList(txs){
  const box=$("weekly-chart");
  if(!box) return;

  const map=groupByDay(txs, t=>t.date, t=>t.amount);
  const rows=Object.entries(map).slice(-5);

  box.innerHTML = rows.length
    ? rows.map(([d,v])=>`
      <div style="display:flex;justify-content:space-between;font-size:12px;padding:6px 0">
        <span>${d}</span><span>${money(v)}</span>
      </div>
    `).join("")
    : `<div style="opacity:.5">No weekly data</div>`;
}

/* ===================== MAIN ===================== */

async function run(){
  const userId=getUserId();
  if(!userId) return;

  const [tasks, txs, focus] = await Promise.all([
    fetchSafe(`${API}/api/tasks/${userId}`),
    fetchSafe(`${API}/api/transactions/${userId}`),
    fetchSafe(`${API}/api/focus/${userId}`)
  ]);

  // KPIs
  const f=computeFinance(txs);
  const t=computeTasks(tasks);
  const fm=computeFocus(focus);

  if($("stat-tasks")) $("stat-tasks").textContent = t.done;
  if($("stat-focus")) $("stat-focus").textContent = fm;
  if($("stat-net")) $("stat-net").textContent = money(f.net);

  // trend deltas
  setDelta("stat-trend", delta7(txs)); // add <div id="stat-trend"></div> if you want visible delta

  // content
  renderInsight(tasks, txs, focus);
  renderNext(tasks, txs, focus);
  renderFeed(tasks, txs);
  renderWeeklyList(txs);
  renderCharts(tasks, txs, focus);

  console.log("Dashboard upgraded:", {tasks, txs, focus});
}

window.addEventListener("DOMContentLoaded", run);
window.addEventListener("dataChanged", run);