"use client";

import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  basePrice: number;
  comparePrice: number | null;
  images: string[];
  variants: Array<{
    id: string;
    flavor: string;
    size: string | null;
    price: number;
    sku: string;
    weightG: number | null;
  }>;
}

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg overflow-hidden"
          style={{ animationDelay: `${i * 100}ms`, background: "#FFFFFF", border: "1px solid rgba(46, 125, 50, 0.15)", boxShadow: "0 2px 8px rgba(46, 125, 50, 0.06)" }}
        >
          <div className="aspect-square relative" style={{ background: "#FFFFFF" }}>
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#2E7D32]" />
            <Skeleton className="h-full w-full" />
          </div>
          <div className="p-5 space-y-3">
            <Skeleton className="h-3 w-20" style={{ background: "#e0e0e0" }} />
            <Skeleton className="h-6 w-full" style={{ background: "#e0e0e0" }} />
            <Skeleton className="h-4 w-16" style={{ background: "#e0e0e0" }} />
            <Skeleton className="h-8 w-full mt-4" style={{ background: "#e0e0e0" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (products.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 text-center"
        style={{ background: "#FAFAF8" }}
      >
        <div className="mb-6 flex h-20 w-20 items-center justify-center" style={{ background: "#FFFFFF", border: "1px solid rgba(46, 125, 50, 0.15)", boxShadow: "0 2px 8px rgba(46, 125, 50, 0.06)" }}>
          <svg
            className="size-10"
            style={{ color: "#2E7D32" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: "'Playfair Display', serif", color: "#1a1a1a" }}
        >
          No Products Found
        </h3>
        <p
          className="text-[14px]"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "#7B9E6B", letterSpacing: "0.5px" }}
        >
          Try adjusting your filters or search query
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => (
        <div
          key={product.id}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <ProductCard {...product} />
        </div>
      ))}
    </div>
  );
}
