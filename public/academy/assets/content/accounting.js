/* Module 1 — Accounting & the Three Statements */
(function () {

const L1 = `
<p>Every model you will ever build — utility, IPP, pipeline, data center REIT, GPU cloud — is the same three
statements wearing different costumes. Learn the plumbing once and every sector becomes a set of assumptions.</p>

<h3>The income statement (IS): performance over a period</h3>
<div class="tablewrap"><table>
<tr><th>Line</th><th>What it is</th><th>Energy flavor</th></tr>
<tr><td>Revenue</td><td>What you billed for the period</td><td>Energy sales, capacity payments, lease/colo rent, $/GPU-hr</td></tr>
<tr><td>COGS / cost of revenue</td><td>Direct costs of producing it</td><td>Fuel, purchased power, colo power</td></tr>
<tr><td>Gross profit</td><td>Revenue − COGS</td><td>For generators, roughly the "spread" or "energy margin"</td></tr>
<tr><td>Opex / SG&amp;A / O&amp;M</td><td>Running the business</td><td>Plant O&amp;M, staffing, insurance, land leases</td></tr>
<tr><td><b>EBITDA</b></td><td>Earnings before interest, taxes, D&amp;A</td><td>The energy world's favorite line — asset cash engine</td></tr>
<tr><td>D&amp;A</td><td>Non-cash cost of using long-lived assets</td><td>Enormous: plants, wires, halls, GPUs all depreciate</td></tr>
<tr><td>EBIT (operating income)</td><td>EBITDA − D&amp;A</td><td>What the assets earn before the capital structure</td></tr>
<tr><td>Interest expense</td><td>Cost of debt</td><td>Infra is levered — this line is big and matters</td></tr>
<tr><td>Pre-tax income → taxes → <b>Net income</b></td><td>The bottom line</td><td>Flows to EPS and to retained earnings</td></tr>
</table></div>
<div class="keybox"><b>Watch out:</b> D&amp;A is usually <i>buried inside</i> COGS and SG&amp;A on the income statement.
The clean number lives on the cash flow statement. When someone hands you an IS and asks for EBITDA, your first
question is "where is the D&amp;A hiding?"</div>

<h3>The balance sheet (BS): a snapshot that must balance</h3>
<p><b>Assets = Liabilities + Equity.</b> Always. If your model's balance sheet is off by $0.37, you have a plug or a
broken link, and an interviewer will find it. The recurring cast:</p>
<ul>
<li><b>Assets:</b> cash, accounts receivable (AR), inventory (fuel!), PP&amp;E (the monster line in energy — plants, wires, data halls), intangibles/goodwill.</li>
<li><b>Liabilities:</b> accounts payable (AP), accrued expenses, deferred revenue, debt (revolver + term), asset retirement obligations.</li>
<li><b>Equity:</b> paid-in capital, retained earnings (RE). RE<sub>end</sub> = RE<sub>beg</sub> + net income − dividends.</li>
</ul>

<h3>The cash flow statement (CFS): the truth serum</h3>
<p>Indirect method: start with net income, undo the non-cash stuff, track the working capital, then investing and financing:</p>
<div class="formula">CFO = Net income + D&amp;A + stock comp ± other non-cash − Δ net working capital<br>
CFI = − capex − acquisitions + asset sales<br>
CFF = + debt drawn − debt repaid − dividends − buybacks + equity issued<br>
Δ Cash = CFO + CFI + CFF   →   ending cash = beginning cash + Δ cash</div>

<h3>How the three link (the interview classic)</h3>
<p>Net income is the hinge: it tops the CFS and rolls into retained earnings on the BS. Ending cash from the CFS is
the BS cash line. Capex from CFI builds PP&amp;E; D&amp;A shrinks it: PP&amp;E<sub>end</sub> = PP&amp;E<sub>beg</sub> + capex − D&amp;A.</p>
<div class="workedex"><div class="wx-title">Worked example — "Depreciation goes up $10, tax rate 25%. Walk me through it."</div>
<b>IS:</b> pre-tax income −10 → taxes −2.50 → net income <b>−7.50</b>.<br>
<b>CFS:</b> start NI −7.50, add back the +10 non-cash depreciation → CFO <b>+2.50</b> → cash +2.50.<br>
<b>BS:</b> assets: cash +2.50, net PP&amp;E −10 → total assets −7.50. Equity: RE −7.50. Balanced. ✔<br>
<i>Moral: more depreciation = less book profit but MORE cash (the tax shield). Say "IS → CFS → BS," in that order, every time.</i></div>`;

const L2 = `
<p>Working capital is where models quietly leak cash. Growth is expensive: sell more, and cash gets stuck in
receivables and inventory before it ever reaches you.</p>
<h3>Net working capital (NWC)</h3>
<div class="formula">NWC = current operating assets (AR + inventory + prepaids) − current operating liabilities (AP + accruals + deferred revenue)<br>
An INCREASE in NWC is a USE of cash. CFO subtracts ΔNWC.</div>
<ul>
<li>AR up → you booked revenue you haven't collected → cash down.</li>
<li>Inventory up → cash converted into fuel/spare parts sitting in a yard.</li>
<li>AP up → suppliers are financing you → cash up (a <i>source</i>).</li>
<li>Deferred revenue up → customers paid you before you delivered → cash up. (Prepaid colo and take-or-pay
GPU contracts create this — a beautiful liability to have.)</li>
</ul>
<h3>The speed dials: DSO, DIO, DPO</h3>
<div class="formula">DSO = AR ÷ revenue × 365 &nbsp;&nbsp;·&nbsp;&nbsp; DIO = inventory ÷ COGS × 365 &nbsp;&nbsp;·&nbsp;&nbsp; DPO = AP ÷ COGS × 365<br>
Cash conversion cycle (CCC) = DSO + DIO − DPO &nbsp;&nbsp;(days of sales your cash is trapped)</div>
<div class="workedex"><div class="wx-title">Worked example</div>
AR $90M on revenue $730M → DSO = 90/730 × 365 = <b>45 days</b>. If DIO is 30 and DPO is 40, CCC = 45 + 30 − 40 =
<b>35 days</b>. Cut DSO by 10 days and you free up 10/365 × 730 = <b>$20M</b> of cash — once.</div>
<div class="keybox"><b>Energy flavor:</b> utilities carry fuel inventories and huge seasonal AR (summer bills);
E&amp;Ps have joint-interest receivables; retail power books (like an IPP's retail arm) swing working capital hard
with weather. Data center landlords on triple-net leases have tiny NWC; GPU clouds collecting monthly on
take-or-pay have negative NWC if customers prepay. In models: project NWC as % of revenue, or each item by days.</div>`;

const L3 = `
<p>Energy and infrastructure live on EBITDA. Know exactly what it is, why the sector loves it, and where it lies to you.</p>
<h3>Why EBITDA rules the sector</h3>
<ul>
<li>Asset-heavy businesses have giant, arbitrary-feeling D&amp;A. EBITDA strips it out to compare the operating engines.</li>
<li>Capital structures differ wildly (a project financed at 80% debt vs. an unlevered balance sheet). EBITDA is
capital-structure-neutral, so <b>EV/EBITDA</b> comps work across them.</li>
<li>Credit lives here: leverage = net debt / EBITDA; covenants are written on it.</li>
</ul>
<h3>Where EBITDA lies</h3>
<ul>
<li><b>Capex is real.</b> A CCGT needs major maintenance every ~4 years; GPUs age out in 4–6; data halls need
refresh. EBITDA − maintenance capex is the honest cash engine. Always split <b>maintenance vs. growth capex</b>.</li>
<li><b>Interest is real</b> for levered infra. An 80%-levered wind farm's EBITDA belongs mostly to lenders.</li>
<li><b>"Adjusted" EBITDA</b> can hide sins: one-time items that recur, unrealized hedge gains, stock comp. Read the reconciliation table every quarter.</li>
</ul>
<h3>The sector's other cash metrics (learn these cold)</h3>
<div class="tablewrap"><table>
<tr><th>Metric</th><th>Definition (typical)</th><th>Used for</th></tr>
<tr><td>FFO</td><td>Net income + D&amp;A ± gains on sales</td><td>REITs (incl. data center REITs)</td></tr>
<tr><td>AFFO</td><td>FFO − recurring capex − straight-line rent adj.</td><td>REIT dividend capacity; P/AFFO multiple</td></tr>
<tr><td>CAFD</td><td>Cash available for distribution: EBITDA − debt service − maintenance capex − taxes</td><td>Yieldcos / renewables; P/CAFD, CAFD yield</td></tr>
<tr><td>DCF (midstream)</td><td>Distributable cash flow: EBITDA − interest − maintenance capex</td><td>Pipelines/MLPs; coverage ratio = DCF ÷ distributions</td></tr>
<tr><td>Free cash flow</td><td>CFO − capex (or EBITDA − interest − taxes − capex ± ΔNWC)</td><td>IPPs, everything; FCF yield = FCF ÷ market cap</td></tr>
</table></div>
<div class="workedex"><div class="wx-title">Worked example — the EBITDA mirage</div>
Two 500&nbsp;MW plants both print $200M EBITDA. Plant A is new (maintenance capex $15M); Plant B is 40 years old
($70M). Real cash engines: A = $185M, B = $130M — <b>30% apart</b> on identical EBITDA. Same trap with GPU fleets:
rental EBITDA looks fat until the 5-year replacement cycle eats it.</div>`;

const L4 = `
<p>A handful of accounting quirks show up constantly in energy coverage. Knowing them marks you as sector-literate.</p>
<h3>Regulated utility specials</h3>
<ul>
<li><b>AFUDC</b> (Allowance for Funds Used During Construction): while building a plant, a utility capitalizes its
financing cost into the asset and books it as (non-cash) income. Big construction cycle → AFUDC-heavy EPS →
lower earnings quality until the asset enters rates.</li>
<li><b>Regulatory assets/liabilities:</b> costs the regulator has promised you can bill customers later (a deferred
fuel balance after a spike) sit as assets; refunds owed sit as liabilities. They smooth earnings and reveal
regulatory lag.</li>
<li><b>CWIP</b> (construction work in progress): plant under construction, not yet depreciating, often not yet
earning (unless the regulator allows CWIP in rate base).</li>
</ul>
<h3>Everyone's specials</h3>
<ul>
<li><b>ARO</b> (asset retirement obligation): the discounted cost of tearing down/decommissioning — nuclear is the
famous one; wind/solar leases carry them too. It accretes through the IS like slow-motion interest.</li>
<li><b>MTM hedges:</b> generators hedge power and gas; unrealized mark-to-market swings whip GAAP net income around.
Analysts strip them: follow <i>adjusted</i> EBITDA and realized hedges. Always ask "what's hedged, at what price, how far out?"</li>
<li><b>Deferred taxes:</b> tax depreciation (MACRS — 5-year for solar/wind/batteries!) front-runs book depreciation,
so cash taxes &lt; book taxes early in asset life → a deferred tax liability builds. This is the raw material of
renewable tax equity.</li>
<li><b>Capitalized vs. expensed:</b> data center developers capitalize construction interest; GPU clouds capitalize
the fleet and depreciate over 4–6 years. Depreciation life assumptions move stated margins a lot — a favorite
short-seller battleground.</li>
</ul>
<div class="keybox"><b>Desk habit:</b> for any company you pick up, find (1) segment EBITDA bridge, (2) capex split
(maintenance/growth), (3) hedge disclosure table, (4) debt maturity ladder. Those four tables answer 80% of client
questions.</div>`;

/* ------------------------------------------------------------ generators */
ACADEMY.gens.acctDepCash = function () {
  const d = rpick([5, 10, 15, 20, 25]); const t = rpick([21, 25]);
  return { t: "num", q: `Depreciation increases by $${d}M this period (tax rate ${t}%). All else equal, what is the change in the company's <b>ending cash</b>?`,
    ans: d * t / 100, dp: 2, tol: 0.05, unit: "$M",
    sol: `NI falls ${d}×(1−${t}%) = ${fmt(d * (1 - t / 100), 2)}; CFS adds back the full ${d} → cash +${fmt(d * t / 100, 2)}. Depreciation is a tax shield: Δcash = D&A × tax rate.` };
};
ACADEMY.gens.acctDepNI = function () {
  const d = rpick([8, 10, 12, 16, 20]); const t = rpick([21, 25]);
  return { t: "num", q: `Depreciation increases by $${d}M (tax rate ${t}%). What is the change in <b>net income</b>? (negative = decrease)`,
    ans: -d * (1 - t / 100), dp: 2, tol: 0.05, unit: "$M",
    sol: `Pre-tax −${d}, taxes −${fmt(d * t / 100, 2)} → NI = −${d} × (1−${t}%) = ${fmt(-d * (1 - t / 100), 2)}.` };
};
ACADEMY.gens.acctCFO = function () {
  const ni = ri(80, 260), da = ri(30, 120), sbc = ri(5, 25);
  const dAR = ri(-20, 30), dInv = ri(-15, 25), dAP = ri(-15, 25);
  const cfo = ni + da + sbc - dAR - dInv + dAP;
  return { t: "num",
    q: `Compute <b>cash flow from operations</b> (indirect method), $M:
    <table><tr><td>Net income</td><td class="num">${ni}</td></tr>
    <tr><td>D&amp;A</td><td class="num">${da}</td></tr>
    <tr><td>Stock comp</td><td class="num">${sbc}</td></tr>
    <tr><td>Δ Accounts receivable</td><td class="num">${dAR >= 0 ? "+" : ""}${dAR}</td></tr>
    <tr><td>Δ Inventory</td><td class="num">${dInv >= 0 ? "+" : ""}${dInv}</td></tr>
    <tr><td>Δ Accounts payable</td><td class="num">${dAP >= 0 ? "+" : ""}${dAP}</td></tr></table>`,
    ans: cfo, dp: 0, tol: 0.6, unit: "$M",
    sol: `CFO = ${ni} + ${da} + ${sbc} − (${dAR}) − (${dInv}) + (${dAP}) = <b>${fmt(cfo, 0)}</b>. Asset increases use cash; liability increases source it.` };
};
ACADEMY.gens.acctDSO = function () {
  const rev = ri(60, 200) * 10; const dso = ri(30, 75);
  const ar = Math.round(rev * dso / 365);
  return { t: "num", q: `Accounts receivable are $${ar}M against annual revenue of $${fmt(rev, 0)}M. What is <b>DSO</b> (days sales outstanding)?`,
    ans: ar / rev * 365, dp: 1, tol: 0.8, unit: "days",
    sol: `DSO = AR ÷ revenue × 365 = ${ar}/${fmt(rev, 0)} × 365 = <b>${fmt(ar / rev * 365, 1)} days</b>.` };
};
ACADEMY.gens.acctCCC = function () {
  const dso = ri(25, 70), dio = ri(10, 60), dpo = ri(15, 65);
  return { t: "num", q: `DSO = ${dso} days, DIO = ${dio} days, DPO = ${dpo} days. What is the <b>cash conversion cycle</b>?`,
    ans: dso + dio - dpo, dp: 0, tol: 0.4, unit: "days",
    sol: `CCC = DSO + DIO − DPO = ${dso} + ${dio} − ${dpo} = <b>${dso + dio - dpo} days</b>.` };
};
ACADEMY.gens.acctEBITDA = function () {
  const rev = ri(40, 140) * 10;
  const cogs = Math.round(rev * rstep(0.45, 0.62, 0.01));
  const sga = Math.round(rev * rstep(0.12, 0.22, 0.01));
  const daInCogs = ri(15, 45), daInSga = ri(5, 20);
  const ebitda = rev - cogs - sga + daInCogs + daInSga;
  return { t: "num",
    q: `From this income statement extract ($M), compute <b>EBITDA</b>:
    <table><tr><td>Revenue</td><td class="num">${fmt(rev, 0)}</td></tr>
    <tr><td>COGS (includes ${daInCogs} of D&amp;A)</td><td class="num">${fmt(cogs, 0)}</td></tr>
    <tr><td>SG&amp;A (includes ${daInSga} of D&amp;A)</td><td class="num">${fmt(sga, 0)}</td></tr></table>`,
    ans: ebitda, dp: 0, tol: 0.6, unit: "$M",
    sol: `EBIT = ${fmt(rev, 0)} − ${fmt(cogs, 0)} − ${fmt(sga, 0)} = ${fmt(rev - cogs - sga, 0)}; add back total D&A ${daInCogs + daInSga} → EBITDA = <b>${fmt(ebitda, 0)}</b>.` };
};
ACADEMY.gens.acctFCF = function () {
  const ni = ri(90, 300), da = ri(40, 150), capex = ri(50, 180), dnwc = ri(-20, 40);
  const fcf = ni + da - capex - dnwc;
  return { t: "num", q: `Net income $${ni}M, D&amp;A $${da}M, capex $${capex}M, change in net working capital ${dnwc >= 0 ? "+" : ""}$${dnwc}M. Simple <b>free cash flow</b>?`,
    ans: fcf, dp: 0, tol: 0.6, unit: "$M",
    sol: `FCF = NI + D&A − capex − ΔNWC = ${ni} + ${da} − ${capex} − (${dnwc}) = <b>${fmt(fcf, 0)}</b>.` };
};

/* --------------------------------------------------------------- drills */
const D1 = { id: "mech", title: "Statement mechanics", desc: "Where things live and how they move", serve: 10, items: [
  { t: "mc", q: "On most income statements, where is D&A?", a: 0, c: [
    "Buried inside COGS and SG&A — the clean figure is on the cash flow statement",
    "Always its own labeled line item below gross profit",
    "Only in the footnotes, never in the statements",
    "Inside interest expense"],
    why: "Companies typically embed D&A in cost lines. Pull the explicit number from the CFS (or the PP&E footnote)." },
  { t: "mc", q: "A customer prepays $50M for future colocation services. Immediate effect?", a: 0, c: [
    "Cash +50, deferred revenue (a liability) +50; no revenue yet",
    "Revenue +50 immediately",
    "Cash +50 and retained earnings +50",
    "No effect until the service is delivered"],
    why: "Cash arrives now; revenue is recognized as the service is delivered. Deferred revenue is the balancing liability — common with prepaid contracts in colo/cloud." },
  { t: "mc", q: "Which single line item directly connects all three statements?", a: 0, c: [
    "Net income — top of the CFS and rolls into retained earnings",
    "Revenue", "EBITDA", "Capex"],
    why: "NI starts CFO (indirect method) and feeds RE on the balance sheet. That's why you answer statement-walk questions in the order IS → CFS → BS." },
  { t: "mc", q: "Inventory (fuel stockpile) rises $30M during the quarter. Effect on CFO?", a: 0, c: [
    "CFO decreases $30M — cash is now sitting in the coal yard",
    "CFO increases $30M", "No effect on CFO — it's an investing item", "CFO falls $30M only if the fuel is burned"],
    why: "An increase in a working capital asset is a use of cash. Burning it later moves it to COGS, not cash." },
  { t: "mc", q: "A generator buys a $100M turbine with cash. At purchase, the income statement shows…", a: 0, c: [
    "Nothing — the cost is capitalized to PP&E and hits the IS over time as depreciation",
    "A $100M expense", "A $100M loss below the line", "Revenue reduced by $100M"],
    why: "Capex is capitalized (CFI −100, PP&E +100). The IS sees it gradually through D&A over the asset's life." },
  { t: "mc", q: "Accounts payable increases. This is…", a: 0, c: [
    "A source of cash — suppliers are financing you",
    "A use of cash", "Non-cash, no CFS effect", "An investing inflow"],
    why: "Liability up = you kept cash longer. CFO adds the increase." },
  { t: "mc", q: "Retained earnings roll-forward is:", a: 0, c: [
    "RE_end = RE_beg + net income − dividends",
    "RE_end = RE_beg + EBITDA − capex",
    "RE_end = RE_beg + CFO − CFF",
    "RE_end = RE_beg + net income + dividends"],
    why: "Profits accumulate in RE; dividends leave from it. Buybacks usually hit treasury stock/APIC instead." },
  { t: "mc", q: "A company draws $200M on its revolver. Where does it appear?", a: 0, c: [
    "CFF inflow +200; debt +200 on the balance sheet",
    "CFO inflow", "CFI inflow", "Revenue"],
    why: "Borrowing is financing. Interest on it will later hit the IS (and CFO through NI)." },
  { t: "mc", q: "Stock-based compensation of $40M:", a: 0, c: [
    "Reduces net income, is added back in CFO, and dilutes shareholders via more shares",
    "Has no income statement impact because no cash is paid",
    "Is a financing outflow",
    "Increases CFO and net income"],
    why: "SBC is a real expense paid in shares: non-cash (added back in CFO) but dilutive. Watch it in tech-adjacent names like GPU clouds." },
  { t: "mc", q: "A (tax-deductible) $200M impairment, 25% tax rate. Effect on the period's cash?", a: 0, c: [
    "Cash rises $50M — the write-down itself is non-cash but shields taxes",
    "Cash falls $200M", "Cash falls $150M", "No cash effect at all"],
    why: "NI −150; CFS adds back +200 → CFO +50. Same logic as the depreciation question: non-cash charges create cash via the tax line (when deductible)." },
  { t: "mc", q: "AFUDC in a utility's earnings is best described as:", a: 0, c: [
    "Non-cash income capitalizing financing costs during construction — flags lower earnings quality while building",
    "A cash subsidy from the regulator",
    "A penalty for construction delays",
    "Deferred fuel expense"],
    why: "Allowance for Funds Used During Construction accrues a return on construction work in progress. Real cash arrives only when the asset enters rates." },
  { t: "mc", q: "Under US GAAP (indirect method), interest expense shows up in:", a: 0, c: [
    "CFO — because the CFS starts from net income, which is already after interest",
    "CFF, always", "CFI", "It never touches the cash flow statement"],
    why: "GAAP: interest paid is an operating flow (starting NI is post-interest). Principal repayment is financing. (IFRS allows choices — a classic gotcha.)" },
  { t: "mc", q: "Which is NOT a use of cash?", a: 0, c: [
    "Depreciation expense rising",
    "Accounts receivable rising",
    "Fuel inventory rising",
    "Paying down the revolver"],
    why: "D&A is non-cash — it's the add-back, never a use. The others all consume cash." },
  { t: "mc", q: "A yieldco reports big GAAP net losses but pays steady dividends for years. The most likely reconciliation:", a: 0, c: [
    "Huge non-cash D&A (and tax-equity allocations) depress NI while cash flow stays healthy — hence the sector's use of CAFD",
    "Fraud — you cannot pay dividends without net income",
    "They are borrowing to pay every dividend",
    "GAAP forbids this"],
    why: "Renewables carry massive depreciation and HLBV/tax-equity noise. Distributions are paid from cash (CAFD), not book income. Dividends need cash + legal capacity, not positive NI." },
]};

const D2 = { id: "walk", title: "Walk me through it", desc: "Interview-style numeric mechanics — infinite variants", serve: 10, items: [
  { t: "gen", g: "acctDepCash" },
  { t: "gen", g: "acctDepNI" },
  { t: "gen", g: "acctCFO" },
  { t: "gen", g: "acctDSO" },
  { t: "gen", g: "acctCCC" },
  { t: "gen", g: "acctEBITDA" },
  { t: "gen", g: "acctFCF" },
  { t: "num", q: "You collect $240M cash on Jan 1 for a 12-month service contract. What is the <b>deferred revenue balance</b> at the end of Q1 (March 31)?",
    ans: 180, dp: 0, tol: 1, unit: "$M",
    sol: "Recognize 3/12 × 240 = 60 as revenue; the remaining <b>180</b> sits as deferred revenue (liability)." },
  { t: "num", q: "Book pre-tax income $200M; statutory rate 25%. Tax depreciation exceeds book depreciation by $30M. What are <b>cash taxes</b>?",
    ans: 42.5, dp: 1, tol: 0.5, unit: "$M",
    sol: "Taxable income = 200 − 30 = 170 → cash tax = 42.5 (book expense 50; the 7.5 difference builds the deferred tax liability). Accelerated depreciation (MACRS) is why energy assets pay little cash tax early." },
  { t: "num", q: "A utility has $1,000M of construction work in progress and accrues AFUDC at 7%. How much <b>non-cash AFUDC income</b> does it book this year?",
    ans: 70, dp: 0, tol: 1, unit: "$M",
    sol: "1,000 × 7% = <b>70</b> — capitalized into the asset and reported in earnings, with no cash received." },
]};

ACADEMY.modules.push({
  id: "acct", order: 1, icon: "🧾",
  title: "Accounting & the Three Statements",
  blurb: "The plumbing under every model: IS, BS, CFS, how they link, and the sector's cash metrics (EBITDA, CAFD, AFFO).",
  lessons: [
    { id: "map", title: "The three statements — a 10-minute map", mins: 9, html: L1 },
    { id: "wc", title: "Working capital & the cash conversion cycle", mins: 6, html: L2 },
    { id: "ebitda", title: "EBITDA and its discontents", mins: 7, html: L3 },
    { id: "energyacct", title: "Energy-flavored accounting (AFUDC, ARO, MTM, MACRS)", mins: 7, html: L4 },
  ],
  drills: [D1, D2],
  boss: { title: "Controller's Gauntlet", count: 14, time: 18 * 60, pass: 0.75 },
  reference: `
<div class="formula">CFO = NI + D&A + SBC − ΔNWC · CFI = −capex · Δcash = CFO+CFI+CFF<br>
PP&E_end = PP&E_beg + capex − D&A · RE_end = RE_beg + NI − dividends<br>
DSO = AR/rev×365 · DIO = inv/COGS×365 · DPO = AP/COGS×365 · CCC = DSO+DIO−DPO<br>
ΔD&A of X with tax t: NI −X(1−t), cash +X·t<br>
FCF = NI + D&A − capex − ΔNWC · CAFD = EBITDA − debt service − maint. capex − cash taxes<br>
FFO = NI + D&A ± sale gains · AFFO = FFO − recurring capex</div>`,
});
})();
