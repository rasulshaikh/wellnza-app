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
  { value: "featured", label: "Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Most Recent" },
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
    <div className="flex flex-1 flex-col" style={{ background: "#FAFAF8", minHeight: "100vh" }}>
      {/* Search header */}
      <div
        className="border-b px-4 py-6 md:px-8"
        style={{ borderColor: "rgba(46, 125, 50, 0.15)", background: "#FAFAF8" }}
      >
        <div className="mx-auto max-w-7xl">
          <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2"
                style={{ color: "#7B9E6B" }}
                aria-hidden="true"
              />
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search products..."
                className="h-12 flex-1 border pl-10 pr-10 text-sm"
                style={{
                  borderColor: "rgba(46, 125, 50, 0.2)",
                  background: "#fff",
                  color: "#1a1a1a",
                }}
              />
              {inputValue && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "#7B9E6B" }}
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            <Button
              type="submit"
              className="h-12 !px-6 text-sm font-medium"
              style={{
                background: "#2E7D32",
                color: "#fff",
                fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)",
              }}
            >
              Search
            </Button>
          </form>

          {/* Sort options */}
          <div className="mt-4 flex items-center gap-4">
            <span
              className="text-xs tracking-wide"
              style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}
            >
              Sort by:
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
              className="h-9 border px-3 py-1.5 text-sm"
              style={{
                borderColor: "rgba(46, 125, 50, 0.2)",
                background: "#fff",
                color: "#1a1a1a",
                fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)",
              }}
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
        {/* Results header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="text-sm"
              style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}
            >
              {query ? "Search Results" : "All Products"}
            </span>
          </div>
          <p
            className="text-sm"
            style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}
            aria-live="polite"
          >
            {total === 0 ? (
              "No products found"
            ) : (
              <>
                Showing <span className="font-medium" style={{ color: "#1a1a1a" }}>{total}</span> products
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
            className="flex flex-col items-center justify-center py-20 text-center rounded-md"
            style={{ background: "#fff", border: "1px solid rgba(46, 125, 50, 0.15)" }}
          >
            <div
              className="mb-6 flex h-20 w-20 items-center justify-center rounded-full"
              style={{ background: "rgba(46, 125, 50, 0.08)" }}
            >
              <Search className="size-10" style={{ color: "#2E7D32" }} />
            </div>
            <h3
              className="text-xl font-bold mb-2"
              style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a" }}
            >
              {query ? `No results for "${query}"` : "No products available"}
            </h3>
            <p
              className="text-sm"
              style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}
            >
              {query ? "Try adjusting your search or browse all products" : "Check back soon for new products"}
            </p>
            <Link
              href="/products"
              className="mt-6 text-sm font-medium transition-colors"
              style={{ color: "#2E7D32" }}
            >
              Browse All Products →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
