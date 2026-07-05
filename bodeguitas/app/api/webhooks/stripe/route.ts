import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { UnitStatus, LeaseStatus, PaymentType, PaymentStatus } from "@prisma/client";
import {
  notifyPaymentReceived,
  notifyAccessCode,
  notifyPaymentFailed,
} from "@/lib/whatsapp";
import Stripe from "stripe";

// Disable body parsing — Stripe needs the raw body
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      // ─── One-time payment completed (deposit + first month) ───
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const leaseId = session.metadata?.leaseId;

        if (!leaseId) break;

        const lease = await db.lease.findUnique({
          where: { id: leaseId },
          include: { unit: true, tenant: true },
        });

        if (!lease) break;

        // Activate the lease
        await db.lease.update({
          where: { id: leaseId },
          data: {
            status: LeaseStatus.ACTIVE,
            depositStatus: "paid",
          },
        });

        // Mark unit as occupied
        await db.unit.update({
          where: { id: lease.unitId },
          data: { status: UnitStatus.OCCUPIED },
        });

        // Record deposit payment
        await db.payment.create({
          data: {
            leaseId,
            amount: lease.depositAmount,
            type: PaymentType.DEPOSIT,
            status: PaymentStatus.PAID,
            paidDate: new Date(),
            stripePaymentIntentId: session.payment_intent as string,
          },
        });

        // Record first month payment
        await db.payment.create({
          data: {
            leaseId,
            amount: lease.monthlyRate,
            type: PaymentType.MONTHLY_RENT,
            status: PaymentStatus.PAID,
            paidDate: new Date(),
            dueDate: lease.startDate,
            stripePaymentIntentId: session.payment_intent as string,
          },
        });

        // Send WhatsApp notifications
        const phone = lease.tenant.whatsapp ?? lease.tenant.phone;
        if (phone) {
          await notifyPaymentReceived(
            phone,
            lease.unit.unitNumber,
            lease.depositAmount + lease.monthlyRate
          );

          // Generate a simple access code (in production, integrate with smart lock API)
          const accessCode = Math.floor(1000 + Math.random() * 9000).toString();
          await notifyAccessCode(phone, lease.unit.unitNumber, accessCode);
        }

        console.log(`Lease ${leaseId} activated for unit ${lease.unit.unitNumber}`);
        break;
      }

      // ─── Subscription invoice paid (recurring monthly) ───
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;

        if (!subscriptionId) break;

        const lease = await db.lease.findFirst({
          where: { stripeSubscriptionId: subscriptionId },
          include: { unit: true, tenant: true },
        });

        if (!lease) break;

        await db.payment.create({
          data: {
            leaseId: lease.id,
            amount: invoice.amount_paid / 100,
            type: PaymentType.MONTHLY_RENT,
            status: PaymentStatus.PAID,
            paidDate: new Date(),
            dueDate: new Date(invoice.period_start * 1000),
            stripeInvoiceId: invoice.id,
          },
        });

        console.log(`Monthly payment recorded for lease ${lease.id}`);
        break;
      }

      // ─── Payment failed ───
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;

        if (!subscriptionId) break;

        const lease = await db.lease.findFirst({
          where: { stripeSubscriptionId: subscriptionId },
          include: { unit: true, tenant: true },
        });

        if (!lease) break;

        await db.payment.create({
          data: {
            leaseId: lease.id,
            amount: invoice.amount_due / 100,
            type: PaymentType.MONTHLY_RENT,
            status: PaymentStatus.FAILED,
            dueDate: new Date(invoice.period_start * 1000),
            stripeInvoiceId: invoice.id,
          },
        });

        // Notify tenant
        const phone = lease.tenant.whatsapp ?? lease.tenant.phone;
        if (phone) {
          await notifyPaymentFailed(phone, lease.unit.unitNumber);
        }

        console.log(`Payment failed for lease ${lease.id}`);
        break;
      }

      // ─── Subscription cancelled ───
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const lease = await db.lease.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (!lease) break;

        await db.lease.update({
          where: { id: lease.id },
          data: {
            status: LeaseStatus.ENDED,
            moveOutDate: new Date(),
          },
        });

        await db.unit.update({
          where: { id: lease.unitId },
          data: { status: UnitStatus.AVAILABLE },
        });

        console.log(`Lease ${lease.id} ended, unit released`);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
