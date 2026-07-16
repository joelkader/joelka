/* Case Labs — build the model (in Excel or on paper), verify at checkpoints.
   All companies fictional. All checkpoint answers verified against an independent
   Python implementation of each model. */
(function () {

/* ---------------------------------------------------- LAB 1: 3-statement -- */
ACADEMY.cases.push({
  id: "lab1", icon: "🧾", difficulty: "Foundation",
  title: "Three-Statement Build — GridWave Generation",
  blurb: "Build a linked 3-year, three-statement model for a fictional merchant IPP. The balance sheet must balance.",
  brief: `
<p><b>GridWave Generation</b> (fictional) is a merchant power producer. Build 2026E–2028E off the 2025A base.
Recommended: a real Excel sheet with IS → CFS → BS blocks. Convention: interest accrues on <b>beginning-of-year</b>
debt (no circularity). No dividends, buybacks, revolver, or interest income. All $ in millions.</p>
<table>
<tr><th>Assumption</th><th class="num">2026E</th><th class="num">2027E</th><th class="num">2028E</th></tr>
<tr><td>Revenue growth</td><td class="num">+6.0%</td><td class="num">+5.0%</td><td class="num">+4.0%</td></tr>
<tr><td>EBITDA margin</td><td class="num">36.0%</td><td class="num">37.0%</td><td class="num">38.0%</td></tr>
<tr><td>D&amp;A ($M)</td><td class="num">140</td><td class="num">145</td><td class="num">150</td></tr>
<tr><td>Capex ($M)</td><td class="num">180</td><td class="num">170</td><td class="num">160</td></tr>
</table>
<table>
<tr><th>Constants</th><th class="num">Value</th></tr>
<tr><td>2025A revenue</td><td class="num">$1,200.0</td></tr>
<tr><td>Interest rate (on beginning debt)</td><td class="num">6.0%</td></tr>
<tr><td>Mandatory debt amortization</td><td class="num">$75 / yr</td></tr>
<tr><td>Tax rate</td><td class="num">25%</td></tr>
<tr><td>Net working capital</td><td class="num">8.0% of revenue</td></tr>
</table>
<table>
<tr><th>Balance sheet, 12/31/25A</th><th class="num">$M</th></tr>
<tr><td>Cash</td><td class="num">250.0</td></tr>
<tr><td>Net working capital (as one line)</td><td class="num">96.0</td></tr>
<tr><td>Net PP&amp;E</td><td class="num">2,600.0</td></tr>
<tr><td>Debt</td><td class="num">1,500.0</td></tr>
<tr><td>Paid-in capital</td><td class="num">800.0</td></tr>
<tr><td>Retained earnings</td><td class="num">646.0</td></tr>
</table>
<p>Model flow: revenue → EBITDA → (−D&amp;A) EBIT → (−interest) EBT → (−tax) NI → CFO = NI + D&amp;A − ΔNWC →
CFI = −capex → CFF = −75 → roll cash, debt, PP&amp;E (BB + capex − D&amp;A), RE (BB + NI). Then check A = L + E.</p>`,
  steps: [
    { q: "2026E revenue?", ans: 1272.0, tol: 1.5, dp: 1, unit: "$M", hint: "1,200 × 1.06.",
      sol: "1,200 × (1+6%) = <b>1,272.0</b>." },
    { q: "2026E EBITDA?", ans: 457.92, tol: 1.2, dp: 2, unit: "$M", hint: "Margin × revenue.",
      sol: "1,272 × 36% = <b>457.9</b>." },
    { q: "2026E interest expense?", ans: 90.0, tol: 0.5, dp: 1, unit: "$M", hint: "Rate × BEGINNING debt (the 12/31/25 balance).",
      sol: "6% × 1,500 = <b>90.0</b>. Beginning-balance convention avoids the interest↔cash circularity — state your convention in any model." },
    { q: "2026E net income?", ans: 170.94, tol: 1.0, dp: 2, unit: "$M", hint: "EBITDA − D&A − interest, then tax at 25%.",
      sol: "EBIT = 457.9 − 140 = 317.9; EBT = 317.9 − 90 = 227.9; NI = 227.9 × 0.75 = <b>170.9</b>." },
    { q: "2026E increase in net working capital (ΔNWC)?", ans: 5.76, tol: 0.15, dp: 2, unit: "$M", hint: "8% of 2026 revenue minus 8% of 2025 revenue.",
      sol: "8% × (1,272 − 1,200) = <b>5.76</b> — growth quietly consumes cash." },
    { q: "2026E cash flow from operations?", ans: 305.18, tol: 1.5, dp: 2, unit: "$M", hint: "NI + D&A − ΔNWC.",
      sol: "170.9 + 140 − 5.8 = <b>305.2</b>." },
    { q: "Ending cash, 12/31/26E?", ans: 300.18, tol: 1.5, dp: 2, unit: "$M", hint: "Beginning 250 + CFO − capex − debt amortization.",
      sol: "250 + 305.2 − 180 − 75 = <b>300.2</b>." },
    { q: "Total assets, 12/31/26E? (the balance check)", ans: 3041.94, tol: 3, dp: 2, unit: "$M", hint: "Cash + NWC (8% of 2026 revenue) + PP&E (2,600 + 180 − 140). Must equal debt + PIC + RE.",
      sol: "300.2 + 101.8 + 2,640 = <b>3,041.9</b> = 1,425 + 800 + 816.9 ✓. If yours doesn't tie, the break is almost always ΔNWC's sign or the debt roll." },
    { q: "2027E net income?", ans: 197.75, tol: 1.2, dp: 2, unit: "$M", hint: "Interest is now 6% × 1,425 (debt amortized $75).",
      sol: "Rev 1,335.6; EBITDA 494.2; EBIT 349.2; interest 85.5; EBT 263.7; NI = <b>197.8</b>." },
    { q: "Ending cash, 12/31/28E?", ans: 526.19, tol: 3, dp: 2, unit: "$M", hint: "Roll all three years. 2028: NI 222.6, D&A 150, ΔNWC 4.3, capex 160, amort 75.",
      sol: "2027 cash 392.9 → +368.4 (CFO) − 160 − 75 = <b>526.2</b>." },
    { q: "Net PP&E, 12/31/28E?", ans: 2675.0, tol: 2, dp: 1, unit: "$M", hint: "2,600 + Σcapex − ΣD&A.",
      sol: "2,600 + (180+170+160) − (140+145+150) = <b>2,675</b>. Capex ≈ D&A → a mature asset base, barely growing." },
    { q: "Total assets, 12/31/28E? (final balance check)", ans: 3312.32, tol: 4, dp: 2, unit: "$M", hint: "Cash 526.2 + NWC (8% × 1,389.0) + PP&E 2,675. Check vs. 1,275 + 800 + RE 1,237.3.",
      sol: "526.2 + 111.1 + 2,675 = <b>3,312.3</b> = 1,275 + 800 + 1,237.3 ✓ Balanced — the model is closed." },
  ],
  debrief: `
<h3>Full solution</h3>
<div class="tablewrap"><table>
<tr><th>$M</th><th class="num">2026E</th><th class="num">2027E</th><th class="num">2028E</th></tr>
<tr><td>Revenue</td><td class="num">1,272.0</td><td class="num">1,335.6</td><td class="num">1,389.0</td></tr>
<tr><td>EBITDA</td><td class="num">457.9</td><td class="num">494.2</td><td class="num">527.8</td></tr>
<tr><td>EBIT</td><td class="num">317.9</td><td class="num">349.2</td><td class="num">377.8</td></tr>
<tr><td>Interest</td><td class="num">90.0</td><td class="num">85.5</td><td class="num">81.0</td></tr>
<tr><td>Net income</td><td class="num">170.9</td><td class="num">197.8</td><td class="num">222.6</td></tr>
<tr><td>CFO</td><td class="num">305.2</td><td class="num">337.7</td><td class="num">368.4</td></tr>
<tr><td>Ending cash</td><td class="num">300.2</td><td class="num">392.9</td><td class="num">526.2</td></tr>
<tr><td>Ending debt</td><td class="num">1,425.0</td><td class="num">1,350.0</td><td class="num">1,275.0</td></tr>
<tr><td>Total assets = L+E</td><td class="num">3,041.9</td><td class="num">3,164.7</td><td class="num">3,312.3</td></tr>
</table></div>
<h3>What you just proved you can do</h3>
<ul>
<li>The exact skill in the job spec: "build and maintain Excel-based financial models, including income statements,
balance sheets, cash flow statements." The linking discipline (NI → CFO and RE; capex/D&A → PP&E; amort → debt) is
identical at any scale.</li>
<li>Debug order when a BS doesn't tie: (1) ΔNWC sign, (2) debt/interest timing, (3) PP&E roll, (4) RE roll.</li>
<li>Extensions to try in Excel: a revolver with a minimum-cash sweep, interest income on cash, a dividend policy,
and quarterly periodicity — each is one more link in the same chain.</li>
</ul>`,
});

/* ------------------------------------------------------------ LAB 2: DCF -- */
ACADEMY.cases.push({
  id: "lab2", icon: "💸", difficulty: "Core",
  title: "DCF — Meridian Power Holdings",
  blurb: "A full unlevered DCF: five years of UFCF, WACC from scratch, Gordon terminal value, and the verdict vs. the market.",
  brief: `
<p><b>Meridian Power Holdings</b> (fictional IPP). Valuation date 12/31/25; end-of-year discounting; $ in millions.
The stock trades at <b>$28.50</b>.</p>
<table>
<tr><th>Driver</th><th class="num">2026</th><th class="num">2027</th><th class="num">2028</th><th class="num">2029</th><th class="num">2030</th></tr>
<tr><td>Revenue growth (2025A rev = 2,400)</td><td class="num">7%</td><td class="num">6%</td><td class="num">5%</td><td class="num">4%</td><td class="num">3%</td></tr>
<tr><td>EBITDA margin</td><td class="num" colspan="5">40% flat</td></tr>
<tr><td>D&amp;A (% of revenue)</td><td class="num" colspan="5">6%</td></tr>
<tr><td>Capex (% of revenue)</td><td class="num">9%</td><td class="num">8%</td><td class="num">8%</td><td class="num">7%</td><td class="num">7%</td></tr>
<tr><td>ΔNWC</td><td class="num" colspan="5">10% of the CHANGE in revenue</td></tr>
<tr><td>Tax rate</td><td class="num" colspan="5">25% (on EBIT)</td></tr>
</table>
<table>
<tr><th>Capital / bridge</th><th class="num">Value</th></tr>
<tr><td>Risk-free rate / beta / ERP</td><td class="num">4.25% / 1.10 / 5.0%</td></tr>
<tr><td>Target debt weight / pre-tax cost of debt</td><td class="num">40% / 6.25%</td></tr>
<tr><td>Terminal growth (Gordon)</td><td class="num">2.0%</td></tr>
<tr><td>Net debt / minority interest</td><td class="num">3,100 / 150</td></tr>
<tr><td>Diluted shares</td><td class="num">320M</td></tr>
</table>`,
  steps: [
    { q: "Cost of equity (CAPM)? (%)", ans: 9.75, tol: 0.05, dp: 2, unit: "%", hint: "rf + β × ERP.",
      sol: "4.25 + 1.10 × 5.0 = <b>9.75%</b>." },
    { q: "WACC? (%)", ans: 7.725, tol: 0.04, dp: 3, unit: "%", hint: "60% equity at 9.75% + 40% debt at 6.25% after 25% tax.",
      sol: "0.6 × 9.75 + 0.4 × 6.25 × 0.75 = 5.85 + 1.875 = <b>7.725%</b>." },
    { q: "2026 unlevered FCF?", ans: 561.0, tol: 3, dp: 1, unit: "$M", hint: "Rev 2,568 → EBITDA 1,027.2, D&A 154.1. UFCF = EBIT(1−t) + D&A − capex − ΔNWC.",
      sol: "EBIT = 1,027.2 − 154.1 = 873.1; NOPAT = 654.8; − capex 231.1 − ΔNWC 16.8 + D&A 154.1 = <b>561.0</b>." },
    { q: "2030 unlevered FCF?", ans: 741.2, tol: 4, dp: 1, unit: "$M", hint: "Rev 3,061.7. Capex is 7% now; ΔNWC = 10% × (3,061.7 − 2,972.5).",
      sol: "EBITDA 1,224.7; EBIT 1,041.0; NOPAT 780.7; +183.7 − 214.3 − 8.9 = <b>741.2</b>." },
    { q: "PV of the five explicit-year UFCFs (stage 1)?", ans: 2628.3, tol: 20, dp: 1, unit: "$M", hint: "UFCFs: 561.0 / 624.3 / 658.1 / 716.8 / 741.2, discounted at 7.725% for 1–5 years.",
      sol: "Σ UFCF_t / 1.07725^t = <b>2,628.3</b>." },
    { q: "Terminal value at year 5 (Gordon)?", ans: 13205.6, tol: 90, dp: 1, unit: "$M", hint: "741.2 × 1.02 ÷ (7.725% − 2%).",
      sol: "756.0 ÷ 0.05725 = <b>13,205.6</b>." },
    { q: "PV of the terminal value?", ans: 9102.8, tol: 70, dp: 1, unit: "$M", hint: "Discount 5 years at WACC.",
      sol: "13,205.6 ÷ 1.07725⁵ = <b>9,102.8</b>." },
    { q: "Enterprise value?", ans: 11731.1, tol: 90, dp: 1, unit: "$M", hint: "Stage 1 + PV(TV).",
      sol: "2,628.3 + 9,102.8 = <b>11,731.1</b>." },
    { q: "Implied value per share?", ans: 26.50, tol: 0.35, dp: 2, unit: "$/share", hint: "(EV − net debt − MI) ÷ 320M.",
      sol: "(11,731 − 3,100 − 150) ÷ 320 = 8,481 ÷ 320 = <b>$26.50</b>." },
    { q: "What percent of EV comes from the terminal value? (%)", ans: 77.6, tol: 0.8, dp: 1, unit: "%", hint: "PV(TV) ÷ EV.",
      sol: "9,102.8 ÷ 11,731.1 = <b>77.6%</b> — normal-high. Your 'valuation' is mostly the perpetuity assumptions; treat g and WACC with respect." },
  ],
  debrief: `
<h3>The verdict — and the more interesting question</h3>
<p>Your DCF says <b>$26.50</b>; the stock trades at <b>$28.50</b> — the market is ~7% ABOVE your base case. Three
professional responses:</p>
<ol>
<li><b>Reverse-engineer the gap:</b> $28.50 needs ~$9.1B of equity value → EV ~$12.4B → roughly 30–40bps lower WACC,
~2.4% terminal growth, or ~$60M/yr more UFCF. Is there a bull case (data center contracts? capacity repricing?) that
plausibly delivers that? If yes, the market may be right and your base case stale.</li>
<li><b>Sensitivity grid</b> (do this in Excel): WACC 7.2–8.2% × g 1.5–2.5% spans roughly $23–$32 — the honest
statement is a range, not $26.50.</li>
<li><b>Cross-check methods:</b> implied EV/2026 EBITDA here is 11.4× — compare to where IPP comps trade before
trusting either answer.</li>
</ol>
<h3>Skills banked</h3>
<ul>
<li>WACC from raw inputs, driver-based UFCF, Gordon TV + cross-checks, the EV→equity bridge — the complete
"discounted cash flow analysis" requirement, done by hand so no template can intimidate you.</li>
<li>Extensions: mid-year convention (adds ~3–4%), exit-multiple TV, scenario-weighted price decks.</li>
</ul>`,
});

/* ------------------------------------------------------ LAB 3: comp sheet -- */
ACADEMY.cases.push({
  id: "lab3", icon: "📋", difficulty: "Core",
  title: "Comp Sheet Friday — Six Power & Infra Names",
  blurb: "Spread a six-company comp sheet from raw inputs: TSM shares, EVs, multiples, growth, leverage — then read it.",
  brief: `
<p>Your analyst wants the sector comp sheet rebuilt before the morning meeting. All companies fictional; $ in
millions except per-share. Options use the treasury stock method (add only if in the money).</p>
<div class="tablewrap"><table>
<tr><th>Company (all fictional)</th><th class="num">Price</th><th class="num">Basic sh (M)</th><th class="num">Options (M @ strike)</th>
<th class="num">Cash</th><th class="num">Debt</th><th class="num">MI</th><th class="num">EBITDA 26E</th><th class="num">EBITDA 27E</th><th>Per-share metric</th></tr>
<tr><td>Ampera Energy (nuclear IPP)</td><td class="num">142.00</td><td class="num">350</td><td class="num">12 @ $80</td>
<td class="num">1,900</td><td class="num">7,800</td><td class="num">0</td><td class="num">4,100</td><td class="num">4,650</td><td>EPS26 $6.10</td></tr>
<tr><td>Keystone Power (gas IPP)</td><td class="num">118.00</td><td class="num">340</td><td class="num">10 @ $60</td>
<td class="num">1,200</td><td class="num">11,500</td><td class="num">0</td><td class="num">4,300</td><td class="num">4,750</td><td>EPS26 $5.95</td></tr>
<tr><td>Bluewater Generation (IPP + retail)</td><td class="num">54.00</td><td class="num">480</td><td class="num">8 @ $35</td>
<td class="num">800</td><td class="num">9,900</td><td class="num">0</td><td class="num">3,350</td><td class="num">3,600</td><td>EPS26 $3.05</td></tr>
<tr><td>Solstice Renewables (yieldco)</td><td class="num">27.00</td><td class="num">405</td><td class="num">—</td>
<td class="num">600</td><td class="num">8,200</td><td class="num">2,400</td><td class="num">1,950</td><td class="num">2,080</td><td>CAFD26 $2.05</td></tr>
<tr><td>Ironpeak Utilities (regulated)</td><td class="num">88.00</td><td class="num">620</td><td class="num">—</td>
<td class="num">400</td><td class="num">21,000</td><td class="num">0</td><td class="num">6,400</td><td class="num">6,850</td><td>EPS26 $5.35</td></tr>
<tr><td>Nimbus Digital Infra (DC REIT)</td><td class="num">152.00</td><td class="num">330</td><td class="num">6 @ $95</td>
<td class="num">2,100</td><td class="num">17,000</td><td class="num">0</td><td class="num">3,050</td><td class="num">3,500</td><td>AFFO26 $7.10</td></tr>
</table></div>`,
  steps: [
    { q: "Ampera's diluted share count? (M)", ans: 355.24, tol: 0.4, dp: 2, unit: "M shares", hint: "350 + 12 × (1 − 80/142).",
      sol: "Options add 12 × (1 − 0.5634) = 5.24 → <b>355.24M</b>." },
    { q: "Ampera's market cap?", ans: 50444, tol: 90, dp: 0, unit: "$M", hint: "Price × diluted shares.",
      sol: "142 × 355.24 = <b>50,444</b>." },
    { q: "Ampera's enterprise value?", ans: 56344, tol: 110, dp: 0, unit: "$M", hint: "+ debt − cash (no MI or preferred here).",
      sol: "50,444 + 7,800 − 1,900 = <b>56,344</b>." },
    { q: "Ampera EV / 2026E EBITDA? (×)", ans: 13.74, tol: 0.08, dp: 2, unit: "×",
      sol: "56,344 ÷ 4,100 = <b>13.74×</b>." },
    { q: "Keystone EV / 2026E EBITDA? (×)", ans: 11.86, tol: 0.08, dp: 2, unit: "×", hint: "Diluted 344.92M (options ITM: 10 × (1−60/118)); EV = mcap + 11,500 − 1,200.",
      sol: "Mcap 40,700; EV 51,000; ÷ 4,300 = <b>11.86×</b>." },
    { q: "Solstice's enterprise value — including its minority interest?", ans: 20935, tol: 60, dp: 0, unit: "$M", hint: "Mcap (no options) + debt + MI − cash. The MI is the whole point.",
      sol: "27 × 405 = 10,935; + 8,200 + 2,400 − 600 = <b>20,935</b>. Skip the $2.4B MI and the yieldco looks a full turn cheaper than it is — the classic renewables comp bug." },
    { q: "Solstice EV / 2026E EBITDA? (×)", ans: 10.74, tol: 0.07, dp: 2, unit: "×",
      sol: "20,935 ÷ 1,950 = <b>10.74×</b> (with MI). Without MI you'd print 9.51× — wrong, and cheap-looking." },
    { q: "Nimbus P / 2026E AFFO? (×)", ans: 21.41, tol: 0.12, dp: 2, unit: "×", hint: "Price ÷ AFFO per share — a PER-SHARE (equity) multiple.",
      sol: "152 ÷ 7.10 = <b>21.41×</b>. Note the pairing: AFFO is an equity metric, so it takes price, not EV." },
    { q: "Bluewater's net leverage (net debt / 2026E EBITDA)? (×)", ans: 2.72, tol: 0.05, dp: 2, unit: "×",
      sol: "(9,900 − 800) ÷ 3,350 = <b>2.72×</b>." },
  ],
  debrief: `
<h3>The finished sheet</h3>
<div class="tablewrap"><table>
<tr><th></th><th class="num">EV ($M)</th><th class="num">EV/26E</th><th class="num">EV/27E</th><th class="num">EBITDA gr.</th><th class="num">P/metric</th><th class="num">Net lev.</th></tr>
<tr><td>Ampera</td><td class="num">56,344</td><td class="num">13.74×</td><td class="num">12.12×</td><td class="num">13.4%</td><td class="num">23.3× P/E</td><td class="num">1.44×</td></tr>
<tr><td>Keystone</td><td class="num">51,000</td><td class="num">11.86×</td><td class="num">10.74×</td><td class="num">10.5%</td><td class="num">19.8× P/E</td><td class="num">2.40×</td></tr>
<tr><td>Bluewater</td><td class="num">35,172</td><td class="num">10.50×</td><td class="num">9.77×</td><td class="num">7.5%</td><td class="num">17.7× P/E</td><td class="num">2.72×</td></tr>
<tr><td>Solstice</td><td class="num">20,935</td><td class="num">10.74×</td><td class="num">10.06×</td><td class="num">6.7%</td><td class="num">13.2× P/CAFD</td><td class="num">3.90×</td></tr>
<tr><td>Ironpeak</td><td class="num">75,160</td><td class="num">11.74×</td><td class="num">10.97×</td><td class="num">7.0%</td><td class="num">16.5× P/E</td><td class="num">3.22×</td></tr>
<tr><td>Nimbus</td><td class="num">65,402</td><td class="num">21.44×</td><td class="num">18.69×</td><td class="num">14.8%</td><td class="num">21.4× P/AFFO</td><td class="num">4.89×</td></tr>
</table></div>
<h3>Now READ it (how you'd brief the analyst)</h3>
<ul>
<li><b>Ampera's 2-turn premium to Keystone</b> maps to growth (13.4% vs 10.5%), lower leverage (1.4× vs 2.4×), and the
nuclear/data-center contracting narrative. Fair question for the desk: is 2 turns the right price for that? That's a
research note, not a spreadsheet cell.</li>
<li><b>Bluewater screens cheapest</b> among IPPs on every metric — either the retail segment deserves its discount
(margin volatility) or it's the value pick. The comp sheet raises the question; the model answers it.</li>
<li><b>Solstice</b> only comps correctly with its MI included; on P/CAFD (13.2×) it's priced for its 6.7% growth.</li>
<li><b>Ironpeak</b> (utility) doesn't belong on EV/EBITDA next to IPPs for stock selection — it trades on P/E (16.5×)
vs. its rate-base growth; it's here for context.</li>
<li><b>Nimbus</b> at 21.4× EV/EBITDA isn't 'expensive vs. IPPs' — it's a different animal (REIT: contracted rent,
development pipeline, 4.9× leverage against long leases). Different multiple regimes, one sheet.</li>
</ul>`,
});

/* ----------------------------------------------- LAB 4: DC development -- */
ACADEMY.cases.push({
  id: "lab4", icon: "🏗️", difficulty: "Core",
  title: "Data Center Development — Fort Nelson Campus",
  blurb: "Underwrite a 48 MW hyperscale development: cost, NOI, yield-on-cost, exit value, levered returns, cap-rate risk.",
  brief: `
<p><b>Bluebird Digital</b> (fictional developer) brings you a 48 MW critical-IT campus, fully pre-leased to a single
investment-grade hyperscaler on a 15-year NNN lease. Underwrite it. $ in millions unless noted.</p>
<table>
<tr><th>Development budget</th><th class="num">Amount</th></tr>
<tr><td>Land &amp; entitlements</td><td class="num">$30.0</td></tr>
<tr><td>Improvements (shell + fit-out)</td><td class="num">$10.5M per MW × 48</td></tr>
<tr><td>Development fee &amp; soft costs</td><td class="num">$21.0</td></tr>
<tr><td>Financing costs (IDC)</td><td class="num">$20.0</td></tr>
</table>
<table>
<tr><th>Lease & operations</th><th class="num">Value</th></tr>
<tr><td>Rent (on critical IT kW)</td><td class="num">$110 / kW / month, NNN</td></tr>
<tr><td>Non-recovered landlord costs</td><td class="num">$2.8 / yr</td></tr>
<tr><td>PUE</td><td class="num">1.30 (tenant pays all power)</td></tr>
<tr><td>Stabilized exit cap rate</td><td class="num">6.25%</td></tr>
<tr><td>Construction loan</td><td class="num">60% of total cost</td></tr>
<tr><td>Timeline to stabilized sale</td><td class="num">~2.5 years</td></tr>
</table>`,
  steps: [
    { q: "Total development cost?", ans: 575, tol: 2, dp: 0, unit: "$M", hint: "Land + 10.5 × 48 + soft + IDC.",
      sol: "30 + 504 + 21 + 20 = <b>575</b> (≈ $12.0M/MW all-in — sanity check vs. the $9–13M/MW range)." },
    { q: "Gross annual rent at full occupancy?", ans: 63.36, tol: 0.4, dp: 2, unit: "$M", hint: "48,000 kW × $110 × 12.",
      sol: "48,000 × 110 × 12 = <b>$63.36M</b>." },
    { q: "Stabilized NOI?", ans: 60.56, tol: 0.4, dp: 2, unit: "$M", hint: "NNN: tenant pays opex & power; subtract only the non-recovered $2.8M.",
      sol: "63.36 − 2.8 = <b>60.56</b>." },
    { q: "Yield on cost? (%)", ans: 10.53, tol: 0.1, dp: 2, unit: "%",
      sol: "60.56 ÷ 575 = <b>10.53%</b> — inside the 9–12% development target band." },
    { q: "Stabilized value at a 6.25% cap rate?", ans: 968.96, tol: 7, dp: 2, unit: "$M",
      sol: "60.56 ÷ 0.0625 = <b>969.0</b>." },
    { q: "Development profit (value − cost)?", ans: 393.96, tol: 7, dp: 2, unit: "$M",
      sol: "969.0 − 575 = <b>394.0</b> — the yield-on-cost vs. cap-rate spread (10.5% vs 6.25%), capitalized. This spread IS the development business." },
    { q: "Facility power draw at PUE 1.30 — the MW the utility must actually deliver?", ans: 62.4, tol: 0.3, dp: 1, unit: "MW",
      sol: "48 × 1.30 = <b>62.4 MW</b>. Interconnection ask ≈ 65 MW with headroom. If the utility can only deliver in 2029, none of the other numbers exist." },
    { q: "Sponsor equity with a 60% loan-to-cost construction loan?", ans: 230, tol: 2, dp: 0, unit: "$M",
      sol: "40% × 575 = <b>230</b>." },
    { q: "Levered MOIC if sold at stabilization (net proceeds = value − loan)? (×)", ans: 2.71, tol: 0.04, dp: 2, unit: "×", hint: "(969 − 345) ÷ 230.",
      sol: "624 ÷ 230 = <b>2.71×</b> in ~2.5 years ≈ 49% IRR. Development pays for entitlement + construction + lease-up risk — pre-leased shells de-risk most of it, which is why everyone chased this trade." },
    { q: "Stress: value if exit cap rates widen to 7.25%?", ans: 835.31, tol: 7, dp: 2, unit: "$M",
      sol: "60.56 ÷ 0.0725 = <b>835.3</b> — profit drops from $394M to $260M on a 100bp cap move. Cap-rate (rate) risk is the silent variable in every development pro forma." },
  ],
  debrief: `
<h3>The underwrite on one card</h3>
<div class="tablewrap"><table>
<tr><td>Cost</td><td class="num">$575M ($12.0M/MW)</td><td>NOI</td><td class="num">$60.6M</td></tr>
<tr><td>Yield on cost</td><td class="num">10.53%</td><td>Exit cap</td><td class="num">6.25%</td></tr>
<tr><td>Value / profit</td><td class="num">$969M / $394M</td><td>Levered MOIC</td><td class="num">2.71× (~49% IRR)</td></tr>
<tr><td>Cap +100bp</td><td class="num">value $835M</td><td>Utility ask</td><td class="num">~65 MW</td></tr>
</table></div>
<h3>What would an investment committee push on?</h3>
<ul>
<li><b>Rent durability:</b> $110/kW-mo is a market print — what does the market look like at the 15-year renewal? (Residual value question.)</li>
<li><b>Cost certainty:</b> is the $10.5M/MW under a fixed-price EPC? Equipment (gensets, switchgear, chillers) lead times covered?</li>
<li><b>Power:</b> is the 65 MW under a SIGNED utility agreement with a date, or a study? This is the deal, not a detail.</li>
<li><b>Single-tenant risk:</b> IG credit today, but one lease = binary re-leasing risk in year 15; metro Tier III shells re-lease, remote training barns may not.</li>
<li><b>Exit assumption:</b> the 2.71× needs a 6.25% cap buyer at stabilization — who is it (core fund, REIT), and what if rates move first?</li>
</ul>`,
});

/* --------------------------------------------------- LAB 5: neocloud -- */
ACADEMY.cases.push({
  id: "lab5", icon: "🖥️", difficulty: "Advanced",
  title: "Neocloud Underwrite — TensorForge Compute",
  blurb: "A 10,000-GPU cluster: revenue build, EBITDA, payback vs. contract, debt service, and the brutal renewal scenario.",
  brief: `
<p><b>TensorForge Compute</b> (fictional GPU cloud) wants growth capital for a 10,000-GPU H100-class cluster,
deployed in leased colo. Build the unit economics. $ in millions unless noted; year-1 run-rate.</p>
<table>
<tr><th>Fleet & contracts</th><th class="num">Value</th></tr>
<tr><td>GPUs</td><td class="num">10,000</td></tr>
<tr><td>All-in capex (servers, network, storage, install)</td><td class="num">$38,000 / GPU</td></tr>
<tr><td>Contracted: 3-yr take-or-pay (100% billed)</td><td class="num">7,000 GPUs @ $2.10/GPU-hr</td></tr>
<tr><td>On-demand</td><td class="num">3,000 GPUs @ $2.90/GPU-hr, 45% utilization</td></tr>
</table>
<table>
<tr><th>Cost structure</th><th class="num">Value</th></tr>
<tr><td>IT power draw</td><td class="num">0.85 kW per GPU</td></tr>
<tr><td>Colo all-in rate (space+power+cooling)</td><td class="num">$145 / kW-IT / month</td></tr>
<tr><td>Other fixed opex (staff, software, support)</td><td class="num">$16.0 / yr</td></tr>
<tr><td>S&amp;M + G&amp;A</td><td class="num">8% of revenue</td></tr>
<tr><td>Depreciation</td><td class="num">5-year straight line</td></tr>
<tr><td>Debt: GPU/contract-backed facility</td><td class="num">65% advance rate, 10.5% interest-only</td></tr>
</table>
<p>A year has 8,760 hours. Take-or-pay bills all hours regardless of usage.</p>`,
  steps: [
    { q: "Total fleet capex?", ans: 380, tol: 1, dp: 0, unit: "$M",
      sol: "10,000 × $38k = <b>$380M</b>." },
    { q: "Contracted revenue (year 1)?", ans: 128.77, tol: 1, dp: 2, unit: "$M", hint: "7,000 × 8,760 × 2.10 — take-or-pay means 100% of hours billed.",
      sol: "7,000 × 8,760 × $2.10 = <b>$128.8M</b>." },
    { q: "On-demand revenue?", ans: 34.30, tol: 0.4, dp: 2, unit: "$M", hint: "Only 45% of hours monetize.",
      sol: "3,000 × 8,760 × 45% × $2.90 = <b>$34.3M</b>." },
    { q: "Total revenue?", ans: 163.07, tol: 1.2, dp: 2, unit: "$M",
      sol: "128.8 + 34.3 = <b>$163.1M</b>." },
    { q: "Annual colo cost?", ans: 14.79, tol: 0.2, dp: 2, unit: "$M", hint: "10,000 × 0.85 kW = 8,500 kW IT × $145 × 12.",
      sol: "8,500 × 145 × 12 = <b>$14.8M</b>." },
    { q: "EBITDA?", ans: 119.23, tol: 1.2, dp: 2, unit: "$M", hint: "Revenue − colo − 16 fixed − 8% of revenue.",
      sol: "163.1 − 14.8 − 16.0 − 13.0 = <b>$119.2M</b> (73% margin — checks against the 60–75% neocloud band)." },
    { q: "EBITDA margin? (%)", ans: 73.1, tol: 0.5, dp: 1, unit: "%",
      sol: "119.2 ÷ 163.1 = <b>73.1%</b>. Fat — until you remember the assets die young. Next steps make that concrete." },
    { q: "Annual depreciation?", ans: 76, tol: 0.5, dp: 0, unit: "$M",
      sol: "380 ÷ 5 = <b>$76M</b> — nearly two-thirds of that beautiful EBITDA. EBIT = $43.2M. Depreciation is the business model's tell." },
    { q: "Annual interest on the GPU-backed facility?", ans: 25.93, tol: 0.3, dp: 2, unit: "$M", hint: "65% × 380 at 10.5%.",
      sol: "247 × 10.5% = <b>$25.9M</b>. EBT is down to ~$17M — the equity is a thin slice of a leveraged, fast-depreciating machine." },
    { q: "Simple payback on capex (capex ÷ EBITDA), in years?", ans: 3.19, tol: 0.05, dp: 2, unit: "years",
      sol: "380 ÷ 119.2 = <b>3.19 yrs</b> vs. a 3.0-yr contract: the contract does NOT quite pay the fleet back. Cumulative 3-yr EBITDA ≈ $358M vs. $380M capex → ~94% coverage. Everything past year 3 is residual-value risk." },
    { q: "Renewal scenario, year 4: ALL 10,000 GPUs re-lease at $1.20/GPU-hr at 60% utilization; S&M falls to 5% of revenue; colo and fixed opex unchanged. New EBITDA?", ans: 29.13, tol: 0.7, dp: 2, unit: "$M", hint: "Revenue = 10,000 × 8,760 × 0.60 × 1.20.",
      sol: "Revenue $63.1M − 14.8 − 16.0 − 3.2 = <b>$29.1M</b> — barely above the $25.9M interest bill, before ANY principal. This is the 'GPU depreciation is real' lesson in one number." },
  ],
  debrief: `
<h3>The underwrite in four numbers</h3>
<div class="tablewrap"><table>
<tr><td>Year-1 EBITDA / margin</td><td class="num">$119M / 73%</td><td>Payback vs. contract</td><td class="num">3.19 yrs vs. 3.0 yrs</td></tr>
<tr><td>Contracted capex coverage</td><td class="num">~94%</td><td>Year-4 renewal EBITDA</td><td class="num">$29M vs. $26M interest</td></tr>
</table></div>
<h3>How an analyst frames this (both sides, with numbers)</h3>
<ul>
<li><b>Bull:</b> 94% of capex is covered by credit-worthy take-or-pay before any residual value; even the harsh
renewal scenario (−43% price, 60% util) covers cash interest; and any year-4 pricing above $1.20 is equity upside.
Ask for: a slightly longer contract (3.5 yrs = full coverage), amortizing debt inside the contract term.</li>
<li><b>Bear:</b> margins are an artifact of a 5-year depreciation life on a ~3-year competitive asset; on-demand
(21% of revenue) decays with every supply wave; one contract = concentration; and 65% leverage at 10.5% means the
equity is a call option that expires when the contract does.</li>
<li><b>The professional questions:</b> Who is the counterparty and can they pay in year 3? What are actual
historical re-lease rates for N-1 chips? Is the debt amortizing or bullet? What's the collateral release mechanism?
Underwrite the CONTRACT and the STRUCTURE — the GPUs are just the excuse.</li>
</ul>`,
});

/* ----------------------------------------------- LAB 6: project finance -- */
ACADEMY.cases.push({
  id: "lab6", icon: "☀️", difficulty: "Advanced",
  title: "Project Finance — Sundance Solar + Storage",
  blurb: "Size the debt (P50/P90, DSCR), monetize the ITC via transfer, back into sponsor equity and cash yield.",
  brief: `
<p><b>Sundance Energy Partners</b> (fictional sponsor) is financing a 200 MW-ac solar + 50 MW / 200 MWh battery
project in West Texas. You're the analyst on the deal. $ in millions unless noted.</p>
<table>
<tr><th>Project & revenue</th><th class="num">Value</th></tr>
<tr><td>Solar capacity / P50 net capacity factor</td><td class="num">200 MW-ac / 29%</td></tr>
<tr><td>P90 production</td><td class="num">93% of P50</td></tr>
<tr><td>Solar PPA (15-yr, hub-settled)</td><td class="num">$45.00 / MWh on all P50 volumes</td></tr>
<tr><td>Battery tolling agreement (15-yr)</td><td class="num">$8.50 / kW-month on 50,000 kW</td></tr>
<tr><td>Total operating costs (O&amp;M, insurance, land, mgmt, augmentation)</td><td class="num">$8.8 / yr</td></tr>
</table>
<table>
<tr><th>Capital</th><th class="num">Value</th></tr>
<tr><td>Total capex (EPC + interconnection + owner costs)</td><td class="num">$270.0</td></tr>
<tr><td>Debt sizing</td><td class="num">min(1.30× DSCR on P50, 1.20× on P90)</td></tr>
<tr><td>Loan: fully amortizing</td><td class="num">6.75%, 15 years (annuity factor 9.2535)</td></tr>
<tr><td>ITC: 30% base + 10% energy-community adder</td><td class="num">40% × eligible basis (95% of capex)</td></tr>
<tr><td>Credit transfer price</td><td class="num">$0.925 per $1.00, cash at COD</td></tr>
</table>
<p>Simplifications: flat annual CFADS (ignore degradation/escalators); treat ITC cash as reducing the equity check.</p>`,
  steps: [
    { q: "P50 annual solar generation? (MWh)", ans: 508080, tol: 3000, dp: 0, unit: "MWh", hint: "200 × 8,760 × 29%.",
      sol: "200 × 8,760 × 0.29 = <b>508,080 MWh</b>." },
    { q: "Annual solar PPA revenue?", ans: 22.86, tol: 0.25, dp: 2, unit: "$M",
      sol: "508,080 × $45 = <b>$22.86M</b>." },
    { q: "Annual battery tolling revenue?", ans: 5.10, tol: 0.08, dp: 2, unit: "$M", hint: "50,000 kW × 8.50 × 12.",
      sol: "50,000 × $8.50 × 12 = <b>$5.10M</b> — capacity payments for availability, no merchant risk on the battery." },
    { q: "CFADS at P50?", ans: 19.16, tol: 0.25, dp: 2, unit: "$M",
      sol: "22.86 + 5.10 − 8.80 = <b>$19.16M</b>." },
    { q: "CFADS at P90? (solar revenue at 93%; toll and opex unchanged)", ans: 17.56, tol: 0.25, dp: 2, unit: "$M",
      sol: "22.86 × 0.93 + 5.10 − 8.80 = <b>$17.56M</b>." },
    { q: "Maximum annual debt service? (the binding constraint)", ans: 14.64, tol: 0.15, dp: 2, unit: "$M", hint: "min(19.16/1.30, 17.56/1.20).",
      sol: "P50 test: 14.74; P90 test: <b>14.64</b> ← binds. Downside cases size the debt; the P50–P90 gap belongs to equity." },
    { q: "Debt raised? (DS × annuity factor 9.2535)", ans: 135.4, tol: 1.5, dp: 1, unit: "$M",
      sol: "14.64 × 9.2535 = <b>$135.4M</b> (~50% gearing — typical for contracted solar+storage sized this way)." },
    { q: "Cash from selling the ITC?", ans: 94.91, tol: 1, dp: 2, unit: "$M", hint: "40% × (95% × 270) × 0.925.",
      sol: "Credit = 40% × 256.5 = $102.6M; × $0.925 = <b>$94.9M</b> at COD. Transferability in action." },
    { q: "Sponsor equity check?", ans: 39.66, tol: 1.2, dp: 2, unit: "$M", hint: "Capex − debt − ITC cash.",
      sol: "270 − 135.4 − 94.9 = <b>$39.7M</b> — under 15% of capex. Tax credits + contracted debt do the heavy lifting; that's the modern renewables capital stack." },
    { q: "Year-1 sponsor cash-on-cash yield? (%)", ans: 11.4, tol: 0.4, dp: 1, unit: "%", hint: "(CFADS P50 − debt service) ÷ equity.",
      sol: "(19.16 − 14.64) ÷ 39.66 = 4.53/39.66 = <b>11.4%</b>. With the 10-year merchant tail (post-PPA years 16–25), full-life sponsor IRR ≈ 12%." },
  ],
  debrief: `
<h3>Sources & uses (the one-slide version)</h3>
<div class="tablewrap"><table>
<tr><th>Sources</th><th class="num">$M</th><th>Uses</th><th class="num">$M</th></tr>
<tr><td>Term debt (P90-sized)</td><td class="num">135.4</td><td>Total capex</td><td class="num">270.0</td></tr>
<tr><td>ITC transfer proceeds</td><td class="num">94.9</td><td></td><td></td></tr>
<tr><td>Sponsor equity</td><td class="num">39.7</td><td></td><td></td></tr>
</table></div>
<h3>Deal-desk observations</h3>
<ul>
<li><b>The P90 test bound.</b> When the downside case sizes the debt, resource risk is priced by lenders and equity
keeps the average-year upside — this is DSCR mechanics doing exactly its job.</li>
<li><b>Where the risk actually hides:</b> the PPA is HUB-settled — the project keeps basis risk between its West
Texas node and the hub (congested solar zones can see wide, growing basis). A busbar PPA would shift that to the
buyer at a lower price. This nuance is a real interview differentiator.</li>
<li><b>Policy sensitivity:</b> at a 30% ITC (no adder), equity jumps to ~$63M and cash-on-cash falls to ~7% — run
credits as scenarios, not constants.</li>
<li><b>Merchant tail:</b> years 16–25 assumed ~$9M/yr — cheap optionality in the base case, the first thing an IC
will zero out in the downside.</li>
<li>Extensions in Excel: sculpted amortization on a degrading production profile, a DSRA, and P99 winter stress for
the battery augmentation reserve.</li>
</ul>`,
});

/* -------------------------------------------------- LAB 7: rate case -- */
ACADEMY.cases.push({
  id: "lab7", icon: "🏛️", difficulty: "Core",
  title: "Utility Rate Case — Prairie State Electric",
  blurb: "Build a regulated revenue requirement: return on rate base, tax gross-up, EPS power, and the customer bill.",
  brief: `
<p><b>Prairie State Electric</b> (fictional regulated utility) files a rate case. Reconstruct the revenue
requirement and what it means for earnings and customers. $ in millions unless noted.</p>
<table>
<tr><th>Regulatory inputs</th><th class="num">Value</th></tr>
<tr><td>Rate base</td><td class="num">$8,000</td></tr>
<tr><td>Authorized capital structure</td><td class="num">52% equity / 48% debt</td></tr>
<tr><td>Allowed ROE</td><td class="num">9.6%</td></tr>
<tr><td>Embedded cost of debt</td><td class="num">4.8%</td></tr>
<tr><td>Tax rate</td><td class="num">25%</td></tr>
<tr><td>O&amp;M expense</td><td class="num">$1,150</td></tr>
<tr><td>Depreciation</td><td class="num">$480</td></tr>
<tr><td>Property &amp; other taxes</td><td class="num">$210</td></tr>
<tr><td>Diluted shares</td><td class="num">180M</td></tr>
<tr><td>Annual retail sales</td><td class="num">32,000 GWh</td></tr>
</table>
<p>Revenue requirement = O&amp;M + depreciation + other taxes + return on rate base + income taxes. Income taxes
gross up the EQUITY return only: tax = equity return × t/(1−t). (Debt interest is deductible, so it needs no gross-up.)</p>`,
  steps: [
    { q: "Allowed return on the equity layer (= regulated net income)?", ans: 399.36, tol: 2, dp: 2, unit: "$M", hint: "Rate base × 52% × 9.6%.",
      sol: "8,000 × 0.52 × 0.096 = <b>$399.4M</b>. This IS the utility's earnings engine: rate base × equity ratio × ROE." },
    { q: "Return on the debt layer?", ans: 184.32, tol: 1.5, dp: 2, unit: "$M",
      sol: "8,000 × 0.48 × 0.048 = <b>$184.3M</b> — recovered in rates, passed to bondholders." },
    { q: "Income tax allowance (gross-up on the equity return)?", ans: 133.12, tol: 1.5, dp: 2, unit: "$M", hint: "399.36 × 0.25/0.75.",
      sol: "399.4 × ⅓ = <b>$133.1M</b> — customers pay the taxes on the utility's profit; that's how regulated pricing works." },
    { q: "Total revenue requirement?", ans: 2556.8, tol: 8, dp: 1, unit: "$M", hint: "1,150 + 480 + 210 + both returns + tax allowance.",
      sol: "1,150 + 480 + 210 + 399.4 + 184.3 + 133.1 = <b>$2,556.8M</b>." },
    { q: "EPS if Prairie State earns exactly its allowed return?", ans: 2.22, tol: 0.03, dp: 2, unit: "$/share",
      sol: "399.4 ÷ 180 = <b>$2.22</b>. (Real utilities under- or over-earn vs. allowed — 'earned vs. allowed ROE' is a core utilities-desk metric.)" },
    { q: "The utility adds $600M of rate base next year (grid hardening + data-center interconnections). Incremental net income?", ans: 29.95, tol: 0.5, dp: 2, unit: "$M", hint: "New rate base × equity ratio × ROE.",
      sol: "600 × 0.52 × 0.096 = <b>$29.95M</b>." },
    { q: "Implied EPS growth from that capex (ignoring new shares)? (%)", ans: 7.5, tol: 0.2, dp: 1, unit: "%",
      sol: "29.95 ÷ 399.4 = <b>7.5%</b>. Rate base growth ≈ EPS growth — THE utility investment thesis. (Funding half the equity layer with new shares dilutes this toward 5–6% — why utilities' equity needs matter so much.)" },
    { q: "System average rate customers pay? (¢/kWh)", ans: 7.99, tol: 0.1, dp: 2, unit: "¢/kWh", hint: "Revenue requirement ÷ 32,000 GWh, converted.",
      sol: "2,556.8M ÷ 32,000 GWh = $79.9/MWh = <b>7.99¢/kWh</b> (energy portion of the bill)." },
    { q: "Monthly bill for a home using 850 kWh?", ans: 67.91, tol: 0.8, dp: 2, unit: "$",
      sol: "850 × 7.99¢ = <b>$67.91</b>. Every capex program lands here — which is why load growth is politically double-edged: more rate base spread over more kWh can LOWER rates… if the data centers pay their share. That sentence is half of current utility regulation debates." },
  ],
  debrief: `
<h3>The regulated model on one card</h3>
<div class="tablewrap"><table>
<tr><td>Net income = RB × eq% × ROE</td><td class="num">$399.4M ($2.22/sh)</td></tr>
<tr><td>Revenue requirement</td><td class="num">$2,556.8M (7.99¢/kWh)</td></tr>
<tr><td>+$600M rate base</td><td class="num">+$30.0M NI → +7.5% EPS</td></tr>
</table></div>
<h3>Why this matters for every seat you're targeting</h3>
<ul>
<li><b>Sell-side utilities coverage</b> is this model + regulatory calendar + earned-vs-allowed tracking + equity
needs. You can now read any utility's capex slide and translate it to EPS growth in your head: ΔRB × ~52% × ~9.5%.</li>
<li><b>The load-growth kicker:</b> data center demand raises capex (wires, substations) AND spreads fixed costs over
more kWh. Bulls say rates fall while EPS compounds; skeptics ask who bears the risk if the load doesn't show up.
Large-load tariffs with minimum takes are the regulatory answer being negotiated market by market.</li>
<li><b>Infra/PE angle:</b> regulated-like structures (formula rates, revenue caps) are why funds pay premium
multiples for transmission and distribution platforms — bond-like compounding with inflation linkage.</li>
</ul>`,
});
})();
