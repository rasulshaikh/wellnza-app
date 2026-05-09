import { Suspense } from "react";
import { ProductsContent } from "./ProductsContent";
import { Skeleton } from "@/components/ui/skeleton";

function ProductsLoading() {
  return (
    <div className="flex flex-1 flex-col" style={{ background: "#FAFAF8", minHeight: "100vh" }}>
      {/* Page header skeleton */}
      <div
        className="border-b px-4 py-8 md:px-8"
        style={{ background: "#FAFAF8", borderColor: "rgba(46,125,50,0.15)" }}
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="h-[2px] w-8" style={{ background: "#2E7D32" }} />
            <Skeleton className="h-3 w-40" style={{ background: "rgba(46,125,50,0.1)" }} />
          </div>
          <Skeleton className="h-14 w-80" style={{ background: "rgba(46,125,50,0.1)" }} />
          <Skeleton className="h-4 w-full max-w-lg" style={{ background: "rgba(46,125,50,0.1)" }} />
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex flex-1">
        <div className="mx-auto flex w-full max-w-7xl px-4 md:px-8">
          {/* Sidebar skeleton */}
          <div className="hidden w-56 shrink-0 lg:block py-6 pr-8">
            <div className="w-56 shrink-0 p-4" style={{ background: "#fff", border: "1px solid rgba(46,125,50,0.15)" }}>
              <Skeleton className="h-4 w-20 mb-4" style={{ background: "rgba(46,125,50,0.1)" }} />
              <Skeleton className="h-8 w-full mb-3" style={{ background: "rgba(46,125,50,0.1)" }} />
              <Skeleton className="h-8 w-full mb-3" style={{ background: "rgba(46,125,50,0.1)" }} />
              <Skeleton className="h-8 w-full" style={{ background: "rgba(46,125,50,0.1)" }} />
            </div>
          </div>

          {/* Product grid skeleton */}
          <div className="flex flex-1 flex-col py-6 pl-0 lg:pl-0">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-16" style={{ background: "rgba(46,125,50,0.1)" }} />
                <Skeleton className="h-8 w-32" style={{ background: "rgba(46,125,50,0.1)" }} />
              </div>
              <Skeleton className="h-4 w-40" style={{ background: "rgba(46,125,50,0.1)" }} />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ background: "#fff", border: "1px solid rgba(46,125,50,0.15)", borderRadius: "8px", overflow: "hidden" }}>
                  <div className="aspect-square relative" style={{ background: "rgba(46,125,50,0.05)" }}>
                    <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "rgba(46,125,50,0.3)" }} />
                    <Skeleton className="h-full w-full" style={{ background: "rgba(46,125,50,0.08)" }} />
                  </div>
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-3 w-20" style={{ background: "rgba(46,125,50,0.1)" }} />
                    <Skeleton className="h-6 w-full" style={{ background: "rgba(46,125,50,0.1)" }} />
                    <Skeleton className="h-4 w-16" style={{ background: "rgba(46,125,50,0.1)" }} />
                    <Skeleton className="h-10 w-full mt-4" style={{ background: "rgba(46,125,50,0.1)" }} />
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
