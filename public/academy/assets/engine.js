/* ============================================================================
   WATT STREET — Energy & Compute Analyst Academy
   Vanilla-JS game engine. No dependencies, no network. State in localStorage.
   ========================================================================== */
"use strict";

window.ACADEMY = window.ACADEMY || {};
ACADEMY.modules = ACADEMY.modules || [];
ACADEMY.gens = ACADEMY.gens || {};
ACADEMY.cases = ACADEMY.cases || [];
ACADEMY.decks = ACADEMY.decks || {};

/* ---------------------------------------------------------------- utils -- */
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
ACADEMY.rng = mulberry32(Date.now() & 0xffffffff);
ACADEMY.setSeed = function (s) { ACADEMY.rng = mulberry32(s); };

function rnd() { return ACADEMY.rng(); }
function ri(lo, hi) { return lo + Math.floor(rnd() * (hi - lo + 1)); }               // int inclusive
function rpick(arr) { return arr[Math.floor(rnd() * arr.length)]; }
function rstep(lo, hi, step) { const n = Math.round((hi - lo) / step); return lo + ri(0, n) * step; }
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function fmt(x, d) {
  if (d === undefined) d = Math.abs(x) >= 100 ? 0 : Math.abs(x) >= 10 ? 1 : 2;
  return x.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}
function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function parseNum(s) {
  if (s == null) return NaN;
  let t = String(s).trim().replace(/[$,%\s]/g, "").replace(/x$/i, "");
  let neg = false;
  if (/^\(.*\)$/.test(t)) { neg = true; t = t.slice(1, -1); }
  if (t.startsWith("-")) { neg = true; t = t.slice(1); }
  const v = parseFloat(t);
  return isNaN(v) ? NaN : (neg ? -v : v);
}
function today() { return Math.floor(Date.now() / 864e5); }
function todayStr() { const d = new Date(); return d.toISOString().slice(0, 10); }

/* ---------------------------------------------------------------- state -- */
const SAVE_KEY = "wattstreet_v1";
let S = null;
function defaultSave() {
  return {
    xp: 0, drillBest: {}, bossBest: {}, labState: {}, lessonsRead: {},
    missed: [], srs: {}, streak: { last: "", n: 0 }, superday: { best: 0, taken: 0 },
    mission: { date: "", done: false }, stats: { answered: 0, correct: 0 }, theme: "auto"
  };
}
function load() {
  try { S = Object.assign(defaultSave(), JSON.parse(localStorage.getItem(SAVE_KEY) || "{}")); }
  catch (e) { S = defaultSave(); }
}
function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) { /* private mode */ } }

const LEVELS = [
  { xp: 0,    name: "Intern",              icon: "🪪" },
  { xp: 250,  name: "Junior Analyst",      icon: "📎" },
  { xp: 700,  name: "Analyst",             icon: "📊" },
  { xp: 1500, name: "Research Associate",  icon: "🧮" },
  { xp: 2600, name: "Senior Associate",    icon: "📈" },
  { xp: 4000, name: "Vice President",      icon: "🏛️" },
  { xp: 6000, name: "Director",            icon: "🎯" },
  { xp: 8500, name: "Managing Director",   icon: "👑" }
];
function levelOf(xp) {
  let cur = LEVELS[0], next = null;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].xp) cur = LEVELS[i];
    else { next = LEVELS[i]; break; }
  }
  return { cur, next };
}
function addXP(n) {
  const before = levelOf(S.xp).cur;
  S.xp += n; save();
  const after = levelOf(S.xp).cur;
  renderTopbar();
  if (after !== before) toast(`${after.icon} Promoted: <b>${after.name}</b>`, "gold");
}
function touchStreak() {
  const t = todayStr();
  if (S.streak.last === t) return;
  const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  S.streak.n = (S.streak.last === y) ? S.streak.n + 1 : 1;
  S.streak.last = t; save(); renderTopbar();
}
function recordAnswer(key, ok) {
  S.stats.answered++; if (ok) S.stats.correct++;
  if (!ok && key) { S.missed = S.missed.filter(k => k !== key); S.missed.push(key); if (S.missed.length > 120) S.missed.shift(); }
  if (ok && key) S.missed = S.missed.filter(k => k !== key);
  touchStreak(); save();
}

/* ---------------------------------------------------------------- toast -- */
function toast(html, kind) {
  const el = document.createElement("div");
  el.style.cssText = "position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:99;" +
    "background:var(--card);border:1px solid var(--line);border-radius:12px;padding:10px 20px;" +
    "font-size:14px;box-shadow:0 8px 30px rgba(0,0,0,.4);transition:opacity .4s;";
  if (kind === "gold") el.style.borderColor = "var(--gold)";
  el.innerHTML = html;
  document.body.appendChild(el);
  setTimeout(() => { el.style.opacity = "0"; setTimeout(() => el.remove(), 450); }, 2200);
}

/* ------------------------------------------------------------ item pool -- */
function moduleById(id) { return ACADEMY.modules.find(m => m.id === id); }
function allDrillItems(mod) {
  const out = [];
  (mod.drills || []).forEach(d => d.items.forEach((it, i) => out.push({ it, key: mod.id + ":" + d.id + ":" + i })));
  return out;
}
function materialize(entry) {
  // entry: {it,key} where it may be a generator ref {t:'gen', g:'id'}
  if (entry.it.t === "gen") {
    const g = ACADEMY.gens[entry.it.g];
    const inst = g();
    inst.t = inst.t || "num";
    return { it: inst, key: "gen:" + entry.it.g };
  }
  return entry;
}
function modulePool(mod) {
  const pool = allDrillItems(mod);
  (mod.bossExtraGens || []).forEach(g => pool.push({ it: { t: "gen", g }, key: "gen:" + g }));
  return pool;
}
function findItemByKey(key) {
  if (key.startsWith("gen:")) return { it: { t: "gen", g: key.slice(4) }, key };
  const [mid, did, idx] = key.split(":");
  const mod = moduleById(mid); if (!mod) return null;
  const d = (mod.drills || []).find(x => x.id === did); if (!d) return null;
  const it = d.items[+idx]; if (!it) return null;
  return { it, key };
}

