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

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-shadow hover:shadow-card-hover">
      {/* Image */}
      <Link href={`/products/${slug}`} className="block aspect-square overflow-hidden bg-muted">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={name}
            width={400}
            height={400}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
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
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <Badge variant="secondary" className="mb-2 w-fit text-xs">
          {CATEGORY_LABELS[category] ?? category}
        </Badge>

        <Link href={`/products/${slug}`} className="block">
          <h3 className="font-heading text-sm font-semibold text-foreground leading-tight line-clamp-2 hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-heading text-base font-bold text-foreground">
            {formatCurrency(displayPrice)}
          </span>
          {comparePrice && comparePrice > displayPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatCurrency(comparePrice)}
            </span>
          )}
        </div>

        {variants.length > 1 && (
          <p className="mt-1 text-xs text-muted-foreground">
            {variants.length} variants
          </p>
        )}

        <Button
          className="mt-3 w-full"
          size="sm"
          onClick={handleAddToCart}
          disabled={variants.length === 0}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
