# Well NZ Nutrition — Architecture Document

**Generated:** 2026-05-06
**Project:** well-nz-nutrition

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript) |
| Database | PostgreSQL via Prisma (Neon.tech) |
| Auth | NextAuth v5 — Google OAuth + Credentials (bcrypt) |
| Payments | Razorpay + Stripe |
| Deployment | Vercel |
| Styling | Tailwind CSS + custom athletic dark theme |
| Fonts | Bebas Neue (headings) + Oswald (body) |

---

## Route Groups

```
app/
├── (store)/          ← Public storefront (products, cart, checkout, account)
├── (auth)/           ← Login, register, forgot/reset password
├── admin/            ← Future admin panel
├── api/              ← API routes (auth, webhooks, etc.)
```

### Storefront Pages (all athletic dark theme)

| Route | Description |
|---|---|
| `/` | Homepage with HeroSlider, product showcases |
| `/products` | Product listing with category filtering |
| `/products/[slug]` | Product detail (nutrition facts, variants, reviews) |
| `/cart` | Cart drawer |
| `/checkout` | 3-step checkout (contact → shipping → payment via Razorpay) |
| `/order-confirmation` | Post-payment confirmation |
| `/account` | Dashboard (orders, addresses, subscription, settings) |
| `/about` | Static content |
| `/privacy` | Privacy policy |
| `/terms` | Terms & conditions |

---

## Data Model (Prisma — PostgreSQL)

### Core Entities

```
User
├── accounts (OAuth providers)
├── sessions (NextAuth)
├── addresses (shipping/billing)
├── orders (with OrderItems)
├── subscriptions (recurring)
├── loyaltyLedger (points history)
└── reviews (product reviews)

Product
└── ProductVariant
     ├── Inventory (per location)
     ├── OrderItem
     └── SubscriptionItem

CartAbandonment — captured for email recovery flows
```

### Key Design Decisions

- **Prices stored in paise** — integer, no floating point errors
- **Order number** is unique string, not sequential ID
- **Loyalty ledger** is separate append-only table for points history
- **Cart abandonment** tracked separately for recovery email flows
- **Inventory** tracked per location with low-stock thresholds

---

## Auth Flow

```
User signs in via Google OAuth or email/password (bcrypt)
  → NextAuth JWT session (no database sessions)
  → jwt() callback stores user.id + role in token
  → session() callback exposes role to client
  → Middleware protects /account/* routes
  → Welcome email triggered on first sign-in (one-time flag: emailSent)
```

### Auth Providers

- **Google OAuth** — via `next-auth/providers/google`
- **Credentials** — email + bcrypt hashed password
- **JWT strategy** — sessions stored in cookies, not database

---

## Payment Flow (Razorpay)

```
Cart → POST /api/checkout/create-order
  → Creates Razorpay order (amount in paise)
  → Returns order_id to client

Client → Razorpay checkout modal
  → User completes payment

Webhook → POST /api/webhooks/razorpay
  → Verifies signature
  → Creates Order + OrderItems
  → Clears cart
  → Updates inventory
```

---

## Theme / Design System

### Athletic Dark Theme

| Token | Value |
|---|---|
| Background | `#0D0D0D` |
| Cards | `#1A1A1A` |
| Primary green | `#166534` |
| Accent green | `#22C55E` |
| Card styling | Angular `clip-path` polygon (top-right cut corner) |

### Typography

| Element | Font | Style |
|---|---|---|
| Headings | Bebas Neue | `font-bebas`, `tracking-wider` |
| Body | Oswald | `font-oswald`, weights 400/600/700 |

### UI Components (`components/ui-styling/`)

- Navbar — with 3D hero slider integration
- Footer — contact, social links, policy pages
- CartDrawer
- ProductCard
- Button variants

---

## API Routes

| Route | Purpose |
|---|---|
| `/api/auth/[...nextauth]` | NextAuth handlers (sign in/up/out) |
| `/api/checkout/create-order` | Razorpay order creation |
| `/api/webhooks/razorpay` | Payment confirmation + order creation |
| `/api/products/search` | Product search |
| `/api/account/*` | Account operations |

---

## Database Schema Summary

### Tables

- `User` — id, email, name, phone, role, password hash, reset token
- `Account` — OAuth provider linking (NextAuth adapter)
- `Session` — NextAuth session storage
- `Address` — shipping/billing addresses per user
- `Product` — slug, description, category, basePrice, nutritionFacts, images
- `ProductVariant` — flavor, size, price (paise), sku, weight
- `Location` — warehouse/physical location for inventory
- `Inventory` — quantity per product variant per location
- `Order` — orderNumber, status, paymentMethod, razorpayOrderId, totals
- `OrderItem` — quantity, unitPrice (paise) per order
- `Subscription` — recurring billing with frequency
- `SubscriptionItem` — variant + frequency per subscription
- `LoyaltyLedger` — append-only points history (EARNED/REDEEMED/EXPIRED/ADJUSTED)
- `Review` — ratings, verified purchase flag, helpful count
- `CartAbandonment` — cart data, email, phone, recovery link, reminderSent

### Enums

- `Role`: CUSTOMER, ADMIN
- `OrderStatus`: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED
- `PaymentMethod`: RAZORPAY, STRIPE, COD
- `ProductCategory`: PRE_WORKOUT, PROTEIN, MASS_GAINER, OMEGA_3, MULTIVITAMIN
- `SubscriptionStatus`: ACTIVE, PAUSED, CANCELLED
- `SubscriptionFrequency`: WEEKLY, BIWEEKLY, MONTHLY
- `LoyaltyType`: EARNED, REDEEMED, EXPIRED, ADJUSTED

---

## Infrastructure

| Service | Provider |
|---|---|
| Database | Neon.tech PostgreSQL (SSL in production, pooled via pg) |
| Payments | Razorpay (primary), Stripe (secondary) |
| Auth | NextAuth v5 with JWT sessions |
| File storage | Unsplash CDN + Zyrosite for images |
| Email | Resend (via `lib/email.ts`) |
| Deployment | Vercel |

---

## Deployment Status

- **Vercel production** — verified working
- **Build:** 44 pages compiled successfully
- **Recent fixes:** Privacy page, terms page converted to athletic dark theme, WhatsApp NZ format (+64), product detail page fonts corrected to Oswald

---

## Project Structure

```
well-nz-nutrition/
├── app/
│   ├── (store)/         ← Storefront routes
│   ├── (auth)/          ← Auth routes
│   ├── admin/           ← Admin (future)
│   ├── api/             ← API endpoints
│   ├── layout.tsx       ← Root layout (fonts, metadata)
│   └── globals.css      ← Tailwind + custom styles
├── components/
│   ├── ui-styling/      ← Athletic theme components
│   ├── _components/     ← Additional components
│   └── ui/              ← Base UI components
├── lib/
│   ├── auth.ts          ← NextAuth config
│   ├── db.ts            ← Prisma client (pg adapter)
│   ├── email.ts         ← Resend email
│   ├── utils.ts         ← Formatters (currency, date)
│   └── validators/       ← Input validation
├── prisma/
│   └── schema.prisma    ← Full data model
└── public/              ← Static assets
```