/* ---------------------------------------------------------------- shell -- */
function renderTopbar() {
  const lv = levelOf(S.xp);
  const due = dueCardCount();
  document.getElementById("topstats").innerHTML =
    `<span class="pill">⚡ <b>${fmt(S.xp, 0)}</b> XP</span>` +
    `<span class="pill">${lv.cur.icon} <b>${lv.cur.name}</b></span>` +
    `<span class="pill">🔥 <b>${S.streak.n}</b> day${S.streak.n === 1 ? "" : "s"}</span>` +
    (due ? `<span class="pill" style="cursor:pointer" onclick="location.hash='#/cards'">🃏 <b>${due}</b> due</span>` : "");
}
function setTheme() {
  // Explicit choice stamps the root; "auto" leaves the attribute to the OS media
  // query or an embedding viewer's own theme toggle (never fight an external stamp).
  if (S.theme === "light" || S.theme === "dark") {
    document.documentElement.setAttribute("data-theme", S.theme);
  }
}
function el(id) { return document.getElementById(id); }
function view(html) {
  stopTimer();
  el("view").innerHTML = html;
  window.scrollTo(0, 0);
}
function crumbs(parts) {
  return `<div class="crumbs">` + parts.map(p =>
    p.href ? `<a href="${p.href}">${p.label}</a>` : `<span>${p.label}</span>`).join(" › ") + `</div>`;
}

/* --------------------------------------------------------------- router -- */
function route() {
  const h = (location.hash || "#/home").slice(2).split("/");
  const [page, a, b] = h;
  try {
    if (page === "" || page === "home") return vHome();
    if (page === "module") return vModule(a);
    if (page === "lesson") return vLesson(a, b);
    if (page === "drill") return startDrill(a, b);
    if (page === "boss") return vBossIntro(a);
    if (page === "lab") return vLab(a);
    if (page === "cards") return vCards(a);
    if (page === "superday") return vSuperdayIntro();
    if (page === "mission") return startMission();
    if (page === "review") return startReview();
    if (page === "reference") return vReference();
    if (page === "settings") return vSettings();
    vHome();
  } catch (e) {
    el("view").innerHTML = `<div class="card"><h3>Something broke</h3><p class="desc">${esc(e.message)}</p>
      <button class="btn" onclick="location.hash='#/home'">Home</button></div>`;
    console.error(e);
  }
}

/* ----------------------------------------------------------------- home -- */
function moduleProgress(mod) {
  const lessons = (mod.lessons || []).length;
  const readN = (mod.lessons || []).filter(l => S.lessonsRead[mod.id + ":" + l.id]).length;
  const drills = (mod.drills || []).length;
  let dScore = 0;
  (mod.drills || []).forEach(d => { dScore += (S.drillBest[mod.id + ":" + d.id] || 0); });
  const dAvg = drills ? dScore / drills : 0;
  const boss = S.bossBest[mod.id] || 0;
  const pct = Math.round(100 * (0.3 * (lessons ? readN / lessons : 0) + 0.5 * dAvg + 0.2 * boss));
  return { pct, readN, lessons, dAvg, boss };
}
function vHome() {
  const lv = levelOf(S.xp);
  const nextTxt = lv.next ? `${fmt(lv.next.xp - S.xp, 0)} XP to ${lv.next.name}` : "Top of the ladder";
  const pctToNext = lv.next ? Math.round(100 * (S.xp - lv.cur.xp) / (lv.next.xp - lv.cur.xp)) : 100;
  const missionDone = S.mission.date === todayStr() && S.mission.done;
  const due = dueCardCount();

  let modCards = ACADEMY.modules.map(m => {
    const p = moduleProgress(m);
    const bossBadge = (S.bossBest[m.id] || 0) >= (m.boss?.pass ?? 0.75)
      ? `<span class="badge pass">boss cleared</span>` : "";
    return `<div class="card clickable" onclick="location.hash='#/module/${m.id}'">
      <h3><span class="icon">${m.icon}</span>${m.title} ${bossBadge}</h3>
      <div class="desc">${m.blurb}</div>
      <div class="meta"><span>${p.readN}/${p.lessons} lessons</span>
        <span>drills ${Math.round(p.dAvg * 100)}%</span><span>boss ${Math.round(p.boss * 100)}%</span></div>
      <div class="progressbar"><div style="width:${p.pct}%"></div></div>
    </div>`;
  }).join("");

  let labCards = ACADEMY.cases.map(c => {
    const st = S.labState[c.id] || {};
    const done = st.done ? `<span class="badge pass">complete</span>` : "";
    return `<div class="card clickable" onclick="location.hash='#/lab/${c.id}'">
      <h3><span class="icon">${c.icon}</span>${c.title} ${done}</h3>
      <div class="desc">${c.blurb}</div>
      <div class="meta"><span>${c.steps.length} checkpoints</span><span>${c.difficulty || ""}</span></div>
    </div>`;
  }).join("");

  view(`
    <div class="levelbar">
      <div class="lvl">${lv.cur.icon}</div>
      <div><div class="lvl-name">${lv.cur.name}</div><div class="lvl-sub">${nextTxt}</div></div>
      <div class="lvl-track"><div class="progressbar"><div style="width:${pctToNext}%"></div></div></div>
      <div class="lvl-sub num">${fmt(S.xp, 0)} XP · 🔥 ${S.streak.n}</div>
    </div>

    <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(230px,1fr))">
      <div class="card clickable" onclick="location.hash='#/mission'">
        <h3>🎯 Daily Mission ${missionDone ? '<span class="badge pass">done</span>' : ""}</h3>
        <div class="desc">12 mixed questions across all desks. 1.25× XP, once a day.</div>
      </div>
      <div class="card clickable" onclick="location.hash='#/cards'">
        <h3>🃏 Flashcards</h3>
        <div class="desc">${due ? `<b>${due} cards due</b> for review.` : "Spaced-repetition vocab — the language of the desk."}</div>
      </div>
      <div class="card clickable" onclick="location.hash='#/review'">
        <h3>🩹 Fix Your Misses</h3>
        <div class="desc">${S.missed.length ? `Re-drill your last <b>${S.missed.length}</b> misses.` : "Nothing in the miss bin. Go earn some mistakes."}</div>
      </div>
      <div class="card clickable" onclick="location.hash='#/superday'">
        <h3>🏁 Superday ${S.superday.best >= 0.75 ? '<span class="badge gold">passed</span>' : ""}</h3>
        <div class="desc">The final: 36 questions, 75 minutes, all topics. Best: ${Math.round(S.superday.best * 100)}%.</div>
      </div>
    </div>

    <div class="section-label">Desks (work them in order)</div>
    <div class="grid">${modCards}</div>

    <div class="section-label">Case Labs — build the model, enter the checkpoints</div>
    <div class="grid">${labCards}</div>

    <div class="footer-note">
      Watt Street is a training simulator. All companies in drills and labs are <b>fictional</b>;
      market figures (auction prices, costs, rates) are teaching approximations compiled in early 2026 —
      always verify current data before using numbers professionally. Keyboard: <kbd>1</kbd>–<kbd>9</kbd> pick answers,
      <kbd>Enter</kbd> submits/advances. · <a href="#/reference">Formula reference</a> · <a href="#/settings">Settings</a>
    </div>
  `);
}

