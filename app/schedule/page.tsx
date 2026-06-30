"use client";
import Nav from "@/components/Nav";
import { usePoolState } from "@/lib/usePoolState";
import { Match } from "@/lib/scoring";
import { tierFor } from "@/data/tournament";
import Flag from "@/components/Flag";
import TierTag from "@/components/TierTag";
import Link from "next/link";

const KO_ROUNDS = ["Round of 32", "Round of 16", "Quarter-final", "Semi-final", "Final"];
const isReal = (t: string) => !!tierFor(t);

export default function SchedulePage() {
  const { state, error } = usePoolState();

  if (error) return <Shell><p className="muted">Couldn’t load data: {error}</p></Shell>;
  if (!state) return <Shell><p className="muted">Loading…</p></Shell>;

  const ownerOf = new Map(state.results.map((r) => [r.team, r.owner]));
  const matches = state.matches ?? [];

  // Group fixtures, grouped by group letter.
  const groupSections: { round: string; items: Match[] }[] = [];
  for (const m of matches) {
    if (!m.round.startsWith("Group ")) continue;
    let sec = groupSections.find((s) => s.round === m.round);
    if (!sec) { sec = { round: m.round, items: [] }; groupSections.push(sec); }
    sec.items.push(m);
  }
  groupSections.sort((a, b) => a.round.localeCompare(b.round));

  // Knockout matches, by round.
  const koByRound = new Map<string, Match[]>();
  for (const m of matches) {
    if (m.round.startsWith("Group ")) continue;
    if (!koByRound.has(m.round)) koByRound.set(m.round, []);
    koByRound.get(m.round)!.push(m);
  }
  const bracketCols = KO_ROUNDS.filter((r) => koByRound.has(r));
  const thirdPlace = koByRound.get("Third place") ?? [];

  function koCard(m: Match) {
    const oa = ownerOf.get(m.teamA) ?? null;
    const ob = ownerOf.get(m.teamB) ?? null;
    const aThrough = m.winner === "A";
    const bThrough = m.winner === "B";
    const aOut = m.winner === "B";
    const bOut = m.winner === "A";
    return (
      <div className="bracket-card" key={m.id}>
        {m.date && <div className="ko-when">{m.date}</div>}
        <div className={`ko-line ${aThrough ? "through" : ""} ${aOut ? "out" : ""}`}>
          {isReal(m.teamA) && <Flag team={m.teamA} />}
          <span className="ko-name">{m.teamA}</span>
          {isReal(m.teamA) && <TierTag team={m.teamA} />}
        </div>
        <div className={`ko-line ${bThrough ? "through" : ""} ${bOut ? "out" : ""}`}>
          {isReal(m.teamB) && <Flag team={m.teamB} />}
          <span className="ko-name">{m.teamB}</span>
          {isReal(m.teamB) && <TierTag team={m.teamB} />}
        </div>
        <div className="ko-owners">
          <span className={aThrough ? "won" : "match-owner"}>{oa ?? "—"}</span>
          <span className="muted"> vs </span>
          <span className={bThrough ? "won" : "match-owner"}>{ob ?? "—"}</span>
        </div>
      </div>
    );
  }

  return (
    <Shell>
      <h1>Schedule</h1>
      <p className="sub">The bracket and every group fixture — with the owning players facing off.</p>

      {matches.length === 0 && (
        <p className="muted">
          No matches yet. An admin can manage them in the{" "}
          <Link href="/admin">Admin panel</Link>.
        </p>
      )}

      {/* Knockout bracket */}
      {bracketCols.length > 0 && (
        <>
          <h2>Knockout bracket</h2>
          <div className="bracket">
            {bracketCols.map((round) => (
              <div className="bracket-col" key={round}>
                <h3 className="bracket-title">{round}</h3>
                {koByRound.get(round)!.map(koCard)}
              </div>
            ))}
          </div>
          {thirdPlace.length > 0 && (
            <>
              <h3 className="bracket-title" style={{ marginTop: 16 }}>Third place</h3>
              <div className="bracket">
                <div className="bracket-col">{thirdPlace.map(koCard)}</div>
              </div>
            </>
          )}
        </>
      )}

      {/* Group stage fixtures */}
      {groupSections.length > 0 && <h2>Group stage</h2>}
      {groupSections.map((sec) => (
        <div key={sec.round} style={{ marginBottom: 18 }}>
          <h3 className="bracket-title">{sec.round}</h3>
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
                      <Flag team={m.teamA} /> {m.teamA} <TierTag team={m.teamA} />
                    </span>
                    <span className="match-score">
                      {played ? `${m.scoreA} – ${m.scoreB}` : "vs"}
                    </span>
                    <span className={`match-side side-b ${bWon ? "won" : ""}`}>
                      <TierTag team={m.teamB} /> {m.teamB} <Flag team={m.teamB} />
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
      ))}

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
