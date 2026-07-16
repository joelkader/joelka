#!/usr/bin/env python3
"""Golden check-figures for Watt Street academy case labs. All $ in millions unless noted."""

def money(x, d=2):
    return f"{x:,.{d}f}"

print("=" * 80)
print("LAB 1 — THREE-STATEMENT MODEL: GridWave Generation (fictional IPP)")
print("=" * 80)
rev0 = 1200.0
growth = [0.06, 0.05, 0.04]
margin = [0.36, 0.37, 0.38]
da = [140.0, 145.0, 150.0]
capex = [180.0, 170.0, 160.0]
rate_int = 0.06
amort = 75.0
tax_rate = 0.25
nwc_pct = 0.08

cash, debt, ppe, pic, re = 250.0, 1500.0, 2600.0, 800.0, 646.0
nwc = nwc_pct * rev0
years = [2026, 2027, 2028]
rev_prev = rev0
for i, yr in enumerate(years):
    rev = rev_prev * (1 + growth[i])
    ebitda = rev * margin[i]
    ebit = ebitda - da[i]
    interest = rate_int * debt          # beginning-of-year debt convention
    ebt = ebit - interest
    tax = ebt * tax_rate
    ni = ebt - tax
    nwc_new = nwc_pct * rev
    d_nwc = nwc_new - nwc
    cfo = ni + da[i] - d_nwc
    cfi = -capex[i]
    cff = -amort
    d_cash = cfo + cfi + cff
    cash += d_cash
    debt -= amort
    ppe += capex[i] - da[i]
    re += ni
    nwc = nwc_new
    assets = cash + nwc + ppe
    le = debt + pic + re
    print(f"\n{yr}: rev={money(rev)} ebitda={money(ebitda)} d&a={da[i]} ebit={money(ebit)}")
    print(f"      int={money(interest)} ebt={money(ebt)} tax={money(tax)} NI={money(ni)}")
    print(f"      dNWC={money(d_nwc)} CFO={money(cfo)} CFI={money(cfi)} CFF={money(cff)} dCash={money(d_cash)}")
    print(f"      end: cash={money(cash)} debt={money(debt)} PP&E={money(ppe)} RE={money(re)}")
    print(f"      BS: assets={money(assets)} L+E={money(le)} check={abs(assets-le)<1e-6}")
    rev_prev = rev

print()
print("=" * 80)
print("LAB 2 — DCF: Meridian Power Holdings (fictional IPP), valuation date 12/31/25")
print("=" * 80)
rev0 = 2400.0
g = [0.07, 0.06, 0.05, 0.04, 0.03]
m_ebitda = 0.40
m_da = 0.06
m_capex = [0.09, 0.08, 0.08, 0.07, 0.07]
tax_rate = 0.25
nwc_of_drev = 0.10
rf, beta, erp = 0.0425, 1.10, 0.05
re_coe = rf + beta * erp
wd, rd = 0.40, 0.0625
wacc = (1 - wd) * re_coe + wd * rd * (1 - tax_rate)
print(f"Cost of equity = {re_coe*100:.3f}%   WACC = {wacc*100:.4f}%")
rev_prev = rev0
ufcf_list, ebitda_list = [], []
for i in range(5):
    rev = rev_prev * (1 + g[i])
    ebitda = rev * m_ebitda
    dep = rev * m_da
    ebit = ebitda - dep
    nopat = ebit * (1 - tax_rate)
    cap = rev * m_capex[i]
    dnwc = (rev - rev_prev) * nwc_of_drev
    ufcf = nopat + dep - cap - dnwc
    ufcf_list.append(ufcf)
    ebitda_list.append(ebitda)
    print(f"{2026+i}: rev={money(rev)} ebitda={money(ebitda)} ebit={money(ebit)} nopat={money(nopat)} "
          f"capex={money(cap)} dNWC={money(dnwc)} UFCF={money(ufcf)}")
    rev_prev = rev
pv_stage1 = sum(f / (1 + wacc) ** (i + 1) for i, f in enumerate(ufcf_list))
g_term = 0.02
tv = ufcf_list[-1] * (1 + g_term) / (wacc - g_term)
pv_tv = tv / (1 + wacc) ** 5
ev = pv_stage1 + pv_tv
net_debt, mi, shares, px = 3100.0, 150.0, 320.0, 28.50
eq = ev - net_debt - mi
ps = eq / shares * 1  # $ per share (eq in $M, shares in M)
print(f"\nPV stage 1 = {money(pv_stage1)}   TV = {money(tv)}   PV(TV) = {money(pv_tv)}")
print(f"EV = {money(ev)}   equity = {money(eq)}   per share = ${ps:.2f}   upside vs $28.50 = {(ps/px-1)*100:.1f}%")
print(f"TV share of EV = {pv_tv/ev*100:.1f}%   implied EV/2026 EBITDA = {ev/ebitda_list[0]:.2f}x")

