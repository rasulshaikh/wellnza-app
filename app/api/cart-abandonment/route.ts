import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const cartAbandonmentSchema = z.object({
  cartItems: z.array(z.object({
    productVariantId: z.string(),
    quantity: z.number(),
    name: z.string(),
    price: z.number(),
    flavor: z.string(),
  })),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  guestName: z.string().optional(),
  shippingCost: z.number().optional(),
  total: z.number(),
  couponCode: z.string().optional(),
  discount: z.number().optional(),
  step: z.enum(["address", "shipping", "payment"]),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = cartAbandonmentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  const { cartItems, email, phone, guestName, shippingCost, total, couponCode, discount, step } = parsed.data;

  // Store/update cart abandonment record
  const identifier = phone || email || "unknown";
  const existing = await db.cartAbandonment.findFirst({
    where: phone ? { phone } : email ? { email } : undefined,
  });

  const recoveryLink = `https://wellnza.com/checkout?recovery=${Date.now().toString(36)}`;

  const data = {
    userId: null,
    email: email || null,
    phone: phone || null,
    guestName: guestName || null,
    cartData: { items: cartItems, couponCode, discount, shippingCost },
    lastActiveAt: new Date(),
    recoveryLink,
    updatedAt: new Date(),
  };

  if (existing) {
    await db.cartAbandonment.update({ where: { id: existing.id }, data });
  } else {
    await db.cartAbandonment.create({
      data: { id: `ca_${Date.now().toString(36)}`, ...data },
    });
  }

  return NextResponse.json({ stored: true, recoveryLink });
}
