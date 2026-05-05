import { Suspense } from "react";
import { ProductsContent } from "./ProductsContent";
import { Skeleton } from "@/components/ui/skeleton";

function ProductsLoading() {
  return (
    <div className="flex flex-1 flex-col" style={{ background: "#0D0D0D", minHeight: "100vh" }}>
      {/* Page header skeleton */}
      <div
        className="border-b border-[#166534]/30 px-4 py-8 md:px-8"
        style={{ background: "linear-gradient(180deg, #0D0D0D 0%, #1A1A1A 100%)" }}
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="h-[2px] w-8 bg-[#166534]" />
            <Skeleton className="h-3 w-40 bg-[#1A1A1A]" />
          </div>
          <Skeleton className="h-14 w-80 bg-[#1A1A1A]" />
          <Skeleton className="h-4 w-full max-w-lg bg-[#1A1A1A]" />
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex flex-1">
        <div className="mx-auto flex w-full max-w-7xl px-4 md:px-8">
          {/* Sidebar skeleton */}
          <div className="hidden w-56 shrink-0 lg:block py-6 pr-8">
            <div className="w-56 shrink-0 p-4" style={{ background: "#1A1A1A", border: "1px solid rgba(22, 101, 52, 0.3)" }}>
              <Skeleton className="h-4 w-20 mb-4 bg-[#0D0D0D]" />
              <Skeleton className="h-8 w-full mb-3 bg-[#0D0D0D]" />
              <Skeleton className="h-8 w-full mb-3 bg-[#0D0D0D]" />
              <Skeleton className="h-8 w-full bg-[#0D0D0D]" />
            </div>
          </div>

          {/* Product grid skeleton */}
          <div className="flex flex-1 flex-col py-6 pl-0 lg:pl-0">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-16 bg-[#1A1A1A]" />
                <Skeleton className="h-8 w-32 bg-[#1A1A1A]" />
              </div>
              <Skeleton className="h-4 w-40 bg-[#1A1A1A]" />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="athletic-card">
                  <div className="aspect-square bg-[#1A1A1A] relative">
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#166534]/50" />
                    <Skeleton className="h-full w-full" />
                  </div>
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-3 w-20 bg-[#1A1A1A]" />
                    <Skeleton className="h-6 w-full bg-[#1A1A1A]" />
                    <Skeleton className="h-4 w-16 bg-[#1A1A1A]" />
                    <Skeleton className="h-10 w-full bg-[#1A1A1A] mt-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsContent />
    </Suspense>
  );
}
