# Excel Labs — Specs, Conventions & Check Figures

The in-game labs give you checkpoint validation; this file is the Excel-side companion: how to build the
workbooks like a professional, plus **full solution tables** so you can verify every line offline.

## Excel craft (non-negotiable desk conventions)

- **Inputs blue, formulas black**, links to other sheets green. One assumptions block at the top; **no numbers
  typed inside formulas** — ever. `=D12*(1+$D$5)` yes; `=D12*1.06` no.
- Years across columns, one column per period, same column = same year on every sheet.
- Build **error checks**: a balance-sheet check row (`=assets - liabs - equity`, formatted to scream when ≠0),
  and a sources=uses check in deal models. Sum your checks into one "model OK?" cell.
- Keyboard first: navigate with Ctrl+arrows, anchor with F4, trace with Ctrl+`[`. Speed is credibility in a
  live setting.
- **Sensitivities with Data Tables** (What-If Analysis → Data Table): every valuation gets a WACC×g or
  cap-rate×rent grid.
- Scenario switches: a single cell (1/2/3) driving `INDEX()` or `CHOOSE()` across assumption sets — base /
  downside / upside. This is "formulate models relating constants, variables, alternatives" from the job spec,
  operationalized.
- Label units on every row (`$M`, `$/kW-mo`, `MWh`). Half of real model bugs are unit bugs.
- Functions that come up in interviews/tests: `XNPV/XIRR` (dated flows), `INDEX/MATCH` (never `VLOOKUP` in a
  model you respect), `SUMPRODUCT`, `EOMONTH`, `IFERROR` (sparingly), Data Tables, `NPV` vs. discounting manually
  (know why manual is safer: NPV assumes end-of-period, period-1 start).

---

## Lab 1 — GridWave Generation (three-statement model)

Assumptions: in-game Lab 1 brief. Convention: interest on beginning-of-year debt; tax 25%; NWC = 8% of revenue.

**Full check figures ($M):**

| Line | 2026E | 2027E | 2028E |
|---|---:|---:|---:|
| Revenue | 1,272.00 | 1,335.60 | 1,389.02 |
| EBITDA | 457.92 | 494.17 | 527.83 |
| D&A | 140.00 | 145.00 | 150.00 |
| EBIT | 317.92 | 349.17 | 377.83 |
| Interest | 90.00 | 85.50 | 81.00 |
| Pre-tax income | 227.92 | 263.67 | 296.83 |
| Taxes (25%) | 56.98 | 65.92 | 74.21 |
| **Net income** | **170.94** | **197.75** | **222.62** |
| ΔNWC | 5.76 | 5.09 | 4.27 |
| CFO | 305.18 | 337.67 | 368.35 |
| Capex (CFI) | (180.00) | (170.00) | (160.00) |
| Debt amortization (CFF) | (75.00) | (75.00) | (75.00) |
| Δ Cash | 50.18 | 92.67 | 133.35 |
| **Ending cash** | **300.18** | **392.85** | **526.19** |
| Ending debt | 1,425.00 | 1,350.00 | 1,275.00 |
| Net PP&E | 2,640.00 | 2,665.00 | 2,675.00 |
| NWC balance | 101.76 | 106.85 | 111.12 |
| Retained earnings | 816.94 | 1,014.69 | 1,237.32 |
| **Total assets = L+E** | **3,041.94** | **3,164.69** | **3,312.32** |

**Extensions (do at least two):**
1. Revolver: minimum cash of $150M; if cash would fall below it, draw; if above with revolver outstanding, repay.
2. Interest income at 3.0% on beginning cash (watch: it flows to pre-tax income).
3. Dividend switch: 30% payout of NI — trace it through RE and cash.
4. Quarterly version of 2026 (seasonality: 20/26/32/22% of revenue).

## Lab 2 — Meridian Power (DCF)

Assumptions: in-game Lab 2 brief. WACC = 7.725%, Gordon g = 2.0%, end-of-year discounting.

