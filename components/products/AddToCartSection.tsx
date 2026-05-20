"use client";

import { useState } from "react";
import { Minus, Plus, Check } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { cn } from "@/lib/utils";
import { getVariantStockStatus } from "@/lib/product-utils";

interface AddToCartSectionProps {
  hasVariants: boolean;
  productId: string;
  productName: string;
  images: string[];
  defaultPrice: number;
  selectedVariantId: string | null;
  variants: Array<{ id: string; flavor: string; size: string | null; price: number }>;
  inventory: Array<{ variantId: string; quantity: number }>;
}

export function AddToCartSection({
  hasVariants,
  productId,
  productName,
  images,
  defaultPrice,
  selectedVariantId,
  variants,
  inventory,
}: AddToCartSectionProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const store = useCartStore();

  const selectedVariant = variants.find((v) => v.id === selectedVariantId);

  const isOutOfStock = selectedVariantId
    ? getVariantStockStatus(selectedVariantId, inventory) === "out_of_stock"
    : inventory.length === 0 || inventory.every(i => i.quantity <= 0);

  if (!hasVariants) {
    return (
      <button disabled className="w-full h-12 rounded-lg text-white font-semibold text-base cursor-not-allowed" style={{ background: "#2E7D32", opacity: 0.5 }}>
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
      {/* Quantity selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium" style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif", color: "#1a1a1a" }}>Qty</span>
        <div className="flex items-center h-11 rounded-lg border overflow-hidden" style={{ borderColor: "rgba(46,125,50,0.15)" }}>
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="flex items-center justify-center w-11 h-full border-r hover:bg-[#FAFAF8] transition-colors disabled:opacity-50"
            style={{ borderColor: "rgba(46,125,50,0.15)", color: "#2E7D32" }}
            disabled={quantity <= 1}
          >
            <Minus className="size-4" />
          </button>
          <span className="w-12 text-center text-sm font-medium" style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif", color: "#1a1a1a" }}>{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(10, quantity + 1))}
            className="flex items-center justify-center w-11 h-full border-l hover:bg-[#FAFAF8] transition-colors disabled:opacity-50"
            style={{ borderColor: "rgba(46,125,50,0.15)", color: "#2E7D32" }}
            disabled={quantity >= 10}
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>

      {/* Add to cart button */}
      <button
        className={cn(
          "w-full h-12 rounded-lg font-semibold text-base transition-all",
          added
            ? "text-white border-2"
            : isOutOfStock
            ? "cursor-not-allowed opacity-50"
            : "text-white hover:opacity-90"
        )}
        style={{
          background: added ? "#2E7D32" : isOutOfStock ? "#FAFAF8" : "#2E7D32",
          borderColor: added ? "#2E7D32" : "transparent",
          color: isOutOfStock ? "#7B9E6B" : "#FFFFFF",
          fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif"
        }}
        disabled={isOutOfStock || !selectedVariantId}
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
