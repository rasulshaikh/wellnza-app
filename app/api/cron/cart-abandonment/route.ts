// Vercel Cron - runs daily via vercel.json cron config
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Verify internal API key (skip for local dev)
  if (
    process.env.NODE_ENV === "production" &&
    process.env.INTERNAL_API_KEY &&
    req.headers.get("x-internal-key") !== process.env.INTERNAL_API_KEY
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { db } = await import("@/lib/db");
    const ONE_HOUR_AGO = new Date(Date.now() - 60 * 60 * 1000);
    const TWENTY_FOUR_HOURS_AGO = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // 1hr abandoned carts not yet emailed
    const oneHourCarts = await db.cartAbandonment.findMany({
      where: {
        lastActiveAt: { lt: ONE_HOUR_AGO },
        reminderSent: false,
        orderId: null,
        email: { not: null },
      },
    });

    // 24hr abandoned carts not yet emailed (already got 1hr email)
    const twentyFourHourCarts = await db.cartAbandonment.findMany({
      where: {
        lastActiveAt: { lt: TWENTY_FOUR_HOURS_AGO },
        orderId: null,
        email: { not: null },
      },
    });

    const { sendEmail } = await import("@/lib/email");

    // 1hr emails
    for (const cart of oneHourCarts) {
      try {
        const { CartAbandoned1hrEmail } = await import(
          "@/lib/email-templates/cart-abandoned-1hr"
        );
        const cartData = cart.cartData as { items?: Array<{ name: string; quantity: number; price: number; image?: string }> } | null;
        const items = cartData?.items ?? [];
        if (cart.email) {
          await sendEmail({
            to: cart.email,
            subject: "You left something behind 🏋️ — Well NZ Nutrition",
            react: CartAbandoned1hrEmail({ items, name: cart.guestName || "there" }),
          });
        }
        await db.cartAbandonment.update({
          where: { id: cart.id },
          data: { reminderSent: true },
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
        const cartData = cart.cartData as { items?: Array<{ name: string; quantity: number; price: number; image?: string }> } | null;
        const items = cartData?.items ?? [];
        if (cart.email) {
          await sendEmail({
            to: cart.email,
            subject: "Still thinking? 🏋️ — Here's 10% off your order",
            react: CartAbandoned24hrEmail({
              items,
              name: cart.guestName || "there",
              discountCode: "COMEBACK10",
            }),
          });
        }
        await db.cartAbandonment.update({
          where: { id: cart.id },
          data: { reminderSent: true },
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
