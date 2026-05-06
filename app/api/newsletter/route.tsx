import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const { error } = await sendEmail({
      to: email,
      subject: "You're on the list! 💪",
      react: (
        <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto", padding: "40px 20px" }}>
          <h1 style={{ color: "#2E7D32", fontSize: "24px" }}>You're in!</h1>
          <p style={{ color: "#333", fontSize: "16px", lineHeight: "1.5" }}>
            Thanks for subscribing to Wellnza Nutrition updates. We'll keep you posted on new products, exclusive offers, and health tips.
          </p>
          <p style={{ color: "#666", fontSize: "14px", marginTop: "30px" }}>
            — The Wellnza Team
          </p>
        </div>
      ),
    });

    if (error) {
      console.error("[newsletter] sendEmail error:", error);
      return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}