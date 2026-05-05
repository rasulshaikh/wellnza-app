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
          className="athletic-card"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="aspect-square bg-[#1A1A1A] relative">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#166534]/50" />
            <Skeleton className="h-full w-full" />
          </div>
          <div className="p-5 space-y-3">
            <Skeleton className="h-3 w-20 bg-[#1A1A1A]" />
            <Skeleton className="h-6 w-full bg-[#1A1A1A]" />
            <Skeleton className="h-4 w-16 bg-[#1A1A1A]" />
            <Skeleton className="h-8 w-full bg-[#1A1A1A] mt-4" />
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
        style={{ background: "#0D0D0D" }}
      >
        <div className="mb-6 flex h-20 w-20 items-center justify-center" style={{ background: "#1A1A1A", border: "1px solid rgba(22, 101, 52, 0.3)" }}>
          <svg
            className="size-10 text-[#166534]"
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
          className="text-2xl font-bold text-white mb-2"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "2px" }}
        >
          NO PRODUCTS FOUND
        </h3>
        <p
          className="text-[14px] text-[#888888]"
          style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "1px" }}
        >
          TRY ADJUSTING YOUR FILTERS OR SEARCH QUERY
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => (
        <div
          key={product.id}
          className="athletic-animate-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <ProductCard {...product} />
        </div>
      ))}
    </div>
  );
}
