import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";
import { OrderConfirmedEmail } from "@/lib/email-templates/order-confirmed";

export async function POST(request: Request) {
  try {
    const session = await auth();

    const body = await request.json();
    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = body;

    if (!orderId || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find the order - support both logged-in users and guests
    let order;
    if (session?.user?.id) {
      // Logged-in user: find by orderId + userId
      order = await db.order.findUnique({
        where: { id: orderId, userId: session.user.id },
      });
    } else {
      // Guest checkout: find by orderId + razorpayOrderId (both are required as proof of ownership)
      order = await db.order.findFirst({
        where: {
          id: orderId,
          razorpayOrderId,
          userId: null,
        },
      });
    }

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Already processed or in terminal state — treat as success for idempotency
    const TERMINAL_STATES = ["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (order.status !== "PENDING") {
      return NextResponse.json({ success: true, alreadyVerified: true });
    }

    // Verify amount matches - fetch payment from Razorpay to get actual amount paid
    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
    if (razorpaySecret) {
      try {
        const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${razorpaySecret}`).toString("base64");
        const paymentRes = await fetch(`https://api.razorpay.com/v1/payments/${razorpayPaymentId}`, {
          headers: { Authorization: `Basic ${auth}` },
        });
        if (paymentRes.ok) {
          const paymentData = await paymentRes.json();
          // Razorpay amount is in paise (currency's smallest unit)
          // Razorpay returns amount in paise; order.total is stored in rupees — multiply by 100 to compare
          const amountPaid = paymentData.amount;
          if (amountPaid !== order.total * 100) {
            console.error("[verify-payment] Amount mismatch for order:", orderId, "expected paise:", order.total * 100, "got paise:", amountPaid);
            return NextResponse.json(
              { success: false, error: "Payment amount mismatch" },
              { status: 400 }
            );
          }
        }
      } catch (err) {
        console.error("[verify-payment] Failed to fetch Razorpay payment:", err);
        // Continue with signature verification as fallback
      }
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    // Timing-safe signature comparison
    const expectedBuf = Buffer.from(expectedSignature, "hex");
    const actualBuf = Buffer.from(razorpaySignature, "hex");
    if (expectedBuf.length !== actualBuf.length || !crypto.timingSafeEqual(expectedBuf, actualBuf)) {
      console.error("[verify-payment] Signature mismatch for order:", orderId);
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
      let email = updatedOrder.user?.email;
      // For guest orders (userId null), look up the guest user via the shipping address
      if (!email && !updatedOrder.userId) {
        const guestOrder = await db.order.findUnique({
          where: { id: updatedOrder.id },
          include: { shippingAddress: { include: { user: { select: { email: true, name: true } } } } },
        });
        email = guestOrder?.shippingAddress?.user?.email;
      }
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
