import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageGallery } from "@/components/products/ImageGallery";
import { ReviewCard } from "@/components/products/ReviewCard";
import { ProductCard } from "@/components/products/ProductCard";
import { AddToCartSection } from "@/components/products/AddToCartSection";
import { VariantSelectorClient } from "@/components/products/VariantSelectorClient";
import { Star } from "lucide-react";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

const CATEGORY_LABELS: Record<string, string> = {
  PRE_WORKOUT: "Pre-Workout",
  PROTEIN: "Protein",
  MASS_GAINER: "Mass Gainer",
  OMEGA_3: "Omega-3",
  MULTIVITAMIN: "Multivitamin",
};

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug, isActive: true },
    select: { name: true, description: true },
  });
  if (!product) return {};
  return {
    title: `${product.name} — Wellnza Nutrition`,
    // Note: slice at character level; JS strings are UTF-16 so this won't
    // split multi-byte characters, which is acceptable for metadata desc
    description: product.description.slice(0, 160),
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  const product = await db.product.findUnique({
    where: { slug, isActive: true },
    include: {
      variants: {
        include: {
          inventory: { select: { quantity: true } },
        },
      },
      reviews: {
        where: { isApproved: true },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { user: { select: { name: true } } },
      },
    },
  });

  if (!product) notFound();

  // Related products — same category, exclude current
  const relatedProducts = await db.product.findMany({
    where: { category: product.category, isActive: true, id: { not: product.id } },
    take: 4,
    orderBy: { featured: "desc" },
    select: {
      id: true, name: true, slug: true, description: true, category: true,
      basePrice: true, comparePrice: true, images: true, isActive: true, featured: true,
      variants: {
        select: { id: true, flavor: true, size: true, price: true, sku: true, weightG: true },
      },
    },
  });

  // Rating stats — compute from already-fetched reviews
  const approvedReviews = product.reviews.filter((r: typeof product.reviews[number]) => r.isApproved);
  const avgRating = approvedReviews.length
    ? (approvedReviews.reduce((total: number, r: typeof approvedReviews[number]) => total + r.rating, 0) / approvedReviews.length).toFixed(1)
    : null;

  const images: string[] = product.images ?? [];
  const hasVariants = product.variants.length > 0;

  // Build variant data for client components
  const variantData = product.variants.map((v: typeof product.variants[number]) => ({
    id: v.id,
    flavor: v.flavor,
    size: v.size,
    price: v.price,
  }));

  const inventoryData = product.variants.map((v: typeof product.variants[number]) => ({
    variantId: v.id,
    quantity: v.inventory.reduce((total: number, inv: typeof v.inventory[number]) => total + inv.quantity, 0),
  }));

  // Nutrition facts
  let nutritionFacts: Record<string, string> | null = null;
  if (product.nutritionFacts) {
    try {
      nutritionFacts = JSON.parse(product.nutritionFacts);
    } catch {
      nutritionFacts = null;
    }
  }

  const defaultVariant = product.variants[0] ?? null;

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-[#166534]/30 bg-[#0D0D0D] px-4 py-3 md:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs text-[#888888]">
            <Link href="/products" className="hover:text-white transition-colors">Products</Link>
            {" / "}
            <Link href={`/products?category=${product.category.toLowerCase()}`} className="hover:text-white transition-colors">
              {CATEGORY_LABELS[product.category] ?? product.category}
            </Link>
            {" / "}
            <span className="text-white">{product.name}</span>
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[3fr_2fr]">
          {/* LEFT — Image gallery */}
          <ImageGallery images={images} productName={product.name} />

          {/* RIGHT — Product info */}
          <div className="flex flex-col gap-5">
            <Badge className="w-fit text-xs bg-[#166534] text-white">
              {CATEGORY_LABELS[product.category] ?? product.category}
            </Badge>

            <h1 className="text-[28px] font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-bebas)" }}>
              {product.name}
            </h1>

            {/* Rating */}
            {avgRating && (
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-4 ${i < Math.round(Number(avgRating)) ? "fill-[#22C55E] text-[#22C55E]" : "text-[#888888]/30"}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-white">{avgRating}</span>
                <span className="text-sm text-[#888888]">({approvedReviews.length} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-[24px] font-semibold text-white" style={{ fontFamily: "var(--font-bebas)" }}>
                {formatCurrency(defaultVariant?.price ?? product.basePrice)}
              </span>
              {product.comparePrice && product.comparePrice > product.basePrice && (
                <>
                  <span className="text-lg text-[#888888] line-through">
                    {formatCurrency(product.comparePrice)}
                  </span>
                  <span className="rounded-md bg-[#166534] px-2 py-1 text-xs font-semibold text-white">
                    Save {Math.round(((product.comparePrice - product.basePrice) / product.comparePrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Short description */}
            <p className="text-[16px] leading-[1.6] text-[#888888]" style={{ fontFamily: "var(--font-oswald)" }}>
              {product.description.slice(0, 200)}
              {product.description.length > 200 ? "..." : ""}
            </p>

            {product.servingSize && (
              <Badge variant="outline" className="w-fit text-xs border-[#166534]/30 text-[#888888]">
                Serving Size: {product.servingSize}
              </Badge>
            )}

            <Separator />

            {/* Variant selector */}
            {hasVariants && (
              <div className="flex flex-col gap-3">
                <span className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-oswald)" }}>Select Option</span>
                <VariantSelectorClient
                  variants={variantData}
                  inventory={inventoryData}
                />
              </div>
            )}

            {/* Add to cart */}
            <AddToCartSection
              hasVariants={hasVariants}
              productId={product.id}
              productName={product.name}
              images={images}
              defaultPrice={product.basePrice}
              defaultVariant={defaultVariant ? { id: defaultVariant.id, flavor: defaultVariant.flavor, size: defaultVariant.size, price: defaultVariant.price } : null}
              variants={variantData}
              inventory={inventoryData}
            />

            {!hasVariants && (
              <p className="text-sm text-[#888888]">This product is currently unavailable.</p>
            )}

            {/* WhatsApp Chat Link */}
            <div className="mt-4">
              <a
                href={getWhatsAppUrl(`Hi! I'm interested in purchasing ${product.name}. https://www.wellnzanutrition.com/${product.slug}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#22C55E] hover:text-[#166534] font-medium text-sm"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start gap-0 rounded-none border-b border-[#166534]/30 bg-transparent p-0">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-active:border-[#22C55E] data-active:bg-transparent data-active:text-white text-[#888888]"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="nutrition"
                className="rounded-none border-b-2 border-transparent data-active:border-[#22C55E] data-active:bg-transparent data-active:text-white text-[#888888]"
              >
                Nutrition Facts
              </TabsTrigger>
              <TabsTrigger
                value="how-to-use"
                className="rounded-none border-b-2 border-transparent data-active:border-[#22C55E] data-active:bg-transparent data-active:text-white text-[#888888]"
              >
                How to Use
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="py-6">
              <p className="text-sm leading-relaxed text-[#888888] whitespace-pre-wrap" style={{ fontFamily: "var(--font-oswald)" }}>{product.description}</p>
              {product.ingredients && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-white mb-1" style={{ fontFamily: "var(--font-bebas)" }}>Ingredients</h3>
                  <p className="text-sm text-[#888888] whitespace-pre-wrap" style={{ fontFamily: "var(--font-oswald)" }}>{product.ingredients}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="nutrition" className="py-6">
              {nutritionFacts ? (
                <div className="rounded-lg border border-[#166534]/30 bg-[#0D0D0D]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#166534]/30 bg-[#1A1A1A]">
                        <th className="px-4 py-2 text-left font-semibold text-white" style={{ fontFamily: "var(--font-bebas)" }}>Nutrient</th>
                        <th className="px-4 py-2 text-right font-semibold text-white" style={{ fontFamily: "var(--font-bebas)" }}>Per Serving</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(nutritionFacts).map(([key, value]: [string, string]) => (
                        <tr key={key} className="border-b border-[#166534]/30 last:border-0">
                          <td className="px-4 py-2 text-white capitalize" style={{ fontFamily: "var(--font-oswald)" }}>{key.replace(/_/g, " ")}</td>
                          <td className="px-4 py-2 text-right text-[#888888]" style={{ fontFamily: "var(--font-oswald)" }}>{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-lg border border-[#166534]/30 bg-[#0D0D0D]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#166534]/30 bg-[#1A1A1A]">
                        <th className="px-4 py-2 text-left font-semibold text-white" style={{ fontFamily: "var(--font-bebas)" }}>Nutrient</th>
                        <th className="px-4 py-2 text-right font-semibold text-white" style={{ fontFamily: "var(--font-bebas)" }}>Per Serving</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.calories != null && (
                        <tr className="border-b border-[#166534]/30">
                          <td className="px-4 py-2 text-white" style={{ fontFamily: "var(--font-oswald)" }}>Calories</td>
                          <td className="px-4 py-2 text-right text-[#888888]" style={{ fontFamily: "var(--font-oswald)" }}>{product.calories}</td>
                        </tr>
                      )}
                      {product.protein != null && (
                        <tr className="border-b border-[#166534]/30">
                          <td className="px-4 py-2 text-white" style={{ fontFamily: "var(--font-oswald)" }}>Protein</td>
                          <td className="px-4 py-2 text-right text-[#888888]" style={{ fontFamily: "var(--font-oswald)" }}>{product.protein}g</td>
                        </tr>
                      )}
                      {product.carbs != null && (
                        <tr className="border-b border-[#166534]/30">
                          <td className="px-4 py-2 text-white" style={{ fontFamily: "var(--font-oswald)" }}>Carbohydrates</td>
                          <td className="px-4 py-2 text-right text-[#888888]" style={{ fontFamily: "var(--font-oswald)" }}>{product.carbs}g</td>
                        </tr>
                      )}
                      {product.fat != null && (
                        <tr className="border-b border-[#166534]/30">
                          <td className="px-4 py-2 text-white" style={{ fontFamily: "var(--font-oswald)" }}>Fat</td>
                          <td className="px-4 py-2 text-right text-[#888888]" style={{ fontFamily: "var(--font-oswald)" }}>{product.fat}g</td>
                        </tr>
                      )}
                      {!product.calories && !product.protein && !product.carbs && !product.fat && (
                        <tr>
                          <td colSpan={2} className="px-4 py-4 text-center text-[#888888]">
                            Nutrition information not available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="how-to-use" className="py-6">
              <div className="space-y-3">
                {product.directions && (
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1" style={{ fontFamily: "var(--font-bebas)" }}>Directions</h3>
                    <p className="text-sm text-[#888888] whitespace-pre-wrap" style={{ fontFamily: "var(--font-oswald)" }}>{product.directions}</p>
                  </div>
                )}
                {product.servingSize && (
                  <p className="text-sm text-[#888888]" style={{ fontFamily: "var(--font-oswald)" }}>
                    <span className="font-semibold text-white">Serving Size:</span> {product.servingSize}
                  </p>
                )}
                {!product.directions && !product.servingSize && (
                  <p className="text-sm text-[#888888]">Usage instructions not available.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Reviews */}
        <div className="mt-12">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-bebas)" }}>Customer Reviews</h2>
          </div>

          {product.reviews.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#888888]">
              Be the first to review this product.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {product.reviews.map((review: typeof product.reviews[number]) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-bebas)" }}>You may also like</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {relatedProducts.map((p: typeof relatedProducts[number]) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}