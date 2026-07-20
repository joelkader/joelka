"use client";
import Nav from "@/components/Nav";
import ChampionCelebration from "@/components/ChampionCelebration";
import { usePoolState } from "@/lib/usePoolState";
import { buildLeaderboard, hydrateResults } from "@/lib/scoring";
import { PAYOUTS, POT } from "@/data/tournament";
import Link from "next/link";

export default function Home() {
  const { state, error } = usePoolState();

  if (error) return <Shell><p className="muted">Couldn’t load data: {error}</p></Shell>;
  if (!state) return <Shell><p className="muted">Loading…</p></Shell>;

  const results = hydrateResults(state.results, state.matches ?? []);
  const board = buildLeaderboard(results, state.players);
  const max = Math.max(1, ...board.map((b) => b.total));
  const updated = new Date(state.lastUpdated).toLocaleString();

  return (
    <Shell>
      <ChampionCelebration />
      <h1>Leaderboard</h1>
      <p className="sub">Last updated {updated} · pot ${POT}</p>
      <p className="payout">
        {PAYOUTS.second === 0 && PAYOUTS.third === 0 ? (
          <>🏆 Winner takes all · ${PAYOUTS.first}</>
        ) : (
          <>
            🥇 ${PAYOUTS.first} &nbsp; 🥈 ${PAYOUTS.second} &nbsp; 🥉 ${PAYOUTS.third}
          </>
        )}
      </p>

      <div className="card">
        {board.map((b, i) => (
          <div key={b.player} className={`leader-row ${i === 0 ? "first" : ""}`}>
            <span className="rank">{i + 1}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Link href={`/player?name=${encodeURIComponent(b.player)}`} className="leader-name">
                  {b.player}
                </Link>
                <span className="pts">{b.total.toFixed(1)}</span>
              </div>
              <div className="bar-wrap">
                <div className="bar" style={{ width: `${(b.total / max) * 100}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2>Players</h2>
      <div className="player-links">
        {state.players.map((p) => (
          <Link key={p} href={`/player?name=${encodeURIComponent(p)}`}>{p}</Link>
        ))}
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <div className="container">{children}</div>
    </>
  );
}
