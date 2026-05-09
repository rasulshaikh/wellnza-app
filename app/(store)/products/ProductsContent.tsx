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
    <div className="flex flex-1 flex-col" style={{ background: "#FAFAF8", minHeight: "100vh" }}>
      {/* Page header - Botanical White */}
      <div
        className="border-b border-[#2E7D32]/15 px-4 py-8 md:px-8"
        style={{ background: "#FAFAF8" }}
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
          {/* Tag Line */}
          <div className="flex items-center gap-3">
            <div className="h-[2px] w-8 bg-[#2E7D32]" />
            <span
              className="text-[12px] tracking-[3px] text-[#2E7D32]"
              style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}
            >
              WELLNESS, ROOTED IN NATURE
            </span>
          </div>

          {/* Main Heading */}
          <h1
            className="text-[48px] font-bold tracking-tight text-[#1a1a1a] md:text-[56px]"
            style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", letterSpacing: "1px" }}
          >
            Shop Supplements
          </h1>

          {/* Subheading */}
          <p
            className="max-w-xl text-[14px] text-[#7B9E6B]"
            style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", letterSpacing: "0.5px" }}
          >
            Clean, transparent supplements crafted for your wellbeing. Every ingredient, every dose — know exactly what you are putting into your body.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-lg">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#7B9E6B]"
                aria-hidden="true"
              />
              <Input
                name="search"
                type="search"
                placeholder="Search supplements..."
                defaultValue={search}
                className="h-12 flex-1 rounded-md border border-[#2E7D32]/20 bg-white pl-10 pr-10 text-[13px] text-[#1a1a1a] placeholder:text-[#7B9E6B] focus:border-[#2E7D32] focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
                style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}
                aria-label="Search products"
              />
              {search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7B9E6B] hover:text-[#2E7D32] transition-colors"
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            <Button
              type="submit"
              className="h-12 !px-6 rounded-md"
              style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", backgroundColor: "#2E7D32", color: "#fff" }}
              aria-label="Submit search"
            >
              Search
            </Button>
          </form>

          {/* Trust Badges Row */}
          <div className="flex flex-wrap gap-3 pt-2">
            <div className="flex items-center gap-2 rounded-full border border-[#2E7D32]/20 bg-white px-4 py-2" aria-label="Free shipping on all orders">
              <svg className="h-3.5 w-3.5 text-[#2E7D32]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18 1l-4 4-3-3-5 5 3 3-5 5 5 5 3-3 4 4 1-1-4-4 4-4-1-1zm-6 8l-2 2 4 4 4-4-2-2-2 2-2-2z"/>
              </svg>
              <span style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", fontSize: "11px", color: "#1a1a1a", letterSpacing: "1px" }}>FREE SHIPPING</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#2E7D32]/20 bg-white px-4 py-2" aria-label="Lab tested products">
              <svg className="h-3.5 w-3.5 text-[#2E7D32]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
              <span style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", fontSize: "11px", color: "#1a1a1a", letterSpacing: "1px" }}>THIRD-PARTY TESTED</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#2E7D32]/20 bg-white px-4 py-2" aria-label="100% authentic products">
              <svg className="h-3.5 w-3.5 text-[#2E7D32]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", fontSize: "11px", color: "#1a1a1a", letterSpacing: "1px" }}>100% AUTHENTIC</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#2E7D32]/20 bg-white px-4 py-2" aria-label="Natural ingredients">
              <svg className="h-3.5 w-3.5 text-[#2E7D32]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/>
              </svg>
              <span style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", fontSize: "11px", color: "#1a1a1a", letterSpacing: "1px" }}>NATURAL INGREDIENTS</span>
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
              className="w-56 shrink-0 p-4 rounded-md"
              style={{ background: "#fff", border: "1px solid rgba(46, 125, 50, 0.15)", boxShadow: "0 2px 8px rgba(46, 125, 50, 0.06)" }}
            >
              <ProductFilters className="!p-0" />
            </div>
          </div>

          {/* Product area */}
          <div className="flex flex-1 flex-col py-6 pl-0 lg:pl-0">
            {/* Results info */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="text-[12px] text-[#7B9E6B]"
                  style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", letterSpacing: "1px" }}
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
                  className="h-10 rounded-md border border-[#2E7D32]/20 bg-white px-3 py-1.5 text-[13px] text-[#1a1a1a] focus:border-[#2E7D32] focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
                  style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}
                  aria-label="Sort products"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <p
                className="text-[13px] text-[#7B9E6B]"
                style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", letterSpacing: "0.5px" }}
                aria-live="polite"
              >
                {total === 0 ? (
                  "No products found"
                ) : (
                  <>
                    Showing <span className="font-semibold text-[#1a1a1a]">{showingStart}-{showingEnd}</span> of{" "}
                    <span className="font-semibold text-[#1a1a1a]">{total}</span> products
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

            {/* Testimonial - Botanical */}
            <div
              className="mt-16 rounded-md py-12 text-center"
              style={{ background: "linear-gradient(180deg, #fff 0%, #FAFAF8 100%)", border: "1px solid rgba(46, 125, 50, 0.1)" }}
            >
              <div className="mb-4 flex justify-center">
                <span className="text-2xl">◆</span>
              </div>
              <blockquote>
                <p
                  className="text-lg leading-relaxed text-[#1a1a1a] md:text-xl"
                  style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", letterSpacing: "0.5px" }}
                >
                  &ldquo;Wellnza gave me consistent energy and I love knowing exactly what I am taking — clean ingredients, no hidden fillers.&rdquo;
                </p>
              </blockquote>
              <p
                className="mt-4 font-semibold text-[#2E7D32]"
                style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", letterSpacing: "2px" }}
              >
                — PRIYA, MUMBAI · FITNESS ENTHUSIAST
              </p>
              <div className="mt-4 flex justify-center gap-1">
                {[1,2,3,4,5].map((i) => (
                  <svg key={i} className="h-5 w-5 text-[#C9A227]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
            </div>

            {/* Pagination */}
            {total > LIMIT && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  onClick={() => navigateToOffset(prevOffset)}
                  disabled={offset === 0}
                  className="flex items-center gap-2 rounded-md px-4 py-2 text-[13px] text-[#1a1a1a] border border-[#2E7D32]/20 bg-white hover:border-[#2E7D32] hover:text-[#2E7D32] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#2E7D32]/20 disabled:hover:text-[#1a1a1a]"
                  style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="size-4" aria-hidden="true" />
                  Prev
                </button>
                <span
                  className="px-4 text-[13px] text-[#7B9E6B]"
                  style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}
                  aria-current="page"
                >
                  Page {Math.floor(offset / LIMIT) + 1} of {Math.ceil(total / LIMIT)}
                </span>
                <button
                  onClick={() => navigateToOffset(nextOffset)}
                  disabled={offset + LIMIT >= total}
                  className="flex items-center gap-2 rounded-md px-4 py-2 text-[13px] text-[#1a1a1a] border border-[#2E7D32]/20 bg-white hover:border-[#2E7D32] hover:text-[#2E7D32] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#2E7D32]/20 disabled:hover:text-[#1a1a1a]"
                  style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}
                  aria-label="Next page"
                >
                  Next
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
        style={{ background: "#FAFAF8", borderTop: "1px solid rgba(46, 125, 50, 0.1)" }}
      >
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4">
          <p
            className="text-[12px] text-[#7B9E6B]"
            style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", letterSpacing: "1px" }}
          >
            Clean ingredients. Transparent dosing. Premium wellness.
          </p>
          <div className="flex items-center gap-4">
            <span
              className="text-[10px] text-[#7B9E6B]"
              style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", letterSpacing: "1px" }}
            >
              Made in Amravati · Delivered Across India
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
