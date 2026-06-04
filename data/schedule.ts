// ============================================================================
// SCHEDULE — official 2026 World Cup group-stage fixtures
// ============================================================================
// The real Final Draw (5 Dec 2025): all 12 groups A–L, team order roughly by
// seeding (pot 1 first). Fixtures are generated as the standard group
// round-robin; rounds are labelled by Matchday (exact kickoff dates/venues can
// be filled in per match in the Admin panel). Knockout matches depend on
// results, so add those by hand once the bracket is known.
//
// Team names match data/tournament.ts (South Korea = "Korea Republic",
// Côte d'Ivoire = "Ivory Coast", Cabo Verde = "Cape Verde").
//
// IDs are stable so re-deploys reconcile cleanly without duplicating or wiping
// admin-entered scores (see lib/store.ts heal()).
// ============================================================================

import type { Match } from "@/lib/scoring";

const GROUP_LETTERS = "ABCDEFGHIJKL".split(""); // 12 groups

// Official groups, in seeding order (pot 1 → pot 4).
const OFFICIAL_GROUPS: string[][] = [
  ["Mexico", "South Africa", "South Korea", "Czechia"],          // A
  ["Canada", "Switzerland", "Bosnia and Herzegovina", "Qatar"],  // B
  ["Brazil", "Morocco", "Haiti", "Scotland"],                    // C
  ["United States", "Paraguay", "Australia", "Türkiye"],         // D
  ["Germany", "Ecuador", "Côte d'Ivoire", "Curaçao"],            // E
  ["Netherlands", "Japan", "Sweden", "Tunisia"],                 // F
  ["Belgium", "Egypt", "Iran", "New Zealand"],                   // G
  ["Spain", "Uruguay", "Saudi Arabia", "Cabo Verde"],            // H
  ["France", "Senegal", "Norway", "Iraq"],                       // I
  ["Argentina", "Austria", "Algeria", "Jordan"],                 // J
  ["Portugal", "Colombia", "Uzbekistan", "DR Congo"],            // K
  ["England", "Croatia", "Ghana", "Panama"],                     // L
];

function buildGroups(): string[][] {
  return OFFICIAL_GROUPS;
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
