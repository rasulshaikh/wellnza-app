# Well NZ Nutrition — Design Replication Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replicate the wellnzanutrition.com design (Zyrosite template) under the well-nz-nutrition Next.js project. Use the actual content, branding, product names, and layout structure from the reference site.

**Architecture:** Full homepage redesign with hero banner, category showcase, product grid with badges, testimonials section, newsletter signup, and WhatsApp floating button. Products page mirrors homepage with sort dropdown. About page shows testimonials. PDP uses flavor selector + quantity controls + WhatsApp chat link + related products.

**Tech Stack:** Next.js 16 (App Router), Tailwind CSS, Zustand, Prisma 7, NextAuth v5

---

## Source Reference (wellnzanutrition.com)

| Page | URL | Key Elements |
|------|-----|--------------|
| Homepage | `/` | Hero "Unleash Energy" + tagline, Categories section (Pre-Workout/Proteins/Mass Gainer), Featured products grid with badges, Testimonials, Newsletter |
| Products | `/wellnza-nutrition` | Same as homepage but no hero — sort dropdown + product grid + testimonial |
| About | `/about-premium-supplements` | Testimonials only (Rahul + Sara quotes), no mission/why choose us |
| PDP | `/ultra-bulk-mass-gainer` | Flavor dropdown, quantity +/-, Add to bag, WhatsApp chat link, "You may also like" |

---

## Product Catalog (replace existing seed)

| Slug | Name | Category | Price | Badge |
|------|------|----------|-------|-------|
| `ultra-bulk-mass-gainer` | ULTRA BULK Mass Gainer | MASS_GAINER | ₹1999 | BEST SELLER |
| `ultrahype-pre-workout` | ULTRAHYPE Pre-Workout | PRE_WORKOUT | ₹1299 | NEW |
| `whey-protein-isolate` | ULTRA CORE Whey Isolate | PROTEIN | ₹3499 | BEST SELLER |
| `ultraflex-whey-protein-supplement` | ULTRA FLEX Whey Protein | PROTEIN | ₹2199 | BEST |
| `whey-protein` | ULTRA FLEX Whey Protein | PROTEIN | ₹4399 | NEW |
| `omega-3-supplement` | ULTRA SEA Omega-3 | OMEGA_3 | ₹899 | BEST SELLER |
| `multivitamins` | ULTRA LIFE Multivitamins | MULTIVITAMIN | ₹699 | NEW |

---

## Task 1: Replace Prisma Seed Data

**Files:**
- Modify: `prisma/seed.ts`
- Modify: `lib/db.ts`

