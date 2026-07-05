import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookingSchema } from "@/lib/validations";
import {
  getOrCreateStripeCustomer,
  createDepositCheckoutSession,
} from "@/lib/stripe";
import { UnitStatus, LeaseStatus } from "@prisma/client";

// POST /api/checkout
// Body: { unitId, name, email, phone, whatsapp, idDocument, nationality, preferredStartDate, notes }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = bookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // 1. Verify unit is still available
    const unit = await db.unit.findUnique({
      where: { id: data.unitId },
      include: { container: true },
    });

    if (!unit) {
      return NextResponse.json({ error: "Unit not found" }, { status: 404 });
    }

    if (unit.status !== UnitStatus.AVAILABLE) {
      return NextResponse.json(
        { error: "Unit is no longer available" },
        { status: 409 }
      );
    }

    // 2. Create or find tenant
    let tenant = await db.tenant.findUnique({ where: { email: data.email } });

    if (!tenant) {
      tenant = await db.tenant.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone ?? null,
          whatsapp: data.whatsapp ?? null,
          idDocument: data.idDocument ?? null,
          nationality: data.nationality ?? null,
        },
      });
    }

    // 3. Create or retrieve Stripe customer
    const stripeCustomerId = await getOrCreateStripeCustomer(
      tenant.email,
      tenant.name,
      tenant.phone ?? undefined
    );

    // Update tenant with Stripe ID if not set
    if (!tenant.stripeCustomerId) {
      await db.tenant.update({
        where: { id: tenant.id },
        data: { stripeCustomerId },
      });
    }

    // 4. Calculate amounts
    const monthlyRate = unit.monthlyRate + unit.premiumAmount;
    const depositAmount = monthlyRate; // 1 month deposit

    // 5. Create lease record (PENDING until payment)
    const startDate = new Date(data.preferredStartDate);
    const lease = await db.lease.create({
      data: {
        tenantId: tenant.id,
        unitId: unit.id,
        startDate,
        monthlyRate,
        depositAmount,
        depositStatus: "unpaid",
        status: LeaseStatus.PENDING,
        notes: data.notes ?? null,
      },
    });

    // 6. Reserve the unit
    await db.unit.update({
      where: { id: unit.id },
      data: { status: UnitStatus.RESERVED },
    });

    // 7. Create Stripe Checkout session
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const session = await createDepositCheckoutSession({
      customerStripeId: stripeCustomerId,
      unitNumber: unit.unitNumber,
      depositAmount,
      monthlyRate,
      leaseId: lease.id,
      successUrl: `${appUrl}/success?lease=${lease.id}`,
      cancelUrl: `${appUrl}/book?unit=${unit.id}&cancelled=true`,
    });

    // 8. Save checkout session ID on lease
    await db.lease.update({
      where: { id: lease.id },
      data: { stripeCheckoutSessionId: session.id },
    });

    return NextResponse.json({
      checkoutUrl: session.url,
      leaseId: lease.id,
      unitNumber: unit.unitNumber,
      monthlyRate,
      depositAmount,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
