"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  PRE_WORKOUT: "Pre-Workout",
  PROTEIN: "Protein",
  MASS_GAINER: "Mass Gainer",
  OMEGA_3: "Omega-3",
  MULTIVITAMIN: "Multivitamin",
};

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

  const displayImage = images?.[0] ?? null;

  const discountPercent = comparePrice && comparePrice > displayPrice
    ? Math.round(((comparePrice - displayPrice) / comparePrice) * 100)
    : null;

  const isEcoCategory = ["PROTEIN", "PRE_WORKOUT", "OMEGA_3", "MULTIVITAMIN"].includes(category);

  const cardClasses = [
    "group flex flex-col overflow-hidden rounded-xl bg-white transition-all duration-300",
    "border border-[#E7E5E4]",
    "shadow-sm hover:shadow-xl",
    "hover:border-[#A8A29E] hover:-translate-y-1",
  ].join(" ");

  return (
    <div className={cardClasses}>
      {/* Image */}
      <Link href={`/products/${slug}`} className="block aspect-square overflow-hidden bg-muted relative">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={name}
            width={400}
            height={400}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted-foreground/10">
              <span className="text-xs font-medium text-muted-foreground">
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
        {discountPercent && (
          <span className="absolute right-2 top-2 rounded-full bg-[#166534] px-2 py-0.5 text-xs font-semibold text-white">
            -{discountPercent}%
          </span>
        )}
        {isEcoCategory && (
          <span className="absolute left-2 top-2 rounded-full bg-[#166534] px-2 py-0.5 text-xs font-semibold text-white">
            Organic
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <span className="mb-2 w-fit text-xs font-semibold uppercase tracking-[0.08em] text-[#166534] font-raleway">
          {CATEGORY_LABELS[category] ?? category}
        </span>

        <Link href={`/products/${slug}`} className="block">
          <h3 className="font-merriweather font-bold text-[18px] leading-tight text-[#1C1917] line-clamp-2 hover:text-[#166534] transition-colors">
            {name}
          </h3>
        </Link>

        {variants.length > 0 && (
          <p className="mt-1 text-sm text-[#A8A29E] font-raleway">
            {variants[0].flavor}
            {variants.length > 1 && ` +${variants.length - 1} more`}
          </p>
        )}

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-[22px] font-bold text-[#166534] font-raleway">
            {formatCurrency(displayPrice)}
          </span>
          {comparePrice && comparePrice > displayPrice && (
            <span className="text-[15px] font-normal text-[#A8A29E] line-through font-raleway">
              {formatCurrency(comparePrice)}
            </span>
          )}
        </div>

        <Button
          className="mt-4 w-full bg-[#166534] hover:bg-[#14532D] text-white font-semibold transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
          size="sm"
          variant="default"
          onClick={handleAddToCart}
          disabled={variants.length === 0}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
