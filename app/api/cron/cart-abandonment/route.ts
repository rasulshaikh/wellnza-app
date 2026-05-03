// Vercel Cron — runs every hour via vercel.json cron config
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { db } = await import("@/lib/db");
    const ONE_HOUR_AGO = new Date(Date.now() - 60 * 60 * 1000);
    const TWENTY_FOUR_HOURS_AGO = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // 1hr abandoned carts not yet emailed
    const oneHourCarts = await db.cartAbandonment.findMany({
      where: {
        updatedAt: { lt: ONE_HOUR_AGO },
        emailSent1hr: false,
        orderId: null,
      },
    });

    // 24hr abandoned carts not yet emailed (already got 1hr email)
    const twentyFourHourCarts = await db.cartAbandonment.findMany({
      where: {
        updatedAt: { lt: TWENTY_FOUR_HOURS_AGO },
        emailSent24hr: false,
        emailSent1hr: true,
        orderId: null,
      },
    });

    const { sendEmail } = await import("@/lib/email");

    // 1hr emails
    for (const cart of oneHourCarts) {
      try {
        const { CartAbandoned1hrEmail } = await import(
          "@/lib/email-templates/cart-abandoned-1hr"
        );
        const items = (cart.cartItems as Array<{ name: string; quantity: number; price: number; image?: string }>) ?? [];
        await sendEmail({
          to: cart.email,
          subject: "You left something behind 🏋️ — Wellnza Nutrition",
          react: CartAbandoned1hrEmail({ items, name: cart.name || "there" }),
        });
        await db.cartAbandonment.update({
          where: { id: cart.id },
          data: { emailSent1hr: true },
        });
      } catch (err) {
        console.error("[cart-abandoned-1hr]", cart.email, err);
      }
    }

    // 24hr emails with discount
    for (const cart of twentyFourHourCarts) {
      try {
        const { CartAbandoned24hrEmail } = await import(
          "@/lib/email-templates/cart-abandoned-24hr"
        );
        const items = (cart.cartItems as Array<{ name: string; quantity: number; price: number; image?: string }>) ?? [];
        await sendEmail({
          to: cart.email,
          subject: "Still thinking? 🏋️ — Here's 10% off your order",
          react: CartAbandoned24hrEmail({
            items,
            name: cart.name || "there",
            discountCode: "COMEBACK10",
          }),
        });
        await db.cartAbandonment.update({
          where: { id: cart.id },
          data: { emailSent24hr: true },
        });
      } catch (err) {
        console.error("[cart-abandoned-24hr]", cart.email, err);
      }
    }

    return NextResponse.json({
      sent1hr: oneHourCarts.length,
      sent24hr: twentyFourHourCarts.length,
    });
  } catch (err) {
    console.error("[cart-abandonment-cron]", err);
    return NextResponse.json({ error: "Cron failed" }, { status: 500 });
  }
}
