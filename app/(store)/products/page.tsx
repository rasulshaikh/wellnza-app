import { Suspense } from "react";
import { ProductsContent } from "./ProductsContent";
import { Skeleton } from "@/components/ui/skeleton";

function ProductsLoading() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-border bg-background px-4 py-6 md:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-full max-w-md" />
        </div>
      </div>
      <div className="flex flex-1">
        <div className="mx-auto flex w-full max-w-7xl px-4 md:px-8">
          <div className="hidden w-56 shrink-0 lg:block" />
          <div className="flex flex-1 flex-col py-6 pl-0 lg:pl-8">
            <div className="mb-4 flex items-center justify-between">
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
                  <Skeleton className="aspect-square w-full" />
                  <div className="flex flex-col gap-2 p-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="mt-2 h-8 w-full" />
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
