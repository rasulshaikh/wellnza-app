import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkRateLimit, getClientIP, rateLimitResponse } from "../../ratelimit";

export async function POST(req: NextRequest) {
  // Rate limit: 10 cart tracks per minute per IP
  const ip = getClientIP(req);
  if (!checkRateLimit(ip, 10, 60 * 1000)) {
    return rateLimitResponse();
  }

  const { email, name, cartItems } = await req.json();

  if (!email || !cartItems?.length) {
    return NextResponse.json({ error: "Email and cart items required" }, { status: 400 });
  }

  // CartAbandonment uses @@index([email]) not @@unique, so use findFirst + upsert pattern
  const existing = await db.cartAbandonment.findFirst({ where: { email } });

  if (existing) {
    await db.cartAbandonment.update({
      where: { id: existing.id },
      data: {
        cartItems: cartItems as any,
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
        cartItems: cartItems as any,
      },
    });
  }

  return NextResponse.json({ email });
}