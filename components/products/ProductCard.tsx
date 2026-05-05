"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { useRef, useCallback, useState } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  basePrice: number;
  comparePrice?: number | null;
  images: string[];
  variants: Array<{
    id: string;
    flavor: string;
    size: string | null;
    price: number;
    sku: string;
    weightG: number | null;
  }>;
}

const CATEGORY_LABELS: Record<string, string> = {
  PRE_WORKOUT: "PRE-WORKOUT",
  PROTEIN: "PROTEIN",
  MASS_GAINER: "MASS GAINER",
  OMEGA_3: "OMEGA-3",
  MULTIVITAMIN: "MULTIVITAMIN",
};

const THROTTLE_MS = 16;

export function ProductCard({
  id,
  name,
  slug,
  category,
  basePrice,
  comparePrice,
  images,
  variants,
}: ProductCardProps) {
  const store = useCartStore();
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const lastMoveRef = useRef<number>(0);

  const displayPrice = basePrice;
  const primaryVariant = variants[0];

  const handleAddToCart = () => {
    if (!primaryVariant) return;
    store.addItem({
      productVariantId: primaryVariant.id,
      name,
      flavor: primaryVariant.flavor,
      price: primaryVariant.price,
      quantity: 1,
      image: images?.[0] ?? null,
    });
    store.openCart();
  };

  const [tiltStyle, setTiltStyle] = useState('');

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    if (now - lastMoveRef.current < THROTTLE_MS) return;
    lastMoveRef.current = now;

    const container = imageContainerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateY = (mouseX / (rect.width / 2)) * 8;
    const rotateX = -(mouseY / (rect.height / 2)) * 8;

    setTiltStyle(`rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(1.05)`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTiltStyle('rotateY(0deg) rotateX(0deg) scale(1)');
  }, []);

  const displayImage = images?.[0] ?? null;

  const discountPercent = comparePrice && comparePrice > displayPrice
    ? Math.round(((comparePrice - displayPrice) / comparePrice) * 100)
    : null;

  const isEcoCategory = ["PROTEIN", "PRE_WORKOUT", "OMEGA_3", "MULTIVITAMIN"].includes(category);

  return (
    <div className="athletic-card group">
      {/* Image with 3D Parallax */}
      <Link
        href={`/products/${slug}`}
        className="block"
      >
        <div
          ref={imageContainerRef}
          className="athletic-image-container aspect-square relative"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ transform: tiltStyle }}
        >
          {/* Angular frame accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#166534]/20 via-transparent to-transparent z-10 pointer-events-none" />

          {displayImage ? (
            <Image
              src={displayImage}
              alt={name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover relative z-20 transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center relative z-20 bg-[#1A1A1A]">
              <div className="flex h-16 w-16 items-center justify-center bg-[#166534]">
                <span className="text-xs font-bold text-white" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "2px" }}>
                  {name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              </div>
            </div>
          )}

          {/* Discount Badge */}
          {discountPercent && (
            <span
              className="absolute right-2 top-2 z-30 px-2 py-1 text-xs font-bold text-white"
              style={{ fontFamily: "'Bebas Neue', sans-serif", background: "#22C55E", letterSpacing: "1px" }}
              aria-label={`${discountPercent}% discount`}
            >
              -{discountPercent}%
            </span>
          )}

          {/* Organic Badge */}
          {isEcoCategory && (
            <span
              className="absolute left-2 top-2 z-30 px-2 py-1 text-xs font-bold text-white"
              style={{ fontFamily: "'Bebas Neue', sans-serif", background: "#166534", letterSpacing: "1px" }}
              aria-label="Organic certified"
            >
              ORGANIC
            </span>
          )}

          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#166534] z-30" />
        </div>
      </Link>

      {/* Content */}
      <div className="p-5">
        {/* Category Label */}
        <span
          className="mb-3 inline-block text-[11px] font-semibold tracking-[0.15em] text-[#22C55E]"
          style={{ fontFamily: "'Oswald', sans-serif" }}
          aria-label={`Category: ${CATEGORY_LABELS[category] ?? category}`}
        >
          {CATEGORY_LABELS[category] ?? category}
        </span>

        {/* Product Name */}
        <Link href={`/products/${slug}`} className="block">
          <h3
            className="mb-2 text-[18px] font-bold leading-tight text-white transition-colors hover:text-[#22C55E]"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "1px" }}
          >
            {name.toUpperCase()}
          </h3>
        </Link>

        {/* Variant Info */}
        {variants.length > 0 && (
          <p
            className="mb-4 text-[13px] text-[#888888]"
            style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "1px" }}
          >
            {variants[0].flavor.toUpperCase()}
            {variants.length > 1 && ` +${variants.length - 1} MORE`}
          </p>
        )}

        {/* Price */}
        <div className="mb-5 flex items-baseline gap-3">
          <span
            className="text-[24px] font-bold text-[#22C55E]"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "1px" }}
          >
            {formatCurrency(displayPrice)}
          </span>
          {comparePrice && comparePrice > displayPrice && (
            <span
              className="text-[15px] text-[#888888] line-through"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              {formatCurrency(comparePrice)}
            </span>
          )}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleAddToCart}
          disabled={variants.length === 0}
          className="athletic-cta w-full"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          aria-label={variants.length === 0 ? "Out of stock" : `Add ${name} to cart`}
        >
          {variants.length === 0 ? "OUT OF STOCK" : "LOCK IN MY STACK"}
        </button>

        {/* Trust Badge */}
        <div className="mt-4 flex items-center gap-2">
          <svg
            className="h-4 w-4 shrink-0"
            fill="#166534"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
          </svg>
          <span
            className="text-[10px] text-[#888888]"
            style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "1px" }}
          >
            100% AUTHENTIC — ZERO FAKES
          </span>
        </div>
      </div>
    </div>
  );
}
