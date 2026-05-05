import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkRateLimit, getClientIP, rateLimitResponse } from "../../ratelimit";

interface CartItem {
  name: string;
  flavor?: string;
  price: number;
  quantity: number;
  image?: string;
}

function validateCartItems(cartItems: unknown): cartItems is CartItem[] {
  if (!Array.isArray(cartItems)) {
    return false;
  }
  return cartItems.every((item) => {
    return (
      typeof item === "object" &&
      item !== null &&
      typeof item.name === "string" &&
      typeof item.price === "number" &&
      typeof item.quantity === "number"
    );
  });
}

export async function POST(req: NextRequest) {
  // Rate limit: 10 cart tracks per minute per IP
  const ip = getClientIP(req);
  if (!checkRateLimit(ip, 10, 60 * 1000)) {
    return rateLimitResponse();
  }

  const body = await req.json();
  const { email, name, cartItems, phone } = body;

  if (!email && !phone) {
    return NextResponse.json({ error: "Email or phone required" }, { status: 400 });
  }

  if (!validateCartItems(cartItems)) {
    return NextResponse.json({ error: "Invalid cart items" }, { status: 400 });
  }

  // Find existing record by email or phone
  const existing = await db.cartAbandonment.findFirst({
    where: email ? { email } : { phone },
  });

  const recoveryLink = `https://wellnza.com/checkout?recovery=${Date.now().toString(36)}`;

  if (existing) {
    await db.cartAbandonment.update({
      where: { id: existing.id },
      data: {
        cartData: JSON.parse(JSON.stringify({ items: cartItems })),
        lastActiveAt: new Date(),
        updatedAt: new Date(),
        reminderSent: false,
        recoveryLink,
        guestName: name || null,
      },
    });
  } else {
    await db.cartAbandonment.create({
      data: {
        email: email || null,
        phone: phone || null,
        guestName: name || null,
        cartData: JSON.parse(JSON.stringify({ items: cartItems })),
        lastActiveAt: new Date(),
        recoveryLink,
      },
    });
  }

  return NextResponse.json({ email, recoveryLink });
}