# Interview Bank — 40 Questions with Desk Answers

Grouped by round type. Say answers OUT LOUD; fluency under pressure is the skill being tested. The game's
Superday samples the same territory with randomized numbers.

## A. Accounting walks (screeners — must be reflexive)

1. **Walk me through the three statements.** IS measures profit over a period; BS is the position snapshot
   (A = L + E); CFS converts profit to cash. Links: NI → top of CFS and into retained earnings; ending cash →
   BS; capex → PP&E which D&A bleeds back through the IS.
2. **Depreciation up $10, tax 25% — walk it through.** NI −7.50; CFS: +10 add-back → cash +2.50; BS: PP&E −10,
   cash +2.50, RE −7.50. Balanced. Cash UP because of the tax shield.
3. **Why can a profitable company run out of cash?** Growth traps cash in working capital (AR, inventory) and
   capex; profits are accrual, payroll is cash.
4. **Deferred revenue vs. accounts receivable?** Mirror images: cash before service (liability) vs. service
   before cash (asset). Prepaid compute contracts create the first; utility summer bills the second.
5. **What's EBITDA and what's wrong with it?** Capital-structure-neutral operating proxy; ignores capex,
   working capital and interest — dangerous exactly where assets are huge or short-lived (plants, GPUs).
6. **Cash vs. book taxes?** Accelerated tax depreciation (MACRS) defers cash taxes → deferred tax liability;
   foundation of renewables tax equity.

## B. Valuation (the core round)

7. **EV vs. equity value?** EV = whole operating business (equity + debt + pref + MI − cash); equity is the
   shareholders' slice. Pair EV with pre-interest metrics, equity with post-interest. Never "EV/EPS."
8. **Why subtract cash in EV?** Non-operating; a buyer nets it. (Wallet vs. the $20 inside.)
9. **Walk me through a DCF.** Driver-based UFCF 5–10 yrs → discount at WACC → terminal (Gordon or exit
   multiple, cross-checked) → EV → bridge to equity → per share → sensitivities. Flag TV share of EV.
10. **WACC inputs and where they come from?** CAPM for Re (rf = 10-yr, β from unlevered/relevered peers,
    ERP ~5%); after-tax cost of debt from current yields; target weights at market values.
11. **Higher depreciation life for GPUs — effect on a DCF?** None on cash flows directly (D&A is non-cash);
    but it changes stated EBIT and can hide true replacement capex — adjust capex, not just sympathy.
12. **When is EV/EBITDA the wrong multiple?** Financials, and anywhere capex ≠ optional: short-lived assets
    (neoclouds — use EBITDA − replacement capex), REITs (AFFO), regulated utilities (P/E on allowed returns).
13. **Terminal value is 85% of your EV. Problem?** Yes — extend the window, sanity-check implied exit
    multiple/growth; consider whether the asset even deserves a perpetuity (a 30-yr plant may need a wind-down).
14. **What's a reverse DCF and why use it?** Solve for the assumptions embedded in the market price, then
    debate those. It converts "the stock is cheap" into "the market implies 2.8% terminal growth; here's why
    that's too high/low."
15. **Which is usually highest: DCF, trading comps, precedents?** Precedents (control premium + synergies);
    DCF varies with your assumptions; LBO math often sets a floor (what a sponsor can pay and still clear a hurdle).

## C. Power & energy (sector round)

16. **Why does natural gas set power prices?** Merit-order: gas units are marginal most hours in most US
    markets, so market heat rate × gas = clearing price; low-cost nuclear/renewables collect inframarginal rent.
17. **Spark spread math: power $45, gas $3.50, HR 7,500?** Fuel = 7,500×3.50/1000 = $26.25 → spark = $18.75/MWh.
18. **What's a capacity market and why do auction prints move stocks?** Pay for availability ($/MW-day) set
    years ahead; near-pure-margin revenue repricing an entire accredited fleet at once — instant, bankable EBITDA.
19. **PJM vs. ERCOT in one sentence each.** PJM: energy + capacity markets, data-center epicenter. ERCOT:
    energy-only with scarcity pricing — more volatility, faster interconnection, no capacity check.
20. **Why can solar's value fall as more solar is built?** Cannibalization: correlated midday output crushes
    captured prices and ELCC ratings; model captured-price discounts, not hub averages.
