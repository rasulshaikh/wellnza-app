import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  createShiprocketOrder,
  generateAWB,
  ShiprocketOrderPayload,
} from "@/lib/shiprocket";

// Admin-only: create a Shiprocket shipment for a confirmed order
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { orderId } = await request.json();

    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            productVariant: { include: { product: true } },
          },
        },
        shippingAddress: true,
        user: { select: { email: true, name: true, phone: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!order.shippingAddress) {
      return NextResponse.json(
        { error: "Order has no shipping address" },
        { status: 400 }
      );
    }

    if (order.shiprocketOrderId) {
      return NextResponse.json(
        { error: "Shipment already created" },
        { status: 400 }
      );
    }

    const addr = order.shippingAddress;
    const [firstName, ...rest] = (addr.name ?? order.user?.name ?? "Customer").split(" ");
    const lastName = rest.join(" ") || "-";

    const orderItems: ShiprocketOrderPayload["order_items"] = order.items.map(
      (item) => ({
        name: `${item.productVariant.product.name} - ${item.productVariant.flavor}${item.productVariant.size ? " " + item.productVariant.size : ""}`,
        sku: item.productVariant.sku ?? `SKU-${item.productVariantId}`,
        units: item.quantity,
        selling_price: item.unitPrice, // already in rupees (integers, e.g. 2199 = ₹2,199)
      })
    );

    const payload: ShiprocketOrderPayload = {
      order_id: order.orderNumber,
      order_date: order.createdAt.toISOString().replace("T", " ").slice(0, 16),
      pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION ?? "Primary",
      billing_customer_name: firstName,
      billing_last_name: lastName,
      billing_address: addr.line1 + (addr.line2 ? ", " + addr.line2 : ""),
      billing_city: addr.city,
      billing_pincode: addr.pin,
      billing_state: addr.state,
      billing_country: addr.country ?? "India",
      billing_email: order.user?.email ?? "customer@wellnzanutrition.com",
      billing_phone: addr.phone ?? order.user?.phone ?? "9999999999",
      shipping_is_billing: true,
      order_items: orderItems,
      payment_method: order.paymentMethod === "COD" ? "COD" : "Prepaid",
      sub_total: order.subtotal, // already in rupees
      length: 30,
      breadth: 20,
      height: 15,
      weight: 0.5 * order.items.reduce((sum, i) => sum + i.quantity, 0),
    };

    const srOrder = await createShiprocketOrder(payload);

    let awbCode: string | undefined;
    let courierName: string | undefined;

    // AWB may be auto-assigned or need a separate call
    if (srOrder.response?.data?.awb_code) {
      awbCode = srOrder.response.data.awb_code;
      courierName = srOrder.response.data.courier_name;
    } else if (srOrder.shipment_id) {
      const awbData = await generateAWB(srOrder.shipment_id);
      awbCode = awbData?.awb_code;
      courierName = awbData?.courier_name;
    }

    await db.order.update({
      where: { id: orderId },
      data: {
        shiprocketOrderId: String(srOrder.order_id),
        shiprocketShipmentId: String(srOrder.shipment_id),
        trackingNumber: awbCode ?? null,
        trackingCarrier: courierName ?? "Shiprocket",
        status: "SHIPPED",
      },
    });

    return NextResponse.json({
      success: true,
      shiprocketOrderId: srOrder.order_id,
      shipmentId: srOrder.shipment_id,
      awbCode,
      courierName,
    });
  } catch (error) {
    console.error("[create-shipment] Error:", error);
    return NextResponse.json(
      { error: "Failed to create shipment" },
      { status: 500 }
    );
  }
}
