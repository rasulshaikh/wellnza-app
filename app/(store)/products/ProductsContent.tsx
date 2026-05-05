"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition, useRef } from "react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";

const DEBOUNCE_MS = 400;

interface ProductVariant {
  id: string;
  flavor: string;
  size: string | null;
  price: number;
  sku: string;
  weightG: number | null;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  basePrice: number;
  comparePrice: number | null;
  images: string[];
  variants: ProductVariant[];
}

const LIMIT = 20;

const SORT_OPTIONS = [
  { value: "default", label: "DEFAULT" },
  { value: "price_asc", label: "PRICE: LOW TO HIGH" },
  { value: "price_desc", label: "PRICE: HIGH TO LOW" },
  { value: "newest", label: "MOST RECENT" },
];

export function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<{ products: Product[]; total: number } | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const search = searchParams.get("search") ?? "";
  const sort = searchParams.get("sort") ?? "default";
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);

  const categories = searchParams.getAll("category");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const dietary = searchParams.getAll("dietary");

  const fetchProducts = useCallback(() => {
    const params = new URLSearchParams();
    categories.forEach((c) => params.append("category", c));
    dietary.forEach((d) => params.append("dietary", d));
    if (search) params.set("search", search);
    if (sort && sort !== "default") params.set("sort", sort);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    params.set("limit", String(LIMIT));
    params.set("offset", String(offset));

    startTransition(async () => {
      try {
        const res = await fetch(`/api/products?${params.toString()}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch {
        // silently handle fetch errors
      }
    });
  }, [categories, dietary, search, sort, minPrice, maxPrice, offset]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      fetchProducts();
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [fetchProducts]);

  const products = data?.products ?? [];
  const total = data?.total ?? 0;
  const showingStart = total === 0 ? 0 : offset + 1;
  const showingEnd = Math.min(offset + LIMIT, total);

  const navigateToOffset = (newOffset: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newOffset === 0) {
      params.delete("offset");
    } else {
      params.set("offset", String(newOffset));
    }
    router.push(`?${params.toString()}`);
  };

  const prevOffset = Math.max(0, offset - LIMIT);
  const nextOffset = offset + LIMIT < total ? offset + LIMIT : offset;

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const value = formData.get("search") as string;
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    params.delete("offset");
    router.push(`?${params.toString()}`);
  };

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.delete("offset");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-1 flex-col" style={{ background: "#0D0D0D", minHeight: "100vh" }}>
      {/* Page header - Athletic Dark Theme */}
      <div
        className="border-b border-[#166534]/30 px-4 py-8 md:px-8"
        style={{ background: "linear-gradient(180deg, #0D0D0D 0%, #1A1A1A 100%)" }}
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
          {/* Athletic Tag Line */}
          <div className="flex items-center gap-3">
            <div className="h-[2px] w-8 bg-[#166534]" />
            <span
              className="text-[12px] tracking-[3px] text-[#22C55E]"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              EVERY REP. EVERY SET. EVERY DAY.
            </span>
          </div>

          {/* Main Heading */}
          <h1
            className="text-[48px] font-bold tracking-tight text-white md:text-[64px]"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "3px" }}
          >
            LOCK IN YOUR <span className="text-[#22C55E]">GAINS</span>
          </h1>

          {/* Subheading - Athletic Copy */}
          <p
            className="max-w-xl text-[14px] text-[#888888]"
            style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "1px" }}
          >
            BUILT FOR ATHLETES WHO DEMAND MAXIMUM PERFORMANCE. NO SHORTCUTS. NO COMPROMISE. STACK YOUR SUPPLEMENTS, DOMINATE YOUR GOALS.
          </p>

          {/* Search bar - Angular Style */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-lg">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#888888]"
                aria-hidden="true"
              />
              <Input
                name="search"
                type="search"
                placeholder="SEARCH PRODUCTS..."
                defaultValue={search}
                className="h-12 flex-1 border border-[#166534]/40 bg-[#1A1A1A] pl-10 pr-10 text-[13px] text-white placeholder:text-[#888888] focus:border-[#22C55E] focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
                style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "1px" }}
                aria-label="Search products"
              />
              {search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-white transition-colors"
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            <Button
              type="submit"
              className="athletic-cta h-12 !px-6"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              aria-label="Submit search"
            >
              SEARCH
            </Button>
          </form>

          {/* Trust Badges Row */}
          <div className="flex flex-wrap gap-3 pt-2">
            <div className="athletic-trust-badge" aria-label="Free shipping on all orders">
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18 1l-4 4-3-3-5 5 3 3-5 5 5 5 3-3 4 4 1-1-4-4 4-4-1-1zm-6 8l-2 2 4 4 4-4-2-2-2 2-2-2z"/>
              </svg>
              FREE SHIPPING
            </div>
            <div className="athletic-trust-badge" aria-label="Lab tested products">
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
              LAB TESTED
            </div>
            <div className="athletic-trust-badge" aria-label="100% authentic products">
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              100% AUTHENTIC
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1">
        <div className="mx-auto flex w-full max-w-7xl px-4 md:px-8">
          {/* Filters sidebar */}
          <div className="py-6 pr-8 hidden lg:block">
            <div
              className="w-56 shrink-0 p-4 rounded-none"
              style={{ background: "#1A1A1A", border: "1px solid rgba(22, 101, 52, 0.3)" }}
            >
              <ProductFilters className="!p-0" />
            </div>
          </div>

          {/* Product area */}
          <div className="flex flex-1 flex-col py-6 pl-0 lg:pl-0">
            {/* Results info - Athletic Style */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="text-[12px] text-[#888888]"
                  style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "2px" }}
                >
                  SORT BY:
                </span>
                <select
                  value={searchParams.get("sort") ?? "default"}
                  onChange={(e) => {
                    const newParams = new URLSearchParams(searchParams.toString());
                    if (e.target.value === "default") {
                      newParams.delete("sort");
                    } else {
                      newParams.set("sort", e.target.value);
                    }
                    router.push(`/products?${newParams.toString()}`);
                  }}
                  className="h-10 border border-[#166534]/40 bg-[#1A1A1A] px-3 py-1.5 text-[13px] text-white focus:border-[#22C55E] focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
                  style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "1px" }}
                  aria-label="Sort products"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <p
                className="text-[13px] text-[#888888]"
                style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "1px" }}
                aria-live="polite"
              >
                {total === 0 ? (
                  "NO PRODUCTS FOUND"
                ) : (
                  <>
                    SHOWING <span className="font-semibold text-white">{showingStart}-{showingEnd}</span> OF{" "}
                    <span className="font-semibold text-white">{total}</span> PRODUCTS
                  </>
                )}
              </p>
            </div>

            {/* Grid */}
            {isPending && !data ? (
              <ProductGrid products={[]} isLoading />
            ) : (
              <ProductGrid products={products} />
            )}

            {/* Testimonial - Athletic Dark Section */}
            <div
              className="mt-16 py-16 text-center"
              style={{ background: "linear-gradient(180deg, #1A1A1A 0%, #0D0D0D 100%)", borderTop: "1px solid rgba(22, 101, 52, 0.3)" }}
            >
              <div className="mb-4 flex justify-center">
                <svg className="h-6 w-6 text-[#22C55E]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
              </div>
              <blockquote>
                <p
                  className="text-lg leading-relaxed text-white md:text-xl"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "1px" }}
                >
                  &ldquo;WELL NZ GAVE ME UNMATCHED FOCUS AND ENERGY DURING WORKOUTS - TRULY A GAME CHANGER FOR MY TRAINING SESSIONS.&rdquo;
                </p>
              </blockquote>
              <p
                className="mt-6 font-semibold text-[#22C55E]"
                style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "2px" }}
              >
                - PRANAV
              </p>
              <div className="mt-4 flex justify-center gap-1">
                {[1,2,3,4,5].map((i) => (
                  <svg key={i} className="h-5 w-5 text-[#22C55E]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                  </svg>
                ))}
              </div>
            </div>

            {/* Pagination - Athletic Style */}
            {total > LIMIT && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  onClick={() => navigateToOffset(prevOffset)}
                  disabled={offset === 0}
                  className="flex items-center gap-2 px-4 py-2 text-[13px] text-white border border-[#166534]/40 hover:border-[#22C55E] hover:text-[#22C55E] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#166534]/40 disabled:hover:text-white"
                  style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "2px" }}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="size-4" aria-hidden="true" />
                  PREV
                </button>
                <span
                  className="px-4 text-[13px] text-[#888888]"
                  style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "1px" }}
                  aria-current="page"
                >
                  PAGE {Math.floor(offset / LIMIT) + 1} OF {Math.ceil(total / LIMIT)}
                </span>
                <button
                  onClick={() => navigateToOffset(nextOffset)}
                  disabled={offset + LIMIT >= total}
                  className="flex items-center gap-2 px-4 py-2 text-[13px] text-white border border-[#166534]/40 hover:border-[#22C55E] hover:text-[#22C55E] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#166534]/40 disabled:hover:text-white"
                  style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "2px" }}
                  aria-label="Next page"
                >
                  NEXT
                  <ChevronRight className="size-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Tagline */}
      <div
        className="py-6 px-4 md:px-8"
        style={{ background: "#0D0D0D", borderTop: "1px solid rgba(22, 101, 52, 0.2)" }}
      >
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4">
          <p
            className="text-[12px] text-[#888888]"
            style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "2px" }}
          >
            BUILT FOR <span className="text-[#22C55E]">ATHLETES</span>. PROVEN BY <span className="text-[#22C55E]">GAINS</span>.
          </p>
          <div className="flex items-center gap-4">
            <span
              className="text-[10px] text-[#888888]"
              style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "1px" }}
            >
              SOURCE DIRECT - NO MIDDLEMEN
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