21. **What limits new gas build if prices are high?** Turbine order books sold out for years, EPC/labor,
    interconnection queues — the supply response is delayed, which is why existing fleets re-rated.
22. **Why is transmission a good business?** FERC-regulated formula rates (~9.5–10.5% ROE) on a huge, growing,
    reliability-mandated rate base — a regulated compounder with policy tailwinds.
23. **How does a regulated utility make money?** NI ≈ rate base × equity ratio × allowed ROE. Growth = rate
    base growth, funded partly with new equity — hence the obsession with capex plans, lag and dilution.
24. **What did the nuclear PTC (45U) change?** Put an effective revenue floor (~low-$40s/MWh) under existing
    nuclear: bear case capped, hyperscaler-PPA upside kept — an option-shaped payoff that re-rated the fleet.
25. **Busbar vs. hub PPA — who eats basis?** Busbar: buyer. Hub-settled: the project keeps node-to-hub basis
    risk. "Fully contracted" ≠ fully de-risked; ask where every contract settles.

## D. Data centers & compute (the differentiator round)

26. **Why are data centers priced in MW, not square feet?** Power is the scarce input and the cost driver;
    rent is quoted $/kW of critical IT load per month.
27. **PUE 1.25 — meaning?** Facility draws 1.25 MW per 1.0 MW of IT: 0.25 of cooling/electrical overhead.
    Utility sees facility MW; leases price IT MW.
28. **Data center development math?** Cost ~$9–13M/MW turnkey; NOI = rent × kW × 12 − slippage; target
    yield-on-cost ~9–12% vs. exit caps ~6–7% — the spread capitalized is the developer's profit.
29. **Why do hyperscale leases command low cap rates?** 10–15 yr NNN with IG credits and escalators — a
    corporate bond wearing a building.
30. **GPU cloud unit economics?** Revenue/GPU-yr = $/hr × 8,760 × utilization vs. ~$35–45k all-in capex +
    power/colo opex. Payback vs. contract term vs. competitive life is the whole debate.
31. **Why is a 6-year GPU depreciation life controversial?** Frontier pricing power may last ~2–3 years per
    generation; longer life inflates EBIT without changing cash. Underwrite with contracted coverage of capex
    and harsh re-lease decay, not spot rates.
32. **What's "speed to power"?** Time to energize a site — the binding constraint of the AI build-out.
    Signed interconnection/service agreements carry real scarcity value; queue positions are options.
33. **Biggest risk to the whole AI-power trade?** Demand repricing: efficiency jumps (compute per watt,
    algorithmic gains) or hyperscaler capex digestion. Track signed contracts vs. announcements as the
    skepticism dial — plus political risk on consumer bills.

## E. Project finance & funds

34. **What's DSCR and how does it size debt?** CFADS ÷ debt service. Max DS = CFADS/target; debt = DS ×
    annuity factor. Contracted solar ~1.3×; merchant 1.7–2.5×+.
35. **P50 vs. P90?** Median vs. exceeded-90%-of-years production. Debt sized on downside cases; equity earns
    the gap.
36. **Tax equity flip vs. transferability?** Flip: investor takes ~99% of tax benefits to a target IRR, then
    steps down — monetizes credits AND depreciation, but slow/costly. Transfer: sell credits at ~$0.90–0.95
    cash — fast, partial. Hybrids common.
37. **IRR vs. MOIC — 2.0× in 3 yrs or 3.0× in 8?** 26% vs. ~14.7% IRR — A on speed, B on wealth. Quote both;
    LPs eat DPI.
38. **Standard waterfall?** Return capital → 8% pref → GP catch-up → 80/20. With full catch-up, carry ≈ 20%
    of total profit.

## F. Fit & pitch (prepare, don't improvise)

39. **"Pitch me a stock."** Use the Module 7 template: claim with numbers → variant perception → two dated
    catalysts → valuation with sensitivity → the risk that kills it and your tripwire. 90 seconds. Have one
    long (from your capstone) and one short prepared.
40. **"Why energy/power/compute research?"** Tie the macro (first real load growth in 20 years; compute as
    the marginal buyer of electrons) to your demonstrated work: "I built a rate-case model, a GPU-fleet
    underwrite, and a capstone initiation on [company] — here's what I learned that surprised me…" Evidence
    beats enthusiasm, and "what surprised you" proves the learning was real.
