/* Module 2 — Valuation: EV, DCF, WACC */
(function () {

const L1 = `
<p>Before any multiple or DCF makes sense, you need the two "values" straight. This is the most common screen-out
question in analyst interviews — and the most common comp-sheet bug on real desks.</p>
<h3>Equity value vs. enterprise value</h3>
<ul>
<li><b>Equity value (market cap)</b> = share price × <i>diluted</i> shares. What the shareholders' claim is worth.</li>
<li><b>Enterprise value (EV)</b> = value of the whole operating business, regardless of who financed it:</li>
</ul>
<div class="formula">EV = equity value + total debt + preferred stock + noncontrolling (minority) interest − cash &amp; equivalents<br>
(+ underfunded pensions, + finance leases, ± other debt-like items when material)</div>
<p><b>Why subtract cash?</b> A buyer of the business gets the cash box; it's not part of the operating engine.
<b>Why add minority interest?</b> Because consolidated EBITDA includes 100% of a subsidiary the parent doesn't fully
own — the numerator and denominator must claim the same perimeter. (Yieldcos and project partnerships make this a
live issue in renewables.)</p>
<div class="workedex"><div class="wx-title">Worked example</div>
Market cap $5,000M, debt $3,000M, minority interest $150M, preferred $250M, cash $400M →
EV = 5,000 + 3,000 + 150 + 250 − 400 = <b>$8,000M</b>.</div>
<h3>Diluted shares — the treasury stock method (TSM)</h3>
<div class="formula">Net new shares = in-the-money options × (1 − strike ÷ current price)<br>
Diluted shares = basic shares + net new option shares (+ RSUs + converts if in the money)</div>
<div class="workedex"><div class="wx-title">Worked example</div>
100M basic shares; 10M options struck at $20; stock at $50. Option holders pay 10M × $20 = $200M, which buys back
$200M ÷ $50 = 4M shares → net +6M → <b>106M diluted</b>. Out-of-the-money options add nothing.</div>
<div class="keybox"><b>Pairing rule (memorize):</b> EV pairs with metrics <i>before</i> interest (revenue, EBITDA,
EBIT, unlevered FCF). Equity value pairs with metrics <i>after</i> interest (net income/EPS, FCFE, book equity,
CAFD). Mixing them — "EV/net income" or "P/EBITDA" — is instant credibility damage.</div>`;

const L2 = `
<p>A DCF answers: what are the future cash flows of the operating business worth today? The cash flow you discount
is <b>unlevered free cash flow (UFCF)</b> — cash available to <i>all</i> capital providers, before financing choices.</p>
<div class="formula">UFCF = EBIT × (1 − tax rate)   [= NOPAT]<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; + D&amp;A (non-cash)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; − capex<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; − increase in net working capital</div>
<p>No interest anywhere in it — leverage lives in the discount rate (WACC), not the cash flows. That's the
consistency rule: unlevered flows ↔ WACC; levered flows (FCFE) ↔ cost of equity.</p>
<h3>Building the forecast (5–10 years)</h3>
<ul>
<li><b>Revenue</b> from drivers, not vibes: MW × capacity factor × $/MWh for a generator; leased MW × $/kW-month for
a data center; GPUs × utilization × $/GPU-hr for compute. Tie growth to something physical or contractual.</li>
<li><b>Margins</b>: anchor to history and to unit economics (spark spreads, PPA prices, rent escalators).</li>
<li><b>Capex</b>: split maintenance vs. growth. If you model growth capex, model the revenue it buys — and vice versa.</li>
<li><b>ΔNWC</b>: % of Δrevenue is fine for a first pass.</li>
</ul>
<div class="workedex"><div class="wx-title">Worked example</div>
EBITDA $800M, D&amp;A $200M, tax 25%, capex $250M, ΔNWC +$30M.<br>
EBIT = 600 → NOPAT = 450 → UFCF = 450 + 200 − 250 − 30 = <b>$370M</b>.</div>
<div class="keybox"><b>Sanity ratios</b> the desk expects you to eyeball: capex vs. D&amp;A (a mature asset base spends
roughly its depreciation; growth spends more), UFCF conversion (UFCF/EBITDA typically 30–60% for asset-heavy names), and
whether terminal-year margins quietly assume the company becomes the best operator in history.</div>`;

const L3 = `
<h3>WACC — the blended cost of capital</h3>
<div class="formula">WACC = (E/V) × Re + (D/V) × Rd × (1 − tax) &nbsp;&nbsp; where V = E + D at <i>market</i> values, target weights<br>
Re (CAPM) = risk-free rate + β × equity risk premium &nbsp;(+ size premium for small caps)<br>
Unlever: βU = βL ÷ [1 + (1−t) × D/E] · Relever at the target D/E</div>
<div class="workedex"><div class="wx-title">Worked example</div>
rf 4.5%, β 1.2, ERP 5% → Re = 10.5%. Capital: 60% equity / 40% debt, pre-tax Rd 6%, tax 25% →
WACC = 0.6 × 10.5 + 0.4 × 6 × 0.75 = 6.3 + 1.8 = <b>8.1%</b>.</div>
<ul>
<li>Debt is cheaper than equity (senior claim, contractual) <i>and</i> interest is tax-deductible — hence the (1−t).</li>
<li>Peer betas must be unlevered then relevered to your target structure — raw betas embed each peer's leverage.</li>
<li>Regulated utilities: low β (~0.5–0.7), heavy cheap debt → WACC ~6–7%. Merchant power / GPU clouds: high β, expensive
debt → 9–13%. The discount rate should smell like the risk.</li>
</ul>
<h3>Terminal value — where DCFs are won and lost</h3>
<div class="formula">Gordon growth: TV = UFCF<sub>final</sub> × (1+g) ÷ (WACC − g), g ≈ long-run GDP/inflation (2–3%)<br>
Exit multiple: TV = terminal EBITDA × multiple &nbsp;→ always cross-check one against the other<br>
PV(TV) = TV ÷ (1 + WACC)<sup>N</sup></div>
<div class="workedex"><div class="wx-title">Worked example</div>
Final-year UFCF $500M, g 2%, WACC 8% → TV = 510 ÷ 0.06 = <b>$8,500M</b>; PV at year 5 = 8,500 ÷ 1.08⁵ =
<b>$5,785M</b>.</div>
<ul>
<li>TV is often 60–80% of EV. If it's above ~80%, extend the explicit window or admit you're valuing a guess.</li>
<li>Cross-check: what EV/EBITDA does your Gordon TV imply? What growth does your exit multiple imply? If your "2% growth"
implies 14× terminal EBITDA for a coal plant, start over.</li>
<li>Mid-year convention (discount at t−0.5) recognizes cash arrives through the year, not on Dec 31 — raises the PV a few percent.</li>
</ul>
<h3>From EV to a share price</h3>
<div class="formula">Equity value = EV − net debt − minority interest − preferred (± investments/JVs)<br>
Per share = equity value ÷ diluted shares → compare to market; run WACC × g sensitivity grid</div>`;

const L4 = `
<p>"What's it worth?" depends on what it is. The energy/infra stack uses different primary tools by business model —
this table is half of sector literacy:</p>
<div class="tablewrap"><table>
<tr><th>Business</th><th>Primary methods</th><th>Why</th></tr>
<tr><td>Regulated utility</td><td>P/E vs. EPS growth; dividend yield; premium/discount to rate base growth</td>
<td>Earnings are regulated and stable; value tracks rate base compounding at allowed ROE</td></tr>
<tr><td>Merchant IPP</td><td>EV/EBITDA, FCF yield, $/kW vs. replacement cost, scenario DCF</td>
<td>Volatile commodity cash flows; asset value bounded by cost of new entry</td></tr>
<tr><td>Contracted renewables / yieldco</td><td>Project-level DCF, P/CAFD, CAFD yield vs. cost of equity</td>
<td>Long contracted cash flows behave like amortizing bonds with a growth option</td></tr>
<tr><td>Midstream / pipelines</td><td>EV/EBITDA, DCF per unit, distribution coverage &amp; yield</td>
<td>Fee-based, volume-linked; investor base buys income</td></tr>
<tr><td>Data center REIT / colo</td><td>P/AFFO, EV/EBITDA, cap rates on stabilized NOI, $/MW, development yield spread</td>
<td>It's real estate: income + development pipeline</td></tr>
<tr><td>Neocloud / GPU compute</td><td>EV/EBITDA (carefully!), contracted backlog analysis, unit economics ($/GPU-hr vs. all-in cost), payback vs. depreciation life</td>
<td>Short asset lives and contract/counterparty risk make headline multiples treacherous</td></tr>
</table></div>
<ul>
<li><b>Sum-of-the-parts (SOTP)</b> for hybrids: a utility with a merchant fleet or a developer with an operating
portfolio — value each segment on its own method, subtract net debt and holdco costs. Watch for the "conglomerate discount" debate.</li>
<li><b>The football field:</b> present DCF, comps, precedent deals, and (where relevant) replacement cost side by side
as ranges. One number is a target; a field is an argument.</li>
<li><b>Reverse DCF:</b> back out what growth/margins the current price implies, then argue with <i>that</i>. Often more
persuasive than your own forecast.</li>
</ul>
<div class="keybox"><b>Desk reality:</b> the model rarely changes minds by itself — the <i>assumption you can defend
better than consensus</i> does. Valuation is the scoreboard; the variant perception is the game (Module 7).</div>`;

/* ------------------------------------------------------------ generators */
ACADEMY.gens.valTSM = function () {
  const sh = ri(80, 400); const opt = ri(5, 30);
  const px = rstep(30, 90, 5); const k = Math.round(px * rstep(0.3, 0.7, 0.05));
  const dil = sh + opt * (1 - k / px);
  return { t: "num", q: `${sh}M basic shares; ${opt}M options struck at $${k}; stock trades at $${px}. <b>Diluted share count</b> (treasury stock method)?`,
    ans: dil, dp: 1, tol: 0.3, unit: "M shares",
    sol: `Proceeds ${opt} × ${k} = ${fmt(opt * k, 0)} buys back ${fmt(opt * k / px, 2)}M shares → net +${fmt(opt * (1 - k / px), 2)}M → <b>${fmt(dil, 1)}M</b>.` };
};
ACADEMY.gens.valEV = function () {
  const mcap = ri(20, 90) * 100; const debt = ri(10, 80) * 100; const cash = ri(2, 25) * 100;
  const mi = rpick([0, 0, 150, 300, 600]); const pref = rpick([0, 0, 200, 400]);
  const ev = mcap + debt + mi + pref - cash;
  return { t: "num", q: `Market cap $${fmt(mcap, 0)}M, total debt $${fmt(debt, 0)}M, cash $${fmt(cash, 0)}M, minority interest $${mi}M, preferred $${pref}M. <b>Enterprise value</b>?`,
    ans: ev, dp: 0, tol: 1, unit: "$M",
    sol: `EV = ${fmt(mcap, 0)} + ${fmt(debt, 0)} + ${mi} + ${pref} − ${fmt(cash, 0)} = <b>${fmt(ev, 0)}</b>.` };
};
ACADEMY.gens.valEq = function () {
  const ev = ri(40, 160) * 100; const nd = Math.round(ev * rstep(0.2, 0.5, 0.05));
  const mi = rpick([0, 100, 250, 500]); const sh = ri(100, 500);
  const ps = (ev - nd - mi) / sh;
  return { t: "num", q: `Your DCF gives EV of $${fmt(ev, 0)}M. Net debt $${fmt(nd, 0)}M, minority interest $${mi}M, ${sh}M diluted shares. <b>Implied value per share</b>?`,
    ans: ps, dp: 2, tol: Math.max(ps * 0.01, 0.05), unit: "$/share",
    sol: `Equity = ${fmt(ev, 0)} − ${fmt(nd, 0)} − ${mi} = ${fmt(ev - nd - mi, 0)}; ÷ ${sh}M shares = <b>$${fmt(ps, 2)}</b>.` };
};
ACADEMY.gens.valUFCF = function () {
  const ebitda = ri(40, 150) * 10; const da = Math.round(ebitda * rstep(0.2, 0.4, 0.05));
  const t = rpick([21, 25]); const capex = Math.round(ebitda * rstep(0.25, 0.45, 0.05)); const dnwc = ri(-20, 40);
  const ufcf = (ebitda - da) * (1 - t / 100) + da - capex - dnwc;
  return { t: "num", q: `EBITDA $${fmt(ebitda, 0)}M, D&amp;A $${da}M, tax ${t}%, capex $${capex}M, ΔNWC ${dnwc >= 0 ? "+" : ""}$${dnwc}M. <b>Unlevered FCF</b>?`,
    ans: ufcf, dp: 1, tol: Math.max(Math.abs(ufcf) * 0.01, 0.6), unit: "$M",
    sol: `EBIT = ${fmt(ebitda - da, 0)}; NOPAT = ${fmt((ebitda - da) * (1 - t / 100), 1)}; +D&A ${da} − capex ${capex} − ΔNWC (${dnwc}) = <b>${fmt(ufcf, 1)}</b>.` };
};
ACADEMY.gens.valWACC = function () {
  const rf = rstep(3.5, 5, 0.25); const beta = rstep(0.6, 1.5, 0.05); const erp = rpick([4.5, 5, 5.5]);
  const wd = rstep(0.2, 0.5, 0.05); const rd = rstep(4.5, 8, 0.25); const t = rpick([21, 25]);
  const re = rf + beta * erp;
  const wacc = (1 - wd) * re + wd * rd * (1 - t / 100);
  return { t: "num", q: `Risk-free ${rf}%, beta ${fmt(beta, 2)}, ERP ${erp}%. Capital structure ${Math.round(wd * 100)}% debt at ${rd}% pre-tax; tax ${t}%. <b>WACC</b>? (answer in %, e.g. 8.1)`,
    ans: wacc, dp: 2, tol: 0.06, unit: "%",
    sol: `Re = ${rf} + ${fmt(beta, 2)}×${erp} = ${fmt(re, 2)}%. WACC = ${fmt(1 - wd, 2)}×${fmt(re, 2)} + ${fmt(wd, 2)}×${rd}×(1−${t}%) = <b>${fmt(wacc, 2)}%</b>.` };
};
ACADEMY.gens.valTV = function () {
  const fcf = ri(30, 90) * 10; const g = rstep(1.5, 2.5, 0.25); const w = rstep(7, 10.5, 0.25);
  const tv = fcf * (1 + g / 100) / ((w - g) / 100);
  return { t: "num", q: `Final-year (year 5) UFCF $${fmt(fcf, 0)}M, perpetuity growth ${g}%, WACC ${w}%. <b>Terminal value at year 5</b> (Gordon)?`,
    ans: tv, dp: 0, tol: tv * 0.01, unit: "$M",
    sol: `TV = ${fmt(fcf, 0)}×${fmt(1 + g / 100, 3)} ÷ (${w}% − ${g}%) = ${fmt(fcf * (1 + g / 100), 1)} ÷ ${fmt((w - g) / 100, 4)} = <b>${fmt(tv, 0)}</b>.` };
};
ACADEMY.gens.valPV = function () {
  const cf = ri(20, 120) * 100; const w = rstep(7, 11, 0.5); const n = ri(3, 7);
  const pv = cf / Math.pow(1 + w / 100, n);
  return { t: "num", q: `Discount $${fmt(cf, 0)}M received at the end of year ${n} back to today at ${w}%. <b>Present value</b>?`,
    ans: pv, dp: 0, tol: pv * 0.01, unit: "$M",
    sol: `PV = ${fmt(cf, 0)} ÷ ${fmt(1 + w / 100, 3)}<sup>${n}</sup> = ${fmt(cf, 0)} ÷ ${fmt(Math.pow(1 + w / 100, n), 4)} = <b>${fmt(pv, 0)}</b>.` };
};
ACADEMY.gens.valUnlever = function () {
  const bl = rstep(1.0, 1.8, 0.05); const de = rstep(0.4, 1.2, 0.1); const t = rpick([21, 25]);
  const bu = bl / (1 + (1 - t / 100) * de);
  return { t: "num", q: `A peer's levered beta is ${fmt(bl, 2)} with D/E of ${fmt(de, 1)} and tax ${t}%. <b>Unlevered beta</b>?`,
    ans: bu, dp: 3, tol: 0.015, unit: "",
    sol: `βU = ${fmt(bl, 2)} ÷ [1 + (1−${t}%)×${fmt(de, 1)}] = ${fmt(bl, 2)} ÷ ${fmt(1 + (1 - t / 100) * de, 3)} = <b>${fmt(bu, 3)}</b>.` };
};
ACADEMY.gens.valFCFyield = function () {
  const mcap = ri(30, 150) * 100; const fcf = Math.round(mcap * rstep(0.05, 0.14, 0.005));
  const y = fcf / mcap * 100;
  return { t: "num", q: `Free cash flow $${fmt(fcf, 0)}M against a $${fmt(mcap, 0)}M market cap. <b>FCF yield</b>? (%, e.g. 7.5)`,
    ans: y, dp: 1, tol: 0.15, unit: "%",
    sol: `${fmt(fcf, 0)} ÷ ${fmt(mcap, 0)} = <b>${fmt(y, 1)}%</b>. IPPs returning capital often trade on this — compare it to their buyback pace and to cost of equity.` };
};

/* --------------------------------------------------------------- drills */
const D1 = { id: "ev", title: "EV & the bridge", desc: "Enterprise vs. equity value, diluted shares", serve: 9, items: [
  { t: "gen", g: "valEV" },
  { t: "gen", g: "valTSM" },
  { t: "gen", g: "valEq" },
  { t: "mc", q: "Why is cash subtracted when computing enterprise value?", a: 0, c: [
    "EV measures the operating business; cash is a non-operating asset a buyer effectively gets back at close",
    "Cash is worthless to acquirers",
    "Because interest income is taxed",
    "Convention with no economic logic"],
    why: "Think of buying a wallet: you pay for the wallet, not for the $20 bill inside that comes with it. Net debt = debt − cash captures this." },
  { t: "mc", q: "Which multiple pairing is INCORRECT?", a: 0, c: [
    "EV / net income",
    "EV / EBITDA",
    "Price / earnings",
    "Price / AFFO"],
    why: "Net income is after interest — an equity metric. Pairing it with EV double-counts capital structure. Numerator and denominator must serve the same claimholders." },
  { t: "mc", q: "A company consolidates a 60%-owned project. To keep EV/EBITDA consistent you should:", a: 0, c: [
    "Add the minority interest to EV, since consolidated EBITDA includes 100% of the project",
    "Subtract minority interest from EV",
    "Use only 60% of consolidated EBITDA with plain market cap",
    "Ignore it — minority interests never matter"],
    why: "Consolidated EBITDA counts the whole project, so the EV must include the piece owned by others (the NCI). Alternative: proportional EBITDA. Yieldco structures make this real." },
  { t: "mc", q: "Stock falls 30% but nothing else changes. Enterprise value…", a: 0, c: [
    "Falls by the drop in market cap — debt and cash are unchanged",
    "Is unchanged, EV ignores the stock price",
    "Rises because leverage rose",
    "Falls by exactly 30%"],
    why: "EV = mcap + net debt (+…). Equity fell, so EV falls by that dollar amount — but by a smaller % than 30% if there's debt. Leverage amplifies equity moves relative to EV moves." },
  { t: "num", q: "Market cap $5,000M, debt $3,000M, minority interest $150M, preferred $250M, cash $400M. EV?",
    ans: 8000, dp: 0, tol: 5, unit: "$M",
    sol: "5,000 + 3,000 + 150 + 250 − 400 = <b>8,000</b>." },
  { t: "mc", q: "Options struck at $80 when the stock is $60 add how many TSM shares?", a: 0, c: [
    "Zero — out-of-the-money options are excluded",
    "All of them",
    "Half of them",
    "They reduce the share count"],
    why: "TSM only counts in-the-money options (exercise proceeds < market value). OTM options aren't exercised." },
]};

const D2 = { id: "dcf", title: "DCF mechanics", desc: "UFCF, WACC, terminal value, PV — infinite variants", serve: 10, items: [
  { t: "gen", g: "valUFCF" },
  { t: "gen", g: "valWACC" },
  { t: "gen", g: "valTV" },
  { t: "gen", g: "valPV" },
  { t: "gen", g: "valUnlever" },
  { t: "gen", g: "valFCFyield" },
  { t: "mc", q: "Interest expense does NOT appear in unlevered FCF because…", a: 0, c: [
    "Financing costs are captured in the WACC; UFCF belongs to all capital providers",
    "Interest is non-cash",
    "It's too volatile to forecast",
    "GAAP forbids it"],
    why: "Consistency rule: unlevered flows ↔ blended discount rate. Put interest in the flows AND the rate and you double-count leverage." },
  { t: "mc", q: "Switching from end-of-year to mid-year discounting does what to a DCF value?", a: 0, c: [
    "Raises it — cash flows are discounted about half a year less",
    "Lowers it",
    "No change",
    "Only changes the terminal value"],
    why: "Each flow gets (1+w)^(t−0.5) instead of (1+w)^t. For WACC ~8% that's roughly a 4% uplift." },
  { t: "mc", q: "Your terminal value is 85% of total EV. Best response:", a: 0, c: [
    "Extend the explicit forecast and cross-check the implied exit multiple — the DCF is mostly assumption right now",
    "Ship it — high TV share is normal and needs no comment",
    "Set TV to zero to be conservative",
    "Raise the growth rate so stage 1 matters more"],
    why: "60–80% is common, above that your 'valuation' is one perpetuity formula. Sanity-check what EV/EBITDA the TV implies and lengthen the window." },
  { t: "mc", q: "All else equal, which change moves a DCF value the MOST?", a: 0, c: [
    "Narrowing WACC − g from 6% to 5%",
    "A 1% higher year-2 revenue estimate",
    "Moving one year of capex forward",
    "A small change in day-count convention"],
    why: "TV = FCF(1+g)/(WACC−g): the denominator spread drives the biggest slug of value. 6%→5% raises TV by ~20%. Hence the sensitivity grid on WACC × g." },
  { t: "mc", q: "For a merchant IPP with violently commodity-driven cash flows, the most defensible DCF practice is:", a: 0, c: [
    "Probability-weight power-price scenarios (and/or use forward curves while liquid, normalized prices after)",
    "Use one price deck and add 200bps to WACC to 'cover it'",
    "Skip the DCF and only use book value",
    "Assume last year's spark spread forever"],
    why: "Scenario-weighting confronts the distribution honestly. Desks often mark to the forward curve for 2–3 years, then a mid-cycle normalization — and cross-check with $/kW replacement cost." },
]};

const D3 = { id: "method", title: "Which method when", desc: "Method judgment across the energy/compute stack", serve: 8, items: [
  { t: "mc", q: "Regulated utilities are primarily valued on P/E rather than EV/EBITDA mainly because…", a: 0, c: [
    "Regulation makes earnings stable and debt costs are largely passed through in rates, so the equity slice is the cleanest comparable",
    "Utilities have no debt",
    "EBITDA is not meaningful for utilities",
    "SEC rules require it"],
    why: "Allowed ROE × rate base ≈ earnings; capital structure is set by regulators and remarkably uniform. The whole sector quotes P/E vs. EPS growth (plus dividend yield)." },
  { t: "mc", q: "The most natural primary framework for a contracted-renewables yieldco:", a: 0, c: [
    "P/CAFD (or CAFD yield vs. cost of equity) with a project-level DCF underneath",
    "EV/Revenue",
    "Price to book value",
    "$/kW versus a new-build CCGT"],
    why: "Long PPAs make cash distributions the product. CAFD yield vs. required return is the sector's clearing price; the project DCF checks contract roll-off." },
  { t: "mc", q: "A data center REIT's development pipeline is best valued via…", a: 0, c: [
    "Yield-on-cost vs. exit cap rate spread on the pipeline (value creation per MW), added to the stabilized portfolio's value",
    "It should be ignored until built",
    "A P/E on current earnings only",
    "Book value of land",],
    why: "Development profit = NOI/cost yield above the cap rate the market pays for stabilized assets. Ignoring pipeline misses most of a developer's equity story." },
  { t: "mc", q: "$/kW comparisons for power plants are most useful for…", a: 0, c: [
    "Bounding value against replacement cost / cost of new entry",
    "Predicting next quarter's EPS",
    "Setting the dividend",
    "Computing WACC"],
    why: "If existing CCGTs trade at $600/kW and new builds cost $1,300+/kW with 5-year turbine queues, existing fleets have scarcity value — a core bull argument for IPPs in a load-growth cycle." },
  { t: "mc", q: "Headline EV/EBITDA is most misleading for which of these?", a: 0, c: [
    "A GPU cloud whose fleet depreciates over ~5 years",
    "A regulated water utility",
    "A fee-based pipeline with 20-year contracts",
    "A stabilized, fully-leased data center"],
    why: "When the asset base must be rebought every ~5 years, EBITDA wildly overstates sustainable cash flow. EBITDA − replacement capex (or EBIT) is the honest lens for neoclouds." },
  { t: "mc", q: "A diversified company owns a regulated utility plus a merchant fleet. The cleanest approach:", a: 0, c: [
    "Sum-of-the-parts: P/E or rate-base value on the utility, EV/EBITDA or $/kW on merchant, less holdco costs and net debt",
    "One blended EV/EBITDA for everything",
    "Value only the larger segment",
    "Use book value"],
    why: "Different economics deserve different tools; SOTP is how the market prices hybrids (and how activists argue for splits)." },
  { t: "mc", q: "The point of a 'reverse DCF' is to…", a: 0, c: [
    "Back out the growth/margin assumptions embedded in today's price, then debate those",
    "Run the DCF backwards in time",
    "Discount at negative rates",
    "Check the model for circular references"],
    why: "It reframes the argument: 'the market is paying for X; we think X is too high/low because…' — usually more persuasive than defending your own point forecast." },
  { t: "mc", q: "Precedent transaction multiples usually sit ABOVE trading comps because…", a: 0, c: [
    "They embed control premiums and synergies",
    "They are older",
    "Sellers always lie",
    "Accounting rules differ for acquirers"],
    why: "Buyers pay for control and expected synergies; that's why the M&A bar on a football field typically sits higher than the trading-comps bar." },
]};

ACADEMY.modules.push({
  id: "val", order: 2, icon: "💸",
  title: "Valuation & DCF",
  blurb: "Enterprise value, unlevered FCF, WACC, terminal value — and which method fits which energy/compute business.",
  lessons: [
    { id: "bridge", title: "Equity vs. enterprise value & diluted shares", mins: 8, html: L1 },
    { id: "ufcf", title: "DCF I — unlevered free cash flow", mins: 7, html: L2 },
    { id: "wacctv", title: "DCF II — WACC & terminal value", mins: 9, html: L3 },
    { id: "which", title: "Which method for which asset", mins: 8, html: L4 },
  ],
  drills: [D1, D2, D3],
  boss: { title: "Valuation Committee", count: 16, time: 22 * 60, pass: 0.75 },
  reference: `
<div class="formula">EV = mcap + debt + pref + MI − cash · TSM adds opt×(1−K/P) when P&gt;K<br>
UFCF = EBIT(1−t) + D&A − capex − ΔNWC<br>
Re = rf + β×ERP · WACC = (E/V)Re + (D/V)Rd(1−t) · βU = βL/[1+(1−t)D/E]<br>
TV = FCF(1+g)/(WACC−g) · PV = CF/(1+r)^t · equity = EV − net debt − MI − pref<br>
Utilities: P/E · IPP: EV/EBITDA, FCF yield, $/kW · Yieldco: P/CAFD · Midstream: EV/EBITDA, DCF/unit · DC REIT: P/AFFO, cap rate, $/MW</div>`,
});
})();
