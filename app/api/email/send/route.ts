import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

const templateMap: Record<string, string> = {
  "welcome": "lib/email-templates/welcome",
  "order-confirmed": "lib/email-templates/order-confirmed",
  "order-shipped": "lib/email-templates/order-shipped",
  "order-delivered": "lib/email-templates/order-delivered",
  "order-cancelled": "lib/email-templates/order-cancelled",
  "cart-abandoned-1hr": "lib/email-templates/cart-abandoned-1hr",
  "cart-abandoned-24hr": "lib/email-templates/cart-abandoned-24hr",
};

export async function POST(req: NextRequest) {
  // Verify internal API key (skip for local dev)
  if (
    process.env.NODE_ENV === "production" &&
    process.env.INTERNAL_API_KEY &&
    req.headers.get("x-internal-key") !== process.env.INTERNAL_API_KEY
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { to, subject, template, data } = await req.json();

  if (!to || !subject || !template) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!templateMap[template]) {
    return NextResponse.json({ error: "Unknown template" }, { status: 400 });
  }

  try {
    const mod = await import(`@/${templateMap[template]}`);
    const templateKey = Object.keys(mod).find((k) => k.endsWith("Email"));
    if (!templateKey) {
      return NextResponse.json({ error: "Template not found" }, { status: 500 });
    }
    const TemplateFn = mod[templateKey];

    await sendEmail({ to, subject, react: TemplateFn(data || {}) });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[email/send]", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
