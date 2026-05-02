"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AddToCartSectionProps {
  hasVariants: boolean;
  productId: string;
  productName: string;
  images: string[];
  defaultPrice: number;
  defaultVariant?: { id: string; flavor: string; size: string | null; price: number } | null;
  variants: Array<{ id: string; flavor: string; size: string | null; price: number }>;
  inventory: Array<{ variantId: string; quantity: number }>;
}

export function AddToCartSection({
  hasVariants,
  productId,
  productName,
  images,
  defaultPrice,
  defaultVariant,
  variants,
  inventory,
}: AddToCartSectionProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(defaultVariant?.id ?? null);
  const store = useCartStore();

  const selectedVariant = variants.find((v) => v.id === selectedVariantId);
  const displayPrice = selectedVariant?.price ?? defaultPrice;

  const getStockStatus = (variantId: string) => {
    const inv = inventory.find((i) => i.variantId === variantId);
    if (!inv) return "out_of_stock";
    if (inv.quantity === 0) return "out_of_stock";
    if (inv.quantity <= 5) return "low_stock";
    return "in_stock";
  };

  const isOutOfStock = selectedVariantId ? getStockStatus(selectedVariantId) === "out_of_stock" : !hasVariants;

  if (!hasVariants) {
    return (
      <Button disabled className="w-full" size="lg">
        Out of Stock
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Selected variant display */}
      {selectedVariant && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {selectedVariant.flavor}
            {selectedVariant.size ? ` / ${selectedVariant.size}` : ""}
          </span>
          <span className="font-semibold text-foreground">{formatCurrency(displayPrice)}</span>
        </div>
      )}

      {/* Quantity selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-foreground">Qty</span>
        <div className="flex items-center gap-1 rounded-lg border border-border">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="flex size-8 items-center justify-center hover:bg-muted transition-colors"
            disabled={quantity <= 1}
          >
            <Minus className="size-3" />
          </button>
          <span className="w-8 text-center text-sm font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(10, quantity + 1))}
            className="flex size-8 items-center justify-center hover:bg-muted transition-colors"
            disabled={quantity >= 10}
          >
            <Plus className="size-3" />
          </button>
        </div>
      </div>

      {/* Add to cart button */}
      <Button
        className="w-full"
        size="lg"
        disabled={isOutOfStock}
        onClick={() => {
          if (!selectedVariantId || !selectedVariant) return;
          store.addItem({
            productVariantId: selectedVariantId,
            name: productName,
            flavor: selectedVariant.flavor,
            price: selectedVariant.price,
            quantity,
            image: images[0] ?? undefined,
          });
          store.openCart();
        }}
      >
        {isOutOfStock ? "Out of Stock" : "Add to Cart"}
      </Button>
    </div>
  );
}