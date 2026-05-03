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
  const { email, name, cartItems } = body;

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  if (!validateCartItems(cartItems)) {
    return NextResponse.json({ error: "Invalid cart items" }, { status: 400 });
  }

  // CartAbandonment uses @@index([email]) not @@unique, so use findFirst + upsert pattern
  const existing = await db.cartAbandonment.findFirst({ where: { email } });

  if (existing) {
    await db.cartAbandonment.update({
      where: { id: existing.id },
      data: {
        cartItems: JSON.parse(JSON.stringify(cartItems)),
        updatedAt: new Date(),
        emailSent1hr: false,
        emailSent24hr: false,
      },
    });
  } else {
    await db.cartAbandonment.create({
      data: {
        email,
        name: name || null,
        cartItems: JSON.parse(JSON.stringify(cartItems)),
      },
    });
  }

  return NextResponse.json({ email });
}