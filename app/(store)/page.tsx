"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/store/cart-store";
import { cn, formatCurrency } from "@/lib/utils";

// Placeholder products
const PRODUCTS = [
  {
    id: "1",
    name: "Whey Isolate 900g",
    category: "Protein",
    price: 249900, // paise
    categorySlug: "protein",
  },
  {
    id: "2",
    name: "Creatine Monohydrate",
    category: "Pre-Workout",
    price: 89900,
    categorySlug: "pre-workout",
  },
  {
    id: "3",
    name: "Omega-3 Fish Oil",
    category: "Omega-3",
    price: 129900,
    categorySlug: "omega-3",
  },
  {
    id: "4",
    name: "BCAA Recovery",
    category: "Pre-Workout",
    price: 79900,
    categorySlug: "pre-workout",
  },
];

// Category quick links
const CATEGORIES = [
  { name: "Pre-Workout", slug: "pre-workout", initial: "PW" },
  { name: "Protein", slug: "protein", initial: "PR" },
  { name: "Mass Gainer", slug: "mass-gainer", initial: "MG" },
  { name: "Omega-3", slug: "omega-3", initial: "O3" },
  { name: "Multivitamin", slug: "multivitamin", initial: "MV" },
];

// Trust signals
const TRUST_SIGNALS = [
  { label: "FSSAI Certified", icon: "shield" },
  { label: "Free Shipping over ₹999", icon: "truck" },
  { label: "Easy Returns", icon: "refresh" },
];

function TrustIcon({ type }: { type: string }) {
  if (type === "shield") {
    return (
      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    );
  }
  if (type === "truck") {
    return (
      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    );
  }
  // refresh
  return (
    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  );
}

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubscribed(true);
      setEmail("");
    } catch {
      // silently fail
    }
  };

  const handleAddToCart = (product: (typeof PRODUCTS)[0]) => {
    addItem({
      productVariantId: product.id,
      name: product.name,
      flavor: "Unflavored",
      price: product.price,
      quantity: 1,
    });
    openCart();
  };

  return (
    <div className="flex flex-col">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-background py-20 md:py-28">
        {/* Decorative gradient blob */}
        <div className="pointer-events-none absolute -right-32 -top-20 h-80 w-80 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-gradient-to-tr from-accent/5 to-primary/5 blur-3xl" />

        <div className="container mx-auto px-4">
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              Precision Performance Nutrition
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Science-backed supplements for athletes who demand more
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Button render={<Link href="/products" />} size="lg">
                Shop Now
              </Button>
              <Button render={<Link href="/about" />} variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Products Section */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Bestsellers
            </h2>
            <p className="mt-2 text-muted-foreground">Our most popular supplements</p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {PRODUCTS.map((product) => (
              <div
                key={product.id}
                className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-shadow hover:shadow-card-hover"
              >
                {/* Image placeholder */}
                <div className="aspect-square w-full bg-muted">
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted-foreground/10">
                      <span className="text-xs font-medium text-muted-foreground">
                        {product.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-4">
                  <Badge variant="secondary" className="mb-2 w-fit text-xs">
                    {product.category}
                  </Badge>
                  <h3 className="font-heading text-sm font-semibold text-foreground leading-tight">
                    {product.name}
                  </h3>
                  <p className="mt-1 font-heading text-base font-bold text-primary">
                    {formatCurrency(product.price)}
                  </p>
                  <Button
                    className="mt-3 w-full"
                    size="sm"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button render={<Link href="/products" />} variant="outline">
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* 3. Category Quick Links */}
      <section className="border-y border-border bg-muted/30 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Shop by Category
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:border-primary/30 hover:shadow-card-hover w-32"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <span className="font-heading text-sm font-bold">{cat.initial}</span>
                </div>
                <span className="text-center text-xs font-medium text-foreground">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Trust Signals Bar */}
      <section className="bg-background py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {TRUST_SIGNALS.map((signal) => (
              <div
                key={signal.label}
                className="flex items-center gap-3 text-muted-foreground"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <TrustIcon type={signal.icon} />
                </div>
                <span className="text-sm font-medium">{signal.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Newsletter Capture */}
      <section className="bg-primary py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="font-heading text-3xl font-bold text-primary-foreground md:text-4xl">
              Stay in the Loop
            </h2>
            <p className="mt-3 text-primary-foreground/80">
              Get exclusive deals and nutrition tips
            </p>

            {subscribed ? (
              <div className="mt-8 rounded-lg bg-primary-foreground/10 p-4 text-primary-foreground">
                <p className="font-medium">You&apos;re subscribed! Check your inbox soon.</p>
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-primary-foreground/50"
                />
                <Button
                  type="submit"
                  variant="outline"
                  size="lg"
                  className="shrink-0 border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
                >
                  Subscribe
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
