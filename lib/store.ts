// ============================================================================
// STORE — persistence with a single seam (loadState / saveState)
// ============================================================================
// Two backends, picked automatically:
//
//   • On Netlify  -> Netlify Blobs (durable, zero-config — no env vars needed,
//                    the deploy context is injected at runtime). Survives the
//                    read-only / ephemeral serverless filesystem.
//   • Locally     -> JSON file at data/state.json (gitignored). Great for
//                    `npm run dev` and single-server use.
//
// The rest of the app only ever touches loadState/saveState, so this module is
// the only place that knows where state actually lives. Both functions are
// async (Netlify Blobs is async); callers await them.
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

// Self-heal: ensure every known team exists (in case data/tournament.ts changed
// after some state was already saved). Mutates and returns the same object.
function heal(state: PoolState): PoolState {
  const known = new Set(state.results.map((r) => r.team));
  for (const t of TEAMS) {
    if (!known.has(t.name)) state.results.push(emptyResult(t.name, t.tier));
  }
  return state;
}

// Are we running on Netlify? Netlify injects these at build and at function
// runtime; locally none are set, so we use the file backend.
function onNetlify(): boolean {
  return !!(
    process.env.NETLIFY ||
    process.env.NETLIFY_BLOBS_CONTEXT ||
    process.env.NETLIFY_LOCAL
  );
}

async function getBlobStore() {
  // Dynamic import so local dev doesn't need the package resolved eagerly.
  const { getStore } = await import("@netlify/blobs");
  return getStore(BLOB_STORE);
}

export async function loadState(): Promise<PoolState> {
  if (onNetlify()) {
    const store = await getBlobStore();
    const parsed = (await store.get(BLOB_KEY, { type: "json" })) as PoolState | null;
    if (!parsed) {
      const seeded = seedState();
      await store.setJSON(BLOB_KEY, seeded);
      return seeded;
    }
    return heal(parsed);
  }

  // Local file backend.
  try {
    const raw = fs.readFileSync(STATE_PATH, "utf-8");
    return heal(JSON.parse(raw) as PoolState);
  } catch {
    const seeded = seedState();
    await saveState(seeded);
    return seeded;
  }
}

export async function saveState(state: PoolState): Promise<void> {
  state.lastUpdated = new Date().toISOString();

  if (onNetlify()) {
    const store = await getBlobStore();
    await store.setJSON(BLOB_KEY, state);
    return;
  }

  fs.mkdirSync(path.dirname(STATE_PATH), { recursive: true });
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2), "utf-8");
}
