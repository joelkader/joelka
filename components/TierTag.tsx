import { tierFor, TIER_MULTIPLIER } from "@/data/tournament";

// Small tier-colored multiplier badge (e.g. ×4.0) shown next to a team.
// Renders nothing for unknown teams (e.g. knockout placeholders).
export default function TierTag({ team }: { team: string }) {
  const tier = tierFor(team);
  if (!tier) return null;
  return (
    <span className={`tier-badge tier-${tier}`} title={tier}>
      ×{TIER_MULTIPLIER[tier]}
    </span>
  );
}