/* --------------------------------------------------------------- module -- */
function vModule(id) {
  const m = moduleById(id); if (!m) return vHome();
  const lessonRows = (m.lessons || []).map(l => {
    const read = S.lessonsRead[m.id + ":" + l.id];
    return `<div class="rowitem ${read ? "done-row" : ""}" onclick="location.hash='#/lesson/${m.id}/${l.id}'">
      <div><div class="t">${read ? "✅" : "📖"} ${l.title}</div></div>
      <div class="right">${read ? "read" : "~" + (l.mins || 6) + " min"}</div></div>`;
  }).join("");
  const drillRows = (m.drills || []).map(d => {
    const best = S.drillBest[m.id + ":" + d.id];
    return `<div class="rowitem ${best >= 0.8 ? "done-row" : ""}" onclick="location.hash='#/drill/${m.id}/${d.id}'">
      <div><div class="t">🎲 ${d.title}</div><div class="s">${d.desc || ""}</div></div>
      <div class="right">${best !== undefined ? "best " + Math.round(best * 100) + "%" : d.items.length + " q"}</div></div>`;
  }).join("");
  const bossBest = S.bossBest[m.id];
  view(`
    ${crumbs([{ label: "Home", href: "#/home" }, { label: m.title }])}
    <h1><span class="icon">${m.icon}</span> ${m.title}</h1>
    <p class="lead">${m.blurb}</p>
    <div class="section-label">Lessons</div>${lessonRows || "<p class='lead'>None.</p>"}
    <div class="section-label">Drills</div>${drillRows || "<p class='lead'>None.</p>"}
    <div class="section-label">Boss Exam</div>
    <div class="rowitem" onclick="location.hash='#/boss/${m.id}'">
      <div><div class="t">👹 ${m.boss?.title || "Desk exam"}</div>
      <div class="s">${m.boss?.count || 16} questions · ${Math.round((m.boss?.time || 1200) / 60)} min · pass ≥ ${Math.round((m.boss?.pass ?? 0.75) * 100)}%</div></div>
      <div class="right">${bossBest !== undefined ? "best " + Math.round(bossBest * 100) + "%" : "not taken"}</div>
    </div>
    ${m.reference ? `<div class="section-label">Cheat sheet</div><div class="card prose">${m.reference}</div>` : ""}
  `);
}

function vLesson(mid, lid) {
  const m = moduleById(mid); if (!m) return vHome();
  const idx = m.lessons.findIndex(l => l.id === lid);
  const l = m.lessons[idx]; if (!l) return vModule(mid);
  const next = m.lessons[idx + 1];
  const key = m.id + ":" + l.id;
  const first = !S.lessonsRead[key];
  view(`
    ${crumbs([{ label: "Home", href: "#/home" }, { label: m.title, href: "#/module/" + m.id }, { label: l.title }])}
    <h1>${l.title}</h1>
    <div class="card prose">${l.html}</div>
    <div class="btnrow">
      <button class="btn primary" onclick="App.finishLesson('${m.id}','${l.id}', ${next ? `'${next.id}'` : "null"})">
        ${first ? "Mark read (+20 XP)" : "Done"} ${next ? "→ next lesson" : ""}</button>
      <button class="btn ghost" onclick="location.hash='#/module/${m.id}'">Back to desk</button>
    </div>
  `);
}

/* --------------------------------------------------------------- runner -- */
let R = null;   // runner session
let timerH = null;
function stopTimer() { if (timerH) { clearInterval(timerH); timerH = null; } }

/* Enter-key debounce: submitting with Enter focuses the Next button, and the same
   keystroke's trailing events would click it instantly, skipping feedback. */
let advLock = 0;
function lockAdvance() { advLock = Date.now() + 300; }
function advanceLocked() { return Date.now() < advLock; }

function startSession(items, opts) {
  R = Object.assign({
    items, i: 0, score: 0, pts: 0, ptsMax: 0, answered: false, results: [],
    mode: "drill", xpMult: 1, deferFeedback: false, timeLeft: 0, title: "Drill",
    backHash: "#/home", onDone: null
  }, opts);
  if (R.timeLeft > 0) {
    timerH = setInterval(() => {
      R.timeLeft--;
      const t = el("timer");
      if (t) { t.textContent = clock(R.timeLeft); if (R.timeLeft <= 60) t.classList.add("low"); }
      if (R.timeLeft <= 0) { stopTimer(); finishSession(true); }
    }, 1000);
  }
  renderQuestion();
}
function clock(s) { return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }

