"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Nav from "@/components/Nav";
import { usePoolState } from "@/lib/usePoolState";
import { buildLeaderboard, teamPoints, groupBasePoints, knockoutBasePoints } from "@/lib/scoring";
import { TIER_MULTIPLIER } from "@/data/tournament";
import Link from "next/link";

function PlayerView() {
  const params = useSearchParams();
  const name = params.get("name");
  const { state, error } = usePoolState();

  if (error) return <p className="muted">Couldn’t load data: {error}</p>;
  if (!state) return <p className="muted">Loading…</p>;

  // No player selected → show a picker.
  if (!name) {
    return (
      <>
        <h1>Pick your name</h1>
        <div className="player-links">
          {state.players.map((p) => (
            <Link key={p} href={`/player?name=${encodeURIComponent(p)}`}>{p}</Link>
          ))}
        </div>
      </>
    );
  }

  const board = buildLeaderboard(state.results, state.players);
  const rank = board.findIndex((b) => b.player === name) + 1;
  const mine = state.results.filter((r) => r.owner === name);
  const total = mine.reduce((s, r) => s + teamPoints(r), 0);

  const sorted = [...mine].sort((a, b) => teamPoints(b) - teamPoints(a));

  return (
    <>
      <h1>{name}</h1>
      <p className="sub">
        Rank #{rank} of {state.players.length} · {total.toFixed(1)} pts
      </p>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Team</th>
              <th>Tier</th>
              <th className="num">Stage</th>
              <th className="num">Pts</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.team}>
                <td>{r.team}</td>
                <td>
                  <span className={`tier-badge tier-${r.tier}`}>
                    ×{TIER_MULTIPLIER[r.tier]}
                  </span>
                </td>
                <td className="num">{stageLabel(r)}</td>
                <td className="num pts">{teamPoints(r).toFixed(1)}</td>
              </tr>
            ))}
            {mine.length === 0 && (
              <tr><td colSpan={4} className="muted">No teams assigned yet — check back after the draw.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="muted">
        Points = (group + knockout base points) × tier multiplier. Lower-ranked teams pay more per result.
      </p>
      <p><Link href="/">← Back to leaderboard</Link></p>
    </>
  );
}

function stageLabel(r: {
  champion: boolean; reachedFinal: boolean; reachedSF: boolean;
  reachedQF: boolean; reachedR16: boolean; reachedR32: boolean;
  groupWins: number; groupDraws: number;
}): string {
  if (r.champion) return "🏆 Champion";
  if (r.reachedFinal) return "Final";
  if (r.reachedSF) return "Semifinal";
  if (r.reachedQF) return "Quarterfinal";
  if (r.reachedR16) return "Round of 16";
  if (r.reachedR32) return "Round of 32";
  if (r.groupWins || r.groupDraws) return `Group (${r.groupWins}W ${r.groupDraws}D)`;
  return "—";
}

export default function PlayerPage() {
  return (
    <>
      <Nav />
      <div className="container">
        <Suspense fallback={<p className="muted">Loading…</p>}>
          <PlayerView />
        </Suspense>
      </div>
    </>
  );
}