print()
print("=" * 80)
print("LAB 3 — COMP SHEET (six fictional power/infra companies)")
print("=" * 80)
comps = [
    # name, price, basic shares M, options M, strike, cash, debt, pref, MI, EBITDA26, EBITDA27, per-share metric name, value
    ("Ampera Energy",        142.00, 350, 12, 80, 1900,  7800, 0,    0, 4100, 4650, "EPS26",  6.10),
    ("Keystone Power",       118.00, 340, 10, 60, 1200, 11500, 0,    0, 4300, 4750, "EPS26",  5.95),
    ("Bluewater Generation",  54.00, 480,  8, 35,  800,  9900, 0,    0, 3350, 3600, "EPS26",  3.05),
    ("Solstice Renewables",   27.00, 405,  0,  0,  600,  8200, 0, 2400, 1950, 2080, "CAFD26", 2.05),
    ("Ironpeak Utilities",    88.00, 620,  0,  0,  400, 21000, 0,    0, 6400, 6850, "EPS26",  5.35),
    ("Nimbus Digital Infra", 152.00, 330,  6, 95, 2100, 17000, 0,    0, 3050, 3500, "AFFO26", 7.10),
]
for (nm, px, sh, opt, k, cash, debt, pref, mi, e26, e27, met, val) in comps:
    dil = sh + (opt * (1 - k / px) if (opt and px > k) else 0)
    mcap = px * dil
    ev = mcap + debt + pref + mi - cash
    print(f"{nm:22s} dilsh={dil:8.2f} mcap={money(mcap,0):>9} EV={money(ev,0):>9} "
          f"EV/E26={ev/e26:5.2f}x EV/E27={ev/e27:5.2f}x growth={(e27/e26-1)*100:4.1f}% "
          f"{met}={val} P/x={px/val:5.2f}x lev(net debt/E26)={(debt+pref-cash)/e26:4.2f}x")

print()
print("=" * 80)
print("LAB 4 — DATA CENTER DEVELOPMENT: Fort Nelson Campus (fictional)")
print("=" * 80)
mw = 48.0
land = 30.0
improvements = 10.5 * mw
softdev = 21.0
idc = 20.0
cost = land + improvements + softdev + idc
rent_kw_mo = 110.0
nonrec = 2.8
noi = mw * 1000 * rent_kw_mo * 12 / 1e6 - nonrec
yoc = noi / cost
cap = 0.0625
value = noi / cap
profit = value - cost
print(f"Total cost = {money(cost)} (improvements {money(improvements)})")
print(f"Stabilized NOI = {money(noi)}   yield-on-cost = {yoc*100:.2f}%")
print(f"Value @ {cap*100:.2f}% cap = {money(value)}   dev profit = {money(profit)}   MOC = {value/cost:.2f}x")
loan = 0.60 * cost
equity = cost - loan
net_to_eq = value - loan
moic = net_to_eq / equity
yrs = 2.5
irr = moic ** (1 / yrs) - 1
print(f"Levered: loan={money(loan)} equity={money(equity)} exit equity={money(net_to_eq)} "
      f"MOIC={moic:.2f}x IRR({yrs}y)={irr*100:.1f}%")
pue = 1.30
print(f"Facility load @ PUE {pue} = {mw*pue:.1f} MW")
cap2 = 0.0725
print(f"Value @ {cap2*100:.2f}% cap = {money(noi/cap2)}  (profit {money(noi/cap2-cost)})")

