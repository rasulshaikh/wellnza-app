import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/utils";
import { SHIPPING_METHODS, FREE_SHIPPING_THRESHOLD, calculateShipping } from "@/lib/shipping";
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
  shippingMethod: z.enum(["STANDARD", "EXPRESS", "FREE"]).optional().default("STANDARD"),
  // Logged-in user ID (required when session exists)
  userId: z.string().optional(),
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

    // Require at least phone or email for guest checkouts
    if (!parsed.data.guestAddress && !parsed.data.guestPhone && !parsed.data.guestEmail) {
      return NextResponse.json(
        { error: "Phone or email is required for guest checkout" },
        { status: 400 }
      );
    }

    const { cartItems, shippingAddressId, paymentMethod, shippingMethod, userId: userIdFromRequest, guestEmail, guestPhone, guestName, guestAddress } =
      parsed.data;

    // Validate session for logged-in users
    const session = await auth();

    let userId: string | null = null;

    if (session?.user?.id) {
      // User is logged in - require valid userId that matches session
      if (!userIdFromRequest || userIdFromRequest !== session.user.id) {
        return NextResponse.json(
          { error: "Unauthorized - user ID mismatch" },
          { status: 401 }
        );
      }
      userId = session.user.id;
    }
    // If no session, guest checkout is fine (userId stays null)

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

    // Calculate shipping based on method and threshold
    const methodMap: Record<string, string> = {
      STANDARD: "standard",
      EXPRESS: "express",
      FREE: "free",
    };
    const shippingCost = calculateShipping(subtotal, methodMap[shippingMethod] ?? "standard");
    const tax = 0; // No tax for now
    const total = subtotal + shippingCost + tax;

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create address for guest checkout
    let finalShippingAddressId = shippingAddressId;

    if (!shippingAddressId && guestAddress && guestPhone) {
      // Create a guest user if needed, then create address
      const guestEmailAddr = guestEmail || `guest_${guestPhone}@temp.com`;

      // Find existing or create guest user
      let guestUser = await db.user.findFirst({
        where: { email: guestEmailAddr },
      });

      if (!guestUser) {
        guestUser = await db.user.create({
          data: {
            email: guestEmailAddr,
            name: guestName || "Guest",
            phone: guestPhone,
            role: "CUSTOMER",
          },
        });
      }

      // Create address linked to guest user
      const guestAddressRecord = await db.address.create({
        data: {
          userId: guestUser.id,
          name: guestAddress.name,
          phone: guestAddress.phone,
          line1: guestAddress.line1,
          line2: guestAddress.line2 || "",
          city: guestAddress.city,
          state: guestAddress.state,
          pin: guestAddress.pin,
          isDefault: true,
        },
      });

      finalShippingAddressId = guestAddressRecord.id;
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

    // Send order confirmed email after order created
    try {
      const userEmail = guestEmail || (userId ? (await db.user.findUnique({ where: { id: userId }, select: { email: true } }))?.email : null);
      if (userEmail) {
        const { sendEmail } = await import("@/lib/email");
        const { OrderConfirmedEmail } = await import("@/lib/email-templates/order-confirmed");

        // Fetch order with items
        const orderWithItems = await db.order.findUnique({
          where: { id: order.id },
          include: {
            items: { include: { productVariant: { include: { product: { select: { name: true } } } } } },
          },
        });

        if (orderWithItems) {
          const orderItems = orderWithItems.items.map(i => ({
            name: i.productVariant?.product?.name || "Product",
            quantity: i.quantity,
            price: i.unitPrice,
          }));
          const deliveryDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
          await sendEmail({
            to: userEmail,
            subject: `Order #${orderNumber} Confirmed — Wellnza Nutrition`,
            react: OrderConfirmedEmail({
              name: guestName || "Customer",
              orderNumber,
              total,
              items: orderItems,
              estimatedDelivery: deliveryDate,
            }),
          });
        }
      }
    } catch (err) {
      console.error("[order-confirmed-email]", err);
    }

    // If Razorpay, create Razorpay order
    let razorpayOrderId: string | null = null;

    if (paymentMethod === "RAZORPAY") {
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!,
      });

      const razorpayOrder = await razorpay.orders.create({
        amount: total * 100, // Convert rupees to paise
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
