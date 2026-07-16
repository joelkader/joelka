# World Cup 2026 Office Pool — Tracker

> **Also in this repo:** ⚡ **Watt Street — Energy & Compute Analyst Academy**, a self-contained training
> game + 12-week curriculum for energy/power/data-center/compute finance roles. Open
> `public/academy/index.html` in a browser (or visit `/academy/index.html` on the deployed site).
> Docs: [`public/academy/README.md`](public/academy/README.md).

A small Next.js app for a 6-person office World Cup pool. The draw happens in
person (papers from a hat); this app tracks who owns which teams, applies the
underdog-weighted scoring, and shows a live leaderboard everyone can follow.

## What's already built (this base)

- **Scoring engine** (`lib/scoring.ts`) — pure functions, fully working. Base
  points × tier multiplier. This is the core logic and it's done.
- **Data model** (`data/tournament.ts`) — all 48 teams with tiers, the 6
  players, payouts. Edit names/tiers here.
- **Persistence** (`lib/store.ts`) — JSON file at `data/state.json`. Fine for
  local/single-server. See "Deploying" for serverless swap.
- **API** — `GET /api/state` (public read) and `POST /api/admin` (password-gated
  write).
- **Pages** — leaderboard (`/`), per-player view (`/player?name=…`), and an
  admin panel (`/admin`) to assign teams and tick results.
- **Live updates** — pages poll `/api/state` every 60s.

## Scoring rules

Each team earns **base points**, multiplied by its **tier multiplier**:

| Tier | Multiplier |
|------|-----------|
| Favorite | ×1.0 |
| Contender | ×1.5 |
| Mid | ×2.5 |
| Longshot | ×4.0 |

Base points: group win 3 (each), group draw 1 (each), R32 5, R16 8, QF 12,
SF 18, Final 25, Champion 40. Achievements are cumulative — a QF team has R32,
R16 and QF all set.

## Running locally

```bash
npm install
cp .env.local.example .env.local   # then edit ADMIN_PASSWORD
npm run dev
# open http://localhost:3000
```

## Day-to-day use

1. **After the in-person draw:** go to `/admin`, enter the password, and set
   each team's **Owner** dropdown to the player who drew it. Save.
2. **As matches finish:** in `/admin`, update group W/D counts and tick the
   knockout boxes a team has reached. Save. Everyone's view updates within a
   minute.
3. Rename "Player 1…6" to real names in the admin panel (or in
   `data/tournament.ts`).

## Deploying to Netlify

The app is Netlify-ready. Persistence auto-switches backends: a local JSON file
for `npm run dev`, and **Netlify Blobs** once deployed (durable, zero-config —
no database to provision, and it survives Netlify's read-only/ephemeral function
filesystem). The swap lives entirely in `lib/store.ts`.

Steps:

1. Push this repo to GitHub (already done if you're reading this on a branch).
2. In Netlify: **Add new site → Import an existing project**, pick the repo.
   Netlify auto-detects Next.js and installs its Next.js Runtime — no build
   config needed beyond the included `netlify.toml`.
3. Set one environment variable: **Site settings → Environment variables →**
   `ADMIN_PASSWORD` = your real password.
4. Deploy. Visit the site URL; go to `/admin` and enter that password to assign
   owners and tick results. State is stored in Netlify Blobs and shared by all
   visitors.

No keys are needed for Netlify Blobs — the deploy context is injected at
runtime. To deploy from the CLI instead, `npm i -g netlify-cli && netlify deploy
--build --prod` (set `ADMIN_PASSWORD` via `netlify env:set` or the UI first).

---

## TODO for Claude Code (suggested extensions)

The base runs as-is. Good next steps, roughly in priority order:

1. **Deploy-ready persistence.** ✅ Done — `lib/store.ts` now uses Netlify Blobs
   in production (file fallback locally), so it survives serverless. See
   "Deploying to Netlify" above. (Swapping to Vercel KV / Upstash Redis would be
   the same single-seam change if you target a different host.)

2. **Auth hardening.** Right now admin is a single shared password sent in the
   POST body. Fine for friends, but consider: move it to an `Authorization`
   header, add basic rate-limiting, and gate `/admin` behind a cookie session
   so the password isn't re-typed each visit.

3. **Per-team match log.** Instead of just W/D counts, let the admin enter
   individual group results (opponent, score). Derive W/D automatically and
   show a mini match history on each team. More satisfying to follow.

4. **Auto-advance helper.** When the admin ticks "reached QF," auto-tick R32 and
   R16 (since they're cumulative) to prevent input mistakes. Add a confirm when
   un-ticking.

5. **Group-stage validation.** Warn if a team has more than 3 group games
   logged, or if two teams are marked champion.

6. **Projections / "what if".** Given current state, show each player's max
   possible remaining points (if all their alive teams won out). Keeps people
   engaged late even when trailing.

7. **Polish.** Mobile layout for the admin table (it's wide), a tiny country
   flag next to each team, a "last changed" highlight on the leaderboard, and an
   optional email/Slack summary after each match day.

8. **Optional results API.** If you want true hands-off daily updates, wire a
   football data API (e.g. football-data.org has a free tier) to pre-fill
   results for the admin to confirm. Keep the manual override — APIs lag and the
   "best 8 third-placed teams" R32 logic for 2026 is fiddly.

## Project structure

```
data/tournament.ts     teams, tiers, players, payouts (edit here)
lib/scoring.ts          pure scoring engine
lib/store.ts            JSON persistence (swap for KV to deploy)
lib/usePoolState.ts     client polling hook
app/api/state/route.ts  GET public state
app/api/admin/route.ts  POST password-gated update
app/page.tsx            leaderboard
app/player/page.tsx     per-player view
app/admin/page.tsx      assignment + results entry
```
