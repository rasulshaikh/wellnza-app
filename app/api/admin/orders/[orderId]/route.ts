import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { orderId } = await params;

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      shippingAddress: true,
      items: {
        include: {
          productVariant: {
            include: {
              product: { select: { name: true, images: true } },
            },
          },
        },
      },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { orderId } = await params;
  const body = await request.json();
  const { status, trackingNumber, trackingCarrier } = body;

  // Validate status if provided
  const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];
  if (status && !validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  // Build update data
  const updateData: Record<string, unknown> = {};
  if (status) updateData.status = status;
  if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
  if (trackingCarrier !== undefined) updateData.trackingCarrier = trackingCarrier;

  const order = await db.order.update({
    where: { id: orderId },
    data: updateData,
    include: {
      user: { select: { name: true, email: true, phone: true } },
      shippingAddress: true,
      items: {
        include: {
          productVariant: {
            include: {
              product: { select: { name: true, images: true } },
            },
          },
        },
      },
    },
  });

  return NextResponse.json(order);
}
