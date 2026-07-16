# Academy verification tooling

Keeps `public/academy/` honest.

- **`golden.py`** — independent Python implementation of every case-lab model (3-statement, DCF, comp sheet,
  DC development, neocloud, project finance, rate case). Run `python3 golden.py` to print all check figures.
  The lab answers in `public/academy/assets/content/cases.js` and the tables in
  `public/academy/curriculum/excel-labs.md` must match this output.
- **`smoke_test.cjs`** — headless-browser test (Playwright): boots the app, runs every question generator 300×,
  validates all lab checkpoints against the golden values, and simulates user flows (drills, labs, flashcards,
  boss exams, save export). Run with:

```bash
NODE_PATH=$(npm root -g) node tools/academy-tests/smoke_test.cjs
```

(Requires a global `playwright` install with a Chromium; in Claude Code cloud sessions both are preinstalled.)

If you edit lab assumptions in `cases.js`, update `golden.py` first, rerun it, then update the `GOLDEN` table
in `smoke_test.cjs` and the markdown check figures.
