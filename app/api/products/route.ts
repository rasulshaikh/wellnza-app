import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

const PRODUCT_CATEGORIES = ["PRE_WORKOUT", "PROTEIN", "MASS_GAINER", "OMEGA_3", "MULTIVITAMIN"] as const;
type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

const SORT_OPTIONS = {
  featured: { featured: "desc", createdAt: "desc" },
  price_asc: { basePrice: "asc" },
  price_desc: { basePrice: "desc" },
  newest: { createdAt: "desc" },
} as const;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort") as keyof typeof SORT_OPTIONS | null;
    const search = searchParams.get("search");
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 100);
    const offset = parseInt(searchParams.get("offset") ?? "0", 10);

    // Build where clause
    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    // Category filter — support both enum values and slug form (e.g., "protein" → "PROTEIN")
    if (category) {
      const normalized = category.toUpperCase().replace("-", "_");
      if (PRODUCT_CATEGORIES.includes(normalized as ProductCategory)) {
        where.category = normalized as ProductCategory;
      }
    }

    // Price range filter
    if (minPrice || maxPrice) {
      where.basePrice = {};
      if (minPrice && !isNaN(parseInt(minPrice, 10))) {
        where.basePrice.gte = parseInt(minPrice, 10);
      }
      if (maxPrice && !isNaN(parseInt(maxPrice, 10))) {
        where.basePrice.lte = parseInt(maxPrice, 10);
      }
    }

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    // Determine sort order
    const sortKey = (sort && SORT_OPTIONS[sort]) ? SORT_OPTIONS[sort] : SORT_OPTIONS.featured;

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        orderBy: sortKey,
        take: limit,
        skip: offset,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          category: true,
          basePrice: true,
          comparePrice: true,
          images: true,
          isActive: true,
          featured: true,
          variants: {
            select: {
              id: true,
              flavor: true,
              size: true,
              price: true,
              comparePrice: true,
              sku: true,
              weightG: true,
            },
          },
        },
      }),
      db.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("[products API]", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: "Internal server error", detail: message }, { status: 500 });
  }
}
