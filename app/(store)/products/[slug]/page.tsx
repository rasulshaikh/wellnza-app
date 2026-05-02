import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
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
    title: `${product.name} — Well NZ Nutrition`,
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
  const variantData = product.variants.map((v) => ({
    id: v.id,
    flavor: v.flavor,
    size: v.size,
    price: v.price,
  }));

  const inventoryData = product.variants.map((v) => ({
    variantId: v.id,
    quantity: v.inventory.reduce((total, inv) => total + inv.quantity, 0),
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
      <div className="border-b border-border bg-background px-4 py-3 md:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs text-muted-foreground">
            <a href="/products" className="hover:text-foreground transition-colors">Products</a>
            {" / "}
            <a href={`/products?category=${product.category.toLowerCase()}`} className="hover:text-foreground transition-colors">
              {CATEGORY_LABELS[product.category] ?? product.category}
            </a>
            {" / "}
            <span className="text-foreground">{product.name}</span>
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
            <Badge variant="secondary" className="w-fit text-xs">
              {CATEGORY_LABELS[product.category] ?? product.category}
            </Badge>

            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {product.name}
            </h1>

            {/* Rating */}
            {avgRating && (
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-4 ${i < Math.round(Number(avgRating)) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-foreground">{avgRating}</span>
                <span className="text-sm text-muted-foreground">({approvedReviews.length} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-heading text-3xl font-bold text-foreground">
                {formatCurrency(defaultVariant?.price ?? product.basePrice)}
              </span>
              {product.comparePrice && product.comparePrice > product.basePrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatCurrency(product.comparePrice)}
                  </span>
                  <span className="rounded-md bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                    Save {Math.round(((product.comparePrice - product.basePrice) / product.comparePrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Short description */}
            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.description.slice(0, 200)}
              {product.description.length > 200 ? "..." : ""}
            </p>

            {product.servingSize && (
              <Badge variant="outline" className="w-fit text-xs">
                Serving Size: {product.servingSize}
              </Badge>
            )}

            <Separator />

            {/* Variant selector */}
            {hasVariants && (
              <div className="flex flex-col gap-3">
                <span className="text-sm font-semibold text-foreground">Select Option</span>
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
              <p className="text-sm text-muted-foreground">This product is currently unavailable.</p>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start gap-0 rounded-none border-b bg-transparent p-0">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-active:border-primary data-active:bg-transparent data-active:text-foreground"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="nutrition"
                className="rounded-none border-b-2 border-transparent data-active:border-primary data-active:bg-transparent data-active:text-foreground"
              >
                Nutrition Facts
              </TabsTrigger>
              <TabsTrigger
                value="how-to-use"
                className="rounded-none border-b-2 border-transparent data-active:border-primary data-active:bg-transparent data-active:text-foreground"
              >
                How to Use
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="py-6">
              <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{product.description}</p>
              {product.ingredients && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-foreground mb-1">Ingredients</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{product.ingredients}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="nutrition" className="py-6">
              {nutritionFacts ? (
                <div className="rounded-lg border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted">
                        <th className="px-4 py-2 text-left font-semibold">Nutrient</th>
                        <th className="px-4 py-2 text-right font-semibold">Per Serving</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(nutritionFacts).map(([key, value]) => (
                        <tr key={key} className="border-b border-border last:border-0">
                          <td className="px-4 py-2 text-foreground capitalize">{key.replace(/_/g, " ")}</td>
                          <td className="px-4 py-2 text-right text-muted-foreground">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-lg border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted">
                        <th className="px-4 py-2 text-left font-semibold">Nutrient</th>
                        <th className="px-4 py-2 text-right font-semibold">Per Serving</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.calories != null && (
                        <tr className="border-b border-border">
                          <td className="px-4 py-2 text-foreground">Calories</td>
                          <td className="px-4 py-2 text-right text-muted-foreground">{product.calories}</td>
                        </tr>
                      )}
                      {product.protein != null && (
                        <tr className="border-b border-border">
                          <td className="px-4 py-2 text-foreground">Protein</td>
                          <td className="px-4 py-2 text-right text-muted-foreground">{product.protein}g</td>
                        </tr>
                      )}
                      {product.carbs != null && (
                        <tr className="border-b border-border">
                          <td className="px-4 py-2 text-foreground">Carbohydrates</td>
                          <td className="px-4 py-2 text-right text-muted-foreground">{product.carbs}g</td>
                        </tr>
                      )}
                      {product.fat != null && (
                        <tr className="border-b border-border">
                          <td className="px-4 py-2 text-foreground">Fat</td>
                          <td className="px-4 py-2 text-right text-muted-foreground">{product.fat}g</td>
                        </tr>
                      )}
                      {!product.calories && !product.protein && !product.carbs && !product.fat && (
                        <tr>
                          <td colSpan={2} className="px-4 py-4 text-center text-muted-foreground">
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
                    <h3 className="text-sm font-semibold text-foreground mb-1">Directions</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{product.directions}</p>
                  </div>
                )}
                {product.servingSize && (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Serving Size:</span> {product.servingSize}
                  </p>
                )}
                {!product.directions && !product.servingSize && (
                  <p className="text-sm text-muted-foreground">Usage instructions not available.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Reviews */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-xl font-bold text-foreground">Customer Reviews</h2>
            <Button variant="outline" size="sm" disabled title="Review feature coming soon">Coming Soon</Button>
          </div>

          {product.reviews.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Be the first to review this product.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {product.reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="font-heading text-xl font-bold text-foreground mb-6">You might also like</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}