/* Module 3 — Comparable companies & comp sheets */
(function () {

const L1 = `
<p>The comp sheet is the associate's daily bread — the Stifel posting says "building and updating comp sheets"
because you will literally do it every week. A comp sheet is a table of peers with consistent valuation math so
differences in price MEAN something.</p>
<h3>Anatomy of a comp sheet (columns you'll build)</h3>
<ul>
<li><b>Identity:</b> ticker, subsector, market cap, ADV (liquidity).</li>
<li><b>Capitalization:</b> price, diluted shares (TSM!), equity value, + debt + preferred + MI − cash = <b>EV</b>.</li>
<li><b>Operating metrics:</b> EBITDA / EPS / CAFD / AFFO for this year, next year, year after (consensus or your estimates).</li>
<li><b>Multiples:</b> EV/EBITDA (per year), P/E or P/CAFD or P/AFFO, FCF yield, dividend yield.</li>
<li><b>Quality &amp; risk:</b> EBITDA growth, margin, net debt/EBITDA, % contracted/regulated, credit rating.</li>
<li><b>Sector specials:</b> $/kW or EV/MW, rate base growth, backlog coverage — whatever the subsector prices on.</li>
</ul>
<h3>Hygiene rules (where comp sheets go wrong)</h3>
<ul>
<li><b>Calendarize.</b> A June fiscal-year company's "FY2026" is not a December company's "2026." Blend fiscal years
into calendar years before comparing: CY26E ≈ weight of each fiscal year overlapping calendar 2026.</li>
<li><b>Same metric, same perimeter.</b> Consensus EBITDA may be pre- or post-minority, include or exclude
one-offs. Check the footnotes; adjust to one standard.</li>
<li><b>LTM vs. forward.</b> Trailing (LTM) multiples are facts; forward (NTM, CY+1) multiples are opinions about
estimates. Sectors in transition (load growth!) trade on forward numbers.</li>
<li><b>Pull the diluted count from the latest filing</b>, not the cover page; add new converts/options from footnotes.</li>
<li><b>Update for events:</b> M&A, asset sales, buybacks between filings change net debt and share count.</li>
</ul>
<div class="keybox"><b>Sources:</b> on the desk you'll pull consensus from Bloomberg (<code>EEO</code>, <code>MODL</code>),
FactSet, or Visible Alpha, and cap-structure detail from filings. Free equivalents while training: company 10-K/10-Q,
TIKR/Koyfin for consensus, EDGAR full-text search. The <i>process</i> is identical.</div>`;

const L2 = `
<p>Spreading comps is arithmetic; <i>reading</i> them is the job. A multiple is a price, and prices carry information.</p>
<h3>Why multiples differ (the only four reasons)</h3>
<ol>
<li><b>Growth:</b> faster compounding deserves a higher multiple (compare multiples against growth, not in isolation).</li>
<li><b>Risk / quality:</b> contracted vs. merchant revenue, counterparty credit, regulatory jurisdiction quality,
leverage, asset age.</li>
<li><b>Returns on capital:</b> a business that turns growth capex into 12% returns deserves more than one earning 6%.</li>
<li><b>Estimates are wrong:</b> the "cheap" stock may be cheap because the market thinks consensus EBITDA is too high.
Half of research is deciding whether the discount is mispricing or foresight.</li>
</ol>
<h3>Growth-adjusted looks</h3>
<div class="formula">Rough screen: EV/EBITDA ÷ EBITDA growth — a 13× name growing 15% can be "cheaper" than a 10× name growing 5%.<br>
For utilities: P/E vs. rate-base (or EPS) growth — the sector scatterplot everyone keeps.</div>
<h3>The questions a PM will actually ask you</h3>
<ul>
<li>"Why does X trade 2 turns above Y?" — have the growth/risk/mix answer ready in one breath.</li>
<li>"What's embedded?" — at 14× EBITDA, what power price / renewal rate / capacity auction outcome is priced in?</li>
<li>"What closes the gap?" — a catalyst: contract announcements, capacity auction prints, rate case orders, new disclosures.</li>
</ul>
<div class="workedex"><div class="wx-title">Worked example — premium, justified?</div>
Nuclear IPP at 13.7× 2026E EBITDA vs. gas IPP at 11.9×. Justifications: carbon-free scarcity + hyperscaler
contracting upside (long-dated, credit-worthy PPAs at premium prices) + production tax credit price floor under
revenues. Counters: it's priced in; gas peers have more torque to rising power curves. Your job is to pick a side
<i>with numbers</i> — e.g., each 100&nbsp;MW recontracted at a $20/MWh uplift ≈ +$17.5M EBITDA (100 × 8,760 × 20 × ~capacity factor).</div>`;

const L3 = `
<p>Every subsector has "its" multiple and one specialist metric outsiders forget. Ranges below are teaching
approximations (compiled early 2026) — always re-anchor to the current tape.</p>
<div class="tablewrap"><table>
<tr><th>Subsector</th><th>Primary multiple</th><th>Teaching range</th><th>Specialist metrics</th></tr>
<tr><td>Regulated utilities</td><td>P/E (NTM)</td><td>~14–20×</td><td>Premium/discount vs. rate base growth; dividend payout 55–70%</td></tr>
<tr><td>Merchant IPPs</td><td>EV/EBITDA</td><td>~8–14×</td><td>FCF yield, $/kW vs. new-build, % hedged by year</td></tr>
<tr><td>Yieldcos / renewables</td><td>P/CAFD</td><td>~10–16×</td><td>CAFD yield vs. cost of equity; PPA remaining life</td></tr>
<tr><td>Midstream</td><td>EV/EBITDA</td><td>~8–12×</td><td>DCF/unit, distribution coverage ≥1.4×, % fee-based</td></tr>
<tr><td>Data center REITs/colo</td><td>EV/EBITDA, P/AFFO</td><td>~18–28×, ~20–30×</td><td>$/MW, cap rates ~5.5–7.5%, pipeline MW, churn, rent mark-to-market</td></tr>
<tr><td>Neoclouds / GPU compute</td><td>EV/EBITDA (fwd)</td><td>wide &amp; contested</td><td>Backlog/RPO coverage, $/GPU-hr, fleet age, customer concentration, EBITDA − replacement capex</td></tr>
<tr><td>E&amp;P (context)</td><td>EV/EBITDAX</td><td>~3–6×</td><td>$/flowing barrel, PV-10, breakevens</td></tr>
<tr><td>Grid equipment / turbines</td><td>P/E, EV/EBIT</td><td>~15–30×</td><td>Book-to-bill, backlog years, margin trajectory</td></tr>
</table></div>
<div class="keybox"><b>Cross-asset intuition:</b> when the SAME megawatt can be valued as a power plant ($/kW),
a lease stream (cap rate), or a compute engine ($/GPU-hr), the spread between those three answers is where the
2023–2026 AI-power trade lived. Analysts who could arbitrage the frameworks — "this IPP's fleet is worth 2× more as
data-center power" — were the ones who got the calls right.</div>`;

/* ------------------------------------------------------------ generators */
ACADEMY.gens.compEVmult = function () {
  const px = rstep(20, 160, 5); const sh = ri(150, 600);
  const debt = ri(20, 120) * 100; const cash = ri(3, 30) * 100;
  const e = ri(15, 60) * 100;
  const ev = px * sh + debt - cash;
  const m = ev / e;
  return { t: "num", q: `Price $${px}, diluted shares ${sh}M, debt $${fmt(debt, 0)}M, cash $${fmt(cash, 0)}M, 2026E EBITDA $${fmt(e, 0)}M. <b>EV / 2026E EBITDA</b>? (in ×, e.g. 9.6)`,
    ans: m, dp: 2, tol: 0.08, unit: "×",
    sol: `EV = ${px}×${sh} + ${fmt(debt, 0)} − ${fmt(cash, 0)} = ${fmt(ev, 0)}; ÷ ${fmt(e, 0)} = <b>${fmt(m, 2)}×</b>.` };
};
ACADEMY.gens.compPE = function () {
  const eps = rstep(1.5, 9, 0.05); const pe = rstep(9, 24, 0.5);
  const px = Math.round(eps * pe * 100) / 100;
  return { t: "num", q: `Stock at $${fmt(px, 2)}; 2026E EPS $${fmt(eps, 2)}. <b>P/E</b>? (×)`,
    ans: px / eps, dp: 1, tol: 0.15, unit: "×",
    sol: `${fmt(px, 2)} ÷ ${fmt(eps, 2)} = <b>${fmt(px / eps, 1)}×</b>.` };
};
ACADEMY.gens.compLev = function () {
  const e = ri(10, 50) * 100; const lev = rstep(1.5, 5, 0.1);
  const cash = ri(2, 15) * 100; const debt = Math.round(e * lev + cash);
  return { t: "num", q: `Debt $${fmt(debt, 0)}M, cash $${fmt(cash, 0)}M, EBITDA $${fmt(e, 0)}M. <b>Net leverage</b> (net debt / EBITDA, ×)?`,
    ans: (debt - cash) / e, dp: 2, tol: 0.05, unit: "×",
    sol: `(${fmt(debt, 0)} − ${fmt(cash, 0)}) ÷ ${fmt(e, 0)} = <b>${fmt((debt - cash) / e, 2)}×</b>. Rough guardrails: IPPs ~3×, utilities ~5× (at holdco+opco), midstream ~3.5–4.5×.` };
};
ACADEMY.gens.compGrowth = function () {
  const e1 = ri(80, 400) * 10; const g = rstep(3, 18, 0.5);
  const e2 = Math.round(e1 * (1 + g / 100));
  return { t: "num", q: `2026E EBITDA $${fmt(e1, 0)}M → 2027E $${fmt(e2, 0)}M. <b>Growth rate</b>? (%, one decimal)`,
    ans: (e2 / e1 - 1) * 100, dp: 1, tol: 0.15, unit: "%",
    sol: `${fmt(e2, 0)}/${fmt(e1, 0)} − 1 = <b>${fmt((e2 / e1 - 1) * 100, 1)}%</b>.` };
};
ACADEMY.gens.compCal = function () {
  const f1 = rstep(3, 8, 0.05); const f2 = Math.round(f1 * rstep(1.04, 1.15, 0.01) * 100) / 100;
  const cy = 0.5 * f1 + 0.5 * f2;
  return { t: "num", q: `A company's fiscal year ends June 30. FY2026E EPS (ends 6/30/26) is $${fmt(f1, 2)}; FY2027E is $${fmt(f2, 2)}. <b>Calendarized CY2026E EPS</b>?`,
    ans: cy, dp: 2, tol: 0.03, unit: "$",
    sol: `CY26 spans the back half of FY26 and front half of FY27 → 0.5×${fmt(f1, 2)} + 0.5×${fmt(f2, 2)} = <b>$${fmt(cy, 2)}</b>. Never mix fiscal bases in one comp column.` };
};

/* --------------------------------------------------------------- drills */
const D1 = { id: "spread", title: "Spread the comps", desc: "EV multiples, leverage, growth, calendarization", serve: 9, items: [
  { t: "gen", g: "compEVmult" },
  { t: "gen", g: "compPE" },
  { t: "gen", g: "compLev" },
  { t: "gen", g: "compGrowth" },
  { t: "gen", g: "compCal" },
  { t: "mc", q: `Three IPPs:<table><tr><th></th><th class="num">EV/26E</th><th class="num">EBITDA growth</th></tr>
    <tr><td>Alpha</td><td class="num">12.0×</td><td class="num">12%</td></tr>
    <tr><td>Beta</td><td class="num">10.0×</td><td class="num">5%</td></tr>
    <tr><td>Gamma</td><td class="num">13.0×</td><td class="num">15%</td></tr></table>
    Which is cheapest on a growth-adjusted basis (multiple ÷ growth)?`, a: 0, c: [
    "Gamma (0.87) — it screens rich on the raw multiple but cheapest per unit of growth",
    "Beta — lowest multiple wins on any basis",
    "Alpha — it's in the middle so it's the safest",
    "They are all equivalent"],
    why: "12.0/12 = 1.00; 10.0/5 = 2.00; 13.0/15 = 0.87. Raw multiples without growth context mislead — the 'expensive' name is often the cheap one." },
  { t: "mc", q: "Your comp sheet shows a yieldco at a shockingly low EV/EBITDA vs. peers. Before calling it cheap, the FIRST thing to check:", a: 0, c: [
    "Whether EV includes the minority interest / tax-equity claims that consolidated EBITDA implies",
    "Whether the CEO recently sold stock",
    "The company's logo and branding",
    "Its headquarters state"],
    why: "Yieldcos consolidate projects with big NCI and tax-equity stakes. Omitting them understates EV and manufactures fake cheapness — the #1 renewables comp-sheet bug." },
  { t: "mc", q: "LTM multiples vs. forward multiples: which statement is right?", a: 0, c: [
    "LTM is based on reported facts; forward embeds estimate risk — sectors with inflecting fundamentals trade on forward",
    "Forward multiples are facts; LTM is opinion",
    "They are always nearly identical",
    "LTM should always be used for growth sectors"],
    why: "In a load-growth upcycle, trailing numbers understate the future — everyone prices 2027/2028 EBITDA. Know which year the market is 'paying for.'" },
  { t: "mc", q: "A peer completed a large debt-funded acquisition last month; consensus EBITDA doesn't yet include the target. Your comp sheet should…", a: 0, c: [
    "Pro-forma both sides: add the deal debt to EV and the target's EBITDA to the denominator",
    "Add the debt but not the EBITDA — be conservative",
    "Ignore the deal until the next 10-Q",
    "Drop the company from the comp set forever"],
    why: "Half-adjusted comps are worse than unadjusted: EV jumps but EBITDA doesn't → the stock looks artificially expensive. Pro-forma consistently or footnote it." },
]};

const D2 = { id: "read", title: "Premiums & discounts", desc: "Reading the tape like an analyst", serve: 7, items: [
  { t: "mc", q: "A nuclear-heavy IPP trades ~2 turns above gas-heavy peers. The most defensible justification set:", a: 0, c: [
    "Carbon-free scarcity, PTC price floor under revenue, and credit-worthy hyperscaler PPA upside on uncontracted output",
    "Nuclear plants are newer than gas plants",
    "Uranium is cheaper than natural gas per MMBtu",
    "Nuclear EBITDA isn't taxed"],
    why: "The premium story is contracted upside + downside protection (production tax credit floor) + ESG scarcity. Age and fuel-cost comparisons don't drive the multiple." },
  { t: "mc", q: "A utility trades at a persistent P/E discount to peers despite similar EPS growth. The most common fundamental culprits:", a: 0, c: [
    "Tough regulatory jurisdiction, wildfire/storm liability exposure, or chronic equity issuance needs",
    "Its ticker is late in the alphabet",
    "Its dividend is too well covered",
    "Its rate base is growing too fast"],
    why: "Jurisdiction quality (allowed ROE, lag, politics), liability overhangs (wildfire!), and dilution risk are the recurring discount drivers in utilityland." },
  { t: "mc", q: "Two data center REITs: one at 25× AFFO with 8% growth and low churn on hyperscale leases; another at 18× with 4% growth, high churn retail colo. The multiple gap primarily reflects…", a: 0, c: [
    "Growth and revenue durability — longer leases with better credits compound value",
    "An arbitrage you should assume closes tomorrow",
    "Accounting fraud at the cheaper one",
    "Random noise"],
    why: "Multiple gaps that persist usually price real differences. The trade exists only if you can argue the market has mis-measured growth or durability." },
  { t: "mc", q: "\"What's priced in?\" — at 14× EV/EBITDA when peers sit at 11×, the cleanest way to answer:", a: 0, c: [
    "Back-solve: how much incremental EBITDA (e.g., from data-center contracts) justifies 3 extra turns, then judge its plausibility",
    "Declare the stock a short immediately",
    "Assume the market is right and move on",
    "Compare it to the S&P 500 multiple"],
    why: "Turn the premium into a number: 3 turns × EBITDA = $X of EV = $Y of incremental contracted EBITDA at peer multiples. Then debate whether $Y is achievable." },
  { t: "mc", q: "An IPP screens at a 12% FCF yield vs. peers at 7%. Which follow-up matters MOST before calling it a buy?", a: 0, c: [
    "Is that FCF sustainable — hedge roll-off, capacity revenue reset, and maintenance capex honesty",
    "Whether the CFO is well spoken",
    "Whether the yield rounds to a prime number",
    "The color scheme of the investor deck"],
    why: "High spot yields often mark peak hedged prices about to roll down. Bridge FCF forward: what does it look like at re-hedged/normalized prices?" },
  { t: "mc", q: "Consensus 2027 EBITDA for a name you cover is $4.75B; your model says $5.10B. The multiple looks fair on consensus. Your note should argue…", a: 0, c: [
    "The stock is cheap on YOUR numbers — the thesis is the estimate revision, with evidence for your delta",
    "The stock is fairly valued, full stop",
    "Multiples are irrelevant when estimates differ",
    "Wait for the company to confirm guidance before having a view"],
    why: "'Cheap on our numbers, fair on the Street's' IS the classic research call: identify what consensus misses, quantify it, and name the catalyst that reveals it." },
  { t: "mc", q: "When is 'cheap' actually cheap (vs. a value trap)? The best single tell:", a: 0, c: [
    "An identifiable catalyst that forces the market to reprice the metric you think is mismarked",
    "The multiple is below its 5-year average",
    "Management says the stock is undervalued",
    "The chart looks oversold"],
    why: "Discounts without catalysts can persist for years. Auction prints, contract announcements, rate orders, guidance resets — name the event and the date." },
]};

ACADEMY.modules.push({
  id: "comps", order: 3, icon: "📋",
  title: "Comps & Comp Sheets",
  blurb: "Build and read comparable-company tables: calendarization, EV hygiene, multiple selection, premiums and discounts.",
  lessons: [
    { id: "anatomy", title: "Comp sheets — anatomy & hygiene", mins: 8, html: L1 },
    { id: "read", title: "Reading a comp sheet like an analyst", mins: 7, html: L2 },
    { id: "map", title: "The energy & compute multiples map", mins: 6, html: L3 },
  ],
  drills: [D1, D2],
  boss: { title: "Comp Sheet Friday", count: 14, time: 18 * 60, pass: 0.75 },
  reference: `
<div class="formula">EV/EBITDA pairs with EV; P/E, P/CAFD, P/AFFO pair with price · net lev = (debt−cash)/EBITDA<br>
Calendarize June-FYE: CY_N = 0.5×FY_N + 0.5×FY_{N+1}<br>
Premium drivers: growth, risk/mix (contracted vs merchant), returns, estimate error<br>
Utilities P/E ~14–20× · IPP EV/EBITDA ~8–14× · yieldco P/CAFD ~10–16× · midstream ~8–12× · DC REIT P/AFFO ~20–30× (teaching ranges)</div>`,
});
})();
