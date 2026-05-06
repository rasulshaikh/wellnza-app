import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal whether email exists
      return NextResponse.json({ success: true });
    }

    // Generate reset token (expires in 1 hour)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    // Hash token before storing - never store plaintext tokens
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    await db.user.update({
      where: { id: user.id },
      data: {
        resetToken: hashedToken,
        resetTokenExpiry,
      },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL || "https://wellnzanutrition.com"}/reset-password?token=${resetToken}`;

    const { error } = await sendEmail({
      to: email,
      subject: "Reset your Wellnza Nutrition password",
      react: (
        <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto", padding: "40px 20px" }}>
          <h1 style={{ color: "#2E7D32", fontSize: "24px" }}>Reset Your Password</h1>
          <p style={{ color: "#333", fontSize: "16px", lineHeight: "1.5" }}>
            Hi {user.name || "there"},
          </p>
          <p style={{ color: "#333", fontSize: "16px", lineHeight: "1.5" }}>
            You requested a password reset. Click the button below to set a new password. This link expires in 1 hour.
          </p>
          <div style={{ textAlign: "center", margin: "30px 0" }}>
            <a href={resetUrl} style={{ backgroundColor: "#2E7D32", color: "white", padding: "14px 28px", textDecoration: "none", borderRadius: "8px", fontWeight: "600", display: "inline-block" }}>
              Reset Password
            </a>
          </div>
          <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.5" }}>
            If you didn't request this, you can safely ignore this email. Your password won't change until you create a new one.
          </p>
        </div>
      ),
    });

    if (error) {
      console.error("[forgot-password] sendEmail error:", error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[forgot-password]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}