- [ ] **Step 1: Rewrite seed.ts with reference site products**

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    slug: "ultra-bulk-mass-gainer",
    name: "ULTRA BULK Mass Gainer",
    description: "Fuel your muscle growth with Ultra Bulk Mass Gainer by Wellnza Nutrition. Designed for rapid mass gain, it delivers an optimal blend of protein, carbs, and calories in a delicious Alphonso Mango flavor. Perfect for athletes and bodybuilders who want to maximize bulk and strength. Comes in a 60-serving container—support your progress with every scoop!",
    category: "MASS_GAINER",
    basePrice: 1999,
    comparePrice: 2499,
    featured: true,
    isActive: true,
    images: ["https://cdn.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=960,fit=crop,q=100/cdn-ecommerce/store_01KJVXS44M9NNG532TH40JSYHE/assets/b1f35a43-b7f2-433a-bca7-46ee6a701d39.png"],
    variants: {
      create: [
        { flavor: "Alphonso Mango", size: "60 servings", price: 1999, comparePrice: 2499, sku: "UBMG-AM", weightG: 2000 },
        { flavor: "Chocolate Charge", size: "60 servings", price: 1999, comparePrice: 2499, sku: "UBMG-CC", weightG: 2000 },
      ]
    }
  },
  {
    slug: "ultrahype-pre-workout",
    name: "ULTRAHYPE Pre-Workout",
    description: "Experience explosive energy and razor-sharp focus with ULTRAHYPE Pre-Workout. Engineered for athletes who demand more from their training. No crash formula, just pure performance.",
    category: "PRE_WORKOUT",
    basePrice: 1299,
    comparePrice: 1599,
    featured: true,
    isActive: true,
    images: ["https://cdn.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=960,fit=crop,q=100/cdn-ecommerce/store_01KJVXS44M9NNG532TH40JSYHE/assets/2643346f-3234-479c-9a98-353043b45e2c.png"],
    variants: {
      create: [
        { flavor: "Fruit Punch", size: "30 servings", price: 1299, comparePrice: 1599, sku: "UHP-FP", weightG: 900 },
        { flavor: "Blue Raspberry", size: "30 servings", price: 1299, comparePrice: 1599, sku: "UHP-BR", weightG: 900 },
      ]
    }
  },
  {
    slug: "whey-protein-isolate",
    name: "ULTRA CORE Whey Isolate",
    description: "Pure, fast-absorbing whey protein isolate for maximum muscle recovery. 25g protein per serving with zero sugar.",
    category: "PROTEIN",
    basePrice: 3499,
    comparePrice: 4199,
    featured: true,
    isActive: true,
    images: ["https://cdn.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=960,fit=crop,q=100/cdn-ecommerce/store_01KJVXS44M9NNG532TH40JSYHE/assets/d1ad28f5-ec9b-4d62-ba5c-91be9ef209d1.png"],
    variants: {
      create: [
        { flavor: "Vanilla Ice Cream", size: "2 lb", price: 3499, comparePrice: 4199, sku: "UCWI-VI", weightG: 907 },
        { flavor: "Chocolate", size: "2 lb", price: 3499, comparePrice: 4199, sku: "UCWI-CH", weightG: 907 },
      ]
    }
  },
  {
    slug: "ultraflex-whey-protein-supplement",
    name: "ULTRA FLEX Whey Protein",
    description: "Premium whey protein blend for lean muscle building and recovery.",
    category: "PROTEIN",
    basePrice: 2199,
    comparePrice: 2699,
    featured: true,
    isActive: true,
    images: ["https://cdn.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=960,fit=crop,q=100/cdn-ecommerce/store_01KJVXS44M9NNG532TH40JSYHE/assets/1b9a2c29-ce25-4c88-bb70-b0f8ccf93c42b.png"],
    variants: {
      create: [
        { flavor: "Chocolate", size: "2 lb", price: 2199, comparePrice: 2699, sku: "UFWP-CH", weightG: 907 },
        { flavor: "Peanut Butter", size: "2 lb", price: 2199, comparePrice: 2699, sku: "UFWP-PB", weightG: 907 },
      ]
    }
  },
  {
    slug: "whey-protein",
    name: "ULTRA FLEX Whey Protein",
    description: "Advanced formula whey protein for serious athletes seeking peak performance.",
    category: "PROTEIN",
    basePrice: 4399,
    comparePrice: 5299,
    featured: false,
    isActive: true,
    images: ["https://cdn.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=960,fit=crop,q=100/cdn-ecommerce/store_01KJVXS44M9NNG532TH40JSYHE/assets/49186a64-8a51-474b-a0b6-d50e2f3dfb46.png"],
    variants: {
      create: [
        { flavor: "Chocolate Hazelnut", size: "4 lb", price: 4399, comparePrice: 5299, sku: "UFWP-CH4", weightG: 1814 },
      ]
    }
  },
  {
    slug: "omega-3-supplement",
    name: "ULTRA SEA Omega-3",
    description: "Pure fish oil omega-3 capsules for heart, brain, and joint health.",
    category: "OMEGA_3",
    basePrice: 899,
    comparePrice: 1199,
    featured: true,
    isActive: true,
    images: ["https://cdn.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=960,fit=crop,q=100/cdn-ecommerce/store_01KJVXS44M9NNG532TH40JSYHE/assets/5dc9d684-7389-4a41-ae7e-81890be3e86e.png"],
    variants: {
      create: [
        { flavor: "Unflavored", size: "90 capsules", price: 899, comparePrice: 1199, sku: "USO3-UF", weightG: 150 },
      ]
    }
  },
  {
    slug: "multivitamins",
    name: "ULTRA LIFE Multivitamins",
    description: "Complete daily multivitamin for men and women covering all essential nutrients.",
    category: "MULTIVITAMIN",
    basePrice: 699,
    comparePrice: 999,
    featured: true,
    isActive: true,
    images: ["https://cdn.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=960,fit=crop,q=100/cdn-ecommerce/store_01KJVXS44M9NNG532TH40JSYHE/assets/73d50708-e4e5-4161-b90e-ad621bf97a52.png"],
    variants: {
      create: [
        { flavor: "Unflavored", size: "60 tablets", price: 699, comparePrice: 999, sku: "ULM-UF", weightG: 100 },
      ]
    }
  },
];

