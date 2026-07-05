import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const order = req.nextUrl.searchParams.get("order");
  if (!order) {
    return NextResponse.json({ error: "Missing order" }, { status: 400 });
  }

  const lease = await db.lease.findUnique({ where: { orderId: order } });
  if (!lease) {
    // The ONVO webhook may not have attached the order to a lease yet.
    return NextResponse.json({ status: "CONFIRMING" });
  }

  return NextResponse.json({ status: lease.status });
}
