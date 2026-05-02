"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { getVariantStockStatus, getVariantStockLabel } from "@/lib/product-utils";

interface VariantStock {
  variantId: string;
  quantity: number;
}

interface VariantSelectorProps {
  variants: Array<{
    id: string;
    flavor: string;
    size: string | null;
    price: number;
  }>;
  inventory: VariantStock[];
  selectedVariantId: string | null;
  onSelectVariant: (variantId: string) => void;
}

function stockBadge(variantId: string, inventory: VariantStock[]) {
  const status = getVariantStockStatus(variantId, inventory);
  const label = getVariantStockLabel(variantId, inventory);
  if (status === "out_of_stock") {
    return (
      <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-medium text-red-700">
        {label}
      </span>
    );
  }
  if (status === "low_stock") {
    return (
      <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
        {label}
      </span>
    );
  }
  return (
    <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700">
      {label}
    </span>
  );
}

export function VariantSelector({
  variants,
  inventory,
  selectedVariantId,
  onSelectVariant,
}: VariantSelectorProps) {
  if (!variants || variants.length === 0) return null;

  const flavors = useMemo(() => [...new Set(variants.map((v) => v.flavor))], [variants]);
  const selectedVariant = variants.find((v) => v.id === selectedVariantId);

  // If flavors only, show flat list
  if (flavors.length === 1 && variants.length > 1 && variants[0].size) {
    // Has sizes — show size chips after flavor
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">{variants[0].flavor}</span>
          <span className="text-sm text-muted-foreground">/</span>
          <div className="flex gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={() => onSelectVariant(v.id)}
                disabled={getVariantStockStatus(v.id, inventory) === "out_of_stock"}
                aria-label={`${v.flavor}${v.size ? ` / ${v.size}` : ''}`}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-all",
                  selectedVariantId === v.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-muted-foreground/50",
                  getVariantStockStatus(v.id, inventory) === "out_of_stock" && "opacity-50"
                )}
              >
                <span>{v.size}</span>
                {stockBadge(v.id, inventory)}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Multiple flavors — show flavor buttons
  return (
    <div className="space-y-3">
      {flavors.map((flavor) => {
        const flavorVariants = variants.filter((v) => v.flavor === flavor);
        const hasSizes = flavorVariants[0].size != null;

        return (
          <div key={flavor} className="space-y-2">
            <span className="text-sm font-medium text-foreground">{flavor}</span>
            <div className="flex flex-wrap gap-2">
              {hasSizes ? (
                flavorVariants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => onSelectVariant(v.id)}
                    disabled={getVariantStockStatus(v.id, inventory) === "out_of_stock"}
                    aria-label={`${flavor}${v.size ? ` / ${v.size}` : ''}`}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-all",
                      selectedVariantId === v.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-muted-foreground/50",
                      getVariantStockStatus(v.id, inventory) === "out_of_stock" && "opacity-50"
                    )}
                  >
                    <span>{v.size}</span>
                    {stockBadge(v.id, inventory)}
                  </button>
                ))
              ) : (
                <button
                  onClick={() => onSelectVariant(flavorVariants[0].id)}
                  disabled={getVariantStockStatus(flavorVariants[0].id, inventory) === "out_of_stock"}
                  aria-label={flavor}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-all",
                    selectedVariantId === flavorVariants[0].id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-muted-foreground/50",
                    getVariantStockStatus(flavorVariants[0].id, inventory) === "out_of_stock" && "opacity-50"
                  )}
                >
                  {stockBadge(flavorVariants[0].id, inventory)}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}