**UFCF build ($M):**

| Line | 2026 | 2027 | 2028 | 2029 | 2030 |
|---|---:|---:|---:|---:|---:|
| Revenue | 2,568.00 | 2,722.08 | 2,858.18 | 2,972.51 | 3,061.69 |
| EBITDA (40%) | 1,027.20 | 1,088.83 | 1,143.27 | 1,189.00 | 1,224.67 |
| D&A (6% rev) | 154.08 | 163.32 | 171.49 | 178.35 | 183.70 |
| EBIT | 873.12 | 925.51 | 971.78 | 1,010.65 | 1,040.97 |
| NOPAT (75%) | 654.84 | 694.13 | 728.84 | 757.99 | 780.73 |
| Capex | (231.12) | (217.77) | (228.65) | (208.08) | (214.32) |
| ΔNWC | (16.80) | (15.41) | (13.61) | (11.43) | (8.92) |
| **UFCF** | **561.00** | **624.28** | **658.06** | **716.83** | **741.20** |

PV(stage 1) **2,628.34** · TV **13,205.58** · PV(TV) **9,102.80** · EV **11,731.14** · equity **8,481.14** ·
**$26.50/share** vs. $28.50 market (−7%) · TV = 77.6% of EV · implied EV/2026E EBITDA 11.42×.

**Extensions:** mid-year convention (value rises ~3.8%); exit-multiple TV at 9.5× terminal EBITDA (compare!);
5×5 Data Table on WACC (7.2–8.2%) × g (1.5–2.5%); a reverse-DCF cell: what g makes value = $28.50?

## Lab 6 — Sundance Solar + Storage (project finance)

Assumptions: in-game Lab 6 brief.

**Check figures:** P50 generation 508,080 MWh · solar revenue $22.86M · toll $5.10M · CFADS P50 $19.16M /
P90 $17.56M · max debt service $14.64M (P90 test binds) · debt $135.4M (AF 9.2535) · ITC cash $94.91M ·
sponsor equity $39.66M · year-1 cash-on-cash 11.4% · ~12% 25-yr sponsor IRR with a $9M/yr merchant tail
(years 16–25) — build the full annual flow ribbon and check with `IRR()`.

**Extensions:** amortization schedule with constant payment $14.64M (interest = 6.75% × opening balance;
confirm the loan retires in year 15); ITC at 30% (no adder) scenario; P99 = 88% of P50 stress — does the
DSCR stay above 1.0×?

## Labs 3, 4, 5, 7 — build from the in-game briefs

These four are lighter Excel lifts; the in-game checkpoints + debriefs contain the full answers:

- **Lab 3 (comp sheet):** lay it out as a real comp sheet — company rows, cap-structure block, multiples block,
  operating stats block. Add conditional formatting for cheapest/richest per column.
- **Lab 4 (DC development):** one-page pro forma: budget → NOI → YoC → value at cap → profit; add a
  2-way Data Table (rent $95–125 × cap 5.75–7.25%).
- **Lab 5 (neocloud):** fleet unit-economics tab ($/GPU-yr columns) + P&L tab + a renewal-scenario toggle.
  Add cumulative contracted EBITDA vs. capex coverage chart.
- **Lab 7 (rate case):** revenue-requirement stack + a ΔRateBase → ΔEPS sensitivity line. Fastest of the seven.

## Validating and testing models (the job-spec skill, explicitly)

For every workbook: (1) balance/tie-out checks wired to one status cell; (2) sanity ratios next to outputs
(capex vs. D&A, UFCF/EBITDA, DSCR by year); (3) a "stress everything" scenario where each key input moves
against you 10% — if the model errors instead of degrading, fix the formulas; (4) reconcile one output to an
independent method (per-share DCF vs. implied comp multiple; debt sized by formula vs. `PV()`).
That habit — models that check themselves — is precisely "perform validation and testing of models to ensure
adequacy" from the posting.
