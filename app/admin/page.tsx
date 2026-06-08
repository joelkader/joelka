"use client";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import { usePoolState } from "@/lib/usePoolState";
import { TeamResult, teamPoints, Match, groupRecordsByTeam, hydrateGroupResults } from "@/lib/scoring";
import { TIER_MULTIPLIER, TEAMS } from "@/data/tournament";
import Flag from "@/components/Flag";

const PW_KEY = "wcpool_admin_pw"; // remembered for this browser session only

export default function AdminPage() {
  const { state, refresh } = usePoolState(0); // no auto-poll while editing
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [rows, setRows] = useState<TeamResult[]>([]);
  const [players, setPlayers] = useState<string[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [saving, setSaving] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  // Draft for the "add match" form.
  const [draft, setDraft] = useState({ round: "", date: "", teamA: "", teamB: "" });

  // Restore a previously-verified password for this session so the admin
  // doesn't have to retype it on every visit.
  useEffect(() => {
    const saved = sessionStorage.getItem(PW_KEY);
    if (saved) {
      setPassword(saved);
      setUnlocked(true);
    }
  }, []);

  useEffect(() => {
    if (state) {
      setRows(state.results);
      setPlayers(state.players);
      setMatches(state.matches ?? []);
    }
  }, [state]);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }

  async function unlock() {
    setUnlocking(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, verify: true }),
      });
      if (res.ok) {
        sessionStorage.setItem(PW_KEY, password);
        setUnlocked(true);
      } else if (res.status === 401) {
        flash("Wrong password");
      } else {
        flash("Couldn’t verify — try again");
      }
    } catch {
      flash("Couldn’t verify — try again");
    } finally {
      setUnlocking(false);
    }
  }

  function lock() {
    sessionStorage.removeItem(PW_KEY);
    setPassword("");
    setUnlocked(false);
  }

  function update(team: string, patch: Partial<TeamResult>) {
    setRows((prev) => prev.map((r) => (r.team === team ? { ...r, ...patch } : r)));
  }

  function addMatch() {
    if (!draft.teamA || !draft.teamB || draft.teamA === draft.teamB) {
      flash("Pick two different teams");
      return;
    }
    const m: Match = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      round: draft.round.trim(),
      date: draft.date.trim(),
      teamA: draft.teamA,
      teamB: draft.teamB,
      scoreA: null,
      scoreB: null,
    };
    setMatches((prev) => [...prev, m]);
    setDraft({ round: "", date: "", teamA: "", teamB: "" });
  }

  function updateMatch(id: string, patch: Partial<Match>) {
    setMatches((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }

  function removeMatch(id: string) {
    setMatches((prev) => prev.filter((m) => m.id !== id));
  }

  // Parse a score input ("" -> null, else clamped non-negative integer).
  function parseScore(v: string): number | null {
    if (v.trim() === "") return null;
    const n = Math.max(0, Math.floor(+v));
    return isNaN(n) ? null : n;
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          results: hydrateGroupResults(rows, matches), // group W/D from scores
          players,
          matches,
        }),
      });
      if (res.status === 401) {
        flash("Wrong password");
        lock(); // password changed/invalid — send back to login
      } else if (!res.ok) {
        flash("Save failed");
      } else {
        flash("Saved ✓");
        refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  // ---- Login gate: nothing else renders until the password is verified. ----
  if (!unlocked) {
    return (
      <Shell>
        <h1>Admin</h1>
        <p className="sub">Enter the admin password to manage the pool.</p>
        <div className="card">
          <label>Admin password</label>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (password && !unlocking) unlock();
            }}
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              autoFocus
              style={{ width: 240 }}
            />
            <div style={{ marginTop: 12 }}>
              <button type="submit" disabled={!password || unlocking}>
                {unlocking ? "Checking…" : "Unlock"}
              </button>
            </div>
          </form>
        </div>
        {toast && <div className="toast">{toast}</div>}
      </Shell>
    );
  }

  // ---- Unlocked: full admin controls. ----
  if (!state) return <Shell><p className="muted">Loading…</p></Shell>;

  const shown = rows.filter((r) =>
    r.team.toLowerCase().includes(filter.toLowerCase())
  );

  // Group W/D are derived from the entered match scores (single source).
  const recs = groupRecordsByTeam(matches);

  // Unsaved-changes flag — drives the floating "Save" button in the corner.
  const dirty =
    JSON.stringify(rows) !== JSON.stringify(state.results) ||
    JSON.stringify(players) !== JSON.stringify(state.players) ||
    JSON.stringify(matches) !== JSON.stringify(state.matches ?? []);

  return (
    <Shell>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h1>Admin</h1>
        <button className="ghost" onClick={lock}>Lock</button>
      </div>
      <p className="sub">Assign teams after the draw, then tick results as matches finish.</p>

      <h2>Player names</h2>
      <div className="card">
        {players.map((p, i) => (
          <div key={i} style={{ marginBottom: 6 }}>
            <input
              value={p}
              onChange={(e) =>
                setPlayers((prev) => prev.map((x, j) => (j === i ? e.target.value : x)))
              }
              style={{ width: 240 }}
            />
          </div>
        ))}
        <p className="muted">Renaming here updates everywhere. Keep the count the same ({players.length}).</p>
      </div>

      <h2>Teams &amp; results</h2>
      <input
        placeholder="filter teams…"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ width: 240, marginBottom: 10 }}
      />

      <div className="card" style={{ padding: 0 }}>
        <div className="admin-team" style={{ fontWeight: 700, color: "var(--muted)" }}>
          <span>Team</span>
          <span>Tier</span>
          <span>Owner</span>
          <span>GW</span>
          <span>GD</span>
          <span>R32</span>
          <span>R16</span>
          <span>QF</span>
          <span>SF</span>
          <span>Fin</span>
          <span>🏆</span>
        </div>
        {shown.map((r) => {
          const rec = recs.get(r.team);
          const gw = rec?.w ?? 0;
          const gd = rec?.d ?? 0;
          const pts = teamPoints({ ...r, groupWins: gw, groupDraws: gd });
          return (
          <div className="admin-team" key={r.team}>
            <span className="name">
              <Flag team={r.team} /> {r.team}{" "}
              <span className="flag">({pts.toFixed(1)})</span>
            </span>
            <span>
              <span className={`tier-badge tier-${r.tier}`}>×{TIER_MULTIPLIER[r.tier]}</span>
            </span>
            <select
              value={r.owner ?? ""}
              onChange={(e) => update(r.team, { owner: e.target.value || null })}
            >
              <option value="">—</option>
              {players.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <span className="derived" title="From match scores">{gw}</span>
            <span className="derived" title="From match scores">{gd}</span>
            <input type="checkbox" checked={r.reachedR32}
              onChange={(e) => update(r.team, { reachedR32: e.target.checked })} />
            <input type="checkbox" checked={r.reachedR16}
              onChange={(e) => update(r.team, { reachedR16: e.target.checked })} />
            <input type="checkbox" checked={r.reachedQF}
              onChange={(e) => update(r.team, { reachedQF: e.target.checked })} />
            <input type="checkbox" checked={r.reachedSF}
              onChange={(e) => update(r.team, { reachedSF: e.target.checked })} />
            <input type="checkbox" checked={r.reachedFinal}
              onChange={(e) => update(r.team, { reachedFinal: e.target.checked })} />
            <input type="checkbox" checked={r.champion}
              onChange={(e) => update(r.team, { champion: e.target.checked })} />
          </div>
          );
        })}
      </div>
      <p className="muted" style={{ marginTop: 6 }}>
        GW/GD are calculated from the group match scores below. Tick the knockout
        rounds a team reaches.
      </p>

      <h2>Schedule</h2>
      <p className="muted" style={{ marginTop: -6, marginBottom: 10 }}>
        Add fixtures (e.g. France vs Senegal). The public Schedule page shows the
        owning players facing off; enter scores once a match is played.
      </p>

      {/* Add a match */}
      <div className="card" style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        <input
          placeholder="round (e.g. Group A)"
          value={draft.round}
          onChange={(e) => setDraft({ ...draft, round: e.target.value })}
          style={{ width: 150 }}
        />
        <input
          placeholder="date (e.g. Jun 11)"
          value={draft.date}
          onChange={(e) => setDraft({ ...draft, date: e.target.value })}
          style={{ width: 130 }}
        />
        <select value={draft.teamA} onChange={(e) => setDraft({ ...draft, teamA: e.target.value })}>
          <option value="">Team A…</option>
          {TEAMS.map((t) => (
            <option key={t.name} value={t.name}>{t.name}</option>
          ))}
        </select>
        <span className="muted">vs</span>
        <select value={draft.teamB} onChange={(e) => setDraft({ ...draft, teamB: e.target.value })}>
          <option value="">Team B…</option>
          {TEAMS.map((t) => (
            <option key={t.name} value={t.name}>{t.name}</option>
          ))}
        </select>
        <button onClick={addMatch}>Add match</button>
      </div>

      {/* Existing matches */}
      {matches.length > 0 && (
        <div className="card" style={{ padding: 0, marginTop: 10 }}>
          {matches.map((m) => (
            <div key={m.id} className="admin-match">
              <span className="muted" style={{ minWidth: 120 }}>
                {[m.round, m.date].filter(Boolean).join(" · ") || "—"}
              </span>
              <span style={{ flex: 1, textAlign: "right" }}>
                <Flag team={m.teamA} /> {m.teamA}
              </span>
              <input
                type="number" min={0} placeholder="-"
                value={m.scoreA ?? ""}
                onChange={(e) => updateMatch(m.id, { scoreA: parseScore(e.target.value) })}
                style={{ width: 44, textAlign: "center" }}
              />
              <span className="muted">–</span>
              <input
                type="number" min={0} placeholder="-"
                value={m.scoreB ?? ""}
                onChange={(e) => updateMatch(m.id, { scoreB: parseScore(e.target.value) })}
                style={{ width: 44, textAlign: "center" }}
              />
              <span style={{ flex: 1 }}>
                {m.teamB} <Flag team={m.teamB} />
              </span>
              <button className="ghost" onClick={() => removeMatch(m.id)} title="Remove">✕</button>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <button onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </button>
        <button
          className="ghost"
          onClick={() => {
            if (!state) return;
            setRows(state.results);
            setPlayers(state.players);
            setMatches(state.matches ?? []);
          }}
        >
          Reset edits
        </button>
      </div>
      <p className="muted" style={{ marginTop: 8 }}>
        Tip: tick achievements cumulatively. A team in the QF should have R32, R16 and QF all checked.
      </p>

      {/* Floating save button — appears in the corner once you've made a change. */}
      {dirty && (
        <button className="save-fab" onClick={save} disabled={saving}>
          <span className="dot" />
          {saving ? "Saving…" : "Save changes"}
        </button>
      )}

      {toast && <div className="toast">{toast}</div>}
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
