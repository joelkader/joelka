"use client";
import Nav from "@/components/Nav";
import { usePoolState } from "@/lib/usePoolState";
import { flagFor } from "@/data/tournament";
import Link from "next/link";

export default function SchedulePage() {
  const { state, error } = usePoolState();

  if (error) return <Shell><p className="muted">Couldn’t load data: {error}</p></Shell>;
  if (!state) return <Shell><p className="muted">Loading…</p></Shell>;

  // team name -> owning player (or null)
  const ownerOf = new Map(state.results.map((r) => [r.team, r.owner]));
  const matches = state.matches ?? [];

  return (
    <Shell>
      <h1>Schedule</h1>
      <p className="sub">Every fixture, with the owning players facing off.</p>

      {matches.length === 0 ? (
        <p className="muted">
          No matches added yet. An admin can add them in the{" "}
          <Link href="/admin">Admin panel</Link>.
        </p>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          {matches.map((m) => {
            const oa = ownerOf.get(m.teamA) ?? null;
            const ob = ownerOf.get(m.teamB) ?? null;
            const played = m.scoreA != null && m.scoreB != null;
            const aWon = played && (m.scoreA as number) > (m.scoreB as number);
            const bWon = played && (m.scoreB as number) > (m.scoreA as number);
            return (
              <div key={m.id} className="match-row">
                <div className="match-meta">
                  {m.round && <span className="match-round">{m.round}</span>}
                  {m.date && <span className="muted">{m.date}</span>}
                </div>
                <div className="match-teams">
                  <span className={`match-side side-a ${aWon ? "won" : ""}`}>
                    <span className="team-flag">{flagFor(m.teamA)}</span> {m.teamA}
                  </span>
                  <span className="match-score">
                    {played ? `${m.scoreA} – ${m.scoreB}` : "vs"}
                  </span>
                  <span className={`match-side side-b ${bWon ? "won" : ""}`}>
                    {m.teamB} <span className="team-flag">{flagFor(m.teamB)}</span>
                  </span>
                </div>
                <div className="match-owners">
                  <span className={aWon ? "won" : "match-owner"}>{oa ?? "—"}</span>
                  <span className="muted"> vs </span>
                  <span className={bWon ? "won" : "match-owner"}>{ob ?? "—"}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p style={{ marginTop: 16 }}><Link href="/">← Back to leaderboard</Link></p>
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
