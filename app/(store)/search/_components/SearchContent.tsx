"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import Link from "next/link";

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
  { value: "featured", label: "FEATURED" },
  { value: "price_asc", label: "PRICE: LOW TO HIGH" },
  { value: "price_desc", label: "PRICE: HIGH TO LOW" },
  { value: "newest", label: "MOST RECENT" },
];

export function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") ?? "";
  const sort = searchParams.get("sort") ?? "featured";
  const [inputValue, setInputValue] = useState(query);
  const [data, setData] = useState<{ products: Product[]; total: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const fetchProducts = useCallback((searchQuery: string, sortOrder: string) => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (sortOrder && sortOrder !== "featured") params.set("sort", sortOrder);
    params.set("limit", String(LIMIT));

    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then((d: { products: Product[]; total: number }) => {
        setData(d);
        setIsLoading(false);
      })
      .catch(() => {
        setData(null);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      fetchProducts(query, sort);
    }, 300);
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, sort, fetchProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (inputValue) params.set("q", inputValue);
    router.push(`/search?${params.toString()}`);
  };

  const clearSearch = () => {
    setInputValue("");
    router.push("/search");
  };

  const products = data?.products ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="flex flex-1 flex-col" style={{ background: "#0D0D0D", minHeight: "100vh" }}>
      {/* Search header - Athletic Dark Theme */}
      <div
        className="border-b border-[#166534]/30 px-4 py-6 md:px-8"
        style={{ background: "linear-gradient(180deg, #0D0D0D 0%, #1A1A1A 100%)" }}
      >
        <div className="mx-auto max-w-7xl">
          <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#888888]"
                aria-hidden="true"
              />
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="SEARCH PRODUCTS..."
                className="h-12 flex-1 border border-[#166534]/40 bg-[#1A1A1A] pl-10 pr-10 text-[13px] text-white placeholder:text-[#888888] focus:border-[#22C55E] focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
                style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "1px" }}
              />
              {inputValue && (
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
            >
              SEARCH
            </Button>
          </form>

          {/* Sort options */}
          <div className="mt-4 flex items-center gap-4">
            <span
              className="text-[12px] text-[#888888]"
              style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "2px" }}
            >
              SORT BY:
            </span>
            <select
              value={sort}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams.toString());
                if (e.target.value === "featured") {
                  params.delete("sort");
                } else {
                  params.set("sort", e.target.value);
                }
                router.push(`/search?${params.toString()}`);
              }}
              className="h-9 border border-[#166534]/40 bg-[#1A1A1A] px-3 py-1.5 text-[13px] text-white focus:border-[#22C55E] focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
              style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "1px" }}
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">
        {/* Results header - Athletic Style */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="text-[12px] text-[#888888]"
              style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "2px" }}
            >
              {query ? "SEARCH RESULTS" : "ALL PRODUCTS"}
            </span>
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
                SHOWING <span className="font-semibold text-white">{total}</span> PRODUCTS
              </>
            )}
          </p>
        </div>

        {isLoading ? (
          <ProductGrid products={[]} isLoading />
        ) : data && data.products.length > 0 ? (
          <ProductGrid products={data.products} />
        ) : (
          <div
            className="flex flex-col items-center justify-center py-20 text-center"
            style={{ background: "#0D0D0D" }}
          >
            <div className="mb-6 flex h-20 w-20 items-center justify-center" style={{ background: "#1A1A1A", border: "1px solid rgba(22, 101, 52, 0.3)" }}>
              <Search className="size-10 text-[#166534]" />
            </div>
            <h3
              className="text-2xl font-bold text-white mb-2"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "2px" }}
            >
              {query ? `NO RESULTS FOR "${query.toUpperCase()}"` : "NO PRODUCTS FOUND"}
            </h3>
            <p
              className="text-[14px] text-[#888888]"
              style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "1px" }}
            >
              {query ? "TRY ADJUSTING YOUR SEARCH OR BROWSE ALL PRODUCTS" : "CHECK BACK SOON FOR NEW PRODUCTS"}
            </p>
            <Link href="/products" className="mt-6 text-[#166534] hover:text-[#22C55E] transition-colors font-medium" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "1px" }}>
              BROWSE ALL PRODUCTS →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
