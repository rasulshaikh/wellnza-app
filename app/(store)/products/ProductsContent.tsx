"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";

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
  { value: "default", label: "Default" },
  { value: "price_asc", label: "Price (low to high)" },
  { value: "price_desc", label: "Price (high to low)" },
  { value: "newest", label: "Most recent" },
];

export function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<{ products: Product[]; total: number } | null>(null);

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
    fetchProducts();
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
    window.history.pushState(null, "", `?${params.toString()}`);
    const event = new PopStateEvent("popstate");
    window.dispatchEvent(event);
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
    window.history.pushState(null, "", `?${params.toString()}`);
    const event = new PopStateEvent("popstate");
    window.dispatchEvent(event);
  };

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.delete("offset");
    window.history.pushState(null, "", `?${params.toString()}`);
    const event = new PopStateEvent("popstate");
    window.dispatchEvent(event);
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* Page header */}
      <div className="border-b border-border bg-background px-4 py-6 md:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
          <h1 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
            All Products
          </h1>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="search"
                type="search"
                placeholder="Search products..."
                defaultValue={search}
                className="pl-9 pr-9"
              />
              {search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            <Button type="submit" variant="outline">
              Search
            </Button>
          </form>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1">
        <div className="mx-auto flex w-full max-w-7xl px-4 md:px-8">
          {/* Filters sidebar */}
          <ProductFilters className="py-6" />

          {/* Product area */}
          <div className="flex flex-1 flex-col py-6 pl-0 lg:pl-8">
            {/* Results info */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
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
                  className="border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <p className="text-sm text-muted-foreground">
                {total === 0 ? (
                  "No products found"
                ) : (
                  <>
                    Showing <span className="font-medium text-foreground">{showingStart}-{showingEnd}</span> of{" "}
                    <span className="font-medium text-foreground">{total}</span> products
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

            {/* Testimonial */}
            <div className="mt-16 py-12 bg-gray-50 text-center">
              <p className="text-lg italic text-muted-foreground">
                "Ultrahype gave me unmatched focus and energy during workouts—truly a game changer for my training sessions."
              </p>
              <p className="mt-2 font-semibold">— Pranav</p>
              <div className="mt-4 flex justify-center gap-0.5">
                {[1,2,3,4,5].map((i) => (
                  <span key={i} className="text-yellow-500 text-lg">★</span>
                ))}
              </div>
            </div>

            {/* Pagination */}
            {total > LIMIT && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateToOffset(prevOffset)}
                  disabled={offset === 0}
                  className="gap-1"
                >
                  <ChevronLeft className="size-4" />
                  Previous
                </Button>
                <span className="px-3 text-sm text-muted-foreground">
                  Page {Math.floor(offset / LIMIT) + 1} of {Math.ceil(total / LIMIT)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateToOffset(nextOffset)}
                  disabled={offset + LIMIT >= total}
                  className="gap-1"
                >
                  Next
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