function startDrill(mid, did) {
  const m = moduleById(mid); if (!m) return vHome();
  const d = (m.drills || []).find(x => x.id === did); if (!d) return vModule(mid);
  let entries = d.items.map((it, i) => ({ it, key: mid + ":" + did + ":" + i }));
  if (d.shuffle !== false) entries = shuffle(entries);
  if (d.serve) entries = entries.slice(0, d.serve);
  startSession(entries.map(materialize), {
    mode: "drill", title: `${m.icon} ${d.title}`, backHash: "#/module/" + mid,
    onDone: (pct) => { const k = mid + ":" + did; if ((S.drillBest[k] || 0) < pct) S.drillBest[k] = pct; save(); }
  });
}

function vBossIntro(mid) {
  const m = moduleById(mid); if (!m) return vHome();
  const b = m.boss || {};
  view(`
    ${crumbs([{ label: "Home", href: "#/home" }, { label: m.title, href: "#/module/" + m.id }, { label: "Boss" }])}
    <div class="card" style="text-align:center;padding:40px 20px">
      <div style="font-size:52px">👹</div>
      <h1>${b.title || m.title + " Exam"}</h1>
      <p class="lead">${b.count || 16} questions · ${Math.round((b.time || 1200) / 60)} minutes · pass ≥ ${Math.round((b.pass ?? 0.75) * 100)}%<br>
      No feedback until the end — just like a live client call.</p>
      <button class="btn primary" onclick="App.startBoss('${mid}')">Start</button>
    </div>`);
}
function startBoss(mid) {
  const m = moduleById(mid); const b = m.boss || {};
  const pool = shuffle(modulePool(m));
  const items = pool.slice(0, b.count || 16).map(materialize);
  startSession(items, {
    mode: "boss", title: `👹 ${m.title} Boss`, backHash: "#/module/" + mid,
    deferFeedback: true, timeLeft: b.time || 1200, xpMult: 1.5,
    onDone: (pct) => {
      if ((S.bossBest[mid] || 0) < pct) S.bossBest[mid] = pct;
      if (pct >= (b.pass ?? 0.75)) addXP(150);
      save();
    }
  });
}

function vSuperdayIntro() {
  view(`
    ${crumbs([{ label: "Home", href: "#/home" }, { label: "Superday" }])}
    <div class="card" style="text-align:center;padding:40px 20px">
      <div style="font-size:52px">🏁</div>
      <h1>Superday</h1>
      <p class="lead">36 questions across every desk · 75 minutes · pass ≥ 75%.<br>
      This is the associate-seat interview gauntlet: accounting, DCF, comps, power, compute, project finance, judgment.<br>
      Best so far: <b>${Math.round(S.superday.best * 100)}%</b> (${S.superday.taken} attempts)</p>
      <button class="btn primary" onclick="App.startSuperday()">I'm ready</button>
    </div>`);
}
function startSuperday() {
  let items = [];
  ACADEMY.modules.forEach(m => {
    const pool = shuffle(modulePool(m));
    items = items.concat(pool.slice(0, Math.ceil(36 / ACADEMY.modules.length) + 1));
  });
  items = shuffle(items).slice(0, 36).map(materialize);
  startSession(items, {
    mode: "superday", title: "🏁 Superday", backHash: "#/home",
    deferFeedback: true, timeLeft: 75 * 60, xpMult: 2,
    onDone: (pct) => {
      S.superday.taken++;
      if (pct > S.superday.best) S.superday.best = pct;
      if (pct >= 0.75) addXP(400);
      save();
    }
  });
}

function startMission() {
  if (S.mission.date === todayStr() && S.mission.done) {
    view(`<div class="card" style="text-align:center;padding:40px"><div style="font-size:44px">🎯</div>
      <h2>Mission complete</h2><p class="lead">Come back tomorrow. Streak: 🔥 ${S.streak.n}</p>
      <button class="btn" onclick="location.hash='#/home'">Home</button></div>`);
    return;
  }
  let items = [];
  ACADEMY.modules.forEach(m => { items = items.concat(shuffle(modulePool(m)).slice(0, 2)); });
  items = shuffle(items).slice(0, 12).map(materialize);
  startSession(items, {
    mode: "mission", title: "🎯 Daily Mission", backHash: "#/home", xpMult: 1.25,
    onDone: () => { S.mission = { date: todayStr(), done: true }; save(); }
  });
}

function startReview() {
  if (!S.missed.length) { location.hash = "#/home"; return; }
  const entries = S.missed.slice(-25).map(findItemByKey).filter(Boolean).reverse();
  startSession(shuffle(entries).map(materialize), { mode: "review", title: "🩹 Fix Your Misses", backHash: "#/home" });
}

/* ------------------------------------------------------ question render -- */
function renderQuestion() {
  const n = R.items.length;
  if (R.i >= n) return finishSession(false);
  const { it } = R.items[R.i];
  R.answered = false;
  const head = `<div class="runner-head"><a href="${R.backHash}">✕ quit</a>
    <span>${R.title}</span><span class="num">${R.i + 1} / ${n}</span>
    <span class="num">✔ ${R.score}</span>
    ${R.timeLeft > 0 ? `<span class="timer" id="timer">${clock(R.timeLeft)}</span>` : ""}</div>`;

  let body = "";
  if (it.t === "mc" || it.t === "judge") {
    const order = it.noShuffle ? it.c.map((_, i) => i) : shuffle(it.c.map((_, i) => i));
    R.order = order;
    body = `<div class="choices">` + order.map((ci, pos) =>
      `<button class="choice" id="ch${pos}" onclick="App.answerMC(${ci},${pos})">
         <span class="key">${pos + 1}</span>${typeof it.c[ci] === "string" ? it.c[ci] : it.c[ci].text}</button>`).join("") + `</div>`;
  } else if (it.t === "num") {
    body = `<div class="numrow">
      <input id="numin" inputmode="decimal" autocomplete="off" placeholder="your answer"
             onkeydown="if(event.key==='Enter')App.answerNum()">
      <span class="unit">${it.unit || ""}</span>
      <button class="btn primary" onclick="App.answerNum()">Submit</button></div>`;
  } else if (it.t === "write") {
    body = `<textarea class="writebox" id="writein" placeholder="Draft it like it's going to the morning note..."></textarea>
      <div class="btnrow"><button class="btn primary" onclick="App.revealWrite()">Compare to the desk answer</button></div>`;
  }
  view(head + `<div class="qcard"><div class="qtext">${it.q}</div>${body}<div id="fb"></div><div id="nextrow"></div></div>`);
  const inp = el("numin"); if (inp) inp.focus();
}

