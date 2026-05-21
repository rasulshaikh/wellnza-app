"use client";

import { useState } from "react";
import { ImageGallery } from "@/components/products/ImageGallery";
import { VariantSelectorClient } from "@/components/products/VariantSelectorClient";
import { AddToCartSection } from "@/components/products/AddToCartSection";
import { formatCurrency } from "@/lib/utils";

interface Variant {
  id: string;
  flavor: string;
  size: string | null;
  price: number;
}

interface Inventory {
  variantId: string;
  quantity: number;
}

interface ProductDetailClientProps {
  variants: Variant[];
  inventory: Inventory[];
  images: string[];
  productId: string;
  productName: string;
  defaultPrice: number;
  categoryLabel: string;
  comparePrice: number | null;
}

export function ProductDetailClient({
  variants,
  inventory,
  images,
  productId,
  productName,
  defaultPrice,
  categoryLabel,
  comparePrice,
}: ProductDetailClientProps) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const selectedVariantId = variants[selectedVariantIndex]?.id ?? null;

  const handleVariantChange = (variantId: string) => {
    const idx = variants.findIndex((v) => v.id === variantId);
    if (idx !== -1) setSelectedVariantIndex(idx);
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {/* LEFT — Image gallery, variant-aware */}
      <ImageGallery
        images={images}
        productName={productName}
        variantHint={selectedVariantIndex}
        variants={variants}
      />

      {/* RIGHT — Product info */}
      <div className="flex flex-col gap-5">
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider w-fit"
          style={{
            background: `${"#14532D"}15`,
            color: "#14532D",
            border: `1px solid ${"#14532D"}30`,
          }}
        >
          {categoryLabel}
        </span>

        <h1
          className="text-[28px] font-bold tracking-tight"
          style={{
            fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)",
            color: "#1a1a1a",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {productName}
        </h1>

        {/* Price — updates with variant selection */}
        <div className="flex items-baseline gap-3">
          <span
            className="text-[24px] font-semibold"
            style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a" }}
          >
            {formatCurrency(variants[selectedVariantIndex]?.price ?? defaultPrice)}
          </span>
          {comparePrice && comparePrice > (variants[selectedVariantIndex]?.price ?? defaultPrice) && (
            <>
              <span className="text-lg line-through" style={{ color: "#7B9E6B" }}>
                {formatCurrency(comparePrice)}
              </span>
              <span
                className="rounded-md px-2 py-1 text-xs font-semibold text-white"
                style={{ background: "#14532D" }}
              >
                Save {Math.round(((comparePrice - (variants[selectedVariantIndex]?.price ?? defaultPrice)) / comparePrice) * 100)}%
              </span>
            </>
          )}
        </div>

        {/* Variant selector */}
        {variants.length > 0 && (
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#1a1a1a" }}>
              Select Option
            </span>
            <VariantSelectorClient
              variants={variants}
              inventory={inventory}
              onVariantChange={handleVariantChange}
            />
          </div>
        )}

        {/* Add to cart */}
        <AddToCartSection
          hasVariants={variants.length > 0}
          productId={productId}
          productName={productName}
          images={images}
          defaultPrice={defaultPrice}
          selectedVariantId={selectedVariantId}
          variants={variants}
          inventory={inventory}
        />
      </div>
    </div>
  );
}
