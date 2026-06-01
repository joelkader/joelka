// ============================================================================
// STORE — persistence with a single seam (loadState / saveState)
// ============================================================================
// Two backends, chosen by what's actually available at runtime — no env-var
// guessing:
//
//   1. Netlify Blobs  — used whenever the Netlify runtime context exists
//                        (i.e. when deployed). Durable, zero-config, and
//                        survives the read-only / ephemeral function FS.
//   2. JSON file      — used locally (`npm run dev`), at data/state.json.
//
// loadState NEVER throws: if a backend is unavailable it degrades to the
// in-memory seed so the API always returns 200 rather than 500ing the site.
// The rest of the app only ever touches loadState/saveState. Both are async.
// ============================================================================

import fs from "fs";
import path from "path";
import { TEAMS, PLAYERS } from "@/data/tournament";
import { TeamResult, emptyResult } from "@/lib/scoring";

const STATE_PATH = path.join(process.cwd(), "data", "state.json");
const BLOB_STORE = "wc-pool";
const BLOB_KEY = "state";

export interface PoolState {
  results: TeamResult[];
  players: string[];
  lastUpdated: string; // ISO timestamp
}

function seedState(): PoolState {
  return {
    results: TEAMS.map((t) => emptyResult(t.name, t.tier)),
    players: PLAYERS,
    lastUpdated: new Date().toISOString(),
  };
}

// Self-heal: keep persisted state in sync with data/tournament.ts (the source
// of truth) so edits there propagate to an already-seeded store. Mutates and
// returns the same object.
function heal(state: PoolState): PoolState {
  const tierByTeam = new Map(TEAMS.map((t) => [t.name, t.tier]));

  // Add any newly-listed teams.
  const known = new Set(state.results.map((r) => r.team));
  for (const t of TEAMS) {
    if (!known.has(t.name)) state.results.push(emptyResult(t.name, t.tier));
  }

  // Reconcile tiers — tier is set in the data file, never edited in the admin
  // panel, so the data file always wins (e.g. Germany/Netherlands → Favorite).
  for (const r of state.results) {
    const tier = tierByTeam.get(r.team);
    if (tier && r.tier !== tier) r.tier = tier;
  }

  // Reconcile the roster only when its size changes (e.g. 6 → 8 players). We
  // avoid clobbering on every load so admin-panel name edits still persist.
  if (state.players.length !== PLAYERS.length) {
    state.players = [...PLAYERS];
  }

  return state;
}

// Returns the Netlify Blobs store, or null if the Netlify context isn't
// available (e.g. local dev) — getStore throws without siteID/token, which is
// our signal to use the file backend instead.
async function getBlobStore() {
  try {
    const { getStore } = await import("@netlify/blobs");
    return getStore(BLOB_STORE);
  } catch {
    return null;
  }
}

function readFile(): PoolState | null {
  try {
    return heal(JSON.parse(fs.readFileSync(STATE_PATH, "utf-8")) as PoolState);
  } catch {
    return null;
  }
}

function writeFile(state: PoolState): void {
  fs.mkdirSync(path.dirname(STATE_PATH), { recursive: true });
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2), "utf-8");
}

export async function loadState(): Promise<PoolState> {
  // 1. Netlify Blobs, if we're running on Netlify.
  const store = await getBlobStore();
  if (store) {
    try {
      const parsed = (await store.get(BLOB_KEY, { type: "json" })) as PoolState | null;
      if (parsed) return heal(parsed);
      const seeded = seedState();
      await store.setJSON(BLOB_KEY, seeded);
      return seeded;
    } catch {
      // Blobs reachable check failed — never 500 the page; serve the seed.
      return seedState();
    }
  }

  // 2. Local file backend (seed + persist on first run).
  const fromFile = readFile();
  if (fromFile) return fromFile;
  const seeded = seedState();
  try {
    writeFile(seeded);
  } catch {
    // Read-only FS — still serve the seed.
  }
  return seeded;
}

export async function saveState(state: PoolState): Promise<void> {
  state.lastUpdated = new Date().toISOString();

  const store = await getBlobStore();
  if (store) {
    await store.setJSON(BLOB_KEY, state);
    return;
  }

  writeFile(state);
}