function xpFor(it) {
  const d = it.diff || 1;
  const base = it.t === "num" ? 14 : it.t === "judge" ? 12 : 10;
  return Math.round(base * d * R.xpMult);
}

function answerMC(ci, pos) {
  if (R.answered) return; R.answered = true;
  const entry = R.items[R.i]; const it = entry.it;
  const isJudge = it.t === "judge";
  const best = isJudge ? it.c.reduce((m, c, i) => (it.c[i].pts > it.c[m].pts ? i : m), 0) : it.a;
  const ok = ci === best;
  const pts = isJudge ? it.c[ci].pts : (ok ? 1 : 0);
  const maxPts = isJudge ? Math.max(...it.c.map(c => c.pts)) : 1;
  R.pts += pts; R.ptsMax += maxPts;
  if (ok) R.score++;
  recordAnswer(entry.key, ok);
  R.results.push({ it, ok, picked: ci });
  // paint
  R.order.forEach((oc, p) => {
    const btn = el("ch" + p); if (!btn) return;
    btn.disabled = true;
    if (oc === best) btn.classList.add("correct");
    else if (oc === ci) btn.classList.add("wrong");
    else btn.classList.add("dim");
  });
  if (!R.deferFeedback) {
    const note = isJudge ? (it.c[ci].note || "") : (it.why || "");
    const grade = isJudge ? `${it.c[ci].pts}/${maxPts} pts — ` : "";
    fb(ok ? "good" : "bad", (ok ? "✔ Right. " : "✘ Not quite. ") + grade, note);
    if (ok || pts > 0) addXP(Math.round(xpFor(it) * (isJudge ? pts / maxPts : 1)));
  } else setTimeout(nextQ, 350);
  if (!R.deferFeedback) nextBtn();
}

function answerNum() {
  if (R.answered) return;
  const entry = R.items[R.i]; const it = entry.it;
  const v = parseNum(el("numin").value);
  if (isNaN(v)) { el("numin").focus(); return; }
  R.answered = true;
  const tol = it.tol !== undefined ? it.tol : Math.max(Math.abs(it.ans) * 0.015, 0.01);
  const ok = Math.abs(v - it.ans) <= tol;
  if (ok) R.score++;
  R.pts += ok ? 1 : 0; R.ptsMax += 1;
  recordAnswer(entry.key, ok);
  R.results.push({ it, ok, picked: v });
  if (!R.deferFeedback) {
    fb(ok ? "good" : "bad",
      (ok ? "✔ Right: " : "✘ Answer: ") + `<span class="num">${fmt(it.ans, it.dp)}</span> ${it.unit || ""}`,
      it.sol || "");
    if (ok) addXP(xpFor(it));
    nextBtn();
  } else setTimeout(nextQ, 250);
}

function revealWrite() {
  if (R.answered) return; R.answered = true;
  const entry = R.items[R.i]; const it = entry.it;
  const yours = esc(el("writein").value || "(blank)");
  el("fb").innerHTML = `<div class="feedback info"><div class="fb-head">Desk answer</div>${it.model}
    <div style="margin-top:10px"><b>Rubric — score yourself:</b><ul>${it.rubric.map(r => `<li>${r}</li>`).join("")}</ul></div>
    <div style="margin-top:6px;color:var(--ink-faint);font-size:13px">Yours:<br><i>${yours.replace(/\n/g, "<br>")}</i></div></div>
    <div class="btnrow">
      <button class="btn" onclick="App.gradeWrite(0)">Missed it (0)</button>
      <button class="btn" onclick="App.gradeWrite(1)">Partial (1)</button>
      <button class="btn" onclick="App.gradeWrite(2)">Solid (2)</button>
      <button class="btn primary" onclick="App.gradeWrite(3)">Nailed it (3)</button></div>`;
}
function gradeWrite(g) {
  const entry = R.items[R.i];
  const ok = g >= 2;
  if (ok) R.score++;
  R.pts += g; R.ptsMax += 3;
  recordAnswer(entry.key, ok);
  R.results.push({ it: entry.it, ok, picked: g });
  if (ok) addXP(Math.round(8 * g * R.xpMult));
  nextQ();
}

function fb(kind, head, sol) {
  el("fb").innerHTML = `<div class="feedback ${kind}"><div class="fb-head">${head}</div>
    ${sol ? `<div class="sol">${sol}</div>` : ""}</div>`;
}
function nextBtn() {
  lockAdvance();
  el("nextrow").innerHTML = `<div class="btnrow"><button class="btn primary" id="nextbtn" onclick="App.nextQ()">
    ${R.i + 1 >= R.items.length ? "Finish" : "Next"} ↵</button></div>`;
  el("nextbtn").focus();
}
function nextQ() { if (advanceLocked()) return; R.i++; renderQuestion(); }

