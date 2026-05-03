import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

const PRODUCT_CATEGORIES = ["PRE_WORKOUT", "PROTEIN", "MASS_GAINER", "OMEGA_3", "MULTIVITAMIN"] as const;
type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

const SORT_OPTIONS: Record<string, object> = {
  // featured uses array for multi-field sort in Prisma 7
  featured: [{ featured: "desc" as const }, { createdAt: "desc" as const }],
  price_asc: { basePrice: "asc" as const },
  price_desc: { basePrice: "desc" as const },
  newest: { createdAt: "desc" as const },
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort");
    const search = searchParams.get("search");
    const rawLimit = parseInt(searchParams.get("limit") ?? "20", 10);
    const limit = isNaN(rawLimit) ? 20 : Math.min(Math.max(rawLimit, 1), 100);
    const rawOffset = parseInt(searchParams.get("offset") ?? "0", 10);
    const offset = isNaN(rawOffset) ? 0 : Math.max(rawOffset, 0);

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

    // Search filter (case-insensitive)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Determine sort order
    const sortKey = SORT_OPTIONS[sort as string] ?? SORT_OPTIONS.featured;

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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
