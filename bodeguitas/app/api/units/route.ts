import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { UnitSize, UnitStatus } from "@prisma/client";

// GET /api/units?size=QUARTER&electricity=true
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const size = searchParams.get("size") as UnitSize | null;
  const electricity = searchParams.get("electricity");
  const status = searchParams.get("status") as UnitStatus | null;

  const where: any = {};

  // Default: only show available units on public endpoint
  where.status = status ?? UnitStatus.AVAILABLE;

  if (size && Object.values(UnitSize).includes(size)) {
    where.size = size;
  }
  if (electricity === "true") {
    where.hasElectricity = true;
  }

  const units = await db.unit.findMany({
    where,
    include: {
      container: {
        select: { serialNumber: true, locationOnSite: true, sizeFt: true },
      },
    },
    orderBy: { unitNumber: "asc" },
  });

  // Also get summary counts for the availability display
  const allUnits = await db.unit.groupBy({
    by: ["status"],
    _count: { id: true },
  });

  const summary = {
    total: allUnits.reduce((sum, g) => sum + g._count.id, 0),
    available: allUnits.find((g) => g.status === "AVAILABLE")?._count.id ?? 0,
    occupied: allUnits.find((g) => g.status === "OCCUPIED")?._count.id ?? 0,
    reserved: allUnits.find((g) => g.status === "RESERVED")?._count.id ?? 0,
    maintenance: allUnits.find((g) => g.status === "MAINTENANCE")?._count.id ?? 0,
  };

  return NextResponse.json({ units, summary });
}
