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
      <span className="rounded px-1.5 py-0.5 text-[10px] font-medium" style={{ background: "rgba(185,28,28,0.1)", color: "#B91C1C" }}>
        {label}
      </span>
    );
  }
  if (status === "low_stock") {
    return (
      <span className="rounded px-1.5 py-0.5 text-[10px] font-medium" style={{ background: "rgba(180,83,9,0.1)", color: "#B45309" }}>
        {label}
      </span>
    );
  }
  return null;
}

export function VariantSelector({
  variants,
  inventory,
  selectedVariantId,
  onSelectVariant,
}: VariantSelectorProps) {
  const flavors = useMemo(() => [...new Set(variants.map((v) => v.flavor))], [variants]);
  if (!variants || variants.length === 0) return null;

  const btnBase = "flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-all cursor-pointer";
  const btnSelected = "text-white";
  const btnUnselected = "text-[#1a1a1a] hover:border-[#2E7D32] hover:text-[#2E7D32]";
  const selectedStyle = { background: "#2E7D32", borderColor: "#2E7D32" };
  const unselectedStyle = { background: "#fff", borderColor: "rgba(46,125,50,0.25)" };

  // Single flavor with multiple sizes — show inline size chips
  if (flavors.length === 1 && variants.length > 1 && variants[0].size) {
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium" style={{ color: "#1a1a1a", fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>
            {variants[0].flavor}
          </span>
          <span style={{ color: "#7B9E6B" }}>/</span>
          {variants.map((v) => {
            const isSelected = selectedVariantId === v.id;
            const oos = getVariantStockStatus(v.id, inventory) === "out_of_stock";
            return (
              <button
                key={v.id}
                onClick={() => onSelectVariant(v.id)}
                disabled={oos}
                aria-label={`${v.flavor}${v.size ? ` / ${v.size}` : ""}`}
                className={cn(btnBase, isSelected ? btnSelected : btnUnselected, oos && "opacity-40 cursor-not-allowed")}
                style={isSelected ? selectedStyle : unselectedStyle}
              >
                <span>{v.size}</span>
                {stockBadge(v.id, inventory)}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Multiple flavors — show each as a selectable chip
  return (
    <div className="flex flex-wrap gap-2">
      {flavors.map((flavor) => {
        const flavorVariants = variants.filter((v) => v.flavor === flavor);
        const hasSizes = flavorVariants[0].size != null;

        if (hasSizes) {
          return flavorVariants.map((v) => {
            const isSelected = selectedVariantId === v.id;
            const oos = getVariantStockStatus(v.id, inventory) === "out_of_stock";
            return (
              <button
                key={v.id}
                onClick={() => onSelectVariant(v.id)}
                disabled={oos}
                aria-label={`${flavor}${v.size ? ` / ${v.size}` : ""}`}
                className={cn(btnBase, isSelected ? btnSelected : btnUnselected, oos && "opacity-40 cursor-not-allowed")}
                style={isSelected ? selectedStyle : unselectedStyle}
              >
                <span>{flavor}{v.size ? ` / ${v.size}` : ""}</span>
                {stockBadge(v.id, inventory)}
              </button>
            );
          });
        }

        const v = flavorVariants[0];
        const isSelected = selectedVariantId === v.id;
        const oos = getVariantStockStatus(v.id, inventory) === "out_of_stock";
        return (
          <button
            key={v.id}
            onClick={() => onSelectVariant(v.id)}
            disabled={oos}
            aria-label={flavor}
            className={cn(btnBase, isSelected ? btnSelected : btnUnselected, oos && "opacity-40 cursor-not-allowed")}
            style={isSelected ? selectedStyle : unselectedStyle}
          >
            <span>{flavor}</span>
            {stockBadge(v.id, inventory)}
          </button>
        );
      })}
    </div>
  );
}
