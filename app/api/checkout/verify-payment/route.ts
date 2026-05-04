import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";
import { OrderConfirmedEmail } from "@/lib/email-templates/order-confirmed";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = body;

    if (!orderId || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find the order
    const order = await db.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      console.error("[verify-payment] Signature mismatch", {
        expected: expectedSignature,
        received: razorpaySignature,
      });
      return NextResponse.json(
        { success: false, error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Update order status to PROCESSING within a transaction
    const updatedOrder = await db.$transaction(async (tx) => {
      return tx.order.update({
        where: { id: orderId },
        data: {
          status: "PROCESSING",
          razorpayPaymentId,
        },
        include: {
          user: { select: { email: true, name: true } },
          items: {
            include: {
              productVariant: {
                include: { product: { select: { name: true } } },
              },
            },
          },
        },
      });
    });

    // Send payment confirmed email
    try {
      // Get email from user relation or fall back to guest lookup via address
      const email = updatedOrder.user?.email;
      if (email) {
        const deliveryDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
        const orderItems = updatedOrder.items.map((i) => ({
          name: i.productVariant.product.name,
          quantity: i.quantity,
          price: i.unitPrice,
        }));
        await sendEmail({
          to: email,
          subject: `Payment Confirmed — Order #${updatedOrder.orderNumber} | Wellnza Nutrition`,
          react: OrderConfirmedEmail({
            name: updatedOrder.user?.name || "Customer",
            orderNumber: updatedOrder.orderNumber,
            total: updatedOrder.total,
            items: orderItems,
            estimatedDelivery: deliveryDate,
          }),
        });
      }
    } catch (err) {
      console.error("[payment-confirmed-email]", err);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[verify-payment] Signature mismatch");
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
