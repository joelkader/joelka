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
// Distribution: 8 Favorites · 8 Contenders · 16 Mid · 16 Longshot
// (so the 1-1-2-2 draft over 8 players uses every team with none left over).
export const TEAMS: { name: string; tier: Tier }[] = [
  // Favorites (8)
  { name: "Spain", tier: "Favorite" },
  { name: "France", tier: "Favorite" },
  { name: "England", tier: "Favorite" },
  { name: "Brazil", tier: "Favorite" },
  { name: "Argentina", tier: "Favorite" },
  { name: "Portugal", tier: "Favorite" },
  { name: "Germany", tier: "Favorite" },
  { name: "Netherlands", tier: "Favorite" },
  // Contenders (8)
  { name: "Belgium", tier: "Contender" },
  { name: "Croatia", tier: "Contender" },
  { name: "Uruguay", tier: "Contender" },
  { name: "Morocco", tier: "Contender" },
  { name: "Switzerland", tier: "Contender" },
  { name: "Colombia", tier: "Contender" },
  { name: "Japan", tier: "Contender" },
  { name: "Senegal", tier: "Contender" },
  // Mid (16)
  { name: "United States", tier: "Mid" },
  { name: "Mexico", tier: "Mid" },
  { name: "Ecuador", tier: "Mid" },
  { name: "South Korea", tier: "Mid" },
  { name: "Norway", tier: "Mid" },
  { name: "Sweden", tier: "Mid" },
  { name: "Austria", tier: "Mid" },
  { name: "Türkiye", tier: "Mid" },
  { name: "Iran", tier: "Mid" },
  { name: "Egypt", tier: "Mid" },
  { name: "Paraguay", tier: "Mid" },
  { name: "Côte d'Ivoire", tier: "Mid" },
  { name: "Algeria", tier: "Mid" },
  { name: "Ghana", tier: "Mid" },
  { name: "Czechia", tier: "Mid" },
  { name: "Canada", tier: "Mid" },
  // Longshots (16)
  { name: "Tunisia", tier: "Longshot" },
  { name: "Scotland", tier: "Longshot" },
  { name: "Qatar", tier: "Longshot" },
  { name: "Saudi Arabia", tier: "Longshot" },
  { name: "Iraq", tier: "Longshot" },
  { name: "Uzbekistan", tier: "Longshot" },
  { name: "Panama", tier: "Longshot" },
  { name: "South Africa", tier: "Longshot" },
  { name: "Bosnia and Herzegovina", tier: "Longshot" },
  { name: "DR Congo", tier: "Longshot" },
  { name: "Cabo Verde", tier: "Longshot" },
  { name: "Haiti", tier: "Longshot" },
  { name: "Jordan", tier: "Longshot" },
  { name: "Curaçao", tier: "Longshot" },
  { name: "New Zealand", tier: "Longshot" },
  { name: "Australia", tier: "Longshot" },
];

// Tier lookup by team name (for showing multipliers next to teams).
export const TIER_BY_TEAM: Record<string, Tier> = Object.fromEntries(
  TEAMS.map((t) => [t.name, t.tier])
);

// A team's tier, or null for unknown teams (e.g. knockout placeholders).
export function tierFor(team: string): Tier | null {
  return TIER_BY_TEAM[team] ?? null;
}

// ISO 3166-1 alpha-2 codes (and FIFA subdivisions) per team, used to render
// real flag images via flagcdn.com. Emoji flags don't render on many browsers
// (e.g. Windows), so we use images instead.
export const FLAG_CODES: Record<string, string> = {
  Spain: "es", France: "fr", England: "gb-eng", Brazil: "br",
  Argentina: "ar", Portugal: "pt", Germany: "de", Netherlands: "nl",
  Belgium: "be", Croatia: "hr", Uruguay: "uy", Morocco: "ma",
  Switzerland: "ch", Colombia: "co", "United States": "us", Mexico: "mx",
  Japan: "jp", Senegal: "sn", Ecuador: "ec", "South Korea": "kr",
  Norway: "no", Sweden: "se", Austria: "at", "Türkiye": "tr",
  Iran: "ir", Egypt: "eg", Australia: "au", Paraguay: "py",
  "Côte d'Ivoire": "ci", Algeria: "dz", Ghana: "gh", Czechia: "cz",
  Tunisia: "tn", Scotland: "gb-sct", Qatar: "qa", "Saudi Arabia": "sa",
  Iraq: "iq", Uzbekistan: "uz", Panama: "pa", Canada: "ca",
  "South Africa": "za", "Bosnia and Herzegovina": "ba", "DR Congo": "cd",
  "Cabo Verde": "cv", Haiti: "ht", Jordan: "jo", "Curaçao": "cw",
  "New Zealand": "nz",
};

// Returns the flagcdn code for a team, or "" if unknown.
export function flagCode(team: string): string {
  return FLAG_CODES[team] ?? "";
}

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

// 8 players × $25 buy-in, winner takes all.
export const POT = 200;
export const PAYOUTS = { first: 200, second: 0, third: 0 };
