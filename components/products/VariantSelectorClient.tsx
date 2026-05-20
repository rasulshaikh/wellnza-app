"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { VariantSelector } from "./VariantSelector";

interface VariantSelectorClientProps {
  variants: Array<{ id: string; flavor: string; size: string | null; price: number }>;
  inventory: Array<{ variantId: string; quantity: number }>;
  onVariantChange?: (variantId: string) => void;
}

export function VariantSelectorClient({ variants, inventory, onVariantChange }: VariantSelectorClientProps) {
  const firstInStock = variants.find(v => {
    const inv = inventory.find(i => i.variantId === v.id);
    return inv && inv.quantity > 0;
  }) ?? variants[0];
  const [selected, setSelected] = useState<string | null>(firstInStock?.id ?? null);

  const handleSelect = (variantId: string) => {
    setSelected(variantId);
    onVariantChange?.(variantId);
  };

  return (
    <VariantSelector
      variants={variants}
      inventory={inventory}
      selectedVariantId={selected}
      onSelectVariant={handleSelect}
    />
  );
}