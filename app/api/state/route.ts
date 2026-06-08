// GET /api/state — public, read-only. Returns the full pool state.
import { NextResponse } from "next/server";
import { loadState } from "@/lib/store";

export const dynamic = "force-dynamic"; // run at request time (reads Blobs)

export async function GET() {
  const state = await loadState();
  // No caching: an admin save must be visible immediately. (A CDN cache here
  // made saves look like they "reverted" — the edge served a pre-save copy.)
  return NextResponse.json(state, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
