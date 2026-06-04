// GET /api/state — public, read-only. Returns the full pool state.
import { NextResponse } from "next/server";
import { loadState } from "@/lib/store";

export const dynamic = "force-dynamic"; // run at request time (reads Blobs)

export async function GET() {
  const state = await loadState();
  // Cache at the CDN/edge so repeat loads and polls don't wake the function
  // every time. The data only changes on an admin save, and the app tolerates
  // ~60s lag. The browser still revalidates (max-age=0); the edge serves a
  // cached copy for up to 30s and a stale one while it refreshes.
  return NextResponse.json(state, {
    headers: {
      "Cache-Control":
        "public, max-age=0, s-maxage=30, stale-while-revalidate=120",
    },
  });
}
