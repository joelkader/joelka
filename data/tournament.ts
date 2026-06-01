// ============================================================================
// TOURNAMENT DATA — World Cup 2026 Office Pool
// ============================================================================
// This file is the single source of truth for teams, tiers, and players.
// Edit the rosters here (or use the admin panel) after your in-person draw.
// ============================================================================

export type Tier = "Favorite" | "Contender" | "Mid" | "Longshot";

export const TIER_MULTIPLIER: Record<Tier, number> = {
  Favorite: 1.0,
  Contender: 1.5,
  Mid: 2.5,
  Longshot: 4.0,
};

// Base points per achievement (multiplier is applied on top, see lib/scoring.ts)
export const BASE_POINTS = {
  groupWin: 3, // per group win (3 group games per team)
  groupDraw: 1, // per group draw
  reachedR32: 5,
  reachedR16: 8,
  reachedQF: 12,
  reachedSF: 18,
  reachedFinal: 25,
  champion: 40,
} as const;

// All 48 teams with their tier assignment.
export const TEAMS: { name: string; tier: Tier }[] = [
  // Favorites
  { name: "Spain", tier: "Favorite" },
  { name: "France", tier: "Favorite" },
  { name: "England", tier: "Favorite" },
  { name: "Brazil", tier: "Favorite" },
  { name: "Argentina", tier: "Favorite" },
  { name: "Portugal", tier: "Favorite" },
  { name: "Germany", tier: "Favorite" },
  { name: "Netherlands", tier: "Favorite" },
  // Contenders
  { name: "Belgium", tier: "Contender" },
  { name: "Croatia", tier: "Contender" },
  { name: "Uruguay", tier: "Contender" },
  { name: "Morocco", tier: "Contender" },
  { name: "Switzerland", tier: "Contender" },
  { name: "Colombia", tier: "Contender" },
  // Mid
  { name: "United States", tier: "Mid" },
  { name: "Mexico", tier: "Mid" },
  { name: "Japan", tier: "Mid" },
  { name: "Senegal", tier: "Mid" },
  { name: "Ecuador", tier: "Mid" },
  { name: "South Korea", tier: "Mid" },
  { name: "Norway", tier: "Mid" },
  { name: "Sweden", tier: "Mid" },
  { name: "Austria", tier: "Mid" },
  { name: "Türkiye", tier: "Mid" },
  { name: "Iran", tier: "Mid" },
  { name: "Egypt", tier: "Mid" },
  { name: "Australia", tier: "Mid" },
  { name: "Paraguay", tier: "Mid" },
  { name: "Côte d'Ivoire", tier: "Mid" },
  { name: "Algeria", tier: "Mid" },
  { name: "Ghana", tier: "Mid" },
  // Longshots
  { name: "Czechia", tier: "Longshot" },
  { name: "Tunisia", tier: "Longshot" },
  { name: "Scotland", tier: "Longshot" },
  { name: "Qatar", tier: "Longshot" },
  { name: "Saudi Arabia", tier: "Longshot" },
  { name: "Iraq", tier: "Longshot" },
  { name: "Uzbekistan", tier: "Longshot" },
  { name: "Panama", tier: "Longshot" },
  { name: "Canada", tier: "Longshot" },
  { name: "South Africa", tier: "Longshot" },
  { name: "Bosnia and Herzegovina", tier: "Longshot" },
  { name: "DR Congo", tier: "Longshot" },
  { name: "Cabo Verde", tier: "Longshot" },
  { name: "Haiti", tier: "Longshot" },
  { name: "Jordan", tier: "Longshot" },
  { name: "Curaçao", tier: "Longshot" },
  { name: "New Zealand", tier: "Longshot" },
];

// The 8 players. Edit names here; this is the source of truth for who's in.
export const PLAYERS = [
  "Yaniv B.",
  "Jeff W.",
  "Gaurav J.",
  "Joel K.",
  "Robert L.",
  "Paul G.",
  "Sofia R.",
  "Aviv B.",
];

// 8 players × $30 buy-in.
export const POT = 240;
export const PAYOUTS = { first: 150, second: 60, third: 30 };
