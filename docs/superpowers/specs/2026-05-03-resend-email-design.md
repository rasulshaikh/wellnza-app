# Resend Email Integration Design

**Goal:** Add Resend-powered transactional emails for account creation, order status updates, and cart abandonment sequences.

**Architecture:**

```
lib/email.ts           → Resend client + sendEmail() helper
lib/email-templates/   → React email templates (welcome, order, cart)
app/api/email/send/    → Trigger emails server-side
app/api/cron/cart-abandonment/route.ts → Vercel Cron for abandoned cart detection
```

**Email Types & Triggers:**

| Email | Trigger | Template |
|---|---|---|
| Welcome | NextAuth jwt callback, first sign-in | `welcome.tsx` |
| Order Confirmed | `POST /api/checkout/create-order` after payment verified | `order-confirmed.tsx` |
| Order Shipped | `PATCH /api/admin/orders/[orderId]` status → "SHIPPED" | `order-shipped.tsx` |
| Order Delivered | `PATCH /api/admin/orders/[orderId]` status → "DELIVERED" | `order-delivered.tsx` |
| Order Cancelled | `PATCH /api/admin/orders/[orderId]` status → "CANCELLED" | `order-cancelled.tsx` |
| Cart Abandoned (1hr) | Vercel Cron, cart updated >1hr ago, has items, no order | `cart-abandoned-1hr.tsx` |
| Cart Abandoned (24hr) | Vercel Cron, cart updated >24hr ago, no order, email not sent | `cart-abandoned-24hr.tsx` |

**Cart Abandonment Timing:**
- Email 1 at 1 hour — "You left something behind" — friendly reminder with cart items
- Email 2 at 24 hours — "Still thinking?" — scarcity nudge + `COMEBACK10` discount code (10% off)

**Key Implementation Details:**

1. **Cart state must include user email** — Zustand cart persists to localStorage, add `email` field so we know who to email even for guest carts
2. **Cart abandonment check** — Cron route reads carts where `updatedAt` > 1hr (or 24hr) ago, `items` not empty, `orderId` null, `abandonmentEmailSent` false
3. **All emails** — From: `Wellnza Nutrition <hello@wellnzanutrition.com>` via Resend
4. **No new Prisma models** — reuse existing `User` and `Order` models

**Files to Create:**
- `lib/email.ts`
- `lib/email-templates/welcome.tsx`
- `lib/email-templates/order-confirmed.tsx`
- `lib/email-templates/order-shipped.tsx`
- `lib/email-templates/order-delivered.tsx`
- `lib/email-templates/order-cancelled.tsx`
- `lib/email-templates/cart-abandoned-1hr.tsx`
- `lib/email-templates/cart-abandoned-24hr.tsx`
- `app/api/email/send/route.ts`
- `app/api/cron/cart-abandonment/route.ts`

**Files to Modify:**
- `lib/auth.ts` — Add welcome email trigger in jwt callback
- `app/api/checkout/create-order/route.ts` — Add order confirmed email after payment verified
- `app/api/admin/orders/[orderId]/route.ts` — Add order status email on status change
- `store/cart.ts` (Zustand) — Add `email` field to cart state

**Environment Variables:**
- `RESEND_API_KEY` — Resend API key
- `NEXT_PUBLIC_APP_URL` — App URL for email links