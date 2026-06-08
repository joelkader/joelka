"use client";
import Nav from "@/components/Nav";
import { usePoolState } from "@/lib/usePoolState";
import Flag from "@/components/Flag";
import Link from "next/link";

export default function SchedulePage() {
  const { state, error } = usePoolState();

  if (error) return <Shell><p className="muted">Couldn’t load data: {error}</p></Shell>;
  if (!state) return <Shell><p className="muted">Loading…</p></Shell>;

  // team name -> owning player (or null)
  const ownerOf = new Map(state.results.map((r) => [r.team, r.owner]));
  const matches = state.matches ?? [];

  // Group fixtures by round, then order: Groups A–L, then knockout rounds.
  const sections: { round: string; items: typeof matches }[] = [];
  for (const m of matches) {
    let sec = sections.find((s) => s.round === m.round);
    if (!sec) {
      sec = { round: m.round, items: [] };
      sections.push(sec);
    }
    sec.items.push(m);
  }
  const KO_ORDER = ["Round of 32", "Round of 16", "Quarter-final", "Semi-final", "Third place", "Final"];
  const rank = (r: string) =>
    r.startsWith("Group ") ? r.charCodeAt(6) : 1000 + KO_ORDER.indexOf(r);
  sections.sort((a, b) => rank(a.round) - rank(b.round));

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
        sections.map((sec) => (
          <div key={sec.round} style={{ marginBottom: 18 }}>
            <h2 style={{ marginBottom: 8 }}>{sec.round}</h2>
            <div className="card" style={{ padding: 0 }}>
              {sec.items.map((m) => {
                const oa = ownerOf.get(m.teamA) ?? null;
                const ob = ownerOf.get(m.teamB) ?? null;
                const played = m.scoreA != null && m.scoreB != null;
                const aWon = played && (m.scoreA as number) > (m.scoreB as number);
                const bWon = played && (m.scoreB as number) > (m.scoreA as number);
                const drawn = played && (m.scoreA as number) === (m.scoreB as number);
                return (
                  <div key={m.id} className="match-row">
                    <div className="match-meta">
                      {m.date && <span className="muted">{m.date}</span>}
                      {m.venue && <span className="match-venue">{m.venue}</span>}
                      {drawn && <span className="draw-tag">Draw</span>}
                    </div>
                    <div className="match-teams">
                      <span className={`match-side side-a ${aWon ? "won" : ""}`}>
                        <Flag team={m.teamA} /> {m.teamA}
                      </span>
                      <span className="match-score">
                        {played ? `${m.scoreA} – ${m.scoreB}` : "vs"}
                      </span>
                      <span className={`match-side side-b ${bWon ? "won" : ""}`}>
                        {m.teamB} <Flag team={m.teamB} />
                      </span>
                    </div>
                    <div className="match-office-label">Office matchup</div>
                    <div className="match-owners">
                      <span className={aWon ? "won" : "match-owner"}>{oa ?? "—"}</span>
                      <span className="muted"> {drawn ? "drew" : "vs"} </span>
                      <span className={bWon ? "won" : "match-owner"}>{ob ?? "—"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
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
