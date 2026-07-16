/* Module 6 — Project Finance, Infra & Fund Math */
(function () {

const L1 = `
<p>Most energy and data center assets aren't financed like companies — they're financed like <b>projects</b>: a
special-purpose vehicle (SPV), a bundle of contracts, and debt that can only look to the project's own cash flows.
This is the native language of PE/infra/renewables funds — and increasingly of neocloud financings.</p>
<h3>The structure</h3>
<ul>
<li><b>SPV / ProjectCo</b> owns the asset. Sponsors put in equity; lenders lend <b>non-recourse</b> — if the project
fails, they get the project, not the sponsor's balance sheet.</li>
<li>The bankability stack: offtake (PPA/lease/take-or-pay), EPC contract (who builds, fixed price?), O&amp;M
agreement, interconnection agreement, site control, permits. Debt is priced against the WEAKEST of these.</li>
<li><b>CFADS</b> — cash flow available for debt service = revenue − opex − taxes (before debt). The project's paycheck.</li>
</ul>
<h3>DSCR — the covenant that runs the show</h3>
<div class="formula">DSCR = CFADS ÷ debt service (principal + interest)<br>
1.0× = breakeven · contracted solar sized at ~1.25–1.35× · merchant/partially contracted 1.7–2.5×+<br>
Max debt service = CFADS ÷ target DSCR → debt = PV of that payment stream (annuity at the loan rate/tenor)</div>
<div class="workedex"><div class="wx-title">Worked example</div>
CFADS $19.2M, target DSCR 1.30× → max debt service $14.8M/yr. At 6.75% for 15 years the annuity factor is
(1 − 1.0675⁻¹⁵)/0.0675 = 9.25 → supportable debt ≈ <b>$137M</b>. Debt capacity is a PV of contracted cash —
which is why longer PPAs = more (and cheaper) leverage.</div>
<h3>P50 / P90 / P99 — energy's downside grammar</h3>
<ul>
<li>P50 = median annual production; <b>P90</b> = the level exceeded 90% of years (a bad-but-plausible year); P99 = worst-case-ish.</li>
<li>Lenders size on conservative cases: e.g., 1.30× on P50 <i>and</i> 1.20× on P90 — whichever binds. Equity earns
the difference between P50 reality and P90 sizing.</li>
</ul>
<h3>Protective plumbing</h3>
<ul>
<li><b>Sculpting:</b> shape principal payments so DSCR stays constant as CFADS varies (contract step-downs, degradation).</li>
<li><b>DSRA:</b> a reserve holding ~6 months of debt service. <b>Cash sweeps:</b> in merchant deals, excess cash
force-pays debt. <b>Distribution tests:</b> equity gets paid only if DSCR &gt; threshold and reserves are full.</li>
<li><b>Merchant tail:</b> cash flows after the contract ends. Lenders credit it lightly; equity's upside lives there.</li>
</ul>`;

const L2 = `
<p>US renewable (and now nuclear/storage) economics run through the tax code. You don't need to be a tax lawyer —
you need the cash mechanics of the three monetization routes.</p>
<h3>What's being monetized</h3>
<ul>
<li><b>ITC</b>: a credit worth a % of eligible capex (30% base era, with adders — energy communities, domestic content —
pushing to 40%+; subsequent law tightened windows for wind/solar: always check current rules).</li>
<li><b>PTC</b>: $/MWh for 10 years of production, inflation-indexed.</li>
<li><b>Depreciation</b>: MACRS 5-year for most renewables — losses in early years that a profitable owner can use.</li>
</ul>
<h3>Route 1 — classic tax equity (partnership flip)</h3>
<ul>
<li>A tax-capacity investor (bank) funds ~30–40% of capex and receives ~99% of tax benefits (+ some cash) until it
hits a target after-tax IRR (~6–8% over ~5–9 yrs); then its share "flips" down to ~5% and the sponsor can buy it out.</li>
<li>Monetizes credits AND depreciation, but it's expensive, slow, documentation-heavy, and capacity-limited.</li>
</ul>
<h3>Route 2 — transferability (the post-2022 unlock)</h3>
<ul>
<li>Sell the credits for cash to any corporate taxpayer at ~$0.90–0.95 per $1.00. Simpler, faster, opened the buyer
pool — became the default for mid-size deals. Trade-off: depreciation stays with the sponsor (valuable only if the
sponsor has tax appetite), and credits face recapture/qualification risk the buyer diligences.</li>
</ul>
<h3>Route 3 — hybrid</h3>
<ul>
<li>"TE + transfer" structures: a small tax-equity wrapper monetizes depreciation while the credits are sold. On the
desk you mostly need: <b>how much cash, when, at what discount</b>.</li>
</ul>
<div class="workedex"><div class="wx-title">Worked example — capital stack with transferability</div>
$270M solar+storage project: debt $135M (DSCR-sized), ITC 40% × $256M eligible basis = $103M sold at $0.925 =
<b>$95M cash at COD</b> → sponsor equity only <b>$40M</b> (~15% of capex). Small equity slices + contracted cash
flows = levered mid-teens sponsor IRRs from single-digit unlevered yields. That's the whole renewables business model.</div>
<div class="keybox"><b>Policy is an input, not a constant:</b> credit rules shifted materially in 2025 (construction
deadlines, sourcing restrictions). Models carry policy scenarios the way they carry gas-price scenarios. Say
"under current law" a lot.</div>`;

const L3 = `
<p>Funds keep score with a small set of numbers. Learn to move between them instantly.</p>
<h3>The scorecard</h3>
<div class="formula">MOIC (multiple on invested capital) = total value returned ÷ equity invested<br>
IRR = the discount rate making NPV of your equity flows zero — time-weighted "speed of money"<br>
For a single exit: IRR = MOIC^(1/years) − 1<br>
Cash-on-cash (cash yield) = annual distribution ÷ equity invested<br>
TVPI = (distributions + remaining value) ÷ paid-in · DPI = distributions ÷ paid-in (realized only)</div>
<div class="workedex"><div class="wx-title">Worked example</div>
$230M equity into a data center development; sell stabilized in 2.5 years for net $624M → MOIC 2.71×, IRR =
2.71^(1/2.5) − 1 ≈ <b>49%</b>. Same MOIC over 7 years ≈ 15.3%. IRR rewards speed; MOIC rewards magnitude — quote both,
because funds juice IRR with early refis while LPs quietly track DPI.</div>
<h3>Development vs. stabilized returns (the risk ladder)</h3>
<ul>
<li>Core / stabilized contracted assets: ~7–10% levered IRR — bond-plus.</li>
<li>Value-add (repower, re-lease, expansion): low-to-mid teens.</li>
<li>Development (entitle → build → lease): high teens to 20s+ — paid for entitlement, construction and lease-up risk.</li>
<li>The trade everyone runs: create at a ~10–12% yield-on-cost, sell to core buyers at a ~6–7% cap — <b>develop-to-core</b>.</li>
</ul>
<h3>LBO-lite: how a fund underwrites a platform</h3>
<div class="formula">Entry equity = entry EV − debt · Exit equity = exit EV − remaining debt<br>
Value creation = EBITDA growth + multiple change + deleveraging (debt paydown)</div>
<div class="workedex"><div class="wx-title">Worked example</div>
Buy at 10× on $100M EBITDA (EV $1,000M), 60% debt. EBITDA grows 8%/yr for 5 years → $146.9M; exit at 10×;
40% of debt repaid from FCF. Exit equity = 1,469 − 360 = $1,109M vs. $400M in → <b>2.77×, ~22.6% IRR</b>.
Decompose it: growth contributed everything here — same-multiple exit, honest underwriting. When a model needs
multiple EXPANSION to clear the hurdle, that's hope, not analysis.</div>`;

const L4 = `
<p>Whether you sit sell-side covering the sector or inside a PE/infra/credit fund, you'll live with fund mechanics.
Here's the machine.</p>
<h3>The vehicle</h3>
<ul>
<li><b>LPs</b> (pensions, sovereigns, endowments) commit capital; the <b>GP</b> (the fund manager) calls it as deals
close (capital calls), invests over ~5 years, returns it over ~10–12.</li>
<li>Economics: management fee ~1.5–2% on committed/invested capital + <b>carried interest</b> ~20% of profits above a
<b>preferred return</b> (~8%), usually with a GP <b>catch-up</b>.</li>
<li>Waterfall order: (1) return LP capital, (2) pay LP the pref, (3) GP catch-up (GP takes 100% until it holds 20% of
profits), (4) 80/20 split thereafter. <b>European</b> waterfall = computed on the whole fund; <b>American</b> = deal-by-deal (GP-friendlier).</li>
</ul>
<div class="workedex"><div class="wx-title">Worked example</div>
Fund invests $100M in a deal, exits at $220M in 4 years. Simple pref owed: 8% × 4 × 100 = $32M. Distribution: LP gets
100 (capital) + 32 (pref); GP catch-up takes $8M (making GP 20% of the $40M distributed above capital); remaining
$80M splits 80/20 → LP +64, GP +16. Totals: LP $196M, GP $24M — GP carry = 20% × $120M profit. ✔</div>
<h3>What fund analysts actually build (vs. sell-side)</h3>
<ul>
<li>Asset-level models: monthly, with full debt schedules, covenant tests, downside cases (P90, contract loss,
rate +200bps). The sell-side associate's quarterly EPS model is the light version of this.</li>
<li>The IC memo: sources &amp; uses, base/downside/upside IRRs, sensitivity grid, exit assumptions, "why do we win" —
structurally identical to an initiation report's thesis/valuation/risks. The skills transfer 1:1.</li>
<li>Credit funds run the same models but stop at the debt line: their question is "can I get hurt?", not "can I get rich?"</li>
</ul>
<div class="keybox"><b>Interview mapping:</b> sell-side energy research ↔ infra PE ↔ project finance banking ↔
neocloud corp dev all test: three statements, DCF/IRR mechanics, DSCR/debt sizing, unit economics of MW and GPUs,
and whether you can defend a number under pressure. This academy's Superday drills exactly that set.</div>`;

/* ------------------------------------------------------------ generators */
ACADEMY.gens.pfDSCR = function () {
  const ds = ri(20, 90); const dscr = rstep(1.05, 2.2, 0.05);
  const cfads = Math.round(ds * dscr * 10) / 10;
  return { t: "num", q: `A project generates CFADS of $${fmt(cfads, 1)}M against annual debt service of $${fmt(ds, 0)}M. <b>DSCR</b>? (×)`,
    ans: cfads / ds, dp: 2, tol: 0.03, unit: "×",
    sol: `${fmt(cfads, 1)} ÷ ${fmt(ds, 0)} = <b>${fmt(cfads / ds, 2)}×</b>. Below ~1.1× distributions usually lock; at 1.0× the equity check engine stalls.` };
};
ACADEMY.gens.pfMaxDebt = function () {
  const cfads = ri(15, 60); const dscr = rpick([1.25, 1.3, 1.35, 1.4]);
  const r = rpick([5.5, 6, 6.5, 7]); const n = rpick([15, 18, 20]);
  const ds = cfads / dscr;
  const af = (1 - Math.pow(1 + r / 100, -n)) / (r / 100);
  const debt = ds * af;
  return { t: "num", q: `Size the debt: CFADS $${fmt(cfads, 0)}M/yr (flat), target DSCR ${fmt(dscr, 2)}×, fully-amortizing loan at ${r}% over ${n} years. <b>Maximum debt</b>? (Annuity factor = (1−(1+r)⁻ⁿ)/r)`,
    ans: debt, dp: 0, tol: debt * 0.015, unit: "$M",
    sol: `Max DS = ${fmt(cfads, 0)}/${fmt(dscr, 2)} = ${fmt(ds, 2)}; AF(${r}%, ${n}y) = ${fmt(af, 3)} → debt = ${fmt(ds, 2)} × ${fmt(af, 3)} = <b>$${fmt(debt, 0)}M</b>.` };
};
ACADEMY.gens.pfMOIC = function () {
  const eq = ri(40, 300); const m = rstep(1.4, 3.2, 0.05);
  const dist = Math.round(eq * m);
  return { t: "num", q: `A fund invests $${fmt(eq, 0)}M of equity and ultimately receives $${fmt(dist, 0)}M back. <b>MOIC</b>? (×)`,
    ans: dist / eq, dp: 2, tol: 0.03, unit: "×",
    sol: `${fmt(dist, 0)} ÷ ${fmt(eq, 0)} = <b>${fmt(dist / eq, 2)}×</b>.` };
};
ACADEMY.gens.pfIRR = function () {
  const m = rstep(1.5, 3, 0.1); const n = ri(3, 7);
  const irr = (Math.pow(m, 1 / n) - 1) * 100;
  return { t: "num", q: `A single-exit deal returns ${fmt(m, 1)}× the equity after ${n} years (no interim cash). <b>IRR</b>? (%)`,
    ans: irr, dp: 1, tol: 0.25, unit: "%",
    sol: `IRR = ${fmt(m, 1)}^(1/${n}) − 1 = <b>${fmt(irr, 1)}%</b>. Speed matters: the same multiple over ${n + 2} years is only ${fmt((Math.pow(m, 1 / (n + 2)) - 1) * 100, 1)}%.` };
};
ACADEMY.gens.pfCoC = function () {
  const eq = ri(30, 200); const y = rstep(6, 15, 0.5);
  const cash = Math.round(eq * y) / 100;
  return { t: "num", q: `Sponsor equity of $${fmt(eq, 0)}M receives annual distributions of $${fmt(cash, 2)}M. <b>Cash-on-cash yield</b>? (%)`,
    ans: cash / eq * 100, dp: 1, tol: 0.2, unit: "%",
    sol: `${fmt(cash, 2)} ÷ ${fmt(eq, 0)} = <b>${fmt(cash / eq * 100, 1)}%</b>.` };
};
ACADEMY.gens.pfCarry = function () {
  const inv = rpick([50, 100, 150, 200]); const m = rstep(1.8, 2.8, 0.1);
  const profit = Math.round(inv * (m - 1));
  return { t: "num", q: `A deal returns ${fmt(m, 1)}× on $${fmt(inv, 0)}M invested. Assuming the pref is cleared and the GP catch-up completes, <b>GP carried interest at 20%</b>?`,
    ans: profit * 0.2, dp: 1, tol: Math.max(profit * 0.2 * 0.02, 0.2), unit: "$M",
    sol: `Profit = ${fmt(inv, 0)} × (${fmt(m, 1)} − 1) = $${fmt(profit, 0)}M → carry = 20% × ${fmt(profit, 0)} = <b>$${fmt(profit * 0.2, 1)}M</b>. (Full catch-up makes carry ≈ 20% of TOTAL profit.)` };
};
ACADEMY.gens.pfLBO = function () {
  const e0 = rpick([80, 100, 120, 150]); const mult = rpick([8, 9, 10, 11]);
  const debtPct = rpick([50, 55, 60]); const g = rpick([5, 6, 7, 8]); const n = 5;
  const paydown = rpick([30, 40, 50]);
  const ev0 = e0 * mult, d0 = ev0 * debtPct / 100, eq0 = ev0 - d0;
  const e5 = e0 * Math.pow(1 + g / 100, n);
  const ev5 = e5 * mult, d5 = d0 * (1 - paydown / 100), eq5 = ev5 - d5;
  const moic = eq5 / eq0;
  return { t: "num", q: `LBO-lite: buy at ${mult}× on $${fmt(e0, 0)}M EBITDA with ${debtPct}% debt. EBITDA grows ${g}%/yr for ${n} years; exit at the same ${mult}×; ${paydown}% of the debt is repaid from cash flow. <b>Equity MOIC</b>? (×)`,
    ans: moic, dp: 2, tol: 0.05, unit: "×",
    sol: `Entry: EV ${fmt(ev0, 0)}, debt ${fmt(d0, 0)}, equity ${fmt(eq0, 0)}. Exit: EBITDA ${fmt(e5, 1)} × ${mult} = ${fmt(ev5, 0)}; debt ${fmt(d5, 0)} → equity ${fmt(eq5, 0)}. MOIC = <b>${fmt(moic, 2)}×</b> (≈ ${fmt((Math.pow(moic, 1 / n) - 1) * 100, 1)}% IRR).` };
};
ACADEMY.gens.pfRateBase = function () {
  const rb = rpick([4000, 6000, 8000, 10000]); const eqr = rpick([50, 52, 55]);
  const roe = rpick([9.2, 9.5, 9.6, 10]); const sh = rpick([120, 150, 180, 220]);
  const ni = rb * eqr / 100 * roe / 100;
  return { t: "num", q: `A regulated utility has a $${fmt(rb, 0)}M rate base, a ${eqr}% authorized equity layer, and a ${fmt(roe, 1)}% allowed ROE. With ${sh}M shares, <b>EPS if it earns its full allowed return</b>?`,
    ans: ni / sh, dp: 2, tol: 0.03, unit: "$/share",
    sol: `NI = ${fmt(rb, 0)} × ${eqr}% × ${fmt(roe, 1)}% = $${fmt(ni, 1)}M ÷ ${sh}M = <b>$${fmt(ni / sh, 2)}</b>. Utility EPS ≈ rate base × equity ratio × ROE — the whole sector in one line.` };
};

/* --------------------------------------------------------------- drills */
const D1 = { id: "dscr", title: "Debt & DSCR", desc: "CFADS, coverage, debt sizing, P50/P90", serve: 8, items: [
  { t: "gen", g: "pfDSCR" },
  { t: "gen", g: "pfMaxDebt" },
  { t: "mc", q: "\"Non-recourse\" project debt means…", a: 0, c: [
    "Lenders can claim only the project's assets and cash flows — not the sponsor's balance sheet",
    "The loan can never default",
    "The sponsor guarantees repayment",
    "There is no collateral at all"],
    why: "The SPV firewall lets a sponsor run many projects without cross-contamination — and makes lenders obsess over contracts, since contracts are all they have." },
  { t: "mc", q: "Lenders size renewable debt on P90 (not P50) production because…", a: 0, c: [
    "Debt must survive bad years — P90 is a level of output exceeded 90% of the time",
    "P90 is the best-case scenario",
    "Regulators require it",
    "P50 is impossible to estimate"],
    why: "Equity lives on averages; credit lives on downsides. The P50/P90 gap (resource risk) is also exactly what the equity earns for holding." },
  { t: "mc", q: "A merchant (uncontracted) power project vs. a contracted one: the merchant deal's debt will feature…", a: 0, c: [
    "Lower leverage, higher required DSCR, cash sweeps and shorter tenor",
    "Higher leverage and lower DSCR",
    "The same terms — lenders ignore revenue type",
    "No interest rate"],
    why: "Volatile revenue = less debt capacity and tighter plumbing. Rule of thumb: contracted ~1.3× DSCR; merchant 1.7–2.5×+ with sweeps." },
  { t: "mc", q: "A DSRA (debt service reserve account) exists to…", a: 0, c: [
    "Hold ~6 months of debt service so a bad quarter doesn't trigger default",
    "Pay dividends in good years",
    "Fund expansion capex",
    "Pay the developer's fee"],
    why: "It's the project's emergency fund — a liquidity shock absorber lenders require before equity sees a dollar." },
  { t: "mc", q: "\"Sculpted\" amortization means…", a: 0, c: [
    "Principal payments are shaped so DSCR stays roughly constant as CFADS varies over time",
    "Debt is repaid in equal principal amounts",
    "Interest-only forever",
    "The loan balance grows"],
    why: "PPA step-downs, degradation, and seasonality make flat mortgage-style payments wasteful; sculpting maximizes debt capacity against the actual cash profile." },
  { t: "mc", q: "The \"merchant tail\" of a project is…", a: 0, c: [
    "Cash flows expected after the offtake contract expires — lenders credit them lightly; equity's upside lives there",
    "The last year of construction",
    "A type of interest-rate hedge",
    "The decommissioning cost"],
    why: "A 15-year PPA on a 35-year asset leaves 20 years of merchant exposure. How you value the tail (re-contract? merchant curve? zero?) often decides whether the deal pencils." },
]};

const D2 = { id: "returns", title: "Returns math", desc: "IRR, MOIC, cash yields, carry, LBO-lite", serve: 9, items: [
  { t: "gen", g: "pfMOIC" },
  { t: "gen", g: "pfIRR" },
  { t: "gen", g: "pfCoC" },
  { t: "gen", g: "pfCarry" },
  { t: "gen", g: "pfLBO" },
  { t: "gen", g: "pfRateBase" },
  { t: "mc", q: "Two deals: A returns 2.0× in 3 years; B returns 3.0× in 8 years. Which has the higher IRR?", a: 0, c: [
    "A (~26%) — B is ~14.7%; IRR rewards speed",
    "B — bigger multiple always wins",
    "They're equal",
    "Cannot be determined"],
    why: "2^(1/3)−1 ≈ 26%; 3^(1/8)−1 ≈ 14.7%. But over a fund's life, B compounds more total wealth — hence quoting IRR AND MOIC." },
  { t: "mc", q: "A GP marks a fund at 1.9× TVPI but only 0.3× DPI in year 7. An LP's fair concern:", a: 0, c: [
    "Most of the 'return' is unrealized marks — little cash has actually come back",
    "The fund has returned too much cash",
    "TVPI should exceed 2× by year 2",
    "Nothing — marks are as good as cash"],
    why: "TVPI includes remaining (subjective) value; DPI is money in LP pockets. 'You can't eat IRR' — late-cycle vintages get judged on DPI." },
  { t: "mc", q: "In a develop-to-core strategy, the profit engine is…", a: 0, c: [
    "Creating assets at a ~10–12% yield-on-cost and selling at a ~6–7% cap rate — capitalizing the spread",
    "Buying stabilized assets and holding them",
    "Currency arbitrage",
    "Fee income"],
    why: "The development spread (YoC − exit cap) capitalized over NOI is where data center and renewables developers mint equity value." },
  { t: "mc", q: "A model only clears the fund's hurdle if exit multiple expands from 10× to 12×. Honest interpretation:", a: 0, c: [
    "The underwriting depends on the market paying more per dollar of EBITDA — hope, not analysis; size accordingly",
    "Perfectly normal base case",
    "Multiple expansion is guaranteed in infra",
    "The model must be wrong mechanically"],
    why: "Growth and deleveraging are controllable-ish; multiple expansion is a market bet. ICs discount it to zero in base cases — sell-side should apply the same skepticism to price targets." },
]};

const D3 = { id: "structs", title: "Structures & tax equity", desc: "Flips, transferability, waterfalls, holdco/opco", serve: 8, items: [
  { t: "mc", q: "In a classic partnership flip, the tax equity investor…", a: 0, c: [
    "Takes ~99% of tax benefits (and some cash) until hitting a target IRR, then 'flips' to ~5% and the sponsor may buy it out",
    "Owns 100% of the project forever",
    "Provides debt at a fixed rate",
    "Only buys RECs"],
    why: "The flip matches tax appetite to tax benefits. Post-flip, economics return to the sponsor — which is why sponsor value is heavily back-ended." },
  { t: "mc", q: "Transferability vs. classic tax equity — the trade-off:", a: 0, c: [
    "Transfer is simpler cash-now (~$0.90–0.95 per $1 of credit) but leaves depreciation unmonetized unless the sponsor has tax appetite",
    "Transfer pays more than 100 cents on the dollar",
    "Classic tax equity requires no lawyers",
    "They are identical economically"],
    why: "Classic TE monetizes credits + depreciation but is slow/expensive; transfer is fast but partial. Hybrids exist. Know 'how much cash, when, at what discount.'" },
  { t: "mc", q: "Waterfall order in a standard PE fund:", a: 0, c: [
    "Return LP capital → LP preferred return → GP catch-up → 80/20 split",
    "GP carry first → LP capital → pref",
    "80/20 split from dollar one",
    "Management fees are the waterfall"],
    why: "Alignment by sequence: LPs are made whole plus pref before the GP's profit share turns on." },
  { t: "mc", q: "Structural subordination (holdco/opco) means…", a: 0, c: [
    "Holdco debt is served only by what flows UP from opcos after opco debt/covenants — riskier than the same dollar at the opco",
    "Holdco debt always gets paid first",
    "Opco lenders have no collateral",
    "It's a tax concept only"],
    why: "Utilities and IPPs layer debt at both levels; distribution blocks at the opco can starve the holdco. Rating agencies (and good analysts) map every layer." },
  { t: "mc", q: "Why do infrastructure funds pay premium prices for NNN-leased hyperscale data centers?", a: 0, c: [
    "Long contracted cash flows from strong credits match their LPs' liability profiles and support cheap leverage",
    "The buildings appreciate like art",
    "They can't buy anything else",
    "Colo tenants never leave"],
    why: "Pension/insurance capital prices duration and certainty. That's also the exit bid that development strategies sell into — know your buyer." },
  { t: "mc", q: "An IPP with $2B of 2027 debt maturities in a high-rate environment. The equity analyst's first question:", a: 0, c: [
    "Refinancing math — at what new rate, and what does the interest step-up do to FCF/share?",
    "The color of the bond documents",
    "Whether the CEO is optimistic",
    "Nothing — maturities are a credit analyst's problem"],
    why: "Refi walls transfer EBITDA from equity to lenders. Maturity ladders and hedged rates belong in every levered-equity model — 'equity is a call option on the enterprise' isn't just a saying." },
  { t: "mc", q: "GPU-backed lending with a 4-year loan against a 3-year customer contract: who's exposed to what in year 4?", a: 0, c: [
    "The lender (and equity) carry residual-value risk on depreciated GPUs with no contracted revenue behind them",
    "Nobody — the loan is riskless",
    "Only the customer",
    "The chip manufacturer"],
    why: "Tenor beyond contract = taking silicon residual risk. Structure watch: advance rates, amortization inside the contract, re-lease assumptions. Same logic as the merchant tail in power." },
  { t: "judge", q: "<b>Judgment call:</b> a sponsor shows you a solar deal: 1.38× DSCR on P50, 15-yr busbar PPA with an IG utility, transferability at $0.93, sponsor IRR 13% with ZERO merchant tail value. Your read?", c: [
    { text: "Conservatively structured — contracted revenue, honest sizing, tail as free upside; dig into opex and basis assumptions next", pts: 3, note: "Right: the visible assumptions are prudent. Diligence shifts to what's NOT on the slide (O&M escalators, degradation, curtailment)." },
    { text: "Reject it — 13% is too low for solar", pts: 0, note: "13% levered on a fully contracted, honestly-sized deal is market-plausible; 'too low' without risk context isn't analysis." },
    { text: "It's great because the IRR would be 20%+ if you added merchant tail value", pts: 1, note: "True but that's the upside case, not the underwriting. Credit for noticing the conservatism." },
    { text: "It's uninvestable because it uses tax credits", pts: 0, note: "Credits are standard machinery, not a red flag — though policy scenarios belong in the model." }],
    why: "Judge structures by where the risk actually sits." },
]};

ACADEMY.modules.push({
  id: "pf", order: 6, icon: "🏗️",
  title: "Project Finance & Fund Math",
  blurb: "SPVs, CFADS, DSCR sizing, P50/P90, tax equity & transferability, IRR/MOIC, waterfalls — the PE/infra toolkit.",
  lessons: [
    { id: "pf101", title: "Project finance 101 — non-recourse debt & DSCR", mins: 9, html: L1 },
    { id: "taxeq", title: "Tax equity & transferability", mins: 8, html: L2 },
    { id: "returns", title: "Returns math — IRR, MOIC, yields", mins: 8, html: L3 },
    { id: "funds", title: "Fund mechanics — LPs, GPs, waterfalls", mins: 8, html: L4 },
  ],
  drills: [D1, D2, D3],
  boss: { title: "Investment Committee", count: 16, time: 22 * 60, pass: 0.75 },
  reference: `
<div class="formula">CFADS = revenue − opex − taxes (pre-debt) · DSCR = CFADS/DS<br>
Max debt = (CFADS/DSCR) × AF, AF = (1−(1+r)⁻ⁿ)/r<br>
MOIC = returned/invested · single-exit IRR = MOIC^(1/n) − 1 · CoC = annual cash/equity<br>
Waterfall: capital → pref (8%) → catch-up → 80/20 · carry ≈ 20% of profit past pref<br>
Utility NI = rate base × equity % × allowed ROE · develop-to-core: create at 10–12% YoC, sell at 6–7% cap<br>
Tax credits: ITC = % of capex at COD · PTC = $/MWh × 10yrs · transfer ≈ $0.90–0.95/$1</div>`,
});
})();
