import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});

// Helper: create or retrieve a Stripe customer
export async function getOrCreateStripeCustomer(
  email: string,
  name: string,
  phone?: string
): Promise<string> {
  const existing = await stripe.customers.list({ email, limit: 1 });
  if (existing.data.length > 0) return existing.data[0].id;

  const customer = await stripe.customers.create({
    email,
    name,
    phone: phone ?? undefined,
    metadata: { source: "bodeguitas" },
  });
  return customer.id;
}

// Helper: create a checkout session for deposit + first month
export async function createLeaseCheckoutSession({
  customerStripeId,
  unitNumber,
  monthlyRate,
  depositAmount,
  leaseId,
  successUrl,
  cancelUrl,
}: {
  customerStripeId: string;
  unitNumber: string;
  monthlyRate: number;
  depositAmount: number;
  leaseId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const session = await stripe.checkout.sessions.create({
    customer: customerStripeId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Bodeguitas Unit ${unitNumber} — Monthly Rent`,
            description: `Storage unit rental at Bodeguitas, Santa Teresa`,
          },
          unit_amount: Math.round(monthlyRate * 100),
          recurring: { interval: "month" },
        },
        quantity: 1,
      },
    ],
    // Charge deposit as a one-time add-on in the first invoice
    subscription_data: {
      metadata: { leaseId, unitNumber },
    },
    invoice_creation: undefined,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { leaseId, unitNumber, depositAmount: depositAmount.toString() },
  });

  return session;
}

// Helper: create a one-time payment for deposit
export async function createDepositCheckoutSession({
  customerStripeId,
  unitNumber,
  depositAmount,
  monthlyRate,
  leaseId,
  successUrl,
  cancelUrl,
}: {
  customerStripeId: string;
  unitNumber: string;
  depositAmount: number;
  monthlyRate: number;
  leaseId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const session = await stripe.checkout.sessions.create({
    customer: customerStripeId,
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Bodeguitas Unit ${unitNumber} — Security Deposit`,
          },
          unit_amount: Math.round(depositAmount * 100),
        },
        quantity: 1,
      },
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Bodeguitas Unit ${unitNumber} — First Month Rent`,
          },
          unit_amount: Math.round(monthlyRate * 100),
        },
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { leaseId, unitNumber, type: "deposit_and_first_month" },
  });

  return session;
}
