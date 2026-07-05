import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const leaseSchema = z.object({
  unitId: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(8),
  language: z.enum(["es", "en"]).default("es"),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = leaseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { unitId, name, email, phone, language } = parsed.data;

  const customer = await db.customer.upsert({
    where: { email },
    update: { name, phone, language },
    create: { name, email, phone, language },
  });

  const lease = await db.lease.create({
    data: { unitId, customerId: customer.id, status: "PENDING" },
  });

  return NextResponse.json({ leaseId: lease.id });
}