function finishSession(timedOut) {
  stopTimer();
  const n = Math.max(R.results.length, R.items.length);
  const pct = R.ptsMax > 0 ? R.pts / R.ptsMax : 0;
  if (R.onDone) R.onDone(pct);
  if (R.deferFeedback) {
    // award XP now
    let xp = 0;
    R.results.forEach(r => { if (r.ok) xp += xpFor(r.it); });
    if (xp) addXP(xp);
  }
  const passNeed = R.mode === "boss" || R.mode === "superday" ? 0.75 : null;
  const passed = passNeed === null ? null : pct >= passNeed;
  const review = R.deferFeedback ? R.results.map((r, i) => {
    const it = r.it;
    const ansTxt = it.t === "num" ? `${fmt(it.ans, it.dp)} ${it.unit || ""}` :
      it.t === "mc" ? (typeof it.c[it.a] === "string" ? it.c[it.a] : it.c[it.a].text) :
      it.t === "judge" ? it.c.reduce((m, c) => c.pts > m.pts ? c : m, it.c[0]).text : "—";
    return `<div class="rowitem" style="cursor:default">
      <div><div class="t">${r.ok ? "✅" : "❌"} Q${i + 1}. ${it.q.replace(/<[^>]+>/g, " ").slice(0, 110)}…</div>
      <div class="s"><b>Answer:</b> ${ansTxt}${it.sol ? " — " + it.sol.replace(/<[^>]+>/g, " ").slice(0, 160) : it.why ? " — " + it.why.replace(/<[^>]+>/g, " ").slice(0, 160) : ""}</div></div></div>`;
  }).join("") : "";
  view(`<div class="card scorebox">
      <div class="big" style="color:${pct >= 0.75 ? "var(--accent2)" : pct >= 0.5 ? "var(--accent)" : "var(--bad)"}">${Math.round(pct * 100)}%</div>
      <div class="verdict">${timedOut ? "⏰ Time. " : ""}${verdict(pct, passed)}</div>
      <div class="xp">score ${R.score}/${n}</div>
      <div class="btnrow" style="justify-content:center">
        <button class="btn primary" onclick="location.hash='${R.backHash}';">Continue</button>
        ${R.mode === "drill" || R.mode === "review" ? `<button class="btn" onclick="location.reload()">⟳ Again</button>` : ""}
      </div></div>${review ? `<div class="section-label">Answer review</div>` + review : ""}`);
}
function verdict(p, passed) {
  if (passed === true) return "Cleared. The desk nods approvingly.";
  if (passed === false) return "Not yet — review the misses and come back.";
  if (p >= 0.9) return "Client-ready.";
  if (p >= 0.75) return "Solid — tighten the misses.";
  if (p >= 0.5) return "Getting there. Re-read the lesson, then re-run.";
  return "Rough tape. Back to the lessons.";
}

/* ----------------------------------------------------------------- labs -- */
function vLab(id) {
  const c = ACADEMY.cases.find(x => x.id === id); if (!c) return vHome();
  const st = S.labState[id] || (S.labState[id] = { step: 0, miss: {}, done: false });
  const done = st.done || st.step >= c.steps.length;
  const dots = c.steps.map((_, i) =>
    `<span class="${i < st.step ? (st.miss[i] ? "miss done" : "done") : i === st.step && !done ? "cur" : ""}"></span>`).join("");
  let stepHtml = "";
  if (!done) {
    const stp = c.steps[st.step];
    stepHtml = `<div class="qcard">
      <div class="qtext"><b>Checkpoint ${st.step + 1} of ${c.steps.length}.</b> ${stp.q}</div>
      <div class="numrow">
        <input id="numin" inputmode="decimal" autocomplete="off" placeholder="your answer"
          onkeydown="if(event.key==='Enter')App.labAnswer('${id}')">
        <span class="unit">${stp.unit || ""}</span>
        <button class="btn primary" onclick="App.labAnswer('${id}')">Check</button>
        ${stp.hint ? `<button class="btn ghost small" onclick="el('hint').style.display='block'">hint</button>` : ""}
      </div>
      ${stp.hint ? `<div class="hintbox" id="hint" style="display:none">💡 ${stp.hint}</div>` : ""}
      <div id="fb"></div><div id="nextrow"></div></div>`;
  } else {
    stepHtml = `<div class="card"><h2 style="margin-top:0">🎓 Debrief</h2><div class="prose">${c.debrief}</div>
      <div class="btnrow"><button class="btn primary" onclick="location.hash='#/home'">Home</button>
      <button class="btn" onclick="App.labReset('${id}')">⟳ Redo lab</button></div></div>`;
    if (!st.done) { st.done = true; save(); addXP(100); toast("🏆 Lab complete <b>+100 XP</b>", "gold"); }
  }
  view(`
    ${crumbs([{ label: "Home", href: "#/home" }, { label: c.title }])}
    <h1><span class="icon">${c.icon}</span> ${c.title}</h1>
    <p class="lead">${c.blurb} — work it in Excel or on paper, then enter each checkpoint. Tolerances forgive rounding.</p>
    <details class="card labbrief" ${done ? "" : "open"}><summary>📋 Case file & assumptions</summary>
      <div class="prose">${c.brief}</div></details>
    <div class="stepdots">${dots}</div>
    ${stepHtml}`);
  const inp = el("numin"); if (inp) inp.focus();
}
function labAnswer(id) {
  const c = ACADEMY.cases.find(x => x.id === id);
  const st = S.labState[id];
  const stp = c.steps[st.step];
  const v = parseNum(el("numin").value);
  if (isNaN(v)) { el("numin").focus(); return; }
  const tol = stp.tol !== undefined ? stp.tol : Math.max(Math.abs(stp.ans) * 0.02, 0.02);
  const ok = Math.abs(v - stp.ans) <= tol;
  st.miss[st.step] = st.miss[st.step] || 0;
  if (ok) {
    fb("good", `✔ ${fmt(stp.ans, stp.dp)} ${stp.unit || ""}`, stp.sol || "");
    addXP(st.miss[st.step] ? 8 : 15);
    lockAdvance();
    el("nextrow").innerHTML = `<div class="btnrow"><button class="btn primary" id="nextbtn"
      onclick="App.labNext('${id}')">Next ↵</button></div>`;
    el("nextbtn").focus();
    touchStreak(); save();
  } else {
    st.miss[st.step]++;
    if (st.miss[st.step] >= 2) {
      fb("bad", `✘ It's <span class="num">${fmt(stp.ans, stp.dp)}</span> ${stp.unit || ""}`, stp.sol || "");
      lockAdvance();
      el("nextrow").innerHTML = `<div class="btnrow"><button class="btn primary" id="nextbtn"
        onclick="App.labNext('${id}')">Got it — next ↵</button></div>`;
      el("nextbtn").focus();
    } else {
      fb("bad", "✘ Off the mark — check your setup and try once more.", stp.hint ? "💡 " + stp.hint : "");
      el("numin").select();
    }
    save();
  }
}
function labNext(id) {
  if (advanceLocked()) return;
  const st = S.labState[id]; st.step++; save(); vLab(id);
}
function labReset(id) { S.labState[id] = { step: 0, miss: {}, done: S.labState[id].done }; save(); vLab(id); }