print()
print("=" * 80)
print("LAB 5 — NEOCLOUD: TensorForge Compute (fictional GPU cloud)")
print("=" * 80)
n_gpu = 10000
capex_gpu = 38000.0
capex = n_gpu * capex_gpu / 1e6
n_c, px_c = 7000, 2.10
n_o, px_o, util_o = 3000, 2.90, 0.45
rev_c = n_c * 8760 * px_c / 1e6
rev_o = n_o * 8760 * util_o * px_o / 1e6
rev = rev_c + rev_o
kw_it = n_gpu * 0.85
colo = kw_it * 145.0 * 12 / 1e6
other_opex = 16.0
sgna = 0.08 * rev
ebitda = rev - colo - other_opex - sgna
dep = capex / 5
ebit = ebitda - dep
debt = 0.65 * capex
interest = 0.105 * debt
ebt = ebit - interest
print(f"Capex = {money(capex)}   Revenue: contracted {money(rev_c)} + on-demand {money(rev_o)} = {money(rev)}")
print(f"Colo (at {kw_it:,.0f} kW IT, $145/kW-mo) = {money(colo)}  other opex = {other_opex}  S&M/G&A = {money(sgna)}")
print(f"EBITDA = {money(ebitda)}  margin = {ebitda/rev*100:.1f}%")
print(f"D&A(5y) = {money(dep)}  EBIT = {money(ebit)}  debt = {money(debt)}  interest = {money(interest)}  EBT = {money(ebt)}")
print(f"Simple payback = {capex/ebitda:.2f} yrs vs 3-yr contract")
print(f"3yr contracted EBITDA cum = {money(3*ebitda)} vs capex {money(capex)}")
# breakeven contracted price so that 3 x EBITDA = capex, holding on-demand & costs
# EBITDA(p) = [n_c*8760*p + rev_o*1e6]*(1-0.08)/1e6 - colo - other_opex  (S&M scales w/ revenue)
target = capex / 3
# solve (rev(p))*(0.92) - colo - other = target  =>  rev(p) = (target + colo + other)/0.92
rev_needed = (target + colo + other_opex) / 0.92
p_be = (rev_needed - rev_o) * 1e6 / (n_c * 8760)
print(f"Breakeven contracted $/GPU-hr for 3-yr payback = ${p_be:.2f}")
# renewal scenario
rev_ren = n_gpu * 8760 * 0.60 * 1.20 / 1e6
ebitda_ren = rev_ren - colo - other_opex - 0.05 * rev_ren
print(f"Renewal yr4: rev = {money(rev_ren)}  EBITDA = {money(ebitda_ren)}  vs debt service interest {money(interest)}")

print()
print("=" * 80)
print("LAB 6 — PROJECT FINANCE: Sundance Solar + Storage (fictional, ERCOT West)")
print("=" * 80)
mw_pv = 200.0
cf_p50 = 0.29
p90_f = 0.93
ppa = 42.0
mwh_p50 = mw_pv * 8760 * cf_p50
rev_solar = mwh_p50 * ppa / 1e6
toll = 50000 * 8.50 * 12 / 1e6
opex = 8.8
cfads_p50 = rev_solar + toll - opex
cfads_p90 = rev_solar * p90_f + toll - opex
print(f"P50 gen = {mwh_p50:,.0f} MWh  solar rev = {money(rev_solar)}  BESS toll = {money(toll)}")
print(f"CFADS P50 = {money(cfads_p50)}   CFADS P90 = {money(cfads_p90)}")
ds_150 = cfads_p50 / 1.30
ds_120 = cfads_p90 / 1.20
ds = min(ds_150, ds_120)
r, n = 0.0675, 18
af = (1 - (1 + r) ** -n) / r
debt = ds * af
capex_total = 270.0
print(f"Max DS: min(P50/1.30 = {money(ds_150)}, P90/1.20 = {money(ds_120)}) = {money(ds)}")
print(f"Annuity factor (18y @ 6.75%) = {af:.4f}   Debt = {money(debt)}  ({debt/capex_total*100:.1f}% of capex)")
itc_basis = 0.95 * capex_total
itc = 0.40 * itc_basis
itc_cash = itc * 0.925
equity = capex_total - debt - itc_cash
print(f"ITC = 40% x {money(itc_basis)} = {money(itc)}; sold @ $0.925 => cash {money(itc_cash)}")
print(f"Sponsor equity = {money(equity)}  ({equity/capex_total*100:.1f}% of capex)")
cf_eq_1 = cfads_p50 - ds
print(f"Year-1 sponsor cash = {money(cf_eq_1)}  cash-on-cash = {cf_eq_1/equity*100:.1f}%")
# simple IRR: 15 yrs CFADS P50 flat with debt service 18y; yrs 16-18 merchant CFADS 9.0 less DS; 19-25 merchant 9.0
flows = [-equity]
for t in range(1, 26):
    cfads = cfads_p50 if t <= 15 else 9.0
    dsv = ds if t <= 18 else 0.0
    flows.append(cfads - dsv)
