// POST /api/admin — protected by a shared admin password (env ADMIN_PASSWORD).
// Body: { password: string, results: TeamResult[], players?: string[] }
// Overwrites the stored results/players. Used by the admin panel.
import { NextRequest, NextResponse } from "next/server";
import { loadState, saveState } from "@/lib/store";
import { TeamResult } from "@/lib/scoring";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const expected = process.env.ADMIN_PASSWORD ?? "GGPAdmin26";

  if (body.password !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Login check only — used to unlock the admin UI without writing anything.
  if (body.verify) {
    return NextResponse.json({ ok: true });
  }

  const state = await loadState();

  if (Array.isArray(body.results)) {
    state.results = body.results as TeamResult[];
  }
  if (Array.isArray(body.players)) {
    state.players = body.players as string[];
  }

  await saveState(state);
  return NextResponse.json({ ok: true, lastUpdated: state.lastUpdated });
}
