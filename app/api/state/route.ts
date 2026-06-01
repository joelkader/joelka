// GET /api/state — public, read-only. Returns the full pool state.
import { NextResponse } from "next/server";
import { loadState } from "@/lib/store";

export const dynamic = "force-dynamic"; // never cache; always fresh

export async function GET() {
  const state = await loadState();
  return NextResponse.json(state);
}
