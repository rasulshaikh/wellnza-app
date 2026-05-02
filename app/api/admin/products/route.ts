import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const pageSize = parseInt(searchParams.get("pageSize") || "20");
  const category = searchParams.get("category");
  const active = searchParams.get("active");
  const featured = searchParams.get("featured");
  const search = searchParams.get("search");

  // Build where clause
  const where: Record<string, unknown> = {};

  if (category && category !== "ALL") {
    where.category = category;
  }

  if (active === "ACTIVE") {
    where.isActive = true;
  } else if (active === "INACTIVE") {
    where.isActive = false;
  }

  if (featured === "FEATURED") {
    where.featured = true;
  } else if (featured === "NOT_FEATURED") {
    where.featured = false;
  }

  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }

  const [products, totalCount] = await Promise.all([
    db.product.findMany({
      where,
      include: {
        variants: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.product.count({ where }),
  ]);

  return NextResponse.json({
    products,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    },
  });
}