def irr(flows, lo=-0.9, hi=1.5):
    def npv(r):
        return sum(f / (1 + r) ** i for i, f in enumerate(flows))
    for _ in range(100):
        mid = (lo + hi) / 2
        if npv(mid) > 0:
            lo = mid
        else:
            hi = mid
    return (lo + hi) / 2
print(f"Sponsor equity IRR (25y, simplified) = {irr(flows)*100:.1f}%")

print()
print("=" * 80)
print("LAB 7 — RATE CASE: Prairie State Electric (fictional regulated utility)")
print("=" * 80)
rb = 8000.0
eq_ratio, roe, cod = 0.52, 0.096, 0.048
om, dep, othertax = 1150.0, 480.0, 210.0
tax_rate = 0.25
ret_eq = rb * eq_ratio * roe
ret_debt = rb * (1 - eq_ratio) * cod
inc_tax = ret_eq * tax_rate / (1 - tax_rate)
revreq = om + dep + othertax + ret_eq + ret_debt + inc_tax
print(f"Return on equity portion = {money(ret_eq)}  debt return = {money(ret_debt)}  income tax gross-up = {money(inc_tax)}")
print(f"Revenue requirement = {money(revreq)}")
shares = 180.0
print(f"Net income = {money(ret_eq)}  EPS = ${ret_eq/shares:.2f}")
add_rb = 600.0
d_ni = add_rb * eq_ratio * roe
print(f"+$600M rate base => dNI = {money(d_ni)}  new EPS = ${(ret_eq+d_ni)/shares:.3f}  growth = {d_ni/ret_eq*100:.1f}%")
sales_gwh = 32000.0
rate_c = revreq / (sales_gwh * 1e3) * 100  # cents/kWh: $M / GWh*1e3 = $/kWh... check units below
# revreq $M = revreq*1e6 $; sales kWh = 32,000 GWh = 32e9 kWh => $/kWh = revreq*1e6/32e9
per_kwh = revreq * 1e6 / (sales_gwh * 1e6 * 1000) * 100
print(f"Avg rate = {revreq*1e6/(sales_gwh*1e6):.4f} $/kWh = {revreq*1e6/(sales_gwh*1e6)*100:.2f} c/kWh")
print(f"Typical bill @ 850 kWh/mo = ${revreq*1e6/(sales_gwh*1e6)*850:.2f}")

print()
print("=" * 80)
print("SPOT CHECKS for drill items")
print("=" * 80)
# LCOE example
capex_kw, r, n = 1200.0, 0.07, 30
crf = r * (1 + r) ** n / ((1 + r) ** n - 1)
fom, cf, vom = 20.0, 0.25, 0.0
lcoe = (capex_kw * crf + fom) / (8.76 * cf) + vom
print(f"CRF(7%,30y) = {crf:.4f}; solar LCOE example = ${lcoe:.2f}/MWh")
# spark spread
hr, gas, power = 7500.0, 3.50, 45.0
print(f"Fuel cost = {hr*gas/1000:.2f} $/MWh; spark spread = {power - hr*gas/1000:.2f}")
# battery arb
print(f"Battery arb: 400MWh, RTE .85, buy 20 sell 60: daily = {(400*0.85*60 - 400*20)/1000:.2f} k$ ... = {400*0.85*60 - 400*20:,.0f} $/day; annual(350cyc) = {(400*0.85*60 - 400*20)*350/1e6:.2f} M$")
# TSM
print(f"TSM: 100M sh, 10M opt @20, px 50: dil = {100 + 10*(1-20/50):.1f}M")
# WACC quickie
print(f"WACC ex: .6*(4.5+1.2*5) + .4*6*(1-.25) = {0.6*(4.5+1.2*5)+0.4*6*0.75:.2f}%")
# capacity revenue
print(f"PJM cap rev: 500 MW UCAP x $270/MW-d x 365 = {500*270*365/1e6:.2f} M$")
# GPU quick payback
print(f"GPU: $2.20/hr, 65% util => rev/GPU-yr = ${2.20*8760*0.65:,.0f}")
# CCGT annual EBITDA gen
mwh = 550 * 8760 * 0.62
ss = 22.0
print(f"CCGT 550MW @62% CF: {mwh:,.0f} MWh x $22 spark - fixed 25M = {mwh*ss/1e6 - 25:,.1f} M$")
