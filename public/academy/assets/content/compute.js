/* Module 5 — Data Centers, Compute & Neoclouds */
(function () {

const L1 = `
<p>A data center is a machine that turns electricity into computation. The industry prices, leases, and values it in
<b>megawatts</b> — power is both the input and the unit of account. Master the physical layer first; the finance is easy after.</p>
<h3>IT load vs. facility load — PUE</h3>
<div class="formula">PUE (power usage effectiveness) = total facility power ÷ IT power<br>
Facility MW = IT MW × PUE &nbsp;·&nbsp; modern hyperscale PUE ≈ 1.15–1.35 (older/retail 1.5–1.8)</div>
<ul>
<li><b>IT (critical) load</b>: servers, storage, network — what the tenant pays rent on.</li>
<li>The overhead above 1.0 is cooling, power conversion losses, lighting. A 100 MW IT hall at PUE 1.25 pulls
125 MW from the grid. Utilities see the 125; leases price the 100. Keep the two straight in every model.</li>
<li>Liquid cooling (needed for dense AI racks) improves PUE and enables the density jump.</li>
</ul>
<h3>Reliability is the product: redundancy tiers</h3>
<ul>
<li><b>N</b> = just enough equipment; <b>N+1</b> = one spare of each critical component; <b>2N</b> = fully duplicated paths.
Tier III (concurrently maintainable) ≈ the commercial standard; Tier IV (fault-tolerant) for the paranoid.</li>
<li>Uptime is sold in nines: 99.99% ≈ 53 minutes of downtime a year, backed by SLAs with penalty teeth. Generators +
UPS + batteries bridge grid failures.</li>
<li>Some AI <i>training</i> capacity is now built cheaper (N, no generators) — training can tolerate interruptions;
inference and enterprise workloads cannot. Watch this distinction in build costs and lease rates.</li>
</ul>
<h3>Density — the AI discontinuity</h3>
<ul>
<li>Classic enterprise racks: 5–15 kW. AI training racks: 40–130+ kW (a GB200-class NVL rack is ~120–132 kW).
Density forced liquid cooling, new electrical topologies, and made <i>power</i> — not floor space — the binding constraint.</li>
<li>Rule of thumb: an H100-class GPU is ~700 W of chip; all-in (server overhead, networking, storage, cooling at
facility PUE) plan roughly <b>1.2–1.5 kW per GPU</b>. 10,000 GPUs ≈ 13–15 MW of facility load — a small town.</li>
</ul>
<div class="keybox"><b>Vocabulary that signals fluency:</b> "critical IT MW" (the leased quantity), "powered shell"
(building + utility power, tenant does fit-out), "turnkey" (fully fitted), "commissioned vs. contracted vs.
operational MW" (pipeline stages). Announcements quote whichever is biggest; analysts reconcile them.</div>`;

const L2 = `
<p>Data center leasing is industrial real estate with a power meter. The economics run on four numbers: rent per kW,
cost per MW, yield on cost, and the exit cap rate.</p>
<h3>The lease</h3>
<ul>
<li><b>Pricing:</b> $/kW of critical IT load per month. Teaching ranges (early 2026): hyperscale/wholesale roughly
$95–140/kW-mo on new signings (up ~40%+ from the 2020–22 trough); retail colo $130–200+. Tight markets (N. Virginia)
at the top.</li>
<li><b>Structure:</b> hyperscale deals are 10–15+ year <b>triple-net (NNN)</b> leases — tenant pays power, most opex —
with 2–3% annual escalators and investment-grade signatures. That's a corporate bond stapled to a building.</li>
<li><b>Power pass-through:</b> tenants pay their own electricity (metered); the landlord's margin is the rent, not the power.</li>
<li><b>Churn & mark-to-market:</b> legacy leases signed in the cheap era re-price UP on renewal in tight markets — a
rare landlord gift; retail colo has churn risk instead.</li>
</ul>
<h3>Development math (the value creation engine)</h3>
<div class="formula">Total cost ≈ land + shell (~$2–3M/MW) + fit-out (~$7–9M/MW) ≈ <b>$9–13M per IT MW</b> (ex-IT gear, which is the tenant's)<br>
Stabilized NOI = rent × kW × 12 − non-recovered costs<br>
<b>Yield on cost = NOI ÷ total cost</b> (target ~9–12%) &nbsp;vs.&nbsp; <b>exit cap rate ~5.75–7%</b><br>
Development profit = NOI ÷ cap − cost — the spread between those two rates, capitalized</div>
<div class="workedex"><div class="wx-title">Worked example</div>
48 MW at $11M/MW ≈ $528M cost. Rent $115/kW-mo → NOI ≈ 48,000 × 115 × 12 ≈ $66M → yield on cost 12.5%. Value at a
6.25% cap = $1.06B → <b>~$530M of development profit</b>, mostly earned the day the lease is signed. This spread is
why private capital flooded the sector.</div>
<h3>What can kill it</h3>
<ul>
<li><b>Speed-to-power:</b> a site without timely utility power is a field. Interconnection timing is the #1 diligence item.</li>
<li><b>Oversupply:</b> record construction pipelines vs. hyperscaler demand that is large but lumpy and repriceable.
Watch vacancy, pre-leasing %, and rate trends by market.</li>
<li><b>Cap-rate risk:</b> a 6.25% → 7.25% move cuts exit value ~14%. Rate-sensitive, like all real estate.</li>
<li><b>Single-tenant risk:</b> one credit, one building, one workload type (training vs. inference matters for re-leasability).</li>
</ul>`;

const L3 = `
<p>A neocloud (GPU cloud — think CoreWeave-style) buys GPUs, wires them into clusters, and rents them by the hour.
The business model is a leasing company wearing a tech multiple — analyze it like a lessor.</p>
<h3>The unit economics per GPU</h3>
<div class="formula">Revenue/GPU-yr = $/GPU-hr × 8,760 × utilization<br>
All-in capex/GPU ≈ chip + server + network + storage + install (H100-era: ~$35–45k)<br>
Simple payback = capex ÷ (revenue − cash opex) — compare to BOTH contract length AND useful life</div>
<div class="workedex"><div class="wx-title">Worked example</div>
H100 at $2.20/hr, 65% blended utilization → revenue ≈ $12.5k/GPU-yr. All-in capex $40k, cash opex (colo, power,
staff) ~$3k/GPU-yr → ~$9.5k net → <b>~4.2-year payback</b> — longer than most 3-year contracts and uncomfortably
close to the asset's competitive life. Now you understand every bull-bear fight in the sector.</div>
<h3>Contracted vs. on-demand</h3>
<ul>
<li><b>Take-or-pay committed contracts</b> (2–5 yrs, often prepaid in part): lower rate, ~100% effective utilization,
financeable. This is what lenders lend against.</li>
<li><b>On-demand:</b> higher headline rate, utilization risk, price risk. Spot GPU prices FALL as supply arrives and
each new chip generation launches (H100 on-demand went from $4+ to ~$2 in about two years — teaching approximation).</li>
<li>Blended margin: contracted base + on-demand kicker. Ask every neocloud: what % of fleet is contracted, to whom, at what remaining term?</li>
</ul>
<h3>The depreciation-life war</h3>
<ul>
<li>Company chooses 5–6 years straight-line; skeptics argue frontier <i>training</i> demand only pays premium rates for
~2–3 years per chip generation, with older chips repriced down for inference. Longer life ⇒ higher stated margins ⇒
scrutinize.</li>
<li>The honest lens: <b>EBITDA − replacement capex</b>, or IRR per cluster: capex out, contracted cash in, then a
salvage assumption you can defend. If the pitch needs 6-year premium pricing to work, it doesn't work.</li>
</ul>
<h3>Power & cost stack per GPU</h3>
<div class="formula">Power cost/GPU-yr = all-in kW/GPU × 8,760 × $/kWh (×~utilization for the variable slice)<br>
e.g. 1.3 kW × 8,760 × $0.06 ≈ $683/yr — real but small vs. $12k revenue; <i>availability</i> of power, not its price, is the binding constraint</div>`;

const L4 = `
<p>Because paybacks exceed contract terms, neoclouds and AI data centers are financing structures as much as
operating businesses. The credit questions ARE the equity questions.</p>
<h3>Backlog / RPO — the asset investors actually buy</h3>
<ul>
<li>RPO (remaining performance obligations) = contracted future revenue. Multi-billion RPO prints against modest
current revenue are the sector signature.</li>
<li>Quality checklist: <b>who</b> (investment-grade hyperscaler vs. venture-funded lab), <b>tenor</b>, <b>take-or-pay
vs. usage-based</b>, prepayments, termination clauses, and concentration (one customer &gt;50% is common and dangerous).</li>
<li>A contract is only as good as the counterparty's ability to pay in year 4. Underwrite the customer, not the press release.</li>
</ul>
<h3>The debt stack</h3>
<ul>
<li><b>GPU-backed / contract-backed facilities:</b> advance rates ~60–80% against contracted cash flows, rates from
high-single to low-double digits. Tenor should sit INSIDE contract term — when debt outlives the contract, the
lender (or equity) owns residual-value risk on depreciating silicon.</li>
<li><b>Vendor & strategic financing:</b> chipmakers investing in customers who buy their chips; hyperscalers
prepaying capacity they also resell. Real, but flag the circularity — revenue quality and true demand get murky.
Every cycle has a version of this.</li>
<li>Data-center project debt & ABS: stabilized leased campuses financed like real estate (cheap); AI-specific
collateral priced wider.</li>
</ul>
<h3>Residual value — the sector's central argument</h3>
<div class="keybox"><b>The bear case in one line:</b> "You're underwriting 6 years of cash flow on an asset whose
market rate halves every chip generation." <b>The bull case in one line:</b> "Compute demand is so supply-constrained
that even N-1 chips earn strong returns serving inference." Your job as an analyst is to put NUMBERS on both:
contracted coverage of capex (cum. contracted EBITDA ÷ capex), re-lease rate assumptions at −40/−60/−80%, and
counterparty survival scenarios. Whoever does that arithmetic best wins the debate.</div>`;

const L5 = `
<p>The compute build-out runs on one constraint: <b>speed to power</b>. Site selection, deal structures, even chip
deployment schedules now bend around electricity. This is where the energy desk and the compute desk merge — your edge.</p>
<h3>What a site needs (in order)</h3>
<ol>
<li><b>Power:</b> 100–1,000+ MW, deliverable in 2–4 years, at survivable rates. Utility interconnection for large loads
now takes years in hot markets — the queue is the moat, for loads as well as generators.</li>
<li><b>Fiber:</b> latency to network hubs (matters less for training, more for inference/cloud).</li>
<li><b>Land/entitlements, water</b> (cooling — WUE scrutiny), <b>tax abatements</b>, community acceptance (noise, viewshed).</li>
</ol>
<h3>The power-sourcing menu (know all six)</h3>
<div class="tablewrap"><table>
<tr><th>Route</th><th>Speed</th><th>Notes for analysts</th></tr>
<tr><td>Grid interconnection (front-of-meter)</td><td>Slow (2–5+ yrs)</td><td>Default path; watch utility large-load queues, tariffs, who funds upgrades</td></tr>
<tr><td>Co-location at existing plant (BTM)</td><td>Fast</td><td>Regulatory fights over grid-cost allocation; FERC scrutiny reshaped early deals</td></tr>
<tr><td>Long-term PPA with existing nuclear</td><td>Med</td><td>Premium price for 24/7 carbon-free; restart deals (mothballed reactors) are the extreme case</td></tr>
<tr><td>On-site gas (bridge or prime)</td><td>Fast-ish</td><td>Turbine scarcity; emissions/permitting; some giant AI campuses run fleets of gas turbines while awaiting grid</td></tr>
<tr><td>New renewables + storage</td><td>Med</td><td>Cheap energy but not firm alone; pairs with grid/gas; credits improve economics</td></tr>
<tr><td>SMRs / advanced nuclear</td><td>Slow (2030s)</td><td>Hyperscaler offtakes signed, but treat as decade-scale optionality, not near-term MW</td></tr>
</table></div>
<h3>Grid-impact debates you must be able to argue both ways</h3>
<ul>
<li><b>Who pays?</b> Large-load tariffs, minimum-take clauses, and "bring your own generation" rules decide whether
residential customers subsidize AI. Politically explosive; shapes utility earnings and data center costs.</li>
<li><b>Demand forecast risk:</b> announced pipelines exceed what will be built (double-counted site shopping,
speculative developers). Track signed interconnection/service agreements, not press releases.</li>
<li><b>Efficiency curveballs:</b> each chip generation delivers more compute per watt; algorithmic efficiency jumps
(the 2025 "efficient training" scare) can reprice the whole demand curve — the bear case that moves these stocks hardest.</li>
</ul>
<div class="keybox"><b>Cross-desk arbitrage (your differentiator):</b> the same MW can be priced as (a) merchant
power, (b) a 15-yr NNN lease, (c) GPU-hours. When compute pricing implies $200+/MWh of value while the grid prices
the same MW at $50, the spread flows to whoever controls the bottleneck — power. That arbitrage explains IPP
re-ratings, co-location premiums, and why energy analysts got poached by infra funds all through 2024–26.</div>`;

/* ------------------------------------------------------------ generators */
ACADEMY.gens.dcPUE = function () {
  const it = rpick([24, 36, 48, 64, 96, 120, 200]); const pue = rpick([1.15, 1.2, 1.25, 1.3, 1.4, 1.5]);
  return { t: "num", q: `A campus has ${it} MW of critical IT load and runs at a PUE of ${fmt(pue, 2)}. <b>Total facility power draw</b>?`,
    ans: it * pue, dp: 1, tol: 0.2, unit: "MW",
    sol: `${it} × ${fmt(pue, 2)} = <b>${fmt(it * pue, 1)} MW</b> — the number the utility must deliver (and the interconnection request should cover).` };
};
ACADEMY.gens.dcColoRev = function () {
  const mw = rpick([12, 24, 36, 48, 72, 96]); const rate = rstep(95, 175, 5); const occ = rpick([85, 90, 95, 100]);
  const rev = mw * 1000 * rate * 12 * occ / 100 / 1e6;
  return { t: "num", q: `${mw} MW of IT capacity leased at $${fmt(rate, 0)}/kW-month, ${occ}% occupancy. <b>Annual rental revenue</b>?`,
    ans: rev, dp: 1, tol: rev * 0.012, unit: "$M",
    sol: `${mw},000 kW × $${fmt(rate, 0)} × 12 × ${occ}% = <b>$${fmt(rev, 1)}M</b>.` };
};
ACADEMY.gens.dcYoC = function () {
  const mw = rpick([24, 36, 48, 60]); const cpm = rstep(9, 13, 0.5);
  const noiPerMW = rstep(1.0, 1.5, 0.05);
  const noi = Math.round(noiPerMW * mw * 10) / 10;
  const cost = mw * cpm;
  const yoc = noi / cost * 100;
  return { t: "num", q: `A ${mw} MW data center development costs $${fmt(cpm, 1)}M per MW all-in and stabilizes at total NOI of $${fmt(noi, 1)}M/yr. <b>Yield on cost</b> (%)?`,
    ans: yoc, dp: 2, tol: 0.12, unit: "%",
    sol: `Cost = ${mw} × ${fmt(cpm, 1)} = $${fmt(cost, 0)}M → YoC = ${fmt(noi, 1)} ÷ ${fmt(cost, 0)} = <b>${fmt(yoc, 2)}%</b>. Compare to exit cap rates (~6–7%): the spread is the developer's profit.` };
};
ACADEMY.gens.dcCapVal = function () {
  const noi = rstep(30, 120, 5); const cap = rpick([5.75, 6, 6.25, 6.5, 6.75, 7, 7.25]);
  const v = noi / (cap / 100);
  return { t: "num", q: `A stabilized, fully-leased data center produces $${fmt(noi, 0)}M of NOI. At a ${fmt(cap, 2)}% cap rate, <b>what is it worth</b>?`,
    ans: v, dp: 0, tol: v * 0.012, unit: "$M",
    sol: `Value = NOI ÷ cap = ${fmt(noi, 0)} ÷ ${fmt(cap, 2)}% = <b>$${fmt(v, 0)}M</b>.` };
};
ACADEMY.gens.dcPowerCost = function () {
  const fmw = rpick([30, 60, 90, 125, 160]); const p = rstep(45, 90, 5);
  const cost = fmw * 8760 * p / 1e6;
  return { t: "num", q: `A campus draws ${fmw} MW of facility load around the clock at an all-in power price of $${fmt(p, 0)}/MWh. <b>Annual electricity bill</b>?`,
    ans: cost, dp: 1, tol: cost * 0.012, unit: "$M",
    sol: `${fmw} × 8,760 × $${fmt(p, 0)} = <b>$${fmt(cost, 1)}M</b>. (Usually a tenant pass-through in NNN colo — but the number that matters to utilities and regulators.)` };
};
ACADEMY.gens.gpuRev = function () {
  const rate = rstep(1.4, 3.8, 0.05); const util = ri(40, 95);
  const rev = rate * 8760 * util / 100;
  return { t: "num", q: `A GPU rents at $${fmt(rate, 2)}/GPU-hour with ${util}% utilization. <b>Annual revenue per GPU</b>?`,
    ans: rev, dp: 0, tol: rev * 0.012, unit: "$/GPU-yr",
    sol: `${fmt(rate, 2)} × 8,760 × ${util}% = <b>$${fmt(rev, 0)}</b>.` };
};
ACADEMY.gens.gpuFleetEBITDA = function () {
  const n = rpick([4, 8, 10, 16, 24]); // thousands
  const rate = rstep(1.7, 2.6, 0.05); const opexGPU = rstep(2.5, 4.5, 0.25); // $k/GPU-yr
  const rev = n * 1000 * rate * 8760 / 1e6;
  const e = rev - n * 1000 * opexGPU * 1000 / 1e6;
  return { t: "num", q: `A neocloud runs ${fmt(n, 0)},000 GPUs fully contracted (take-or-pay) at $${fmt(rate, 2)}/GPU-hr. Cash opex (colo, power, staff, S&M) is $${fmt(opexGPU * 1000, 0)}/GPU-yr. <b>Annual EBITDA</b>?`,
    ans: e, dp: 0, tol: e * 0.015, unit: "$M",
    sol: `Revenue = ${fmt(n, 0)}k × ${fmt(rate, 2)} × 8,760 = $${fmt(rev, 0)}M; opex = ${fmt(n, 0)}k × ${fmt(opexGPU, 2)}k = $${fmt(n * opexGPU, 1)}M → EBITDA <b>$${fmt(e, 0)}M</b>.` };
};
ACADEMY.gens.gpuPayback = function () {
  const capex = rstep(32, 48, 1); // $k
  const net = rstep(7, 14, 0.5);  // $k net cash per GPU-yr
  const pb = capex / net;
  return { t: "num", q: `All-in capex is $${fmt(capex, 0)}k per GPU; each GPU nets $${fmt(net, 1)}k/yr after cash opex. <b>Simple payback</b> in years?`,
    ans: pb, dp: 2, tol: 0.06, unit: "years",
    sol: `${fmt(capex, 0)} ÷ ${fmt(net, 1)} = <b>${fmt(pb, 2)} yrs</b>. Now compare to the contract term and to the chip's competitive life — if payback > both, the equity is a hope certificate.` };
};
ACADEMY.gens.gpuBreakeven = function () {
  const capex = rstep(34, 46, 2); const yrs = rpick([3, 4]); const opex = rstep(2.5, 4, 0.25); const util = rpick([70, 80, 90, 100]);
  const need = (capex / yrs + opex) * 1000 / (8760 * util / 100);
  return { t: "num", q: `Capex $${fmt(capex, 0)}k/GPU, cash opex $${fmt(opex, 2)}k/GPU-yr, target payback ${yrs} years at ${util}% utilization. <b>Required rental rate</b> ($/GPU-hr)?`,
    ans: need, dp: 2, tol: 0.04, unit: "$/GPU-hr",
    sol: `Need (${fmt(capex, 0)}/${yrs} + ${fmt(opex, 2)}) = $${fmt(capex / yrs + opex, 2)}k/yr ÷ (8,760 × ${util}%) = <b>$${fmt(need, 2)}/hr</b>. Compare that to the market rate — that's your margin of safety (or absence of one).` };
};
ACADEMY.gens.gpuPowerCost = function () {
  const kw = rpick([1.1, 1.2, 1.3, 1.4, 1.5]); const price = rstep(0.04, 0.09, 0.005);
  const cost = kw * 8760 * price;
  return { t: "num", q: `Each GPU consumes ${fmt(kw, 1)} kW all-in (server share + cooling overhead), running 24/7 at $${fmt(price, 3)}/kWh. <b>Annual power cost per GPU</b>?`,
    ans: cost, dp: 0, tol: cost * 0.015, unit: "$/GPU-yr",
    sol: `${fmt(kw, 1)} × 8,760 × ${fmt(price, 3)} = <b>$${fmt(cost, 0)}</b>. Real money at fleet scale — but availability of power, not its price, is the binding constraint.` };
};

/* --------------------------------------------------------------- drills */
const D1 = { id: "dcmath", title: "Data center math", desc: "PUE, rent, build costs, yields, cap rates", serve: 9, items: [
  { t: "gen", g: "dcPUE" },
  { t: "gen", g: "dcColoRev" },
  { t: "gen", g: "dcYoC" },
  { t: "gen", g: "dcCapVal" },
  { t: "gen", g: "dcPowerCost" },
  { t: "mc", q: "PUE of 1.25 means…", a: 0, c: [
    "For every 1 MW of IT load, the facility draws 1.25 MW total — 0.25 MW of cooling/electrical overhead",
    "The facility is 125% utilized",
    "25% of servers are idle",
    "Power costs 1.25× the market rate"],
    why: "PUE = facility ÷ IT. Lower is better; ~1.1–1.2 is state of the art with liquid cooling." },
  { t: "mc", q: "N+1 redundancy means…", a: 0, c: [
    "One spare unit beyond the need — one failure is survivable without dropping load",
    "The facility has one generator total",
    "Two of everything (fully duplicated paths)",
    "No backup at all"],
    why: "N+1 = concurrently maintainable-ish; 2N = full duplication (Tier IV territory). Redundancy level drives both build cost and lease rate." },
  { t: "num", q: "A developer quotes $11.5M per MW all-in for a 64 MW turnkey campus (ex-IT gear). <b>Total development cost</b>?",
    ans: 736, dp: 0, tol: 4, unit: "$M",
    sol: "64 × 11.5 = <b>$736M</b>. Order of magnitude check: AI-era turnkey builds run ~$9–13M/MW before a single server arrives." },
  { t: "mc", q: "Why do 15-year NNN hyperscale leases command LOW cap rates (high values)?", a: 0, c: [
    "Long-duration contracted cash flows from investment-grade credits price like corporate bonds plus a real-asset premium",
    "Because the buildings are pretty",
    "Cap rates are set by law",
    "Data centers never need maintenance"],
    why: "Duration + credit + escalators ≈ bond math. The moment lease term shortens or the credit weakens, the cap rate gaps wider." },
]};

const D2 = { id: "gpu", title: "GPU economics", desc: "Rental rates, paybacks, breakevens, power", serve: 9, items: [
  { t: "gen", g: "gpuRev" },
  { t: "gen", g: "gpuFleetEBITDA" },
  { t: "gen", g: "gpuPayback" },
  { t: "gen", g: "gpuBreakeven" },
  { t: "gen", g: "gpuPowerCost" },
  { t: "mc", q: "A neocloud extends GPU depreciation life from 4 to 6 years. Mechanical effect on reported results:", a: 0, c: [
    "Annual depreciation falls → EBIT and net income rise — with zero change in cash economics",
    "EBITDA rises",
    "Revenue rises",
    "Cash flow improves"],
    why: "Life assumptions don't touch EBITDA or cash; they inflate EBIT/EPS. When margins 'improve' via useful-life extensions, adjust them back and re-compare — a classic quality-of-earnings catch." },
  { t: "mc", q: "Which revenue mix deserves the HIGHEST multiple, all else equal?", a: 0, c: [
    "80% multi-year take-or-pay with investment-grade counterparties, 20% on-demand",
    "100% on-demand at the highest hourly rates",
    "80% 1-year contracts with venture-stage AI labs",
    "100% related-party contracts at above-market rates"],
    why: "Durability × credit quality beats headline rate. On-demand pricing decays with every supply wave and chip generation; related-party revenue gets discounted to near zero by serious investors." },
  { t: "mc", q: "On-demand H100 prices roughly halved within ~two years of peak scarcity. The primary lesson for underwriting:", a: 0, c: [
    "Never underwrite terminal/residual value at today's spot rates — model steep re-lease pricing decay after contracts end",
    "GPU prices always recover",
    "Utilization matters more than price so decay is irrelevant",
    "Contracts are unnecessary in shortages"],
    why: "Supply arrives, new generations launch, spot decays. Contracted-period cash must carry most of the capex; the tail is a discounted option, not a plan." },
  { t: "mc", q: "A chip vendor invests in a neocloud that spends the proceeds on that vendor's chips, and also guarantees to rent unused capacity. An analyst should…", a: 0, c: [
    "Flag circular/vendor-financed revenue and assess demand quality without it",
    "Count it as fully organic demand",
    "Assume it's illegal",
    "Ignore it since cash is cash"],
    why: "Vendor financing inflates apparent demand and blurs price discovery. It's legal and common late in capex cycles — which is exactly why you separate it in the model." },
]};

const D3 = { id: "underwrite", title: "Underwriting compute", desc: "Judgment: contracts, credit, power, obsolescence", serve: 7, items: [
  { t: "judge", q: "<b>Judgment call:</b> you must underwrite ONE of these GPU contracts backing a debt facility. Which is strongest?", c: [
    { text: "4-year take-or-pay, investment-grade hyperscaler, 25% prepaid, rate 15% below spot", pts: 3, note: "Tenor, credit, prepayment, and a below-spot rate (renewal-proof) — this is the bankable one. The 'discount' is the price of certainty." },
    { text: "2-year usage-based deal with a well-funded AI lab at spot rates", pts: 1, note: "Usage-based = utilization risk; venture credit = year-2 risk; spot rate = decay risk." },
    { text: "6-year take-or-pay with a startup whose only funding is the compute contract itself", pts: 0, note: "Tenor is fake if the counterparty can't survive to pay it. Circular funding = no credit." },
    { text: "Month-to-month on-demand at the highest posted rate", pts: 1, note: "Great yield today, gone tomorrow. Not financeable." }],
    why: "Rank by credit × tenor × structure, not headline rate." },
  { t: "mc", q: "'Speed-to-power' premium: two identical land parcels, but one has a signed 300 MW utility service agreement deliverable in 18 months. Its value premium is best justified by…", a: 0, c: [
    "Time-to-revenue: 3–5 years of lease cash flows pulled forward, plus scarcity of deliverable power in that market",
    "Lower construction costs",
    "Better soil quality",
    "Nothing — power access is a commodity"],
    why: "In power-constrained markets the interconnection IS most of the land value. Diligence the agreement's firmness (signed ISA vs. 'in queue') before crediting it." },
  { t: "mc", q: "Training vs. inference workloads matter to real-estate underwriting because…", a: 0, c: [
    "Training tolerates remote/cheap sites and interruptibility; inference needs latency and reliability — affecting re-leasability if the AI tenant leaves",
    "They rhyme",
    "Inference uses no electricity",
    "Training requires Tier IV redundancy by law"],
    why: "A remote training barn built with no generators has a thinner tenant pool on re-lease than a metro Tier III. Residual real-estate value depends on who ELSE could use the shell." },
  { t: "mc", q: "The single most decisive factor separating neocloud winners from casualties over a full cycle is most likely…", a: 0, c: [
    "Contracted coverage of invested capital (backlog quality) entering the downcycle",
    "Logo design",
    "Number of GPUs announced in press releases",
    "Twitter following of the CEO"],
    why: "When spot rates decay, the survivors are those whose capex was already repaid (or covered) by credit-worthy take-or-pay. Coverage ratio: cumulative contracted gross profit ÷ net PP&E." },
  { t: "mc", q: "A utility asks a data center developer for a 15-year minimum-take contract before building its interconnection. The utility's motive:", a: 0, c: [
    "Protect other ratepayers from stranded grid investment if the AI demand evaporates",
    "Pure greed with no economic logic",
    "Federal law requires it",
    "To slow down competitors"],
    why: "Large-load tariffs with minimum takes / exit fees allocate forecast risk to those creating it. Expect these structures to spread — they change data center project economics and belong in your model." },
  { t: "mc", q: "Hyperscalers signing 20-year PPAs with existing/restarting nuclear plants are primarily buying…", a: 0, c: [
    "Firm, 24/7 carbon-free energy with schedule certainty — worth a premium over grid average prices",
    "The cheapest possible electricity",
    "Uranium exposure",
    "Regulatory goodwill only"],
    why: "The premium over market in these deals prices firmness + cleanliness + speed (existing interconnection). It repriced the entire nuclear fleet's earnings power — the signature energy-compute trade of this cycle." },
  { t: "mc", q: "Which single disclosure would MOST improve your ability to model a private neocloud?", a: 0, c: [
    "Contract-by-contract backlog: counterparty, tenor, take-or-pay terms, pricing, prepayments",
    "Total GPUs owned",
    "Founder bios",
    "A list of data center addresses"],
    why: "GPUs are commodity capex; the contracts are the business. Everything else in the model hangs off that table." },
]};

ACADEMY.modules.push({
  id: "compute", order: 5, icon: "🖥️",
  title: "Data Centers, Compute & Neoclouds",
  blurb: "MW as the unit of account: PUE, NNN leases, development yields, GPU unit economics, backlog quality, speed-to-power.",
  lessons: [
    { id: "anatomy", title: "Data center anatomy — MW are the product", mins: 8, html: L1 },
    { id: "colo", title: "Colo & hyperscale economics", mins: 8, html: L2 },
    { id: "neocloud", title: "The neocloud model: renting FLOPs", mins: 9, html: L3 },
    { id: "financing", title: "Financing compute: backlog, debt, residual risk", mins: 8, html: L4 },
    { id: "power", title: "Power for compute: speed-to-power", mins: 9, html: L5 },
  ],
  drills: [D1, D2, D3],
  boss: { title: "Infra Committee", count: 16, time: 22 * 60, pass: 0.75 },
  reference: `
<div class="formula">Facility MW = IT MW × PUE · colo revenue = kW × $/kW-mo × 12 × occupancy<br>
Build ≈ $9–13M/MW turnkey (ex-IT) · YoC = NOI/cost (target 9–12%) vs cap ~6–7% · value = NOI/cap<br>
GPU rev/yr = $/hr × 8,760 × util · payback = capex ÷ net cash/yr · breakeven $/hr = (capex/yrs + opex)/(8,760×util)<br>
All-in ~1.2–1.5 kW/GPU · 10k GPUs ≈ 13–15 MW facility · underwrite contracts (credit × tenor × structure), not spot rates</div>`,
});
})();
