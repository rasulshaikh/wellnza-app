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
  { params }: { params: Promise<{ orderId: string }> }
) {
  const role = await getRoleFromToken();
  if (role !== "ADMIN") {
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
  const role = await getRoleFromToken();
  if (role !== "ADMIN") {
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

  // Send status email
  try {
    let email = order.user?.email;
    let customerName = order.user?.name;
    // For guest orders (userId null), look up email/name via shipping address
    if (!email && !order.userId) {
      const guestOrder = await db.order.findUnique({
        where: { id: order.id },
        include: { shippingAddress: { include: { user: { select: { email: true, name: true } } } } },
      });
      email = guestOrder?.shippingAddress?.user?.email;
      customerName = guestOrder?.shippingAddress?.user?.name || customerName;
    }
    if (!email) throw new Error("No email found");
    const { sendEmail } = await import("@/lib/email");

    if (status === "SHIPPED") {
      const { OrderShippedEmail } = await import("@/lib/email-templates/order-shipped");
      await sendEmail({
        to: email,
        subject: `Order #${order.orderNumber} Shipped — Wellnza Nutrition`,
        react: OrderShippedEmail({
          name: customerName || "Customer",
          orderNumber: order.orderNumber,
          trackingNumber: order.trackingNumber || undefined,
          trackingCarrier: order.trackingCarrier || undefined,
        }),
      });
    } else if (status === "DELIVERED") {
      const { OrderDeliveredEmail } = await import("@/lib/email-templates/order-delivered");
      await sendEmail({
        to: email,
        subject: `Order #${order.orderNumber} Delivered — Wellnza Nutrition`,
        react: OrderDeliveredEmail({ name: customerName || "Customer", orderNumber: order.orderNumber }),
      });
    } else if (status === "CANCELLED") {
      const { OrderCancelledEmail } = await import("@/lib/email-templates/order-cancelled");
      await sendEmail({
        to: email,
        subject: `Order #${order.orderNumber} Cancelled — Wellnza Nutrition`,
        react: OrderCancelledEmail({ name: customerName || "Customer", orderNumber: order.orderNumber }),
      });
    }
  } catch (err) {
    console.error("[order-status-email]", err);
  }

  return NextResponse.json(order);
}
