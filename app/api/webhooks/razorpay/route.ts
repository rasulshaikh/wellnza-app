import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

// Razorpay webhook payload structure
interface RazorpayWebhookPayload {
  entity: string;
  account_id: string;
  event: string;
  contains: string[];
  payload: {
    payment: {
      entity: {
        id: string;
        order_id: string;
        amount: number;
        currency: string;
        status: string;
        method: string;
      };
    };
  };
  created_at: number;
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      console.error("[razorpay-webhook] Missing signature header");
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(rawBody)
      .digest("hex");

    const expectedBuf = Buffer.from(expectedSignature, "hex");
    const actualBuf = Buffer.from(signature, "hex");
    if (expectedBuf.length !== actualBuf.length || !crypto.timingSafeEqual(expectedBuf, actualBuf)) {
      console.error("[razorpay-webhook] Signature mismatch");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    const payload: RazorpayWebhookPayload = JSON.parse(rawBody);
    const event = payload.event;

    console.log(`[razorpay-webhook] Received event: ${event}`);

    // Handle payment.authorized event
    if (event === "payment.authorized") {
      const paymentEntity = payload.payload.payment.entity;
      const { order_id: razorpayOrderId, id: razorpayPaymentId, amount, status } = paymentEntity;

      console.log(`[razorpay-webhook] Payment authorized: ${razorpayPaymentId}, order: ${razorpayOrderId}, amount: ${amount}, status: ${status}`);

      // Find order by razorpay order ID
      const order = await db.order.findFirst({
        where: {
          razorpayOrderId,
          status: "PENDING",
        },
      });

      if (!order) {
        console.error("[razorpay-webhook] Order not found for razorpayOrderId:", razorpayOrderId);
        return NextResponse.json({ success: true }); // Return 200 to acknowledge receipt
      }

      // Update order to PROCESSING
      await db.order.update({
        where: { id: order.id },
        data: {
          status: "PROCESSING",
          razorpayPaymentId,
        },
      });

      console.log(`[razorpay-webhook] Order ${order.orderNumber} updated to PROCESSING`);
    }

    // Handle payment.captured event (Razorpay sometimes uses this instead)
    if (event === "payment.captured") {
      const paymentEntity = payload.payload.payment.entity;
      const { order_id: razorpayOrderId, id: razorpayPaymentId, amount, status } = paymentEntity;

      console.log(`[razorpay-webhook] Payment captured: ${razorpayPaymentId}, order: ${razorpayOrderId}, amount: ${amount}, status: ${status}`);

      // Find order by razorpay order ID
      const order = await db.order.findFirst({
        where: {
          razorpayOrderId,
          status: "PENDING",
        },
      });

      if (!order) {
        console.error("[razorpay-webhook] Order not found for razorpayOrderId:", razorpayOrderId);
        return NextResponse.json({ success: true }); // Return 200 to acknowledge receipt
      }

      // Update order to PROCESSING
      await db.order.update({
        where: { id: order.id },
        data: {
          status: "PROCESSING",
          razorpayPaymentId,
        },
      });

      console.log(`[razorpay-webhook] Order ${order.orderNumber} updated to PROCESSING`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[razorpay-webhook] Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
