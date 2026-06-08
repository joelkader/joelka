"use client";
import Nav from "@/components/Nav";
import { usePoolState } from "@/lib/usePoolState";
import { groupStandings } from "@/lib/scoring";
import Flag from "@/components/Flag";
import Link from "next/link";

export default function StandingsPage() {
  const { state, error } = usePoolState();

  if (error) return <Shell><p className="muted">Couldn’t load data: {error}</p></Shell>;
  if (!state) return <Shell><p className="muted">Loading…</p></Shell>;

  const groups = groupStandings(state.matches ?? []);

  return (
    <Shell>
      <h1>Group standings</h1>
      <p className="sub">Live from the match scores — win 3, draw 1. Top 2 advance.</p>

      {groups.length === 0 ? (
        <p className="muted">No group matches yet.</p>
      ) : (
        groups.map(({ group, rows }) => (
          <div key={group} style={{ marginBottom: 18 }}>
            <h2 style={{ marginBottom: 8 }}>{group}</h2>
            <div className="card" style={{ padding: 0, overflowX: "auto" }}>
              <table className="standings-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Team</th>
                    <th className="num">P</th>
                    <th className="num">W</th>
                    <th className="num">D</th>
                    <th className="num">L</th>
                    <th className="num">GF</th>
                    <th className="num">GA</th>
                    <th className="num">GD</th>
                    <th className="num pts-col">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={r.team}>
                      <td className={i < 2 ? "qual" : ""}>{i + 1}</td>
                      <td><Flag team={r.team} /> {r.team}</td>
                      <td className="num">{r.played}</td>
                      <td className="num">{r.w}</td>
                      <td className="num">{r.d}</td>
                      <td className="num">{r.l}</td>
                      <td className="num">{r.gf}</td>
                      <td className="num">{r.ga}</td>
                      <td className="num">{r.gd > 0 ? `+${r.gd}` : r.gd}</td>
                      <td className="num pts-col">{r.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}

      <p style={{ marginTop: 16 }}><Link href="/schedule">View full schedule →</Link></p>
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
