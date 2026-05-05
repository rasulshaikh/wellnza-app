import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";

// WhatsApp message template
function buildWhatsAppMessage(name: string, items: any[], total: number, recoveryLink: string, couponCode: string): string {
  const itemList = items.slice(0, 3).map((i: any) => `${i.name} (${i.flavor}) x${i.quantity}`).join(", ");
  const couponMsg = couponCode ? `\n\nUse code ${couponCode} for an extra discount!` : "";
  return `Hi ${name || "there"}! You left something behind 🛒\n\nYour cart: ${itemList}${items.length > 3 ? ` +${items.length - 3} more` : ""}\nTotal: ${formatCurrency(total)}\n\nComplete your order: ${recoveryLink}${couponMsg}\n\n- Well NZ Nutrition`;
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  if (secret !== process.env.CART_ABANDONMENT_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find records where reminder hasn't been sent and lastActiveAt > 2 hours ago
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
  const pending = await db.cartAbandonment.findMany({
    where: {
      reminderSent: false,
      lastActiveAt: { lt: twoHoursAgo },
      OR: [{ phone: { not: null } }, { email: { not: null } }],
    },
    take: 20,
  });

  const results = [];
  for (const record of pending) {
    const { cartData, phone, email, recoveryLink, guestName } = record;
    if (!cartData || !recoveryLink) continue;
    const { items, couponCode, total } = cartData as { items: any[], couponCode?: string, total?: number };

    try {
      // Send WhatsApp via Twilio
      if (phone) {
        const msg = buildWhatsAppMessage(guestName || "Hi", items, total || 0, recoveryLink, couponCode || "XEME15");
        await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, {
          method: "POST",
          headers: {
            "Authorization": `Basic ${Buffer.from(process.env.TWILIO_ACCOUNT_SID + ":" + process.env.TWILIO_AUTH_TOKEN).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            To: `whatsapp:+91${phone}`,
            From: `whatsapp:+${process.env.TWILIO_WHATSAPP_FROM}`,
            Body: msg,
          }),
        });
      }

      // Send email
      if (email) {
        const { sendEmail } = await import("@/lib/email");
        const { CartAbandonmentEmail } = await import("@/lib/email-templates/cart-abandonment");
        await sendEmail({
          to: email,
          subject: "You left something behind 🛒 — Well NZ Nutrition",
          react: CartAbandonmentEmail({
            name: guestName || "Hi there",
            items: items.map((i: any) => ({ name: i.name, flavor: i.flavor, quantity: i.quantity, price: i.price })),
            total: total || 0,
            recoveryLink,
            couponCode: couponCode || "XEME15",
          }),
        });
      }

      await db.cartAbandonment.update({
        where: { id: record.id },
        data: { reminderSent: true },
      });
      results.push({ id: record.id, sent: true });
    } catch (err) {
      console.error("[cart-abandonment-notify]", err);
      results.push({ id: record.id, sent: false, error: String(err) });
    }
  }

  return NextResponse.json({ processed: results.length, results });
}
