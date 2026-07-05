# Bodeguitas — Storage Rental Backend

Full-stack Next.js app for managing container storage units in Santa Teresa, Costa Rica.
Part of the KPH Holdings ecosystem (alongside Pinto Rides).

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CUSTOMER FLOW                            │
│                                                                 │
│  Landing Page ──► Browse Units ──► Booking Form ──► Stripe ──►  │
│  (/page.tsx)      (available,      (/book)         Checkout     │
│                    by size,                         (deposit +  │
│                    with price)                       1st month) │
│                                                        │        │
│                                                        ▼        │
│                                              Success Page ──►   │
│                                              (/success)    WA   │
│                                                           notif │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND FLOW                             │
│                                                                 │
│  POST /api/checkout                                             │
│    1. Validate input (Zod)                                      │
│    2. Check unit is AVAILABLE                                   │
│    3. Create/find Tenant in DB                                  │
│    4. Create Stripe Customer                                    │
│    5. Create Lease (PENDING)                                    │
│    6. Mark Unit as RESERVED                                     │
│    7. Create Stripe Checkout Session                            │
│    8. Return checkout URL → redirect customer                   │
│                                                                 │
│  POST /api/webhooks/stripe                                      │
│    checkout.session.completed:                                  │
│      → Activate Lease, mark Unit OCCUPIED                       │
│      → Record deposit + first month Payment                     │
│      → Send WhatsApp confirmation + access code                 │
│    invoice.paid:                                                │
│      → Record monthly Payment                                   │
│    invoice.payment_failed:                                      │
│      → Record failed Payment, WhatsApp alert                    │
│    customer.subscription.deleted:                               │
│      → End Lease, release Unit back to AVAILABLE                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       TENANT PORTAL                             │
│                                                                 │
│  /portal                                                        │
│    → Email lookup → GET /api/tenants?email=...                  │
│    → View active leases, unit info, payment history             │
│    → (Future: submit notice to vacate, update payment method)   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer            | Tool                | Why                                        |
|------------------|---------------------|--------------------------------------------|
| Framework        | Next.js 14 (App Router) | SSR + API routes in one deploy          |
| Database         | PostgreSQL + Prisma | Type-safe ORM, easy migrations             |
| Payments         | Stripe Checkout     | Hosted checkout, subscriptions, webhooks   |
| Validation       | Zod                 | Runtime schema validation on API inputs    |
| Notifications    | Twilio WhatsApp API | Primary comms channel in Costa Rica        |
| Styling          | Tailwind CSS        | Fast, utility-first, mobile-ready          |
| Hosting          | Vercel              | Zero-config Next.js deploys                |
| DB Hosting       | Supabase / Neon     | Free-tier Postgres with connection pooling |

---

## Data Model

```
Container (physical 40ft box)
  └── Unit[] (subdivisions: QUARTER / HALF / FULL)
        ├── status: AVAILABLE | RESERVED | OCCUPIED | MAINTENANCE
        ├── monthlyRate, premiumAmount, hasElectricity
        └── Lease[]
              ├── Tenant (name, email, phone, stripeCustomerId)
              ├── status: PENDING | ACTIVE | NOTICE | ENDED
              ├── stripeSubscriptionId / stripeCheckoutSessionId
              └── Payment[] (DEPOSIT | MONTHLY_RENT | LATE_FEE | REFUND)

WaitlistEntry (for when units are full)
AccessLog (security: who accessed what, when)
```

---

## File Structure

```
bodeguitas/
├── prisma/
│   ├── schema.prisma        # Full data model
│   └── seed.ts              # Seeds 3 containers, 9 units
├── lib/
│   ├── db.ts                # Prisma client singleton
│   ├── stripe.ts            # Stripe helpers (customer, checkout sessions)
│   ├── validations.ts       # Zod schemas
│   └── whatsapp.ts          # Twilio WhatsApp notification templates
├── app/
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Tailwind imports
│   ├── page.tsx              # Landing page — unit availability grid
│   ├── book/page.tsx         # Booking form → Stripe checkout
│   ├── success/page.tsx      # Post-payment confirmation
│   ├── portal/page.tsx       # Tenant self-service portal
│   └── api/
│       ├── units/route.ts        # GET available units
│       ├── checkout/route.ts     # POST create lease + Stripe session
│       ├── tenants/route.ts      # GET tenant info + payment history
│       └── webhooks/stripe/route.ts  # Stripe webhook handler
├── .env.example
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── next.config.js
```

