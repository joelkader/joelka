// ============================================================================
// SCHEDULE — default group-stage fixtures
// ============================================================================
// A full 12-group round-robin generated from the 48 teams in tournament.ts.
// Teams are snake-distributed across groups A–L so each group is tier-balanced.
// These are the default fixtures everyone sees; the admin can edit/remove them
// or enter scores in the Admin panel. Knockout matches depend on results, so
// add those by hand once the bracket is known.
//
// IDs are stable so re-deploys merge cleanly without duplicating or wiping
// admin-entered scores (see lib/store.ts heal()).
// ============================================================================

import type { Match } from "@/lib/scoring";
import { TEAMS } from "./tournament";

const GROUP_LETTERS = "ABCDEFGHIJKL".split(""); // 12 groups

// Snake-distribute the 48 teams into 12 groups of 4 for a balanced spread.
function buildGroups(): string[][] {
  const names = TEAMS.map((t) => t.name);
  const groups: string[][] = GROUP_LETTERS.map(() => []);
  names.forEach((name, i) => {
    const round = Math.floor(i / 12);
    const pos = i % 12;
    const g = round % 2 === 0 ? pos : 11 - pos; // snake
    groups[g].push(name);
  });
  return groups;
}

// Round-robin pairings for a 4-team group, by matchday.
const ROUND_ROBIN: [number, number][][] = [
  [[0, 1], [2, 3]], // Matchday 1
  [[0, 2], [1, 3]], // Matchday 2
  [[0, 3], [1, 2]], // Matchday 3
];

function buildDefaultMatches(): Match[] {
  const groups = buildGroups();
  const matches: Match[] = [];
  groups.forEach((teams, gi) => {
    const letter = GROUP_LETTERS[gi];
    ROUND_ROBIN.forEach((pairs, md) => {
      pairs.forEach(([a, b], pi) => {
        if (!teams[a] || !teams[b]) return;
        matches.push({
          id: `grp-${letter}-md${md + 1}-${pi}`,
          round: `Group ${letter}`,
          date: `Matchday ${md + 1}`,
          teamA: teams[a],
          teamB: teams[b],
          scoreA: null,
          scoreB: null,
        });
      });
    });
  });
  return matches;
}

export const DEFAULT_MATCHES: Match[] = buildDefaultMatches();
