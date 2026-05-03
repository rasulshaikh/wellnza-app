"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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

export function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") ?? "";
  const [inputValue, setInputValue] = useState(query);
  const [data, setData] = useState<{ products: Product[]; total: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    setIsLoading(true);
    fetch(`/api/products?search=${encodeURIComponent(query)}&limit=20`)
      .then((r) => r.json())
      .then((d: { products: Product[]; total: number }) => {
        setData(d);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (inputValue) params.set("q", inputValue);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <>
      <div className="border-b border-border bg-white px-4 py-6 md:px-8">
        <div className="mx-auto max-w-2xl">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search products..."
                className="pl-9 pr-9"
              />
              {inputValue && (
                <button
                  type="button"
                  onClick={() => {
                    setInputValue("");
                    router.push("/search");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            <Button type="submit" variant="default">
              Search
            </Button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        {query ? (
          <>
            <div className="mb-6">
              <h1 className="text-xl font-bold text-[#1C1917]" style={{ fontFamily: "var(--font-heading)" }}>
                Search results for &ldquo;{query}&rdquo;
              </h1>
              {!isLoading && data && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {data.total === 0 ? "No results found" : `${data.total} result${data.total !== 1 ? "s" : ""} found`}
                </p>
              )}
            </div>
            {isLoading ? (
              <ProductGrid products={[]} isLoading />
            ) : data && data.products.length > 0 ? (
              <ProductGrid products={data.products} />
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-muted-foreground">No products found for &ldquo;{query}&rdquo;.</p>
                <Link href="/products" className="mt-4 text-[#166534] hover:underline font-medium">
                  Browse all products →
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Search className="size-12 text-muted-foreground mb-4" />
            <h1 className="text-xl font-bold text-[#1C1917]" style={{ fontFamily: "var(--font-heading)" }}>
              Search Well NZ Nutrition
            </h1>
            <p className="mt-2 text-muted-foreground">Enter a product name, category, or keyword above.</p>
            <Link href="/products" className="mt-6 text-[#166534] hover:underline font-medium">
              Browse all products →
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
