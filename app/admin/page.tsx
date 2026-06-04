"use client";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import { usePoolState } from "@/lib/usePoolState";
import { TeamResult, teamPoints } from "@/lib/scoring";
import { TIER_MULTIPLIER } from "@/data/tournament";

const PW_KEY = "wcpool_admin_pw"; // remembered for this browser session only

export default function AdminPage() {
  const { state, refresh } = usePoolState(0); // no auto-poll while editing
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [rows, setRows] = useState<TeamResult[]>([]);
  const [players, setPlayers] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

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

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, results: rows, players }),
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

  // Unsaved-changes flag — drives the floating "Save" button in the corner.
  const dirty =
    JSON.stringify(rows) !== JSON.stringify(state.results) ||
    JSON.stringify(players) !== JSON.stringify(state.players);

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
        {shown.map((r) => (
          <div className="admin-team" key={r.team}>
            <span className="name">
              {r.team}{" "}
              <span className="flag">({teamPoints(r).toFixed(1)})</span>
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
            <input type="number" min={0} max={3} value={r.groupWins}
              onChange={(e) => update(r.team, { groupWins: clamp(+e.target.value, 0, 3) })}
              style={{ width: 48 }} />
            <input type="number" min={0} max={3} value={r.groupDraws}
              onChange={(e) => update(r.team, { groupDraws: clamp(+e.target.value, 0, 3) })}
              style={{ width: 48 }} />
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
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <button onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </button>
        <button className="ghost" onClick={() => state && setRows(state.results)}>
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

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, isNaN(n) ? 0 : n));
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <div className="container">{children}</div>
    </>
  );
}