/* ------------------------------------------------------------ flashcards -- */
function allCards() {
  const out = [];
  Object.keys(ACADEMY.decks).forEach(dk => {
    ACADEMY.decks[dk].cards.forEach((c, i) => out.push({ deck: dk, card: c, key: "srs:" + dk + ":" + i }));
  });
  return out;
}
function dueCardCount() {
  const t = today();
  return allCards().filter(c => { const e = S.srs[c.key]; return e && e.due <= t; }).length;
}
let CS = null; // card session
function vCards(deckId) {
  const t = today();
  if (!deckId) {
    const rows = Object.keys(ACADEMY.decks).map(dk => {
      const d = ACADEMY.decks[dk];
      const cards = d.cards.map((c, i) => ({ key: "srs:" + dk + ":" + i }));
      const due = cards.filter(c => S.srs[c.key] && S.srs[c.key].due <= t).length;
      const fresh = cards.filter(c => !S.srs[c.key]).length;
      return `<div class="rowitem" onclick="location.hash='#/cards/${dk}'">
        <div><div class="t">🃏 ${d.title}</div><div class="s">${d.cards.length} cards</div></div>
        <div class="right">${due ? due + " due · " : ""}${fresh} new</div></div>`;
    }).join("");
    view(`${crumbs([{ label: "Home", href: "#/home" }, { label: "Flashcards" }])}
      <h1>🃏 Flashcards</h1><p class="lead">Desk vocabulary on a spaced-repetition schedule. Grade honestly — the scheduler does the rest.</p>
      <div class="rowitem" onclick="location.hash='#/cards/all'"><div><div class="t">▶ Review everything due</div></div>
        <div class="right">${dueCardCount()} due</div></div>${rows}`);
    return;
  }
  // build session
  let pool = allCards();
  if (deckId !== "all") pool = pool.filter(c => c.deck === deckId);
  const due = pool.filter(c => S.srs[c.key] && S.srs[c.key].due <= t);
  const fresh = shuffle(pool.filter(c => !S.srs[c.key])).slice(0, 15);
  CS = { q: shuffle(due.concat(fresh)), i: 0, flipped: false, deckId, doneN: 0 };
  if (!CS.q.length) {
    view(`<div class="card scorebox"><div style="font-size:44px">🌤️</div><h2>Deck clear</h2>
      <p class="lead">Nothing due here right now.</p>
      <button class="btn primary" onclick="location.hash='#/cards'">Decks</button></div>`);
    return;
  }
  renderCard();
}
function renderCard() {
  if (CS.i >= CS.q.length) {
    addXP(CS.doneN * 2);
    view(`<div class="card scorebox"><div style="font-size:44px">🃏</div><h2>Session done</h2>
      <p class="lead">${CS.doneN} cards reviewed · +${CS.doneN * 2} XP</p>
      <button class="btn primary" onclick="location.hash='#/cards'">Decks</button>
      <button class="btn" onclick="location.hash='#/home'">Home</button></div>`);
    return;
  }
  const c = CS.q[CS.i];
  CS.flipped = false;
  view(`<div class="runner-head"><a href="#/cards">✕ quit</a><span>🃏 ${ACADEMY.decks[c.deck].title}</span>
      <span class="num">${CS.i + 1}/${CS.q.length}</span></div>
    <div class="flashcard" onclick="App.flipCard()" id="fcard">
      <div class="front">${c.card.f}</div>
      <div class="tap">tap / space to flip</div></div>
    <div class="gradebtns" id="grades" style="visibility:hidden">
      <button class="btn" onclick="App.gradeCard(0)">Again</button>
      <button class="btn" onclick="App.gradeCard(1)">Good</button>
      <button class="btn primary" onclick="App.gradeCard(2)">Easy</button></div>`);
}
function flipCard() {
  if (CS.flipped) return;
  CS.flipped = true;
  const c = CS.q[CS.i];
  el("fcard").innerHTML = `<div class="front">${c.card.f}</div><div class="back">${c.card.b}</div>`;
  el("grades").style.visibility = "visible";
}
function gradeCard(g) {
  if (!CS.flipped) { flipCard(); return; }
  const c = CS.q[CS.i];
  const e = S.srs[c.key] || { iv: 0, due: today() };
  if (g === 0) { e.iv = 0; e.due = today(); CS.q.push(c); }           // requeue today
  else if (g === 1) { e.iv = e.iv ? Math.round(e.iv * 2.3) : 1; e.due = today() + e.iv; }
  else { e.iv = e.iv ? Math.round(e.iv * 3.2) : 3; e.due = today() + e.iv; }
  S.srs[c.key] = e; CS.doneN++; touchStreak(); save(); renderTopbar();
  CS.i++; renderCard();
}

/* ------------------------------------------------------------- reference -- */
function vReference() {
  const secs = ACADEMY.modules.filter(m => m.reference).map(m =>
    `<h2>${m.icon} ${m.title}</h2><div class="card prose">${m.reference}</div>`).join("");
  view(`${crumbs([{ label: "Home", href: "#/home" }, { label: "Reference" }])}
    <h1>📐 Formula Reference</h1><p class="lead">Every cheat sheet in one place. Print-worthy.</p>${secs}`);
}

