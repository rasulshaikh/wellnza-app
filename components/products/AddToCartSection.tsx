"use client";

import { useState } from "react";
import { Minus, Plus, Check } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { getVariantStockStatus } from "@/lib/product-utils";

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
  const [added, setAdded] = useState(false);
  const store = useCartStore();

  const selectedVariant = variants.find((v) => v.id === selectedVariantId);
  const displayPrice = selectedVariant?.price ?? defaultPrice;

  const isOutOfStock = selectedVariantId ? getVariantStockStatus(selectedVariantId, inventory) === "out_of_stock" : !hasVariants;

  if (!hasVariants) {
    return (
      <button disabled className="w-full h-12 rounded-lg bg-[#166534] text-[#FFFFFF] font-['Raleway'] font-semibold text-base opacity-50 cursor-not-allowed">
        Out of Stock
      </button>
    );
  }

  const handleAddToCart = () => {
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
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Variant flavor selector */}
      {variants.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {variants.map((variant) => (
            <button
              key={variant.id}
              type="button"
              onClick={() => setSelectedVariantId(variant.id)}
              className={cn(
                "px-4 py-2 rounded-lg border text-sm font-['Raleway'] transition-all",
                selectedVariantId === variant.id
                  ? "border-[#166534] bg-[#166534] text-[#FFFFFF]"
                  : "border-[#D6D3D1] bg-[#FFFFFF] text-[#1C1917] hover:border-[#166534]"
              )}
            >
              {variant.flavor}
              {variant.size ? ` / ${variant.size}` : ""}
            </button>
          ))}
        </div>
      )}

      {/* Selected variant display */}
      {selectedVariant && (
        <div className="flex items-center justify-between">
          <span className="font-['Raleway'] text-sm text-[#78716C]">
            {selectedVariant.flavor}
            {selectedVariant.size ? ` / ${selectedVariant.size}` : ""}
          </span>
          <span className="font-['Merriweather'] font-semibold text-[#1C1917] text-lg">{formatCurrency(displayPrice)}</span>
        </div>
      )}

      {/* Quantity selector */}
      <div className="flex items-center gap-3">
        <span className="font-['Raleway'] text-sm font-medium text-[#1C1917]">Qty</span>
        <div className="flex items-center h-11 rounded-lg border border-[#D6D3D1] overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="flex items-center justify-center w-11 h-full border-r border-[#D6D3D1] hover:bg-[#F5F5F4] transition-colors text-[#166534] disabled:opacity-50"
            disabled={quantity <= 1}
          >
            <Minus className="size-4" />
          </button>
          <span className="font-['Raleway'] w-12 text-center text-sm font-medium text-[#1C1917]">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(10, quantity + 1))}
            className="flex items-center justify-center w-11 h-full border-l border-[#D6D3D1] hover:bg-[#F5F5F4] transition-colors text-[#166534] disabled:opacity-50"
            disabled={quantity >= 10}
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>

      {/* Add to cart button */}
      <button
        className={cn(
          "w-full h-12 rounded-lg font-['Raleway'] font-semibold text-base transition-all",
          added
            ? "bg-[#166534] text-[#FFFFFF] border-2 border-[#166534]"
            : isOutOfStock
            ? "bg-[#F5F5F4] text-[#B91C1C] cursor-not-allowed opacity-50"
            : "bg-[#166534] text-[#FFFFFF] hover:bg-[#14532D]"
        )}
        disabled={isOutOfStock}
        onClick={handleAddToCart}
      >
        {added ? (
          <span className="flex items-center justify-center gap-2">
            <Check className="size-5" />
            Added!
          </span>
        ) : isOutOfStock ? (
          "Out of Stock"
        ) : (
          "Add to Cart"
        )}
      </button>
    </div>
  );
}