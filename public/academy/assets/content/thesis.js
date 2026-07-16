/* Module 7 — Thesis, Written Product & the Research Process */
(function () {

const L1 = `
<p>Models are table stakes. What research actually sells is a <b>defensible view the market doesn't already hold</b>,
delivered clearly, updated honestly. Here's the anatomy.</p>
<h3>A thesis has four load-bearing parts</h3>
<ol>
<li><b>The claim</b> — direction + magnitude + horizon: "EPS power is $9 by 2027 vs. consensus at $7.40; stock worth $140 vs. $98 today."</li>
<li><b>The variant perception</b> — WHY the market is wrong: "Consensus models capacity revenue at $180/MW-day; the
supply-demand math (retirements + data center load) supports $300+ — and the market hasn't updated for the queue reality."</li>
<li><b>The catalyst path</b> — dated events that force repricing: auction results, contract announcements, rate orders,
guidance updates. No catalyst = a view that can stay cheap forever.</li>
<li><b>The risk ledger</b> — what kills it, with numbers: "A capacity price cap at $250 cuts our EPS bridge by $1.10;
demand-forecast overshoot is the structural bear case."</li>
</ol>
<div class="keybox"><b>Litmus test:</b> a real thesis is <i>falsifiable</i> — it names the numbers it depends on and
the evidence that would change your mind. "Great company, secular tailwinds, buy" fails the test; it contains no
information.</div>
<h3>The initiation report skeleton (you will write these)</h3>
<ul>
<li>Thesis & rating (1 page: the claim, the variant view, the catalysts, the target).</li>
<li>Valuation (method, assumptions, sensitivity, football field, what's priced in).</li>
<li>Business deep-dive (segments, unit economics, contract stack, management/capital allocation).</li>
<li>Industry (supply/demand model — YOUR numbers on load growth, capacity, pricing).</li>
<li>Financial model summary + estimates vs. consensus, quarterized for the next year.</li>
<li>Risks (ranked by expected impact, each with the number it moves).</li>
</ul>
<h3>Ratings mechanics</h3>
<p>Buy/Hold/Sell (or Overweight/Neutral/Underweight) against a 12-month target. The honest way to set targets:
method + assumptions + sensitivity, stated so a reader can disagree with a specific input — "target $140 on 9×
2027E EV/EBITDA with net debt at $12B" — never a bare number.</p>`;

const L2 = `
<p>The associate seat is a rhythm business. Master the rhythm and you'll look senior in month three.</p>
<h3>Earnings season — the 96-hour cycle</h3>
<ol>
<li><b>Preview (T−2 weeks):</b> update estimates, flag what matters ("watch 2027 hedge disclosure and any data center
contract language"), position vs. consensus.</li>
<li><b>The print (T=0):</b> variance table in minutes — actual vs. you vs. Street, line by line. Beat/miss AND why:
price, volume, cost, one-timers, timing. Then the call: management tone, guidance mechanics, the one question that matters.</li>
<li><b>First Take (T+2 hours):</b> 150–400 words: what happened, why, thesis impact, estimate direction. Speed with
zero errors beats depth with one error.</li>
<li><b>Model update + full note (T+1 day):</b> new estimates, revised target, updated comp sheet rows.</li>
</ol>
<h3>Maintenance research (the in-between weeks)</h3>
<ul>
<li>Comp sheets refreshed (weekly or on moves); estimate revisions on datapoints (auction prints, gas strip moves,
contract announcements, monthly EIA data).</li>
<li>Industry notes that build franchise: the load-growth tracker, the capacity supply curve, the data center pipeline map —
proprietary, repeatable artifacts clients come back for.</li>
<li>Client Q&A: sales and PMs ping with questions all day. The good associate answers <i>fast, precisely, with the
source</i> — or says "checking, back to you in 20" and actually is.</li>
</ul>
<div class="workedex"><div class="wx-title">Worked example — a sales question, answered like a pro</div>
<i>"Client asks why VoltCo is down 6% on an EPS beat?"</i><br>
Weak: "Profit taking, probably." Strong: "Beat was low-quality — $0.18 of the $0.22 delta was a one-time tax item;
more importantly they guided 2027 capex up $1.5B with an equity funding need they wouldn't size on the call. Street's
now modeling ~4% dilution. Our take: growth capex earns 9.6% allowed ROE, accretive by 2028 — we'd add on weakness.
Sending the math."</div>
<h3>Answering fast without being wrong</h3>
<ul>
<li>Keep a <b>fact pack</b> per covered name: capacity by plant/market, hedge table, debt ladder, contract list,
guidance history, segment model. 80% of questions hit the pack.</li>
<li>Precision discipline: separate <i>fact</i> ("disclosed 92% hedged for 2026"), <i>estimate</i> ("we model $52/MWh
realized"), and <i>opinion</i> ("we think the 2027 open position is the story"). Clients trust people who label the three.</li>
</ul>`;

const L3 = `
<p>"Managing the databases and electronic data services (Bloomberg, FactSet, etc.)" — a real line in the job spec.
Terminals are expensive; the skill is knowing what to pull and where it lives, which you can learn free.</p>
<h3>Bloomberg — the functions an energy associate actually uses</h3>
<div class="tablewrap"><table>
<tr><th>Function</th><th>What it does</th></tr>
<tr><td><code>DES</code> / <code>CN</code></td><td>Company description / company news</td></tr>
<tr><td><code>FA</code></td><td>Financials — historical statements, segments, ratios</td></tr>
<tr><td><code>EE</code> / <code>EEO</code> / <code>MODL</code></td><td>Estimates, consensus detail, line-item consensus models</td></tr>
<tr><td><code>ANR</code></td><td>Analyst recommendations & targets (where you sit vs. the Street)</td></tr>
<tr><td><code>GP</code> / <code>GF</code></td><td>Price charts / fundamentals charts</td></tr>
<tr><td><code>EQRV</code> / <code>RV</code></td><td>Relative valuation vs. comps, history of multiples</td></tr>
<tr><td><code>HDS</code></td><td>Holders — who owns it, position changes</td></tr>
<tr><td><code>DDIS</code></td><td>Debt maturity ladder (refi-wall questions)</td></tr>
<tr><td><code>SPLC</code></td><td>Supply chain map (who supplies turbines/transformers to whom)</td></tr>
<tr><td><code>BI</code></td><td>Bloomberg Intelligence sector primers & data libraries</td></tr>
<tr><td><code>NI POW</code>, <code>NI UTI</code>, <code>NI NUK</code></td><td>News wires by topic (power, utilities, nuclear)</td></tr>
<tr><td><code>XLTP</code> / <code>BQL</code></td><td>Excel templates / query language — feed your models directly</td></tr>
</table></div>
<p><b>FactSet:</b> screening, estimates, ownership, and the Excel plugin (<code>=FDS</code> codes) that powers most
banks' comp sheets. <b>Visible Alpha / AlphaSense / Tegus:</b> line-item consensus, document search, expert transcripts.</p>
<h3>The free stack (train on this now; it's 90% of the data)</h3>
<div class="tablewrap"><table>
<tr><th>Source</th><th>What lives there</th></tr>
<tr><td>EDGAR (+ full-text search)</td><td>10-K/Q, 8-K, S-1, proxies — hedge tables, debt terms, contract language, risk factors</td></tr>
<tr><td>EIA</td><td>Form 860 (every generator: tech, MW, COD), 923 (monthly generation & fuel), 861 (utility sales/customers), AEO/STEO (forecasts), open API</td></tr>
<tr><td>FERC</td><td>Form 1 (utility plant costs, rate base raw material), eLibrary dockets (rate cases, interconnection fights)</td></tr>
<tr><td>ISO/RTO portals</td><td>PJM DataMiner, ERCOT MIS, CAISO OASIS — prices, load, queues, auction results (also gridstatus.io)</td></tr>
<tr><td>NRC</td><td>Daily power reactor status — the nuclear fleet's uptime, free, every morning</td></tr>
<tr><td>EPA CAMD/CEMS</td><td>Hourly plant-level emissions → implied generation for any fossil unit (how analysts track competitors' plants)</td></tr>
<tr><td>LBNL / NREL / Lazard</td><td>Queue studies, cost benchmarks, LCOE surveys</td></tr>
<tr><td>Company IR</td><td>Decks, hedge tables, backlog slides, transcripts — the fact pack's spine</td></tr>
<tr><td>TIKR / Koyfin (free tiers)</td><td>Consensus estimates & comps practice without a terminal</td></tr>
</table></div>
<div class="keybox"><b>Habit to build now:</b> every claim in your notes carries a source you could produce in 10
seconds. "EIA-923, March release" beats "I read somewhere." Desks run on citeable facts.</div>`;

const L4 = `
<p>You will be challenged — by your analyst, by sales, by clients who manage billions and enjoy sport. The skill is
neither stubbornness nor collapse; it's <b>quantified updating</b>.</p>
<h3>The challenge protocol</h3>
<ol>
<li><b>Restate the objection as a number.</b> "You're saying the capacity price cap proposal takes our $300/MW-day to ~$250."</li>
<li><b>Locate it in the model.</b> "That's −$0.9 of our +$2.10 EPS bridge — thesis dents, doesn't break."</li>
<li><b>Assign probability & watch items.</b> "Stakeholder process runs through March; filings will tell us by Q1."</li>
<li><b>Say what would change your mind.</b> Pre-committed tripwires make you credible: "Cap at $250 AND two GW of new
gas clearing the queue — we'd downgrade."</li>
</ol>
<h3>Bull/bear discipline</h3>
<ul>
<li>Carry three cases with probabilities and price implications. Your target is the probability-weighted view, and you
can state the bear case <i>better than the bears</i> — that's what "able to defend the thesis" means in the job spec.</li>
<li><b>Pre-mortem</b> each initiation: "It's 12 months later and we're wrong — what happened?" Write the three most
likely answers into the risk section with tripwires.</li>
</ul>
<h3>When the stock goes against you</h3>
<ul>
<li>Separate <b>price information</b> from <b>fundamental information</b>. Did a datapoint change (contract lost,
guidance cut, policy shift) or just the price? Facts changed → update estimates first, rating second. Only price
changed → your job is to say so, with the same numbers, louder.</li>
<li>The credibility asset is the honest miss: "We were wrong on X because Y; here's what we learned and changed." Analysts
who never admit misses get muted; analysts who quantify them get read.</li>
</ul>
<h3>Communication under time pressure</h3>
<ul>
<li><b>Answer-first ordering:</b> conclusion, then the two best supports, then the caveat. Morning meetings give you 90 seconds.</li>
<li>Numbers beat adjectives: "backlog covers 74% of invested capital" beats "strong contract position."</li>
<li>Know your <b>three numbers</b> per name cold (the ones the whole debate turns on). For an IPP: open 2027 capacity,
hedge price ladder, FCF/share at strip. For a neocloud: contracted coverage of capex, blended $/GPU-hr, 2-year maturity wall.</li>
</ul>`;

/* --------------------------------------------------------------- drills */
const D1 = { id: "quality", title: "Thesis quality control", desc: "Judgment: claims, catalysts, challenges, prints", serve: 8, items: [
  { t: "judge", q: "<b>Pick the strongest thesis statement</b> for initiating on a merchant IPP:", c: [
    { text: "\"Consensus models 2027 capacity revenue at $180/MW-day; retirement and load-growth math supports $290+. Each $50 is ~$0.70 of EPS. Auction prints in July are the catalyst. Target $145 (9× our 2027 EBITDA); a cap settlement below $225 breaks the case.\"", pts: 3, note: "Claim + variant view + quantified sensitivity + dated catalyst + tripwire. This is the template." },
    { text: "\"Best-in-class fleet with strong management and secular AI tailwinds. Buy.\"", pts: 0, note: "No numbers, no variant view, no catalyst, unfalsifiable. Decoration, not research." },
    { text: "\"The stock is up 40% this year and momentum should continue into year-end.\"", pts: 0, note: "Price action isn't a thesis; there's no fundamental claim at all." },
    { text: "\"Trading 2 turns below its closest peer; the gap should close.\"", pts: 1, note: "At least it's a claim — but WHY does the gap exist, why will it close, and when? Half a thesis." }],
    why: "Falsifiable, quantified, dated." },
  { t: "judge", q: "<b>A PM challenges you:</b> \"Your bull case needs $300/MW-day capacity forever. The state legislature is furious about consumer bills. You're underwriting a political impossibility.\" Best response:", c: [
    { text: "Quantify it: \"At a legislated $250 cap our EPS bridge loses $0.90 of $2.10 — target goes $145→$128, still 18% upside. Below $225 we'd downgrade. The stakeholder filings due March are the tell — we're watching them, and here's our read of the politics.\"", pts: 3, note: "Converts the objection into a number, a scenario, and a tripwire — and respects the political risk rather than dismissing it." },
    { text: "\"Politicians always back down. We're not worried.\"", pts: 0, note: "Unquantified dismissal of a real risk — exactly how analysts get famous for the wrong reasons." },
    { text: "\"You may be right. We'll move to Hold to be safe.\"", pts: 0, note: "Collapsing without new information is as unrigorous as stubbornness. What number changed?" },
    { text: "\"Our price target already includes a 10% haircut for unspecified risks.\"", pts: 1, note: "Vague buffers aren't scenario analysis, but at least it acknowledges the need." }],
    why: "Quantified updating beats confidence theater." },
  { t: "judge", q: "<b>The print:</b> your IPP reports revenue +6% vs. your model but EBITDA −4% vs. your model. The most likely story to investigate FIRST:", c: [
    { text: "Cost side: outage expense, purchased-power costs during price spikes (short generation into load obligations), or hedge settlement timing", pts: 3, note: "Revenue beat + margin miss = the cost lines. For IPPs with retail arms, buying power at spikes to serve fixed-price load is the classic culprit." },
    { text: "The revenue beat means demand is strong; raise estimates", pts: 0, note: "You can't raise estimates on a margin MISS without understanding it — the beat may be low-quality pass-through revenue." },
    { text: "Assume it's a one-timer and wait for the 10-Q", pts: 1, note: "Sometimes right, but 'assume and wait' is not a process; the call and the release footnotes usually tell you same-day." },
    { text: "The company is manipulating earnings", pts: 0, note: "Fraud is the last hypothesis, not the first. Boring operational explanations dominate." }],
    why: "Variance analysis: decompose beat/miss into price/volume/cost before judging quality." },
  { t: "judge", q: "<b>Three weeks after your Buy initiation, the stock is −15% on no news.</b> Your analyst asks for a recommendation. Best:", c: [
    { text: "\"Thesis drivers unchanged — hedge table, auction setup, contracts all intact; we re-checked each. The move tracks the sector selloff on rate fears. At 7.2× versus our 9× target multiple, risk/reward improved: we'd press the call, and here's the client note saying why.\"", pts: 3, note: "Facts re-verified, move attributed, valuation restated, conviction with evidence. This is the job." },
    { text: "\"Downgrade — the market is telling us something.\"", pts: 0, note: "Price alone isn't information about your thesis unless someone knows something — go find out if they do." },
    { text: "\"Say nothing until it recovers.\"", pts: 0, note: "Silence during drawdowns is how research franchises die. Clients pay for exactly these moments." },
    { text: "\"Reiterate but quietly trim the target so we look less wrong.\"", pts: 1, note: "Target management without stated reasons erodes the only asset you have — intellectual honesty." }],
    why: "Separate price info from fundamental info, then act like it." },
  { t: "mc", q: "Which is a CATALYST in the research sense?", a: 0, c: [
    "The PJM base residual auction results publishing on a known date",
    "\"AI will need lots of power eventually\"",
    "The stock being cheap",
    "A round-number price level"],
    why: "A catalyst is a dated, observable event that forces the market to confront your variant number. Vague tailwinds and cheapness have no clock." },
  { t: "mc", q: "Management guides 'mid-teens EBITDA growth' but your bottom-up model of their contracts gets you to 9%. Your note should…", a: 0, c: [
    "Show the bridge: itemize their claimed drivers vs. your contract-level math, state what extra wins their guide requires, and model your number",
    "Use their number — they know their business best",
    "Use your number and not mention the gap",
    "Average the two numbers"],
    why: "The gap IS the research. 'Guidance requires $400M of new contracts not yet signed; at their historical win rate we credit $180M' — that's a note clients forward." },
  { t: "mc", q: "The most defensible way to present a price target:", a: 0, c: [
    "Method + assumptions + sensitivity: \"$140 on 9× 2027E EBITDA of $4.6B; each half-turn is ±$8\"",
    "A bare number with confidence: \"$140. We're sure.\"",
    "A range so wide it can't be wrong: \"$80–200\"",
    "Consensus plus 10%"],
    why: "Targets earn trust when a reader can disagree with a specific input. Bare numbers and unfalsifiable ranges earn mutes." },
  { t: "mc", q: "Your fictional coverage company just announced a 'transformational' 900 MW data center deal, +8% pre-market. The First Take's job is to…", a: 0, c: [
    "Size it: MW × price uplift × margin = EBITDA; compare to what the move already prices in; flag what's NOT disclosed (term, credit, start date)",
    "Congratulate management on the momentum",
    "Repeat the press release with a Buy sticker",
    "Wait a week for certainty"],
    why: "Clients need the arithmetic and the missing variables within the hour. 'The +8% move prices ~$450M of EBITDA; disclosed terms support $280–380M — details on credit/term will decide' is the value-add." },
]};

const D2 = { id: "datahunt", title: "The data hunt", desc: "Which source answers which question", serve: 9, items: [
  { t: "mc", q: "You need every US generator's capacity, technology, and commercial online date. Primary source:", a: 0, c: [
    "EIA Form 860", "FERC Form 1", "The company's marketing site", "NRC daily reports"],
    why: "EIA-860 is the census of US generators — the backbone of any supply model. Free, annual (with monthly preliminary updates)." },
  { t: "mc", q: "Monthly plant-level generation and fuel consumption lives in…", a: 0, c: [
    "EIA Form 923", "EIA Form 861", "The 10-K", "PJM DataMiner"],
    why: "EIA-923 = who generated what, burning what. Pair with 860 (the fleet) and you can rebuild any generator's output history." },
  { t: "mc", q: "A utility's detailed plant costs and the raw material for rate base analysis:", a: 0, c: [
    "FERC Form 1", "EIA AEO", "EDGAR 8-Ks", "The ISO queue"],
    why: "FERC Form 1 is the regulated utility's annual financial X-ray: plant in service, depreciation, O&M detail by function — analysts mine it for rate case previews." },
  { t: "mc", q: "You want to know how hedged an IPP is for 2027 and at what prices. Fastest reliable path:", a: 0, c: [
    "The hedge disclosure table in the latest IR deck / 10-Q derivatives footnote",
    "News search",
    "Ask a competitor",
    "The ISO's website"],
    why: "IPPs publish hedge ladders precisely because analysts model them. Deck first (formatted), 10-Q footnote to verify. This is 'uses all resources to locate relevant data' in practice." },
  { t: "mc", q: "Tracking whether a competitor's gas plant ran last month WITHOUT any paid service:", a: 0, c: [
    "EPA CEMS/CAMD hourly emissions data — emissions imply generation",
    "Guess from the weather",
    "Wait for the annual report",
    "Call the plant"],
    why: "Continuous emissions monitoring is public, hourly, unit-level. Emissions → heat input → implied MWh. One of the great free datasets in the sector." },
  { t: "mc", q: "Live and historical nodal prices, load, and interconnection queues come from…", a: 0, c: [
    "The ISO/RTO data portals (PJM DataMiner, ERCOT MIS, CAISO OASIS — or aggregators like gridstatus)",
    "EDGAR", "FERC Form 1", "The Federal Register"],
    why: "Market operators publish the market. Queue databases also reveal who's trying to build what, where — early intelligence on supply AND large loads." },
  { t: "mc", q: "On Bloomberg, consensus estimates and line-item consensus models live under…", a: 0, c: [
    "EE / EEO / MODL", "DES", "HDS", "GP"],
    why: "EE for the estimate summary, EEO for detail, MODL for line-item consensus. (DES = description, HDS = holders, GP = chart.)" },
  { t: "mc", q: "The debt maturity wall question — 'what does VoltCo owe and when?' — is fastest on…", a: 0, c: [
    "Bloomberg DDIS (or the 10-K debt footnote)",
    "ANR", "SPLC", "NI POW"],
    why: "DDIS draws the ladder instantly; the 10-K footnote is the free equivalent with covenant detail." },
  { t: "mc", q: "You need language from every filing that mentions 'co-location' across all utilities this year. Best free tool:", a: 0, c: [
    "EDGAR full-text search",
    "Reading every 10-K manually",
    "A generic web search",
    "FERC Form 1"],
    why: "EDGAR FTS searches the text of all filings with date/form filters — the free version of AlphaSense, and the fastest way to map an emerging theme across a sector." },
  { t: "mc", q: "Daily status of every US nuclear reactor (up/down/% power):", a: 0, c: [
    "NRC Power Reactor Status Reports — free, every morning",
    "Only available to subscribers",
    "The utilities' Twitter accounts",
    "EIA Form 861"],
    why: "Nuclear analysts check it like a weather report — outage extensions move earnings estimates." },
]};

const D3 = { id: "writing", title: "Write the note", desc: "Draft, then compare against the desk answer", serve: 3, shuffle: true, items: [
  { t: "write", q: "<b>First Take (aim ~120–160 words):</b> Your covered merchant IPP \"Ampera Energy\" (fictional) reported Q2 adj. EBITDA of $1,180M vs. your $1,110M and Street $1,095M (+8% beat). They announced a 15-year, 600 MW data center supply agreement at a disclosed ~$15/MWh premium to wholesale, starting 2028, investment-grade counterparty. Management raised 2026 EBITDA guidance 4%. The stock is +6% pre-market. Draft the First Take.",
    model: `<p><b>Ampera Energy: Beat + the contract we've been waiting for — thesis strengthening (Buy, $152 → under review upward)</b></p>
<p>Q2 adj. EBITDA of $1,180M beat us/Street by 6–8%, driven by stronger realized spark spreads and capacity revenue (quality: recurring, not one-time). The headline is the 15-yr, 600 MW data center agreement (IG counterparty, ~$15/MWh premium, 2028 start): at ~90% delivered CF that's roughly 600 MW × 8,760 × 0.9 × $15 ≈ <b>$71M of high-margin annual EBITDA</b>, and more importantly it validates recontracting economics on the remaining ~2.4 GW of open position — the core of our thesis. Guidance +4% screens conservative against the beat's run-rate. At +6% pre-market the stock prices ≈ $600M of EV (~8.5× the contract's EBITDA) — reasonable, leaving the open-position option free. Watching: counterparty disclosure, capex attached, and whether premiums are trending higher. Numbers going up; full note tonight.</p>`,
    rubric: [
      "Leads with conclusion and thesis impact (not a recap)",
      "Quantifies the contract's EBITDA (MW × hours × CF × premium) rather than calling it 'transformational'",
      "Assesses beat QUALITY (recurring vs. one-time) and guidance conservatism",
      "Compares the stock move to the value created — what's now priced in",
      "Names what's still unknown + next steps, and commits to updated numbers"] },
  { t: "write", q: "<b>Sales desk ping (aim ~60–100 words, answer-first):</b> \"Client asks: your data center REIT 'Nimbus' (fictional) is down 9% since Tuesday on no company news. What's going on and would you buy it here?\" You know: a competitor announced a 400 MW speculative development in Nimbus's core market Tuesday; a hyperscaler CFO said 'we see near-term digestion in leasing' at a conference Wednesday; Nimbus trades at 21× 2026E AFFO vs. its 24× average and your $178 target assumes 22×.",
    model: `<p>Two real datapoints, one repriced multiple — not company-specific damage. Tuesday: a 400 MW speculative build announced in their core market (supply fear); Wednesday: a hyperscaler CFO flagged 'leasing digestion' (demand fear). Nothing changed at Nimbus: 96% pre-leased pipeline, 11-yr WALT, guidance intact. At 21× 2026E AFFO (vs. 24× LT average, 22× our target basis) the market's now pricing the digestion scenario. We'd buy the fear: pre-leasing insulates the near-term, and supply announcements ≠ supply (power constraints gate that 400 MW). Risk: a second hyperscaler echoing digestion — that would slow the whole group. Happy to walk through the pipeline detail.</p>`,
    rubric: [
      "Answer first, attribution of the move to specific datapoints",
      "Separates market/sector information from company-specific facts",
      "Uses valuation context (current vs. historical vs. target multiple)",
      "Gives an actual recommendation with the risk that would change it",
      "Short enough to be read on a phone between meetings"] },
  { t: "write", q: "<b>Elevator pitch (aim ~90–130 words):</b> Pitch fictional \"Keystone Power\" — a gas-heavy merchant IPP, 12 GW fleet concentrated in PJM, 60% hedged through 2026, trading at 11.9× 2026E EV/EBITDA vs. nuclear peers at 13.7× — to a PM who has 90 seconds and already owns the nuclear names.",
    model: `<p>You own the nuclear story — Keystone is the same electrons with more torque and a 2-turn discount. 12 GW of PJM gas, 40% open in 2026 and ~70% open in 2027, right as capacity auctions clear at records and every incremental data center megawatt tightens the same interconnection-constrained market your nuclear names price at 13.7×. Keystone's at 11.9× with each $25/MW-day of capacity worth ~$0.45 of EPS and each 1,000 Btu of market heat-rate expansion worth ~$0.60. The discount exists because gas lacks the 24/7-carbon-free contracting story — but front-of-meter deals are already migrating to firm gas. Catalysts: July auction, first gas-fleet data center contract. Downside protection: 60% hedged 2026, 4× levered, buying back 5% a year.</p>`,
    rubric: [
      "Frames against what the PM already owns (relative pitch, not abstract)",
      "Quantified torque: sensitivity per unit of capacity price / heat rate",
      "Explains WHY the discount exists and why it should close (with catalysts)",
      "Includes downside protection — hedges, leverage, capital return",
      "Speakable in 90 seconds"] },
]};

ACADEMY.modules.push({
  id: "thesis", order: 7, icon: "🎤",
  title: "Thesis, Writing & the Process",
  blurb: "Build a falsifiable thesis, survive challenges, write First Takes, answer sales in 60 seconds, and know where every datapoint lives.",
  lessons: [
    { id: "anatomy", title: "Anatomy of an investment thesis", mins: 8, html: L1 },
    { id: "week", title: "The associate's week & earnings season", mins: 8, html: L2 },
    { id: "data", title: "Data sources — terminals & the free stack", mins: 8, html: L3 },
    { id: "defend", title: "Defending under fire", mins: 7, html: L4 },
  ],
  drills: [D1, D2, D3],
  boss: { title: "Client Lunch Grilling", count: 12, time: 20 * 60, pass: 0.75 },
  reference: `
<div class="formula">Thesis = claim (direction·magnitude·horizon) + variant perception + dated catalysts + quantified risks<br>
Print protocol: variance table → quality of beat/miss → guidance mechanics → thesis impact → First Take in 2h<br>
Challenge protocol: restate as a number → locate in model → probability + tripwire → what changes your mind<br>
Free data: EIA 860/923/861 · FERC Form 1 · ISO portals · EPA CEMS · NRC daily · EDGAR FTS · LBNL/Lazard<br>
Bloomberg: DES FA EE/EEO/MODL ANR EQRV HDS DDIS SPLC BI · answer-first, numbers beat adjectives</div>`,
});
})();
