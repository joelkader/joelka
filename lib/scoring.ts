// ============================================================================
// SCORING ENGINE
// ============================================================================
// Pure functions — no I/O. Given a team's results + tier, compute points.
// This is the heart of the pool. Keep it pure so it's trivial to test.
// ============================================================================

import { BASE_POINTS, TIER_MULTIPLIER, Tier } from "@/data/tournament";

// The mutable result state for a single team, updated by the admin as the
// tournament progresses. Achievement flags are cumulative: a team in the QF
// should have reachedR32, reachedR16 AND reachedQF all true.
export interface TeamResult {
  team: string;
  tier: Tier;
  owner: string | null; // player name, or null if unassigned
  groupWins: number; // 0–3
  groupDraws: number; // 0–3
  reachedR32: boolean;
  reachedR16: boolean;
  reachedQF: boolean;
  reachedSF: boolean;
  reachedFinal: boolean;
  champion: boolean;
}

export function emptyResult(team: string, tier: Tier): TeamResult {
  return {
    team,
    tier,
    owner: null,
    groupWins: 0,
    groupDraws: 0,
    reachedR32: false,
    reachedR16: false,
    reachedQF: false,
    reachedSF: false,
    reachedFinal: false,
    champion: false,
  };
}

// Points from group stage only (before multiplier).
export function groupBasePoints(r: TeamResult): number {
  return r.groupWins * BASE_POINTS.groupWin + r.groupDraws * BASE_POINTS.groupDraw;
}

// Points from knockout achievements only (before multiplier).
export function knockoutBasePoints(r: TeamResult): number {
  let p = 0;
  if (r.reachedR32) p += BASE_POINTS.reachedR32;
  if (r.reachedR16) p += BASE_POINTS.reachedR16;
  if (r.reachedQF) p += BASE_POINTS.reachedQF;
  if (r.reachedSF) p += BASE_POINTS.reachedSF;
  if (r.reachedFinal) p += BASE_POINTS.reachedFinal;
  if (r.champion) p += BASE_POINTS.champion;
  return p;
}

// Total points for a single team, multiplier applied.
export function teamPoints(r: TeamResult): number {
  const base = groupBasePoints(r) + knockoutBasePoints(r);
  return base * TIER_MULTIPLIER[r.tier];
}

export interface PlayerStanding {
  player: string;
  total: number;
  teams: { team: string; tier: Tier; points: number }[];
}

// Build the full leaderboard from all team results.
export function buildLeaderboard(
  results: TeamResult[],
  players: string[]
): PlayerStanding[] {
  const standings: PlayerStanding[] = players.map((player) => {
    const owned = results.filter((r) => r.owner === player);
    const teams = owned
      .map((r) => ({ team: r.team, tier: r.tier, points: teamPoints(r) }))
      .sort((a, b) => b.points - a.points);
    const total = teams.reduce((s, t) => s + t.points, 0);
    return { player, total, teams };
  });
  return standings.sort((a, b) => b.total - a.total);
}
