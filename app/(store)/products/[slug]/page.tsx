import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductDetailClient } from "@/components/products/ProductDetailClient";
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
      <div className="border-b px-4 py-3 md:px-8" style={{ background: "#FAFAF8", borderColor: "rgba(46,125,50,0.15)" }}>
        <div className="mx-auto max-w-7xl">
          <p className="text-xs" style={{ color: "#7B9E6B" }}>
            <Link href="/products" className="hover:underline transition-colors" style={{ color: "#7B9E6B" }}>Products</Link>
            {" / "}
            <Link href={`/products?category=${product.category.toLowerCase()}`} className="hover:underline transition-colors" style={{ color: "#7B9E6B" }}>
              {CATEGORY_LABELS[product.category] ?? product.category}
            </Link>
            {" / "}
            <span style={{ color: "#1a1a1a" }}>{product.name}</span>
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <ProductDetailClient
          variants={variantData}
          inventory={inventoryData}
          images={images}
          productId={product.id}
          productName={product.name}
          defaultPrice={product.basePrice}
          defaultVariant={defaultVariant ? { id: defaultVariant.id, flavor: defaultVariant.flavor, size: defaultVariant.size, price: defaultVariant.price } : null}
          categoryLabel={CATEGORY_LABELS[product.category] ?? product.category}
          comparePrice={product.comparePrice ?? null}
        />

        {/* Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start gap-0 rounded-none border-b p-0" style={{ background: "transparent", borderColor: "rgba(46,125,50,0.15)" }}>
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-active:border-transparent data-active:bg-transparent"
                style={{ color: "#7B9E6B", fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}
                data-active-style={{ color: "#1a1a1a", borderBottomColor: "#2E7D32" }}
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="nutrition"
                className="rounded-none border-b-2 border-transparent data-active:border-transparent data-active:bg-transparent"
                style={{ color: "#7B9E6B", fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}
                data-active-style={{ color: "#1a1a1a", borderBottomColor: "#2E7D32" }}
              >
                Nutrition Facts
              </TabsTrigger>
              <TabsTrigger
                value="how-to-use"
                className="rounded-none border-b-2 border-transparent data-active:border-transparent data-active:bg-transparent"
                style={{ color: "#7B9E6B", fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}
                data-active-style={{ color: "#1a1a1a", borderBottomColor: "#2E7D32" }}
              >
                How to Use
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="py-6">
              <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>{product.description}</p>
              {product.ingredients && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold mb-1" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a" }}>Ingredients</h3>
                  <p className="text-sm whitespace-pre-wrap" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>{product.ingredients}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="nutrition" className="py-6">
              {nutritionFacts ? (
                <div className="rounded-lg border" style={{ borderColor: "rgba(46,125,50,0.15)", background: "#fff" }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b" style={{ borderColor: "rgba(46,125,50,0.15)", background: "#FAFAF8" }}>
                        <th className="px-4 py-2 text-left font-semibold" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a" }}>Nutrient</th>
                        <th className="px-4 py-2 text-right font-semibold" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a" }}>Per Serving</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(nutritionFacts).map(([key, value]: [string, string]) => (
                        <tr key={key} className="border-b last:border-0" style={{ borderColor: "rgba(46,125,50,0.15)" }}>
                          <td className="px-4 py-2 capitalize" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#1a1a1a" }}>{key.replace(/_/g, " ")}</td>
                          <td className="px-4 py-2 text-right" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-lg border" style={{ borderColor: "rgba(46,125,50,0.15)", background: "#fff" }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b" style={{ borderColor: "rgba(46,125,50,0.15)", background: "#FAFAF8" }}>
                        <th className="px-4 py-2 text-left font-semibold" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a" }}>Nutrient</th>
                        <th className="px-4 py-2 text-right font-semibold" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a" }}>Per Serving</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.calories != null && (
                        <tr className="border-b" style={{ borderColor: "rgba(46,125,50,0.15)" }}>
                          <td className="px-4 py-2" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#1a1a1a" }}>Calories</td>
                          <td className="px-4 py-2 text-right" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>{product.calories}</td>
                        </tr>
                      )}
                      {product.protein != null && (
                        <tr className="border-b" style={{ borderColor: "rgba(46,125,50,0.15)" }}>
                          <td className="px-4 py-2" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#1a1a1a" }}>Protein</td>
                          <td className="px-4 py-2 text-right" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>{product.protein}g</td>
                        </tr>
                      )}
                      {product.carbs != null && (
                        <tr className="border-b" style={{ borderColor: "rgba(46,125,50,0.15)" }}>
                          <td className="px-4 py-2" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#1a1a1a" }}>Carbohydrates</td>
                          <td className="px-4 py-2 text-right" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>{product.carbs}g</td>
                        </tr>
                      )}
                      {product.fat != null && (
                        <tr className="border-b" style={{ borderColor: "rgba(46,125,50,0.15)" }}>
                          <td className="px-4 py-2" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#1a1a1a" }}>Fat</td>
                          <td className="px-4 py-2 text-right" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>{product.fat}g</td>
                        </tr>
                      )}
                      {!product.calories && !product.protein && !product.carbs && !product.fat && (
                        <tr>
                          <td colSpan={2} className="px-4 py-4 text-center" style={{ color: "#7B9E6B" }}>
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
                    <h3 className="text-sm font-semibold mb-1" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a" }}>Directions</h3>
                    <p className="text-sm whitespace-pre-wrap" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>{product.directions}</p>
                  </div>
                )}
                {product.servingSize && (
                  <p className="text-sm" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>
                    <span className="font-semibold" style={{ color: "#1a1a1a" }}>Serving Size:</span> {product.servingSize}
                  </p>
                )}
                {!product.directions && !product.servingSize && (
                  <p className="text-sm" style={{ color: "#7B9E6B" }}>Usage instructions not available.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Reviews */}
        <div className="mt-12">
          <div className="mb-6">
            <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a" }}>Customer Reviews</h2>
          </div>

          {product.reviews.length === 0 ? (
            <p className="py-8 text-center text-sm" style={{ color: "#7B9E6B" }}>
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
            <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a" }}>You may also like</h2>
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