/* -------------------------------------------------------------- settings -- */
function vSettings() {
  view(`${crumbs([{ label: "Home", href: "#/home" }, { label: "Settings" }])}
    <h1>⚙️ Settings</h1>
    <div class="card">
      <h3 style="margin-top:0">Theme</h3>
      <div class="btnrow">
        <button class="btn ${S.theme === "auto" ? "primary" : ""}" onclick="App.setThemeMode('auto')">Auto (system)</button>
        <button class="btn ${S.theme === "dark" ? "primary" : ""}" onclick="App.setThemeMode('dark')">Dark</button>
        <button class="btn ${S.theme === "light" ? "primary" : ""}" onclick="App.setThemeMode('light')">Light</button></div>
      <h3>Progress</h3>
      <p class="lead" style="font-size:14px">XP ${fmt(S.xp, 0)} · ${S.stats.correct}/${S.stats.answered} lifetime correct
        (${S.stats.answered ? Math.round(100 * S.stats.correct / S.stats.answered) : 0}%)</p>
      <div class="btnrow">
        <button class="btn" onclick="App.exportSave()">Export save</button>
        <button class="btn" onclick="el('importbox').style.display='block'">Import save</button>
        <button class="btn" style="border-color:var(--bad);color:var(--bad)" onclick="App.wipe()">Reset everything</button></div>
      <div id="importbox" style="display:none;margin-top:12px">
        <textarea class="writebox" id="importtxt" placeholder="paste exported save JSON here"></textarea>
        <div class="btnrow"><button class="btn primary" onclick="App.importSave()">Load</button></div></div>
      <div id="exportbox"></div>
    </div>`);
}
function setThemeMode(t) {
  S.theme = t; save();
  if (t === "auto") document.documentElement.removeAttribute("data-theme");
  else setTheme();
  vSettings();
}
function exportSave() {
  el("exportbox").innerHTML = `<textarea class="writebox" onclick="this.select()">${esc(JSON.stringify(S))}</textarea>
    <p class="lead" style="font-size:13px">Copy this somewhere safe; paste it into Import on another machine.</p>`;
}
function importSave() {
  try {
    const obj = JSON.parse(el("importtxt").value);
    if (typeof obj.xp !== "number") throw new Error("not a Watt Street save");
    S = Object.assign(defaultSave(), obj); save(); setTheme(); renderTopbar();
    toast("Save loaded."); location.hash = "#/home"; route();
  } catch (e) { toast("⚠️ Couldn't parse that save."); }
}
function wipe() {
  if (!confirm("Reset all XP, progress and flashcard history?")) return;
  S = defaultSave(); save(); setTheme(); renderTopbar(); location.hash = "#/home"; route();
}

/* -------------------------------------------------------------- App API -- */
window.App = {
  answerMC, answerNum, nextQ, revealWrite, gradeWrite, labAnswer, labNext, labReset,
  flipCard, gradeCard, startBoss, startSuperday, setThemeMode, exportSave, importSave, wipe,
  finishLesson(mid, lid, nextId) {
    const key = mid + ":" + lid;
    if (!S.lessonsRead[key]) { S.lessonsRead[key] = true; save(); addXP(20); touchStreak(); }
    location.hash = nextId ? `#/lesson/${mid}/${nextId}` : `#/module/${mid}`;
  }
};
window.el = el;

/* ------------------------------------------------------------- keyboard -- */
document.addEventListener("keydown", (e) => {
  if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
  if (CS && el("fcard")) {
    if (e.key === " ") { e.preventDefault(); flipCard(); return; }
    if (CS.flipped && ["1", "2", "3"].includes(e.key)) { gradeCard(+e.key - 1); return; }
  }
  if (R && !R.answered) {
    const k = +e.key;
    if (k >= 1 && k <= 9) { const btn = el("ch" + (k - 1)); if (btn && !btn.disabled) btn.click(); }
  }
  if (e.key === "Enter") { const nb = el("nextbtn"); if (nb) nb.click(); }
});

/* ------------------------------------------------------------ self test -- */
ACADEMY.selfTest = function (iters) {
  iters = iters || 40;
  const report = { gens: {}, cases: {}, counts: {}, errors: [] };
  Object.keys(ACADEMY.gens).forEach(gid => {
    try {
      for (let i = 0; i < iters; i++) {
        const inst = ACADEMY.gens[gid]();
        if (!inst.q || typeof inst.q !== "string") throw new Error("no q");
        if (inst.t === "mc" || inst.t === "judge") {
          if (!Array.isArray(inst.c) || inst.c.length < 2) throw new Error("bad choices");
          if (inst.t === "mc" && (inst.a === undefined || inst.a < 0 || inst.a >= inst.c.length)) throw new Error("bad answer idx");
        } else {
          if (!isFinite(inst.ans)) throw new Error("non-finite ans: " + inst.ans);
        }
      }
      report.gens[gid] = "ok";
    } catch (e) { report.gens[gid] = "FAIL: " + e.message; report.errors.push("gen " + gid + ": " + e.message); }
  });
  ACADEMY.cases.forEach(c => {
    try {
      c.steps.forEach((s, i) => {
        if (!isFinite(s.ans)) throw new Error("step " + (i + 1) + " non-finite");
      });
      report.cases[c.id] = c.steps.map(s => +s.ans.toFixed(4));
    } catch (e) { report.cases[c.id] = "FAIL: " + e.message; report.errors.push("case " + c.id + ": " + e.message); }
  });
  ACADEMY.modules.forEach(m => {
    let mc = 0, num = 0, gen = 0, other = 0;
    (m.drills || []).forEach(d => d.items.forEach(it => {
      if (it.t === "mc") { mc++; if (it.a === undefined || !it.c || it.a >= it.c.length) report.errors.push("bad mc in " + m.id + "/" + d.id); }
      else if (it.t === "num") { num++; if (!isFinite(it.ans)) report.errors.push("bad num in " + m.id + "/" + d.id); }
      else if (it.t === "gen") { gen++; if (!ACADEMY.gens[it.g]) report.errors.push("missing gen " + it.g); }
      else other++;
    }));
    report.counts[m.id] = { mc, num, gen, other, lessons: (m.lessons || []).length, cards: 0 };
  });
  Object.keys(ACADEMY.decks).forEach(dk => { report.counts["deck:" + dk] = ACADEMY.decks[dk].cards.length; });
  return report;
};

/* ----------------------------------------------------------------- boot -- */
function boot() {
  load();
  setTheme();
  ACADEMY.modules.sort((a, b) => (a.order || 0) - (b.order || 0));
  renderTopbar();
  window.addEventListener("hashchange", route);
  route();
}
/* Content files load after engine.js, so defer boot to the end of the parse —
   but stay resilient to embedders that inject this after DOMContentLoaded. */
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else setTimeout(boot, 0);