---

## Setup Instructions

### 1. Clone and install

```bash
cd bodeguitas
npm install
```

### 2. Set up your database

Use [Supabase](https://supabase.com) (free tier) or [Neon](https://neon.tech) for hosted Postgres.
Copy `.env.example` to `.env` and fill in `DATABASE_URL`.

```bash
cp .env.example .env
# Edit .env with your database URL
```

### 3. Push schema and seed

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### 4. Set up Stripe

1. Create a [Stripe account](https://stripe.com)
2. Get your test API keys from the Stripe Dashboard
3. Add `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY` to `.env`
4. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli) for webhook testing:

```bash
# In a separate terminal:
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# Copy the webhook secret (whsec_...) to .env as STRIPE_WEBHOOK_SECRET
```

### 5. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000 — you should see the unit availability grid.

### 6. Test the flow

1. Pick a unit → click "Reserve This Unit"
2. Fill out the booking form
3. Complete payment with Stripe test card `4242 4242 4242 4242`
4. Check the success page
5. Visit `/portal` and look up the email you used

---

## Claude Code Refinement Checklist

When you open this in Claude Code, here's what to prioritize:

### Phase 1: Get it running
- [ ] `npm install` and resolve any dependency issues
- [ ] Set up a Supabase project, get the connection string
- [ ] `npx prisma db push` + `npm run db:seed`
- [ ] Get Stripe test keys configured
- [ ] Verify the full flow works end-to-end locally

### Phase 2: Harden the backend
- [ ] Add rate limiting to `/api/checkout` (prevent double-submissions)
- [ ] Add an expiry job: if a RESERVED unit isn't paid within 30 min, revert to AVAILABLE
- [ ] Add proper error boundaries in the React components
- [ ] Add Stripe subscription creation after initial deposit payment (for recurring monthly billing)
- [ ] Implement the notice-to-vacate flow (tenant submits → 30-day countdown → lease ends)
- [ ] Add CORS headers and API key auth for any external integrations

### Phase 3: Admin dashboard
- [ ] Build `/admin` with occupancy grid (visual map of all units + statuses)
- [ ] Revenue dashboard: MRR, occupancy rate, overdue payments
- [ ] Tenant management: view all tenants, edit lease terms, manual overrides
- [ ] Maintenance mode toggle per unit
- [ ] Export payment data as CSV for accounting

### Phase 4: WhatsApp activation
- [ ] Set up Twilio account and WhatsApp Business profile
- [ ] Register WhatsApp message templates (required for proactive messages)
- [ ] Wire up real credentials in `.env`
- [ ] Add payment reminder cron job (3 days before due date)
- [ ] Add overdue payment escalation (7 days → 14 days → access revoked)

### Phase 5: Production deploy
- [ ] Deploy to Vercel (`vercel --prod`)
- [ ] Set up production Stripe keys and webhook endpoint
- [ ] Configure custom domain (bodeguitas.cr or similar)
- [ ] Set up Stripe production webhook URL in Dashboard
- [ ] Add monitoring (Sentry for errors, Plausible for analytics)
- [ ] Test full flow on production with a real card

### Future enhancements
- [ ] Smart lock API integration (e.g., Nuki, TTLock) for keyless access
- [ ] Automated late fee generation (Stripe billing + webhook)
- [ ] Multi-language support (ES/EN toggle)
- [ ] Photo documentation on move-in/move-out (damage tracking)
- [ ] Referral program (tenant refers → gets a discount month)
- [ ] Integration with Pinto Rides CRM for cross-selling

---

## Key Decisions & Notes

**Why one-time payment first, not subscription?**
The initial checkout charges deposit + first month as a one-time payment. This is simpler
to implement and avoids the complexity of Stripe subscription trial periods for the deposit.
Recurring billing should be set up after the first payment succeeds (Phase 2 task).

**Why email lookup for the portal instead of auth?**
Keeps the MVP simple. In production, add Clerk or NextAuth for proper authentication.
The email lookup is a placeholder that works for demos and early tenants.

**Why WhatsApp over email?**
In Santa Teresa and Costa Rica generally, WhatsApp is the primary communication channel.
Email is still used for receipts and formal records, but WhatsApp gets faster responses
and higher open rates. The stub in `lib/whatsapp.ts` logs to console until Twilio is configured.

**Stripe API version**: Using `2024-12-18.acacia`. Update if Stripe releases newer versions.
