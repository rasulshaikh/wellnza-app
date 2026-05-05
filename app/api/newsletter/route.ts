import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from: "Wellnza Nutrition <hello@wellnzanutrition.com>",
      to: email,
      subject: "You're on the list! 💪",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #166534; font-size: 24px;">You're in!</h1>
          <p style="color: #333; font-size: 16px; line-height: 1.5;">
            Thanks for subscribing to Wellnza Nutrition updates. We'll keep you posted on new products, exclusive offers, and health tips.
          </p>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            — The Wellnza Team
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("[newsletter] Resend error:", error);
      return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}