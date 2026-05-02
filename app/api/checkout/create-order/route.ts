import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateOrderNumber } from "@/lib/utils";
import { z } from "zod";
import Razorpay from "razorpay";

const createOrderSchema = z.object({
  cartItems: z.array(
    z.object({
      productVariantId: z.string().min(1),
      quantity: z.number().int().positive(),
    })
  ),
  shippingAddressId: z.string().optional(),
  paymentMethod: z.enum(["RAZORPAY", "COD"]),
  // Guest checkout fields
  guestEmail: z.string().email().optional(),
  guestPhone: z.string().optional(),
  guestName: z.string().optional(),
  guestAddress: z
    .object({
      name: z.string().min(1),
      phone: z.string().regex(/^[6-9]\d{9}$/),
      line1: z.string().min(1),
      line2: z.string().optional(),
      city: z.string().min(1),
      state: z.string().min(1),
      pin: z.string().regex(/^[1-9]\d{5}$/),
    })
    .optional(),
});

const FREE_SHIPPING_THRESHOLD = 99900; // ₹999 in paise
const STANDARD_SHIPPING = 5000; // ₹50 in paise
const EXPRESS_SHIPPING = 10000; // ₹100 in paise

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { cartItems, shippingAddressId, paymentMethod, guestEmail, guestPhone, guestName, guestAddress } =
      parsed.data;

    // Validate variants exist and get prices
    const variantIds = cartItems.map((i) => i.productVariantId);
    const variants = await db.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: {
        product: { select: { name: true, isActive: true } },
        inventory: true,
      },
    });

    if (variants.length !== variantIds.length) {
      return NextResponse.json(
        { error: "Some products are no longer available" },
        { status: 400 }
      );
    }

    for (const variant of variants) {
      if (!variant.product.isActive) {
        return NextResponse.json(
          { error: `Product "${variant.product.name}" is no longer available` },
          { status: 400 }
        );
      }
    }

    // Check inventory
    for (const item of cartItems) {
      const variant = variants.find((v) => v.id === item.productVariantId);
      if (!variant) {
        return NextResponse.json(
          { error: `Product not found` },
          { status: 400 }
        );
      }

      const totalInventory = variant.inventory.reduce(
        (sum, inv) => sum + inv.quantity,
        0
      );

      if (item.quantity > totalInventory) {
        return NextResponse.json(
          {
            error: `Insufficient stock for "${variant.product.name}" (${variant.flavor})`,
          },
          { status: 400 }
        );
      }
    }

    // Calculate pricing
    const subtotal = cartItems.reduce((sum, item) => {
      const variant = variants.find((v) => v.id === item.productVariantId)!;
      return sum + variant.price * item.quantity;
    }, 0);

    const shippingCost =
      subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
    const tax = 0; // No tax for now
    const total = subtotal + shippingCost + tax;

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Determine userId (if logged in)
    let userId: string | null = null;
    // For now, we don't have session access here directly - client will pass userId if logged in
    // In a real implementation, you'd get this from the session

    // Create address for guest checkout
    let finalShippingAddressId = shippingAddressId;

    if (!shippingAddressId && guestAddress) {
      // Create a temporary address record for guest
      // Note: In production, you'd want to link this properly or use a different approach
      // For now, we'll skip address creation and just use the data
    }

    // Create the order
    const order = await db.order.create({
      data: {
        orderNumber,
        userId,
        status: "PENDING",
        shippingAddressId: finalShippingAddressId,
        subtotal,
        shippingCost,
        tax,
        discount: 0,
        total,
        paymentMethod: paymentMethod as "RAZORPAY" | "COD",
        items: {
          create: cartItems.map((item) => {
            const variant = variants.find((v) => v.id === item.productVariantId)!;
            return {
              productVariantId: item.productVariantId,
              quantity: item.quantity,
              unitPrice: variant.price,
            };
          }),
        },
      },
    });

    // If Razorpay, create Razorpay order
    let razorpayOrderId: string | null = null;

    if (paymentMethod === "RAZORPAY") {
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!,
      });

      const razorpayOrder = await razorpay.orders.create({
        amount: total,
        currency: "INR",
        receipt: order.id,
        notes: {
          orderNumber,
        },
      });

      razorpayOrderId = razorpayOrder.id;

      // Update order with razorpayOrderId
      await db.order.update({
        where: { id: order.id },
        data: { razorpayOrderId },
      });
    }

    return NextResponse.json({
      orderId: order.id,
      orderNumber,
      razorpayOrderId,
      total,
      subtotal,
      shippingCost,
      tax,
      paymentMethod,
    });
  } catch (error) {
    console.error("[create-order]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
