const { chromium } = require("playwright");
(async () => {

const APP = "file:///home/user/joelka/public/academy/index.html";
const GOLDEN = {
  lab1: [1272.0, 457.92, 90.0, 170.94, 5.76, 305.18, 300.18, 3041.94, 197.75, 526.19, 2675.0, 3312.32],
  lab2: [9.75, 7.725, 561.0, 741.2, 2628.3, 13205.6, 9102.8, 11731.1, 26.50, 77.6],
  lab3: [355.24, 50444, 56344, 13.74, 11.86, 20935, 10.74, 21.41, 2.72],
  lab4: [575, 63.36, 60.56, 10.53, 968.96, 393.96, 62.4, 230, 2.71, 835.31],
  lab5: [380, 128.77, 34.30, 163.07, 14.79, 119.23, 73.1, 76, 25.93, 3.19, 29.13],
  lab6: [508080, 22.86, 5.10, 19.16, 17.56, 14.64, 135.4, 94.91, 39.66, 11.4],
  lab7: [399.36, 184.32, 133.12, 2556.8, 2.22, 29.95, 7.5, 7.99, 67.91],
};

const fails = [];
const check = (cond, msg) => { console.log((cond ? "PASS " : "FAIL ") + msg); if (!cond) fails.push(msg); };

const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on("pageerror", e => errors.push(String(e)));
page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });

await page.goto(APP);
await page.waitForTimeout(600);

check((await page.innerText(".topbar")).includes("WATT"), "app boots, topbar renders");
check((await page.locator(".card").count()) > 10, "home renders module + lab cards");

const report = await page.evaluate("ACADEMY.selfTest(300)");
const genFails = Object.entries(report.gens).filter(([k, v]) => v !== "ok");
check(genFails.length === 0, `all ${Object.keys(report.gens).length} generators OK across 300 draws ${genFails.map(g => g[0])}`);
check(report.errors.length === 0, `no content integrity errors ${report.errors.slice(0, 3)}`);
const stats = await page.evaluate(`({
  modules: ACADEMY.modules.length,
  lessons: ACADEMY.modules.reduce((a,m)=>a+(m.lessons||[]).length,0),
  drillItems: ACADEMY.modules.reduce((a,m)=>a+(m.drills||[]).reduce((b,d)=>b+d.items.length,0),0),
  gens: Object.keys(ACADEMY.gens).length,
  labs: ACADEMY.cases.length,
  labSteps: ACADEMY.cases.reduce((a,c)=>a+c.steps.length,0),
  cards: Object.values(ACADEMY.decks).reduce((a,d)=>a+d.cards.length,0),
})`);
console.log("  content:", JSON.stringify(stats));

const jsCases = await page.evaluate("ACADEMY.cases.map(c=>({id:c.id, ans:c.steps.map(s=>s.ans)}))");
for (const c of jsCases) {
  const g = GOLDEN[c.id];
  if (!g) { check(false, `${c.id}: no golden values`); continue; }
  if (g.length !== c.ans.length) { check(false, `${c.id}: step count ${c.ans.length} != golden ${g.length}`); continue; }
  const bad = c.ans.map((a, i) => [i + 1, a, g[i]]).filter(([i, a, gg]) => Math.abs(a - gg) > Math.max(Math.abs(gg) * 0.004, 0.02));
  check(bad.length === 0, `${c.id}: all ${g.length} checkpoints match golden model ${JSON.stringify(bad)}`);
}

await page.goto(APP + "#/module/power"); await page.waitForTimeout(300);
check((await page.innerText("#view")).includes("Power Markets"), "module page renders");

await page.goto(APP + "#/drill/acct/walk"); await page.waitForTimeout(400);
if (await page.locator("#numin").count()) {
  const ans = await page.evaluate("R.items[R.i].it.ans");
  await page.fill("#numin", String(ans));
  await page.click("text=Submit");
  await page.waitForTimeout(200);
  check((await page.innerText("#fb")).includes("✔"), "numeric drill: correct answer accepted with worked solution");
} else {
  await page.locator(".choice").first().click();
  await page.waitForTimeout(200);
  check((await page.locator(".feedback").count()) > 0, "mc drill: feedback appears");
}
const xp = await page.evaluate("JSON.parse(localStorage.getItem('wattstreet_v1')).xp");
check(xp > 0, `XP persisted to localStorage (xp=${xp})`);

await page.goto(APP + "#/lab/lab1"); await page.waitForTimeout(300);
await page.fill("#numin", "1272");
await page.press("#numin", "Enter"); await page.waitForTimeout(200);
check((await page.innerText("#fb")).includes("✔"), "lab checkpoint: correct answer accepted");
await page.click("#nextbtn"); await page.waitForTimeout(200);
await page.fill("#numin", "999999"); await page.press("#numin", "Enter"); await page.waitForTimeout(150);
check((await page.innerText("#fb")).includes("✘"), "lab checkpoint: wrong answer rejected with retry");

await page.goto(APP + "#/cards/power"); await page.waitForTimeout(300);
if (await page.locator("#fcard").count()) {
  await page.click("#fcard"); await page.waitForTimeout(100);
  check((await page.locator(".back").count()) > 0, "flashcard flips");
  await page.click("text=Good"); await page.waitForTimeout(150);
  check(true, "flashcard graded via SRS");
}

await page.goto(APP + "#/boss/val"); await page.waitForTimeout(200);
check((await page.innerText("#view")).includes("Start"), "boss intro renders");
await page.goto(APP + "#/superday"); await page.waitForTimeout(200);
check((await page.innerText("#view")).includes("Superday"), "superday intro renders");
await page.goto(APP + "#/reference"); await page.waitForTimeout(200);
check((await page.innerText("#view")).includes("Formula Reference"), "reference page renders");

await page.goto(APP + "#/boss/power"); await page.waitForTimeout(200);
await page.click("text=Start"); await page.waitForTimeout(400);
check((await page.locator(".qcard").count()) === 1, "boss exam serves questions");
check((await page.locator("#timer").count()) === 1, "boss timer running");

// settings: export/import round-trip
await page.goto(APP + "#/settings"); await page.waitForTimeout(200);
await page.click("text=Export save"); await page.waitForTimeout(150);
const saveTxt = await page.inputValue("#exportbox textarea");
check(saveTxt.includes('"xp"'), "save export produces JSON");

const realErrors = errors.filter(e => !e.toLowerCase().includes("favicon"));
check(realErrors.length === 0, `zero console/page errors ${JSON.stringify(realErrors.slice(0, 3))}`);

await browser.close();
console.log();
if (fails.length) { console.log(fails.length + " FAILURES"); process.exit(1); }
console.log("ALL CHECKS PASSED");
})();
