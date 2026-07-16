/* Module 4 — Power Markets & the Grid */
(function () {

const L1 = `
<p>Power has its own arithmetic. Analysts who can do these conversions in their head control every meeting. Fifteen
minutes here pays off for a career.</p>
<h3>Capacity vs. energy — the fundamental distinction</h3>
<div class="formula">Capacity (kW / MW / GW) = instantaneous capability, like an engine's horsepower<br>
Energy (kWh / MWh / TWh) = capacity × time, like miles driven<br>
1 GW = 1,000 MW = 1,000,000 kW · a year has <b>8,760 hours</b></div>
<ul>
<li><b>Capacity factor (CF)</b> = actual energy ÷ (nameplate × 8,760). Typical: nuclear ~90–95%, CCGT (running merchant)
~40–70%, onshore wind ~30–45%, solar ~20–30%, peakers ~5–15%.</li>
<li><b>Annual energy: MWh = MW × 8,760 × CF.</b> A 100 MW solar farm at 25% CF → 219,000 MWh/yr.</li>
<li>Rule of thumb: 1 MW of always-on power ≈ <b>~800 US homes</b> (avg home ≈ 10,500–11,000 kWh/yr). A 1&nbsp;GW data
center campus ≈ a city of 800k homes, running flat out 24/7.</li>
</ul>
<h3>Heat rate — the fuel-to-power exchange rate</h3>
<div class="formula">Heat rate (Btu/kWh) = fuel energy in ÷ electricity out. LOWER = more efficient.<br>
Thermal efficiency = 3,412 ÷ heat rate &nbsp;(3,412 Btu = 1 kWh)<br>
Fuel cost ($/MWh) = heat rate (Btu/kWh) × gas price ($/MMBtu) ÷ 1,000</div>
<div class="workedex"><div class="wx-title">Worked example</div>
A modern CCGT at 7,000 Btu/kWh is 3,412/7,000 = <b>48.7% efficient</b>. With gas at $3.50/MMBtu its fuel cost is
7,000 × 3.50 ÷ 1,000 = <b>$24.50/MWh</b>. An old peaker at 10,500 Btu/kWh pays $36.75/MWh for the same gas —
that ordering (efficiency) decides who runs.</div>
<div class="keybox"><b>Desk mnemonics:</b> 8,760 hours/yr · 3,412 Btu/kWh · fuel $/MWh ≈ heat rate (in thousands) ×
gas price (7 HR × $3.50 gas ≈ $24.5) · MWh/yr per kW = 8.76 × CF.</div>`;

const L2 = `
<p>Wholesale power prices come out of an auction run by grid operators (ISOs/RTOs) every five minutes to a day ahead.
Understanding the auction is understanding the sector.</p>
<h3>Merit order & marginal pricing</h3>
<ul>
<li>Generators offer at (roughly) marginal cost: renewables/nuclear near $0 (fuel-free or must-run), then efficient
CCGTs, then old gas/oil peakers.</li>
<li>The operator stacks offers cheapest-first until supply meets demand. <b>Everyone clears at the price of the last
(marginal) unit</b> — usually a gas plant, which is why <i>gas sets power prices</i> most hours in most US markets.</li>
<li>Inframarginal rent: a nuclear plant running at $5/MWh cost while gas sets the price at $45 keeps the $40 —
that's the IPP profit engine.</li>
</ul>
<h3>LMP — locational marginal price</h3>
<div class="formula">LMP = system energy price + congestion + losses</div>
<p>Prices differ by <i>node</i>. When wires are full (congestion), cheap generation gets bottled up and load pockets
pay premiums. <b>Basis</b> = your node's price vs. the liquid hub — a west Texas solar farm can see hub $35 while its
busbar clears $18 (or negative). Basis risk quietly kills bad PPAs.</p>
<h3>The market map (know these cold)</h3>
<div class="tablewrap"><table>
<tr><th>Market</th><th>Footprint</th><th>Design</th><th>Analyst notes</th></tr>
<tr><td>PJM</td><td>Mid-Atlantic + OH/IL</td><td>Energy + <b>capacity market</b> (RPM auctions)</td><td>Data center epicenter (N. Virginia); capacity prints are stock-moving events</td></tr>
<tr><td>ERCOT</td><td>Texas</td><td><b>Energy-only</b>, scarcity pricing, high offer caps</td><td>Fastest interconnection, wild volatility, huge renewables + new load</td></tr>
<tr><td>CAISO</td><td>California</td><td>Energy + state RA contracts</td><td>Solar duck curve, battery arbitrage lab</td></tr>
<tr><td>MISO / SPP</td><td>Midwest / plains</td><td>Energy + capacity constructs</td><td>Wind-heavy, big transmission builds</td></tr>
<tr><td>NYISO / ISO-NE</td><td>NY / New England</td><td>Energy + capacity</td><td>Gas constraints, high prices, policy overlays</td></tr>
<tr><td>Southeast/West (non-RTO)</td><td>Utilities' own systems</td><td>Vertically integrated, bilateral</td><td>Regulated returns, IRP processes drive capex</td></tr>
</table></div>
<h3>Two ways to keep the lights on</h3>
<ul>
<li><b>Capacity markets (PJM model):</b> pay generators $/MW-day, set years ahead in auctions, for being <i>available</i>.
Tight recent auctions cleared at record levels (hundreds of $/MW-day) as load growth met retirements — a windfall for
incumbent fleets and a core IPP bull thesis.</li>
<li><b>Energy-only (ERCOT model):</b> no capacity payments; scarcity hours with prices up to the multi-thousand-$/MWh
cap are supposed to pay for new build. More volatility, more torque, more risk.</li>
</ul>
<div class="keybox"><b>Ancillary services</b> (regulation, reserves, ERCOT's responsive reserve) are a small but
high-margin revenue stack — batteries feast on them early, then saturate them (watch ancillary price crush as
battery fleets grow).</div>`;

const L3 = `
<p>A generator's P&amp;L is a few spreads and one big fixed-cost line. You can model a fleet on a napkin if you know these.</p>
<h3>Spark spread — the gas generator's gross margin</h3>
<div class="formula">Spark spread ($/MWh) = power price − heat rate × gas price ÷ 1,000<br>
Dark spread = same idea with coal · "Clean" versions subtract carbon costs<br>
Implied market heat rate = power price ÷ gas price × 1,000 (Btu/kWh) — if it's above your unit's HR, you're in the money</div>
<div class="workedex"><div class="wx-title">Worked example</div>
Power $45/MWh, gas $3.50, your CCGT at 7,500 Btu/kWh: fuel cost = 26.25 → spark = <b>$18.75/MWh</b>. Market implied
heat rate = 45/3.5 × 1,000 = <b>12,857</b> — every unit more efficient than that runs profitably this hour.</div>
<h3>Annual generator EBITDA on a napkin</h3>
<div class="formula">EBITDA ≈ MW × 8,760 × CF × realized spread − fixed O&amp;M ± capacity/ancillary revenue</div>
<div class="workedex"><div class="wx-title">Worked example</div>
550 MW CCGT, 62% CF, $22 average realized spark, $25M fixed costs: 550 × 8,760 × 0.62 = 2.99M MWh × $22 = $65.7M −
$25M = <b>~$41M EBITDA</b>. Add PJM capacity: 500 MW UCAP × $270/MW-day × 365 = <b>+$49M</b> — in tight auctions
capacity can out-earn energy. This is why auction prints move IPP stocks.</div>
<h3>Capacity accreditation — UCAP & ELCC</h3>
<ul>
<li>You don't get paid on nameplate. <b>UCAP</b> (unforced capacity) haircuts for forced outages; <b>ELCC</b> (effective
load-carrying capability) rates each technology by how reliably it shows up when the grid is stressed.</li>
<li>ELCC-style ratings fall with penetration: the first solar farm helps a summer-peaking grid a lot; the 50th just
deepens the evening ramp. Batteries' ratings depend on duration (4h vs longer).</li>
</ul>
<h3>Battery economics — buy low, sell high, twice a day</h3>
<div class="formula">Daily arbitrage margin ≈ energy discharged × discharge price − energy charged × charge price<br>
where energy discharged = capacity charged × round-trip efficiency (RTE ~85–90%)</div>
<div class="workedex"><div class="wx-title">Worked example</div>
100 MW / 400 MWh battery, 85% RTE, charges at $20, discharges at $60: cost = 400 × 20 = $8.0k; revenue = 400 × 0.85
× 60 = $20.4k → <b>$12.4k/day ≈ $4.3M/yr</b> at 350 cycles — plus capacity and ancillary stacking. TB spreads
(top-bottom hourly spreads) are the tracked stat.</div>`;

const L4 = `
<p>LCOE answers: what average price must this plant earn per MWh over its life to cover capex, opex and its cost of
capital? It's the sector's universal cost yardstick — and it's routinely abused. Know both.</p>
<h3>The formula (annualize the capex, divide by the energy)</h3>
<div class="formula">Capital recovery factor: CRF = r(1+r)ⁿ ÷ [(1+r)ⁿ − 1] — turns capex into a level annual payment<br>
LCOE ($/MWh) = [capex($/kW) × CRF + fixed O&amp;M($/kW-yr)] ÷ (8.76 × CF) + variable O&amp;M + fuel ($/MWh)</div>
<div class="workedex"><div class="wx-title">Worked example — utility solar</div>
Capex $1,200/kW, 7% for 30 years → CRF = 0.0806 → $96.7/kW-yr + $20 fixed O&amp;M = $116.7/kW-yr. At 25% CF a kW
produces 8.76 × 0.25 = 2.19 MWh/yr → LCOE = 116.7 ÷ 2.19 ≈ <b>$53/MWh</b> (no fuel). Tax credits can cut this by
a third or more — which is how PPAs got so cheap.</div>
<h3>Where LCOE lies to you</h3>
<ul>
<li><b>It ignores WHEN the energy comes.</b> Solar at $50 that clears $28 midday (cannibalized) is worse than a
peaker at $150 that clears scarcity hours. Value-adjusted metrics (net-CONE comparisons, capacity value) matter.</li>
<li><b>It ignores location</b> — basis and congestion can be ±$15/MWh.</li>
<li><b>Financing moves it.</b> The same solar farm at 5% vs. 9% discount rate is a ~30% LCOE swing — renewables are
rate-sensitive assets.</li>
</ul>
<h3>Cost of new entry (CONE) anchors long-run prices</h3>
<p>If market prices/capacity revenues stay above the cost of building new supply, new build should eventually cap
prices — that's the mean-reversion anchor for merchant valuations. The mid-2020s twist: <b>you often can't build even
when you want to</b> — gas turbines sold out for years, new CCGT capex roughly doubled, interconnection queues run
multi-year. Scarcity of the <i>ability to build</i> extended the earnings runway of existing fleets: the single most
important supply-side fact behind the IPP re-rating.</p>`;

const L5 = `
<p>Merchant risk is what you hedge away. The contract stack — PPAs, hedges, credits — is where energy finance
actually happens, and it's exactly what a research associate gets asked about.</p>
<h3>PPA anatomy (power purchase agreement)</h3>
<ul>
<li><b>Buyer:</b> utility, corporate (hyperscalers are the biggest buyers on earth now), or trader. Term 10–25 yrs.</li>
<li><b>Settlement point:</b> <b>busbar</b> (at the plant — buyer takes basis risk) vs. <b>hub</b> (liquid point —
<i>seller</i> keeps basis risk between plant node and hub). Under-appreciated: many "fully contracted" projects still
carry basis risk.</li>
<li><b>Volume:</b> as-generated (buyer takes shape) vs. fixed-shape/firm (seller must cover shortfalls — dangerous).</li>
<li><b>Price:</b> fixed with escalator, or indexed with floors/collars. Also proxy revenue swaps &amp; hedges that
guarantee a revenue level rather than a price.</li>
</ul>
<div class="keybox"><b>Shape risk / cannibalization:</b> solar output is correlated — every farm produces at the same
hour, crushing midday prices (the duck curve). A solar project's <i>captured</i> price falls relative to average
prices as penetration grows. Model captured-price discounts, not flat hub prices.</div>
<h3>RECs & carbon</h3>
<p>Renewable Energy Certificates (1 REC = 1 MWh of renewable generation) sell separately from energy; state RPS
programs set demand. Some markets add carbon costs (RGGI, California) that raise fossil marginal costs — effectively
a subsidy to non-emitting fleets.</p>
<h3>Tax credits — the renewable capital stack's engine (mechanics &gt; statute)</h3>
<ul>
<li><b>ITC</b> (investment tax credit): % of eligible capex (base 30% with adders for energy communities/domestic
content in recent law) taken at COD. Favors capex-heavy, lower-CF assets (storage!).</li>
<li><b>PTC</b> (production tax credit): $/MWh for 10 years, inflation-indexed (high-$20s/MWh area recently). Favors
high-CF assets (wind, and now nuclear's separate 45U credit, which acts as a revenue floor in the low-$40s/MWh area
for existing plants).</li>
<li><b>Transferability:</b> post-2022 law allows selling credits for cash (~$0.90–0.95 per $1) — simpler than classic
tax equity and it reshaped project capital stacks.</li>
<li><b>Policy risk is live:</b> 2025 legislation accelerated phase-outs for wind/solar credits (construction-start
deadlines, sourcing restrictions). For any real deal: check current law, and treat credit timing as a underwriting
assumption, not a constant of nature.</li>
</ul>
<h3>Hedge disclosure — the IPP tell</h3>
<p>IPPs disclose % hedged by year and average hedge prices. The stock's earnings power = hedged block (locked) +
open block (exposed to the curve). When forwards rise, the open years re-rate first — that's why "% hedged 2027"
tables are in every IPP deck and every analyst model.</p>`;

const L6 = `
<p>The 2020s grid story: demand woke up after 15 flat years, and the wires/equipment/queues couldn't keep up.
Transmission and interconnection stopped being plumbing and became the investment thesis.</p>
<h3>Transmission — a regulated compounder</h3>
<ul>
<li>Interstate transmission rates are <b>FERC-regulated</b> (vs. state PUCs for distribution/retail): formula rates,
allowed ROEs historically ~9.5–10.5%, often with incentive adders. Revenue certainty + huge capex need = classic
rate-base compounding.</li>
<li>National build-out drivers: renewables in remote places, reliability (storms), and now load growth. Multi-billion
regional portfolios (e.g., MISO's long-range tranches) set multi-year capex visibility for utilities/equipment makers.</li>
<li>Congestion revenue rights / FTRs hedge congestion — traders' tools worth knowing exist.</li>
</ul>
<h3>Interconnection — the queue is the moat</h3>
<ul>
<li>Generators (and large loads!) must apply to connect; studies determine <b>network upgrade</b> costs the applicant
funds. Queues stretched to multi-year waits with thousands of GW of (mostly solar/storage) projects — many
speculative, but the delay is real.</li>
<li>Reforms (cluster studies, readiness deposits) are grinding through. Until they work, <b>speed-to-power beats
price</b>: assets with existing interconnection (retiring coal sites, existing plants) carry scarcity premiums.</li>
</ul>
<h3>Equipment: the physical bottleneck</h3>
<ul>
<li>Large power transformers: multi-year lead times. HV breakers, cable: stretched. Gas turbines: order books sold out
years ahead; prices up sharply. Nuclear: restarts and uprates first (cheapest MW), SMRs late-decade at best.</li>
<li>Analyst takeaway: bottleneck vendors (turbines, transformers, switchgear, EPC) became growth stocks; backlog and
book-to-bill are their KPIs.</li>
</ul>
<h3>The load-growth supercycle & compute</h3>
<ul>
<li>US data centers consumed roughly ~4% of US electricity in 2024 with credible projections of ~7–12% by 2028–2030
(ranges vary; treat precision skeptically). National load growth forecasts moved from ~0.5%/yr to ~2%+/yr —
transformational for a sector priced for zero growth.</li>
<li>Hyperscalers contract power like sovereigns: 20-year nuclear PPAs (including restart deals), giant solar
portfolios, and interest in SMRs. Premium prices for firm, clean, <i>fast</i> power.</li>
<li><b>Co-location / behind-the-meter (BTM)</b> — plugging a data center directly into a plant — collided with
regulators (who pays for the grid?). Front-of-meter deals with grid charges became the default; the fight itself is
a recurring research topic.</li>
<li>Bridge power: on-site gas turbines, fuel cells, and batteries fill the gap while grid interconnections wait —
new demand for everything from aeroderivatives to behind-fence microgrids.</li>
</ul>
<div class="keybox"><b>The one-slide thesis of this era:</b> demand inflected (AI/electrification/onshoring), supply
of firm capacity is constrained (retirements + queues + equipment), so scarcity accrues to whoever already owns
capacity, wires, or the ability to deliver power fast. Every energy stock pitch since 2023 is a variation on this
slide — know its numbers and its counterarguments (demand-forecast overshoot, efficiency gains, political backlash
on consumer bills, eventual supply response).</div>`;

/* ------------------------------------------------------------ generators */
ACADEMY.gens.powEnergy = function () {
  const tech = rpick([
    { n: "nuclear plant", cf: [90, 95] }, { n: "CCGT", cf: [45, 70] },
    { n: "onshore wind farm", cf: [32, 45] }, { n: "solar farm", cf: [20, 30] }]);
  const mw = rpick([50, 100, 150, 200, 300, 500, 800, 1000]);
  const cf = ri(tech.cf[0], tech.cf[1]);
  const gwh = mw * 8760 * cf / 100 / 1000;
  return { t: "num", q: `A ${mw} MW ${tech.n} runs at a ${cf}% capacity factor. <b>Annual generation in GWh</b>?`,
    ans: gwh, dp: 0, tol: gwh * 0.01, unit: "GWh",
    sol: `${mw} × 8,760 × ${cf}% = ${fmt(mw * 8760 * cf / 100, 0)} MWh = <b>${fmt(gwh, 0)} GWh</b>.` };
};
ACADEMY.gens.powFuelCost = function () {
  const hr = rstep(6400, 10500, 100); const gas = rstep(2.5, 5, 0.25);
  return { t: "num", q: `A gas unit has a heat rate of ${fmt(hr, 0)} Btu/kWh; gas costs $${fmt(gas, 2)}/MMBtu. <b>Fuel cost per MWh</b>?`,
    ans: hr * gas / 1000, dp: 2, tol: 0.15, unit: "$/MWh",
    sol: `${fmt(hr, 0)} × ${fmt(gas, 2)} ÷ 1,000 = <b>$${fmt(hr * gas / 1000, 2)}/MWh</b>.` };
};
ACADEMY.gens.powEff = function () {
  const hr = rstep(6300, 11000, 100);
  const eff = 3412 / hr * 100;
  return { t: "num", q: `Convert a heat rate of ${fmt(hr, 0)} Btu/kWh into <b>thermal efficiency</b> (%).`,
    ans: eff, dp: 1, tol: 0.3, unit: "%",
    sol: `Efficiency = 3,412 ÷ ${fmt(hr, 0)} = <b>${fmt(eff, 1)}%</b>. (3,412 Btu = 1 kWh.)` };
};
ACADEMY.gens.powSpark = function () {
  const hr = rstep(6500, 8000, 100); const gas = rstep(2.5, 5, 0.25);
  const p = rstep(30, 90, 1);
  const ss = p - hr * gas / 1000;
  return { t: "num", q: `Power at the hub is $${fmt(p, 0)}/MWh; gas is $${fmt(gas, 2)}/MMBtu; your CCGT's heat rate is ${fmt(hr, 0)} Btu/kWh. <b>Spark spread</b>?`,
    ans: ss, dp: 2, tol: 0.2, unit: "$/MWh",
    sol: `Fuel = ${fmt(hr, 0)}×${fmt(gas, 2)}/1,000 = ${fmt(hr * gas / 1000, 2)} → spark = ${fmt(p, 0)} − ${fmt(hr * gas / 1000, 2)} = <b>$${fmt(ss, 2)}</b>.` };
};
ACADEMY.gens.powImpliedHR = function () {
  const gas = rstep(2.5, 5, 0.25); const p = rstep(28, 80, 1);
  const ihr = p / gas * 1000;
  return { t: "num", q: `Power $${fmt(p, 0)}/MWh, gas $${fmt(gas, 2)}/MMBtu. <b>Market implied heat rate</b> (Btu/kWh)?`,
    ans: ihr, dp: 0, tol: ihr * 0.01, unit: "Btu/kWh",
    sol: `${fmt(p, 0)} ÷ ${fmt(gas, 2)} × 1,000 = <b>${fmt(ihr, 0)}</b>. Units more efficient than this are in the money this hour.` };
};
ACADEMY.gens.powCapRev = function () {
  const mw = rpick([200, 300, 400, 500, 700, 900, 1100]); const p = rstep(100, 340, 10);
  const rev = mw * p * 365 / 1e6;
  return { t: "num", q: `A generator clears ${fmt(mw, 0)} MW of UCAP in a capacity auction at $${fmt(p, 0)}/MW-day. <b>Annual capacity revenue</b>?`,
    ans: rev, dp: 1, tol: Math.max(rev * 0.01, 0.1), unit: "$M",
    sol: `${fmt(mw, 0)} × ${fmt(p, 0)} × 365 = <b>$${fmt(rev, 1)}M</b>. This is pure margin against fixed costs — why auction prints move IPP stocks.` };
};
ACADEMY.gens.powGenEBITDA = function () {
  const mw = rpick([350, 450, 550, 650, 800]); const cf = ri(45, 70);
  const ss = rstep(12, 30, 1); const fom = ri(18, 40);
  const e = mw * 8760 * cf / 100 * ss / 1e6 - fom;
  return { t: "num", q: `Napkin a merchant CCGT's <b>annual energy-margin EBITDA</b>: ${mw} MW, ${cf}% capacity factor, average realized spark spread $${fmt(ss, 0)}/MWh, fixed costs $${fom}M/yr. (Ignore capacity revenue.)`,
    ans: e, dp: 1, tol: Math.max(e * 0.015, 0.5), unit: "$M",
    sol: `${mw} × 8,760 × ${cf}% = ${fmt(mw * 8760 * cf / 100 / 1e6, 2)}M MWh × $${fmt(ss, 0)} = ${fmt(mw * 8760 * cf / 100 * ss / 1e6, 1)} − ${fom} = <b>$${fmt(e, 1)}M</b>.` };
};
ACADEMY.gens.powBattery = function () {
  const mwh = rpick([100, 200, 400, 600, 800]); const rte = rpick([85, 88, 90]);
  const ch = rstep(10, 30, 1); const dis = rstep(50, 95, 1); const cyc = rpick([300, 330, 350, 365]);
  const daily = mwh * (rte / 100 * dis - ch);
  const ann = daily * cyc / 1e6;
  return { t: "num", q: `A battery charges its full ${fmt(mwh, 0)} MWh at $${fmt(ch, 0)}/MWh and discharges at $${fmt(dis, 0)}/MWh with ${rte}% round-trip efficiency, ${cyc} cycles/yr. <b>Annual arbitrage margin</b>?`,
    ans: ann, dp: 2, tol: Math.max(ann * 0.015, 0.05), unit: "$M",
    sol: `Daily: ${fmt(mwh, 0)}×${rte}%×${fmt(dis, 0)} − ${fmt(mwh, 0)}×${fmt(ch, 0)} = $${fmt(daily, 0)} → × ${cyc} = <b>$${fmt(ann, 2)}M</b>.` };
};
ACADEMY.gens.powCRF = function () {
  const r = rstep(5, 10, 0.5); const n = rpick([20, 25, 30, 35]);
  const crf = (r / 100) * Math.pow(1 + r / 100, n) / (Math.pow(1 + r / 100, n) - 1);
  return { t: "num", q: `Capital recovery factor for ${r}% over ${n} years? (4 decimals, e.g. 0.0806)`,
    ans: crf, dp: 4, tol: 0.001, unit: "",
    sol: `CRF = r(1+r)ⁿ/[(1+r)ⁿ−1] = <b>${fmt(crf, 4)}</b> → $1 of capex costs $${fmt(crf, 4)}/yr to carry.` };
};
ACADEMY.gens.powLCOE = function () {
  const capex = rstep(900, 1700, 50); const crf = rpick([0.075, 0.0806, 0.088, 0.094]);
  const fom = ri(15, 30); const cf = ri(22, 42);
  const lcoe = (capex * crf + fom) / (8.76 * cf / 100);
  return { t: "num", q: `LCOE for a renewables project: capex $${fmt(capex, 0)}/kW, CRF ${fmt(crf, 4)}, fixed O&amp;M $${fom}/kW-yr, capacity factor ${cf}%. No fuel or variable O&amp;M. <b>LCOE</b>?`,
    ans: lcoe, dp: 1, tol: Math.max(lcoe * 0.015, 0.4), unit: "$/MWh",
    sol: `Annual carrying = ${fmt(capex, 0)}×${fmt(crf, 4)} + ${fom} = $${fmt(capex * crf + fom, 1)}/kW-yr; energy = 8.76×${cf}% = ${fmt(8.76 * cf / 100, 2)} MWh/kW-yr → <b>$${fmt(lcoe, 1)}/MWh</b>.` };
};

/* --------------------------------------------------------------- drills */
const D1 = { id: "units", title: "Units & conversions", desc: "MW, MWh, heat rates, capacity factors — infinite variants", serve: 9, items: [
  { t: "gen", g: "powEnergy" },
  { t: "gen", g: "powFuelCost" },
  { t: "gen", g: "powEff" },
  { t: "num", q: "A hyperscale campus draws a constant 300 MW. How much energy does it consume in a year, in <b>TWh</b>?",
    ans: 2.628, dp: 2, tol: 0.03, unit: "TWh",
    sol: "300 MW × 8,760 h = 2,628,000 MWh = <b>2.63 TWh</b> — roughly a quarter-million homes, running 24/7." },
  { t: "mc", q: "Which has the HIGHEST typical capacity factor?", a: 0, c: [
    "Nuclear (~90%+)", "Onshore wind (~35–45%)", "Utility solar (~20–30%)", "Gas peaker (~5–15%)"],
    why: "Nuclear runs baseload nearly always-on — that (plus zero carbon) is exactly why hyperscalers court it." },
  { t: "mc", q: "A LOWER heat rate means…", a: 0, c: [
    "A more efficient plant — fewer Btu needed per kWh",
    "A less efficient plant",
    "A cheaper plant to build",
    "Nothing about efficiency"],
    why: "Heat rate is fuel in per electricity out. 6,400 beats 10,500. Efficiency = 3,412 ÷ HR." },
  { t: "num", q: "Roughly how many average US homes does 1 MW of around-the-clock power supply? (±100)",
    ans: 800, dp: 0, tol: 150, unit: "homes",
    sol: "1 MW × 8,760h = 8,760 MWh/yr ÷ ~10.5–11 MWh per home ≈ <b>~800 homes</b>. Handy for translating data center announcements into civilian units." },
  { t: "num", q: "A 150 MW wind farm generated 512,000 MWh last year. <b>Capacity factor</b>? (%)",
    ans: 38.96, dp: 1, tol: 0.5, unit: "%",
    sol: "512,000 ÷ (150 × 8,760) = 512,000 ÷ 1,314,000 = <b>39.0%</b>." },
  { t: "mc", q: "Gas is quoted in $/MMBtu; power in $/MWh. The bridge between them is…", a: 0, c: [
    "The heat rate — $/MWh fuel cost = HR(Btu/kWh) × gas($/MMBtu) ÷ 1,000",
    "The exchange rate", "The capacity factor", "There is no relationship"],
    why: "This one line of unit math is the spine of gas-power analysis: it defines fuel costs, spark spreads and implied heat rates." },
]};

const D2 = { id: "spreads", title: "Generator P&L", desc: "Spark spreads, capacity revenue, batteries", serve: 9, items: [
  { t: "gen", g: "powSpark" },
  { t: "gen", g: "powImpliedHR" },
  { t: "gen", g: "powCapRev" },
  { t: "gen", g: "powGenEBITDA" },
  { t: "gen", g: "powBattery" },
  { t: "mc", q: "Most hours in most US markets, the wholesale power price is effectively set by…", a: 0, c: [
    "The marginal gas plant's cost (heat rate × gas price)",
    "The average cost of all plants",
    "Solar construction costs",
    "State regulators hour by hour"],
    why: "Merit-order pricing: the last unit needed sets the clearing price for everyone, and that unit is usually gas. Hence power-gas correlation and 'implied heat rate' as a market stat." },
  { t: "mc", q: "A nuclear plant with ~$25/MWh all-in costs sells into a market clearing at $48. The $23 difference is best described as…", a: 0, c: [
    "Inframarginal rent — the profit engine of low-cost incumbent fleets",
    "An illegal subsidy",
    "Congestion revenue",
    "An accounting error"],
    why: "Low-marginal-cost units collect the gap between their costs and the marginal unit's price — the core IPP economics, supercharged when prices rise." },
  { t: "mc", q: "Why can capacity-auction results move an IPP's stock more than a similar-sized move in energy prices?", a: 0, c: [
    "Capacity revenue is locked years ahead for the whole fleet and flows through at ~100% margin",
    "Capacity revenue is taxed at lower rates",
    "Energy prices are fake",
    "They can't — energy always matters more"],
    why: "An auction print instantly reprices multiple delivery years of near-pure-margin revenue on every accredited MW — visible, bankable EBITDA." },
  { t: "mc", q: "Batteries earned outsized returns in ERCOT's ancillary services early on. As battery capacity grows, expect…", a: 0, c: [
    "Ancillary prices to compress (small markets saturate fast) and revenue mix to shift toward energy arbitrage",
    "Ancillary prices to rise forever",
    "Batteries to be banned from ancillary markets",
    "No change — markets don't respond to entry"],
    why: "Ancillary demand is a few GW; batteries flooded it. The 'ancillary crush' is a standard bear point on storage returns — underwriting should lean on energy spreads." },
]};

const D3 = { id: "lcoe", title: "LCOE & new entry", desc: "Cost yardsticks and what anchors long-run prices", serve: 7, items: [
  { t: "gen", g: "powCRF" },
  { t: "gen", g: "powLCOE" },
  { t: "mc", q: "LCOE's biggest blind spot when comparing solar vs. a gas peaker:", a: 0, c: [
    "It ignores WHEN energy is delivered — capacity value and captured prices differ wildly",
    "It ignores fuel costs",
    "It can't handle different plant sizes",
    "It overstates solar costs"],
    why: "A $/MWh average says nothing about showing up at 7pm in a heat wave. Pair LCOE with capacity value/captured-price analysis." },
  { t: "mc", q: "Solar 'captured price' tends to FALL as solar penetration rises because…", a: 0, c: [
    "All solar produces at the same hours, depressing midday prices it sells into (cannibalization / duck curve)",
    "Panels degrade",
    "Regulators cap solar revenue",
    "Gas prices fall in summer"],
    why: "Correlated output crushes its own clearing price. Model captured-price discounts to hub averages that widen over time — or pair with storage." },
  { t: "num", q: "New CCGT capex $1,400/kW, CRF 0.088, fixed O&M $30/kW-yr, expected 55% CF, fuel+VOM $28/MWh. <b>All-in LCOE</b> (≈ cost of new entry)?",
    ans: (1400 * 0.088 + 30) / (8.76 * 0.55) + 28, dp: 1, tol: 0.8, unit: "$/MWh",
    sol: "Carrying = 1,400×0.088 + 30 = $153.2/kW-yr ÷ 4.82 MWh/kW-yr = $31.8 + $28 = <b>~$59.8/MWh</b>. If forwards sit above this AND you can't get turbines, incumbents mint money — the mid-2020s setup." },
  { t: "mc", q: "Why did existing gas fleets re-rate when turbine order books sold out through the late 2020s?", a: 0, c: [
    "The supply response that normally caps merchant prices got delayed — scarcity value accrued to plants already built",
    "Old turbines became more efficient",
    "Gas got cheaper",
    "Regulators raised allowed ROEs"],
    why: "Cost of new entry only disciplines prices if entry can happen. Multi-year equipment and queue delays extended the high-price runway — a supply story, not a demand one." },
  { t: "mc", q: "Renewables valuations are notably sensitive to interest rates because…", a: 0, c: [
    "They're long-duration, capex-front-loaded assets — value is mostly discounted far-future cash flows, and financing is most of LCOE",
    "Panels are bought with credit cards",
    "Rates change the weather",
    "They aren't rate-sensitive"],
    why: "No fuel, all capital: the discount rate IS the cost structure. The 2022–2023 rate shock crushing yieldcos/offshore wind is the case study." },
]};

const D4 = { id: "markets", title: "Markets, contracts & the grid", desc: "LMP, PPAs, credits, queues, load growth", serve: 10, items: [
  { t: "mc", q: "The three components of a locational marginal price (LMP):", a: 0, c: [
    "Energy + congestion + losses",
    "Fuel + labor + taxes",
    "Capacity + energy + ancillary",
    "Generation + transmission + distribution"],
    why: "Congestion and losses are why nodal prices diverge from the hub — the root of basis risk." },
  { t: "mc", q: "ERCOT differs from PJM most fundamentally in that ERCOT…", a: 0, c: [
    "Has no capacity market — scarcity pricing in the energy market is meant to pay for reliability",
    "Has no renewable generation",
    "Is federally regulated while PJM is not",
    "Bans batteries"],
    why: "Energy-only vs. capacity-market design. (Bonus: ERCOT's limited interstate connections keep it largely outside FERC jurisdiction — and made Winter Storm Uri worse.)" },
  { t: "mc", q: "A solar farm signs a fixed-price PPA settled at the HUB, but its busbar node clears $8 below hub on average. Who eats the $8?", a: 0, c: [
    "The project (seller) — hub-settled contracts leave basis risk with the generator",
    "The buyer",
    "The ISO",
    "Nobody — basis nets to zero"],
    why: "Settlement point allocates basis risk. 'Fully contracted' in the deck ≠ fully de-risked in the field. Ask where every PPA settles." },
  { t: "mc", q: "Negative wholesale prices happen mostly because…", a: 0, c: [
    "PTC-earning wind (paid per MWh generated) and inflexible units keep running below $0, especially amid congestion",
    "Demand goes negative",
    "Utilities pay customers as marketing",
    "Meters run backwards at night"],
    why: "A wind farm earning a ~$28/MWh credit rationally bids down to roughly −$28. Add congestion and must-run units → negative LMPs, mostly at renewable-heavy nodes." },
  { t: "mc", q: "ELCC (capacity accreditation) for solar tends to DECLINE as more solar joins the grid because…", a: 0, c: [
    "Net-load peaks shift to evening hours when solar produces little — later increments add less reliability",
    "Panels wear out faster in groups",
    "Regulators penalize success",
    "Transmission losses rise"],
    why: "Accreditation measures marginal reliability contribution. First solar shaves the 4pm peak; later solar faces a 7pm problem it can't help — which batteries then monetize." },
  { t: "mc", q: "Interconnection queues became a core equity research topic because…", a: 0, c: [
    "Multi-year waits + network-upgrade costs constrain supply — scarcity value for projects (and large loads) that already have grid access",
    "Queues are published in Excel",
    "They set retail electricity rates directly",
    "They determine CEO pay"],
    why: "Speed-to-power is the binding constraint of the AI build-out. Sites with executed interconnection agreements trade at premiums; 'queue position' shows up in M&A price talk." },
  { t: "mc", q: "Interstate transmission returns are set by ____, while retail distribution rates are set by ____.", a: 0, c: [
    "FERC; state utility commissions",
    "State commissions; FERC",
    "The ISO; Congress",
    "NERC; FERC"],
    why: "Jurisdictional split: FERC does wholesale markets + interstate transmission (formula rates, ~9.5–10.5% ROEs + adders); states do retail/distribution. Generation is mostly market (or state-regulated where vertically integrated)." },
  { t: "mc", q: "The nuclear PTC (45U) matters to IPP equity stories primarily because it…", a: 0, c: [
    "Creates an effective revenue floor (low-$40s/MWh area) under existing nuclear — downside protection while keeping upside",
    "Pays for new reactor construction",
    "Caps nuclear revenues",
    "Only applies to government-owned plants"],
    why: "Floor + uncapped upside is an option-like payoff: it de-risked the bear case just as hyperscaler PPAs priced the bull case — the two-sided story behind nuclear IPP re-ratings." },
  { t: "mc", q: "A hyperscaler wants 500 MW 'behind the meter' at an existing nuclear plant. The regulatory fight is chiefly about…", a: 0, c: [
    "Whether the load avoids paying its share of grid costs while still relying on the grid — cost allocation and reliability",
    "Whether data centers are legal in that state",
    "Trademark issues",
    "Fuel storage rules"],
    why: "Regulators pushed back on early co-location structures over exactly this; front-of-meter deals with transmission charges became the workaround. Expect this fight in coverage for years." },
  { t: "mc", q: "Which is the LEAST speculative way to underwrite the data-center load-growth thesis?", a: 0, c: [
    "Signed contracts: hyperscaler PPAs, capacity auction results, utility IRPs with executed large-load agreements",
    "Press releases about announced campuses",
    "Total GW figures in interconnection queues",
    "Social media posts about AI"],
    why: "Queues and announcements are options, not commitments (duplicates, speculative sites). Signed offtake + cleared auctions + rate-based capex are bankable. Ratio of announced-to-signed is your skepticism dial." },
  { t: "judge", q: "<b>Judgment call:</b> PJM capacity prices just printed at record levels. Which asset owner benefits MOST directly next delivery year?", c: [
    { text: "A merchant IPP with a large accredited, unhedged fleet in PJM", pts: 3, note: "Direct, uncontracted exposure: every accredited MW reprices at the new $/MW-day. This is the textbook winner." },
    { text: "A regulated PJM utility earning an allowed ROE on rate base", pts: 1, note: "Mostly pass-through: capacity costs flow to customers; earnings set by rate base, not market prices. Indirect political risk, if anything." },
    { text: "A fully PPA'd solar farm with contracted capacity attributes", pts: 1, note: "Contracted = already sold. The buyer keeps the upside." },
    { text: "A retail power marketer with fixed-price customer contracts", pts: 0, note: "Hurt, not helped: they must BUY capacity at the new price while their retail rates are locked." }],
    why: "Trace who actually holds the repriced commodity." },
]};

ACADEMY.modules.push({
  id: "power", order: 4, icon: "⚡",
  title: "Power Markets & the Grid",
  blurb: "Units, merit order, LMP, spark spreads, capacity auctions, LCOE, PPAs, tax credits, transmission and the load-growth supercycle.",
  lessons: [
    { id: "units", title: "Units & conversions — the desk's arithmetic", mins: 8, html: L1 },
    { id: "markets", title: "How power markets set prices", mins: 9, html: L2 },
    { id: "spreads", title: "Generator economics: sparks, capacity, batteries", mins: 9, html: L3 },
    { id: "lcoe", title: "LCOE & the cost of new entry", mins: 7, html: L4 },
    { id: "contracts", title: "PPAs, hedges, RECs & tax credits", mins: 9, html: L5 },
    { id: "grid", title: "Transmission, queues & the load-growth supercycle", mins: 9, html: L6 },
  ],
  drills: [D1, D2, D3, D4],
  boss: { title: "Trading Floor Exam", count: 18, time: 24 * 60, pass: 0.75 },
  reference: `
<div class="formula">MWh = MW × 8,760 × CF · 1 MW ≈ ~800 homes · efficiency = 3,412/HR<br>
Fuel $/MWh = HR × gas ÷ 1,000 · spark = power − fuel · implied HR = power/gas × 1,000<br>
Capacity rev = UCAP MW × $/MW-day × 365 · LMP = energy + congestion + losses<br>
CRF = r(1+r)ⁿ/[(1+r)ⁿ−1] · LCOE = (capex×CRF + FOM)/(8.76×CF) + VOM + fuel<br>
Battery margin/cycle = MWh×(RTE×P_dis − P_chg) · CF benchmarks: nuke 90%+, wind ~35–45%, solar ~20–30%<br>
PJM = capacity market · ERCOT = energy-only · FERC = wholesale/transmission, states = retail</div>`,
});
})();
