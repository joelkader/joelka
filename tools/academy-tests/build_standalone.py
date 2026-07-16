#!/usr/bin/env python3
"""Build public/academy/standalone.html — the whole academy in one portable file
(inlined CSS + JS). Run from anywhere: python3 tools/academy-tests/build_standalone.py"""
import pathlib

base = pathlib.Path(__file__).resolve().parents[2] / "public" / "academy"
out = base / "standalone.html"

css = (base / "assets/style.css").read_text()
order = [
    "assets/engine.js", "assets/content/accounting.js", "assets/content/valuation.js",
    "assets/content/comps.js", "assets/content/power.js", "assets/content/compute.js",
    "assets/content/projfin.js", "assets/content/thesis.js", "assets/content/cases.js",
    "assets/content/decks.js",
]
js = "\n\n".join((base / p).read_text() for p in order)
assert "</script" not in js and "</style" not in css, "closing-tag hazard in assets"

out.write_text(f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Watt Street — Energy & Compute Analyst Academy</title>
<meta name="description" content="A training game for energy, power, data center and compute-infrastructure finance.">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>">
<style>
{css}
</style>
</head>
<body>
<div class="topbar">
  <div class="brand" onclick="location.hash='#/home'">⚡ WATT <span>STREET</span></div>
  <div class="stats" id="topstats"></div>
</div>
<div class="wrap" id="view">
  <noscript>Watt Street needs JavaScript — it runs entirely in your browser, no server, no accounts.</noscript>
  <p class="lead">Loading the trading floor…</p>
</div>
<script>
{js}
</script>
</body>
</html>
""")
print(f"wrote {out} ({out.stat().st_size:,} bytes)")
