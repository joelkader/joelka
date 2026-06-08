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

// A scheduled fixture. teamA/teamB are team names (see data/tournament.ts).
// Scores are optional — null until the match is played. Owner-vs-owner is
// derived from team ownership at render time, not stored here.
export interface Match {
  id: string;
  round: string; // free text, e.g. "Group A", "Round of 32", "Final"
  date: string; // free text/ISO, e.g. "Sat 13 Jun · 18:00"
  venue?: string; // host city (optional)
  teamA: string;
  teamB: string;
  scoreA: number | null;
  scoreB: number | null;
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

// ----------------------------------------------------------------------------
// GROUP STANDINGS — derived from played group-stage match scores
// ----------------------------------------------------------------------------
// A win = 3 pts, a draw = 1 pt each, a loss = 0. These records also feed the
// pool's group points (see hydrateGroupResults), so entering match scores is
// the single source of truth for the group stage — draws included.

export interface GroupRow {
  team: string;
  played: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
}

function blankRow(team: string): GroupRow {
  return { team, played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
}

// Per-team W/D/L records from all *played* group-stage matches.
export function groupRecordsByTeam(matches: Match[]): Map<string, GroupRow> {
  const recs = new Map<string, GroupRow>();
  const get = (t: string) => {
    if (!recs.has(t)) recs.set(t, blankRow(t));
    return recs.get(t)!;
  };
  for (const m of matches) {
    if (!m.round.startsWith("Group ")) continue;
    if (m.scoreA == null || m.scoreB == null) continue;
    const a = get(m.teamA);
    const b = get(m.teamB);
    a.played++; b.played++;
    a.gf += m.scoreA; a.ga += m.scoreB;
    b.gf += m.scoreB; b.ga += m.scoreA;
    if (m.scoreA > m.scoreB) { a.w++; a.pts += 3; b.l++; }
    else if (m.scoreA < m.scoreB) { b.w++; b.pts += 3; a.l++; }
    else { a.d++; b.d++; a.pts++; b.pts++; }
  }
  for (const r of recs.values()) r.gd = r.gf - r.ga;
  return recs;
}

// Full standings per group (every team in the group, even with 0 played),
// sorted by points, then goal difference, goals for, name.
export function groupStandings(matches: Match[]): { group: string; rows: GroupRow[] }[] {
  const teamsByGroup = new Map<string, Set<string>>();
  for (const m of matches) {
    if (!m.round.startsWith("Group ")) continue;
    if (!teamsByGroup.has(m.round)) teamsByGroup.set(m.round, new Set());
    teamsByGroup.get(m.round)!.add(m.teamA);
    teamsByGroup.get(m.round)!.add(m.teamB);
  }
  const recs = groupRecordsByTeam(matches);
  return [...teamsByGroup.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([group, teams]) => {
      const rows = [...teams].map((t) => recs.get(t) ?? blankRow(t));
      rows.sort(
        (a, b) =>
          b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || a.team.localeCompare(b.team)
      );
      return { group, rows };
    });
}

// Returns results with group wins/draws derived from match scores, so the
// pool's group points come straight from entered results (draws counted).
export function hydrateGroupResults(
  results: TeamResult[],
  matches: Match[]
): TeamResult[] {
  const recs = groupRecordsByTeam(matches);
  return results.map((r) => {
    const rec = recs.get(r.team);
    return { ...r, groupWins: rec?.w ?? 0, groupDraws: rec?.d ?? 0 };
  });
}
