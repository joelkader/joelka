import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/tenants?email=tenant@example.com
// Returns tenant info with active leases and payment history
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const tenant = await db.tenant.findUnique({
    where: { email },
    include: {
      leases: {
        include: {
          unit: {
            include: {
              container: { select: { locationOnSite: true } },
            },
          },
          payments: {
            orderBy: { createdAt: "desc" },
            take: 12, // last 12 payments
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  }

  // Strip sensitive fields
  const { idDocument, stripeCustomerId, ...safe } = tenant;

  return NextResponse.json(safe);
}
