import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { OrderStatus } from "@prisma/client";
import crypto from "crypto";

// Shiprocket status code → our OrderStatus
const STATUS_MAP: Record<number, OrderStatus> = {
  1: "PROCESSING",  // Pickup Scheduled
  2: "PROCESSING",  // Pickup Timed Out
  3: "SHIPPED",     // Picked Up
  4: "SHIPPED",     // Out for Pickup
  5: "SHIPPED",     // In Transit
  6: "SHIPPED",     // Out for Delivery
  7: "DELIVERED",   // Not Delivered
  8: "DELIVERED",   // Delivered
  9: "CANCELLED",   // Cancelled
  10: "PROCESSING", // RTO Initiated
  11: "PROCESSING", // RTO Delivered
  12: "PROCESSING", // RTO Acknowledged
  14: "SHIPPED",    // In Transit
  15: "SHIPPED",    // Reached Destination Hub
  16: "SHIPPED",    // Out for Pickup
  17: "SHIPPED",    // Pickup Exception
  18: "PROCESSING", // Undelivered
  19: "PROCESSING", // Delay
  20: "PROCESSING", // Self-Fulfilled
  21: "CANCELLED",  // Cancelled Before Pickup
};

interface ShiprocketWebhookPayload {
  awb: string;
  courier_name: string;
  current_status: string;
  current_status_id: number;
  order_id: string;         // our order number
  shipment_id: string;
  delivered_date?: string;
  etd?: string;
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();

    // Verify HMAC signature if secret is configured
    const webhookSecret = process.env.SHIPROCKET_WEBHOOK_SECRET;
    if (webhookSecret) {
      const signature = request.headers.get("x-shiprocket-signature");
      if (!signature) {
        console.error("[shiprocket-webhook] Missing signature header");
        return NextResponse.json({ error: "Missing signature" }, { status: 400 });
      }
      const expectedBuf = Buffer.from(
        crypto.createHmac("sha256", webhookSecret).update(rawBody).digest("hex"),
        "hex"
      );
      const actualBuf = Buffer.from(signature, "hex");
      if (expectedBuf.length !== actualBuf.length || !crypto.timingSafeEqual(expectedBuf, actualBuf)) {
        console.error("[shiprocket-webhook] Signature mismatch");
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    }

    const payload: ShiprocketWebhookPayload = JSON.parse(rawBody);
    const { awb, current_status_id, order_id: srOrderNumber, current_status } = payload;

    console.log(`[shiprocket-webhook] AWB: ${awb}, status: ${current_status} (${current_status_id})`);

    const mappedStatus = STATUS_MAP[current_status_id];

    const order = await db.order.findFirst({
      where: {
        OR: [
          { orderNumber: srOrderNumber },
          { trackingNumber: awb },
          { shiprocketOrderId: srOrderNumber },
        ],
      },
    });

    if (!order) {
      console.warn(`[shiprocket-webhook] Order not found for AWB: ${awb}`);
      return NextResponse.json({ success: true });
    }

    const updateData: Parameters<typeof db.order.update>[0]["data"] = {
      trackingNumber: awb,
      trackingCarrier: payload.courier_name,
    };

    if (mappedStatus && mappedStatus !== order.status) {
      // Only advance status, never go backwards
      const statusOrder: OrderStatus[] = [
        "PENDING", "PROCESSING", "SHIPPED", "DELIVERED",
      ];
      const currentIdx = statusOrder.indexOf(order.status as OrderStatus);
      const newIdx = statusOrder.indexOf(mappedStatus);
      if (newIdx > currentIdx || mappedStatus === "CANCELLED") {
        updateData.status = mappedStatus;
      }
    }

    await db.order.update({ where: { id: order.id }, data: updateData });

    console.log(`[shiprocket-webhook] Updated order ${order.orderNumber} → ${updateData.status ?? order.status}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[shiprocket-webhook] Error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
