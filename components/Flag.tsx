import { flagCode } from "@/data/tournament";

// Renders a country flag as an image (flagcdn.com). Emoji flags don't render
// on many browsers/OSes, so we use images for reliability.
export default function Flag({ team, w = 24 }: { team: string; w?: number }) {
  const code = flagCode(team);
  if (!code) return <span className="team-flag-fallback" aria-hidden="true" />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="team-flag"
      src={`https://flagcdn.com/w40/${code}.png`}
      srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
      alt={team}
      width={w}
      height={Math.round((w * 3) / 4)}
      loading="lazy"
    />
  );
}
