"use client";

import { useState } from "react";
import { ImageGallery } from "@/components/products/ImageGallery";
import { VariantSelectorClient } from "@/components/products/VariantSelectorClient";
import { AddToCartSection } from "@/components/products/AddToCartSection";

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
  defaultVariant: { id: string; flavor: string; size: string | null; price: number } | null;
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
  defaultVariant,
  categoryLabel,
  comparePrice,
}: ProductDetailClientProps) {
  // Track which variant index is selected — this drives the image gallery
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  // When variant selection changes, update the image index
  const handleVariantChange = (variantId: string) => {
    const idx = variants.findIndex((v) => v.id === variantId);
    if (idx !== -1) setSelectedVariantIndex(idx);
  };

  return (
    <>
      {/* LEFT — Image gallery, now variant-aware via variantHint prop */}
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
            background: `${"#2E7D32"}15`,
            color: "#2E7D32",
            border: `1px solid ${"#2E7D32"}30`,
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
            {/* Display price from selected variant, falling back to default */}
            {Intl.NumberFormat("en-IN", { style: "currency", currency: "NZD" }).format(
              (variants[selectedVariantIndex]?.price ?? defaultPrice) / 100
            )}
          </span>
          {comparePrice && comparePrice > defaultPrice && (
            <>
              <span className="text-lg line-through" style={{ color: "#7B9E6B" }}>
                {Intl.NumberFormat("en-IN", { style: "currency", currency: "NZD" }).format(comparePrice / 100)}
              </span>
              <span
                className="rounded-md px-2 py-1 text-xs font-semibold text-white"
                style={{ background: "#2E7D32" }}
              >
                Save {Math.round(((comparePrice - defaultPrice) / comparePrice) * 100)}%
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
          defaultVariant={defaultVariant}
          variants={variants}
          inventory={inventory}
        />
      </div>
    </>
  );
}
