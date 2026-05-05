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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const role = await getRoleFromToken();
  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { productId } = await params;

  const product = await db.product.findUnique({
    where: { id: productId },
    include: {
      variants: {
        include: {
          inventory: true,
        },
      },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const role = await getRoleFromToken();
  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { productId } = await params;
  const body = await request.json();
  const { isActive, featured } = body;

  // Build update data
  const updateData: Record<string, unknown> = {};
  if (typeof isActive === "boolean") updateData.isActive = isActive;
  if (typeof featured === "boolean") updateData.featured = featured;

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const product = await db.product.update({
    where: { id: productId },
    data: updateData,
    include: {
      variants: true,
    },
  });

  return NextResponse.json(product);
}
