# Santa Bodega — Customer Website

Spanish-first booking site for the storage vertical, wired to the KPH backend (ONVO Pay).

## What's here

```
santa-bodega-web/
  app/
    layout.tsx              # fonts + metadata (es)
    globals.css             # design tokens: weathered-container + Pacific-coast palette
    page.tsx                # landing: container-board hero + live availability grid
    book/page.tsx           # booking form → creates lease → redirects to ONVO checkout
    payment-result/page.tsx # ONVO redirect target; polls /api/payments/status
    portal/page.tsx         # (stub) tenant self-service — add next
    api/
      leases/route.ts             # POST: upsert customer + create PENDING lease
      payments/status/route.ts    # GET: poll order status for the result page
  lib/
    api.ts                  # typed client for /api/units, lease checkout
    db.ts                   # Prisma singleton
```

The heavy backend routes (`/api/units`, `/api/payments/create`, `/api/webhooks/onvo`)
live in the **kph-backend** package. This site expects them on the same origin, or set
`NEXT_PUBLIC_API_URL` to point at the backend deployment.

## The payment flow (important)

1. Customer fills the booking form → `POST /api/leases` creates the lease + customer.
2. Frontend calls `POST /api/payments/create { kind:"storage_lease" }` → gets the ONVO
   hosted `paymentUrl` → `window.location` redirect.
3. Customer pays on ONVO (card / SINPE Móvil).
4. ONVO redirects back to `/payment-result?order=…`.
5. **Fulfillment is server-side**: the ONVO webhook flips the lease to ACTIVE. The result
   page just *polls* `/api/payments/status` and shows success once the webhook lands — it
   never trusts the redirect alone. If the webhook is slow, the page shows a "confirming"
   state instead of a false success.

## Design notes

The look is built from the subject: weathered shipping containers on a concrete pad by the
Pacific. Container-orange (`--signal`) is the single bold accent, used only on primary
actions and unit numbers. Everything else is steel, sand, and faded marine teal. Type pairs
Archivo (display, with a narrow cut for the stencil labels you'd see stenciled on a
container door) against Inter for body. Corrugation shows up as repeating-linear-gradient
stripes in the hero, not as an image.

## Run it

```
npm install
cp .env.example .env    # set DATABASE_URL (+ NEXT_PUBLIC_API_URL if backend is separate)
npm run dev
```

The landing page renders with demo units even if the backend isn't up yet, so you can work
on styling before wiring the database.

## Next tasks (Claude Code)

- [ ] Build the `/portal` tenant page (lookup by email → active lease, payments, access code)
- [ ] After a successful lease, trigger the ONVO subscription setup for recurring rent
      (SDK tokenization on the result page, or a follow-up email link)
- [ ] Waitlist form when all units are occupied
- [ ] English toggle (the CRM already stores `language`; wire an es/en switch)
- [ ] Photos of the actual site/containers in the hero and unit cards
- [ ] SEO: opengraph image, sitemap, structured data for local business
```
