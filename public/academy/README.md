# ⚡ Watt Street — Energy & Compute Analyst Academy

A self-contained training game + curriculum for breaking into **energy / power / data center / compute-infrastructure
finance**: sell-side research associate seats (e.g., "Research Associate II – Energy"), neocloud analyst roles,
PE/infra funds, real-estate (data center) funds, and project finance.

It trains the exact skill list those postings ask for:

| Job requirement | Where it's trained |
|---|---|
| Excel 3-statement models + DCF | Module 1–2 lessons/drills, **Lab 1 & 2**, `curriculum/excel-labs.md` |
| Mathematical/simulation models, validation & testing | 49 infinite-variant numeric generators; every lab has verified check figures |
| Building & updating comp sheets | Module 3, **Lab 3** |
| Bloomberg/FactSet & data services | Module 7 lesson 3 + "Data Hunt" drill + `curriculum/resources.md` |
| State & defend an investment thesis | Module 7, judgment drills, writing drills |
| Respond to sales/client questions | Module 7 drills & writing reps |
| Written product | 3 graded writing drills with desk-quality model answers |
| Valuation methodologies | Module 2–3 + every lab debrief |
| Industry knowledge (energy, transmission, compute) | Modules 4–6, 110 flashcards, lab debriefs |

## Run it

No install, no accounts, no network — it's vanilla HTML/JS:

- **Simplest:** open `public/academy/index.html` in any browser (double-click works).
- **Via the repo's dev server:** `npm run dev` → http://localhost:3000/academy/index.html
- **If this repo is deployed on Netlify:** it's live at `<your-site>/academy/index.html` automatically (files in
  `public/` are served as static assets).

Progress (XP, streaks, spaced-repetition schedule, lab completion) saves to your browser's localStorage.
Settings → Export save to move progress between machines.

## What's inside

- **7 desks (modules)**, each with lessons → drills → a timed boss exam:
  1. 🧾 Accounting & the Three Statements
  2. 💸 Valuation & DCF
  3. 📋 Comps & Comp Sheets
  4. ⚡ Power Markets & the Grid
  5. 🖥️ Data Centers, Compute & Neoclouds
  6. 🏗️ Project Finance & Fund Math
  7. 🎤 Thesis, Writing & the Process
- **7 case labs** — build the model in Excel/on paper, verify at numeric checkpoints:
  three-statement build, full DCF, six-company comp sheet, data center development pro forma,
  10,000-GPU neocloud underwrite, solar+storage project finance, utility rate case.
- **110 spaced-repetition flashcards** (desk vocabulary), **daily missions**, **Fix-Your-Misses** review,
  and a final **Superday** (36 questions, 75 minutes, all topics).
- **Curriculum folder** (`curriculum/`): 12-week program, Excel lab specs with check figures,
  data-source field guide, interview question bank.

## Honesty notes

- Every company in drills and labs is **fictional**. Market figures (capacity prices, build costs, rates,
  policy details) are teaching approximations compiled in early 2026 — verify current data before using
  numbers professionally. Mechanics don't go stale; levels do.
- All lab checkpoint answers were verified against an independent Python implementation of each model
  (see `tools/academy-tests/`).

## Suggested cadence

Daily (45–60 min): Daily Mission → due flashcards → one lesson + its drill.
Weekly: one case lab (in Excel), one writing rep, one boss exam.
Full plan: `curriculum/12-week-program.md`.