async function main() {
  console.log("Start seeding...");
  await prisma.product.deleteMany();
  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log(`Seeded ${products.length} products`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

- [ ] **Step 2: Run seed**

Run: `npx prisma db seed`
Expected: `Seeded 7 products`

- [ ] **Step 3: Commit**

```bash
git add prisma/seed.ts
git commit -m "feat: replace seed data with reference site products"
```

---

## Task 2: Homepage Redesign

**Files:**
- Modify: `app/(store)/page.tsx`

- [ ] **Step 1: Rewrite homepage with reference design**

```tsx
import Link from "next/link";
import { db } from "@/lib/db";

async function getFeaturedProducts() {
  return db.product.findMany({
    where: { isActive: true, featured: true },
    take: 6,
    select: {
      id: true, name: true, slug: true, basePrice: true, comparePrice: true,
      images: true, category: true, featured: true,
    },
  });
}

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-black text-white">
        <div className="absolute inset-0">
          <img
            src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=2800,fit=crop/PQIno7kFVWk52uM2/gemini_generated_image_a36coaa36coaa36c-GpqVKDujnWLGwkc7.png"
            alt="Hero"
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 py-32 text-center">
          <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight">
            Unleash Energy
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-gray-200">
            Precision engineered for power, focus, and performance
          </p>
          <p className="mt-6 text-sm tracking-widest text-gray-400 uppercase">
            Feel the difference
          </p>
          <Link
            href="/products"
            className="mt-10 inline-block bg-white text-black px-8 py-4 font-semibold hover:bg-gray-100 transition"
          >
            View Products
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="font-heading text-3xl font-bold text-center mb-12">Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Pre-Workout",
                desc: "Fuel your sessions with precision energy.",
                href: "/products?category=PRE_WORKOUT",
                icon: "💪",
              },
              {
                name: "Proteins",
                desc: "Pure strength in every scoop.",
                href: "/products?category=PROTEIN",
                icon: "🏋️",
              },
              {
                name: "Mass Gainer",
                desc: "Build muscle with rich nutrition.",
                href: "/products?category=MASS_GAINER",
                icon: "⚡",
              },
            ].map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="group p-8 border border-gray-200 hover:border-primary transition text-center"
              >
                <div className="text-4xl mb-4">{cat.icon}</div>
                <h4 className="font-heading text-xl font-bold">{cat.name}</h4>
                <p className="mt-2 text-muted-foreground">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h3 className="font-heading text-3xl font-bold text-center mb-12">
            <Link href="/products" className="hover:text-primary transition">
              Featured Products
            </Link>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => {
              const badge = product.slug.includes("mass-gainer") ? "BEST SELLER"
                : product.slug.includes("pre-workout") ? "NEW"
                : product.slug.includes("isolate") ? "BEST SELLER"
                : product.slug.includes("omega") ? "BEST SELLER"
                : product.slug.includes("multivitamin") ? "NEW"
                : "BEST";
              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group bg-white"
                >
                  <div className="relative">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full aspect-square object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 uppercase font-bold">
                      {badge}
                    </span>
                  </div>
                  <div className="p-4">
                    <h4 className="font-heading font-bold text-sm truncate">{product.name}</h4>
                    <p className="mt-1 font-semibold">₹{product.basePrice.toLocaleString()}</p>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/products"
              className="text-primary font-semibold hover:underline"
            >
              Shop Pre-Workout → Elevate your performance with our curated selection...
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-heading text-2xl font-bold">Join Our Elite Circle</h3>
          <p className="mt-2 text-gray-400">Your Email</p>
          <form className="mt-4 flex justify-center gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Email Address"
              className="px-4 py-2 bg-white/10 border border-white/20 text-white placeholder-gray-400 w-64"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-white text-black font-semibold hover:bg-gray-200 transition"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-2 text-sm text-gray-500">Get exclusive offers and insider updates</p>
        </div>
      </section>

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/918788396678"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition"
        aria-label="Open WhatsApp"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build 2>&1 | tail -20`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/(store)/page.tsx
git commit -m "feat: redesign homepage matching reference site"
```

---

## Task 3: Products Page Update

**Files:**
- Modify: `app/(store)/products/ProductsContent.tsx`

- [ ] **Step 1: Update sort options to match reference site**

```tsx
// Replace SORT_OPTIONS in ProductsContent with:
const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "price_asc", label: "Price (low to high)" },
  { value: "price_desc", label: "Price (high to low)" },
  { value: "newest", label: "Most recent" },
];
```

- [ ] **Step 2: Update component to use select dropdown for sort (matching Zyrosite combobox)**

Replace the sort section with:
```tsx
<div className="flex items-center gap-2">
  <span className="text-sm text-muted-foreground">Sort by:</span>
  <select
    value={params.get("sort") ?? "default"}
    onChange={(e) => {
      const newParams = new URLSearchParams(params);
      if (e.target.value === "default") {
        newParams.delete("sort");
      } else {
        newParams.set("sort", e.target.value);
      }
      router.push(`/products?${newParams.toString()}`);
    }}
    className="border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
  >
    {SORT_OPTIONS.map((opt) => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
</div>
```

- [ ] **Step 3: Add testimonial section below product grid**

Add this below the product grid in ProductsContent:
```tsx
<div className="mt-16 py-12 bg-gray-50 text-center">
  <p className="text-lg italic text-muted-foreground">
    "Ultrahype gave me unmatched focus and energy during workouts—truly a game changer for my training sessions."
  </p>
  <p className="mt-2 font-semibold">— Pranav</p>
  <div className="mt-4">
    {[1,2,3,4,5].map((i) => (
      <span key={i} className="text-yellow-500">★</span>
    ))}
  </div>
</div>
```

- [ ] **Step 4: Commit**

```bash
git add app/(store)/products/ProductsContent.tsx
git commit -m "feat: update products page sort + testimonial"
```

---

## Task 4: About Page Redesign (Testimonials Only)

**Files:**
- Modify: `app/(store)/about/page.tsx`

- [ ] **Step 1: Rewrite about page to match reference site**

```tsx
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h1 className="font-heading text-4xl font-bold text-center mb-12">
          Real Feedback
        </h1>
        <p className="text-center text-muted-foreground mb-16">
          Hear from athletes who trust Wellnza Nutrition.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Testimonial 1 */}
          <div className="bg-white p-8 border border-gray-100">
            <p className="text-lg italic text-foreground">
              "Ultrahype gave me unmatched focus and energy during my toughest workouts. It's a game changer."
            </p>
            <div className="mt-6 flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1502765782516-722af1ae6086?auto=format&fit=crop&w=96&h=96"
                alt="Rahul"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">Rahul</p>
                <p className="text-sm text-muted-foreground">Nagpur</p>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-white p-8 border border-gray-100">
            <p className="text-lg italic text-foreground">
              "The clean, powerful boost from Wellnza's pre-workout helped me push past my limits without the crash."
            </p>
            <div className="mt-6 flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1627889861259-fda7d3c6637d?auto=format&fit=crop&w=96&h=96"
                alt="Sara"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">Sara</p>
                <p className="text-sm text-muted-foreground">Mumbai</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="flex justify-center gap-1 text-yellow-500 text-2xl">
            {[1,2,3,4,5].map((i) => <span key={i}>★</span>)}
          </div>
          <div className="flex justify-center gap-1 text-yellow-500 text-2xl mt-2">
            {[1,2,3,4,5].map((i) => <span key={i}>★</span>)}
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link href="/products">
            <button className="bg-black text-white px-8 py-4 font-semibold hover:bg-gray-800 transition">
              Shop Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/(store)/about/page.tsx
git commit -m "feat: redesign about page with testimonials from reference site"
```

---

## Task 5: Product Detail Page (PDP) Update

**Files:**
- Modify: `app/(store)/products/[slug]/page.tsx`
- Modify: `components/cart/AddToCartButton.tsx` (or create if missing)

- [ ] **Step 1: Check existing PDP structure**

Read `app/(store)/products/[slug]/page.tsx` and `components/cart/AddToCartButton.tsx`

- [ ] **Step 2: Update PDP to match reference site structure**

The reference PDP has:
- Product name (h1) + subtitle (h2)
- Price
- Flavor dropdown (combobox)
- Quantity +/ - buttons
- "Add to bag" button
- "Chat on WhatsApp" link (with pre-filled message)
- "You may also like" section
- Review section (empty state)

Key URL pattern for WhatsApp:
```
https://wa.me/918788396678?text=Hi!%20I%27m%20interested%20in%20purchasing%20[PRODUCT_NAME]%20(flavor%3A%20[FLAVOR]).%20https%3A%2F%2Fwww.wellnzanutrition.com%2F[SLUG]
```

- [ ] **Step 3: Commit**

```bash
git add app/(store)/products/[slug]/page.tsx
git commit -m "feat: update PDP with flavor selector, quantity controls, WhatsApp link, related products"
```

---

## Task 6: Navbar Update

**Files:**
- Modify: `components/layout/Navbar.tsx` (or wherever the nav is)

- [ ] **Step 1: Update navigation links to match reference site URLs**

Reference site nav:
- Home → `/`
- Shop → `/products`
- About → `/about`

**Important:** Reference site uses `/about` not `/about-premium-supplements`. Also note the footer links:
- Facebook: `https://www.facebook.com/`
- Instagram: `https://www.instagram.com/wellnza_nutrition`
- WhatsApp: `https://wa.me/918788396678`
- Address: Google Maps link

- [ ] **Step 2: Update footer in `components/layout/Footer.tsx`**

Reference site footer has:
- BRAND section with social links (FB, Instagram, WhatsApp, Google Maps)
- CONTACT: info@wellnzanutrition.com, +91 8788396678
- NEWSLETTER email signup
- TERMS & CONDITIONS link
- Copyright: © 2026
- wellnzanutrition@gmail.com (also shown)

- [ ] **Step 3: Commit**

```bash
git add components/layout/Navbar.tsx components/layout/Footer.tsx
git commit -m "feat: update nav/footer links to match reference site"
```

---

## Task 7: Global Styles — Typography & Colors

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Add reference site font and color tokens**

The reference site uses a clean sans-serif heading font. Check what `font-heading` is set to in the current globals.css and ensure it matches. The reference site appears to use:
- Font: system sans-serif or similar clean font
- Primary: the site appears to use a gold/yellow accent (#D4AF37 type color)
- Background: white or very light gray
- Text: black/dark gray

Check current shadcn/ui CSS variables for `--primary` and update if needed to match reference site's feel.

- [ ] **Step 2: Commit**

```bash
git add app/globals.css
git commit -m "style: update typography and color tokens to match reference site"
```

---

## Task 8: Re-seed Database + Deploy

- [ ] **Step 1: Re-seed the database**

Run: `npx prisma db seed`
Expected: `Seeded 7 products`

- [ ] **Step 2: Push to trigger Vercel deploy**

```bash
git push origin main
```

- [ ] **Step 3: Wait for deploy, then verify**

Run smoke test:
```bash
curl -s -o /dev/null -w "%{http_code}" "https://well-nz-nutrition.vercel.app/"
curl -s -o /dev/null -w "%{http_code}" "https://well-nz-nutrition.vercel.app/products"
curl -s -o /dev/null -w "%{http_code}" "https://well-nz-nutrition.vercel.app/about"
curl -s -o /dev/null -w "%{http_code}" "https://well-nz-nutrition.vercel.app/products/ultra-bulk-mass-gainer"
```

- [ ] **Step 4: Commit all remaining changes**

```bash
git add -A && git commit -m "feat: full site redesign matching wellnzanutrition.com reference"
```

---

## Execution Options

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**