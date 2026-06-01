// ============================================================================
// STORE — simple JSON-file persistence
// ============================================================================
// For a 6-person pool this is plenty. No database needed. State lives in
// data/state.json (gitignored). API routes read/write through here.
//
// CLAUDE CODE NOTE: if you deploy to Vercel/serverless, the filesystem is
// read-only/ephemeral. Swap this module for Vercel KV, Postgres, Supabase,
// or Upstash Redis — the rest of the app only touches loadState/saveState,
// so this is the single seam to change. See README for guidance.
// ============================================================================

import fs from "fs";
import path from "path";
import { TEAMS, PLAYERS } from "@/data/tournament";
import { TeamResult, emptyResult } from "@/lib/scoring";

const STATE_PATH = path.join(process.cwd(), "data", "state.json");

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

export function loadState(): PoolState {
  try {
    const raw = fs.readFileSync(STATE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as PoolState;
    // Self-heal: ensure every team exists (in case data/tournament.ts changed)
    const known = new Set(parsed.results.map((r) => r.team));
    for (const t of TEAMS) {
      if (!known.has(t.name)) parsed.results.push(emptyResult(t.name, t.tier));
    }
    return parsed;
  } catch {
    const seeded = seedState();
    saveState(seeded);
    return seeded;
  }
}

export function saveState(state: PoolState): void {
  state.lastUpdated = new Date().toISOString();
  fs.mkdirSync(path.dirname(STATE_PATH), { recursive: true });
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2), "utf-8");
}
