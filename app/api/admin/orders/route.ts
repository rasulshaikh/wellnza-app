import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

async function getRoleFromToken(): Promise<string | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  const dbUser = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  return dbUser?.role ?? null;
}

export async function GET(request: NextRequest) {
  const role = await getRoleFromToken();

  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const pageSize = parseInt(searchParams.get("pageSize") || "20");
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  // Build where clause
  const where: Record<string, unknown> = {};

  if (status && status !== "ALL") {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: "insensitive" } },
      { user: { email: { contains: search, mode: "insensitive" } } },
    ];
  }

  if (from || to) {
    where.createdAt = {};
    if (from) (where.createdAt as Record<string, unknown>).gte = new Date(from);
    if (to) (where.createdAt as Record<string, unknown>).lte = new Date(to + "T23:59:59.999Z");
  }

  // Build orderBy
  const orderBy: Record<string, unknown> = {};
  if (sortBy === "total") {
    orderBy.total = sortOrder;
  } else if (sortBy === "status") {
    orderBy.status = sortOrder;
  } else {
    orderBy.createdAt = sortOrder;
  }

  const [orders, totalCount] = await Promise.all([
    db.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        items: true,
      },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.order.count({ where }),
  ]);

  return NextResponse.json({
    orders,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    },
  });
}
