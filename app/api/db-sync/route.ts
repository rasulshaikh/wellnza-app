import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const SYNC_SECRET = process.env.DB_SYNC_SECRET || "wellnza-db-sync-2026";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  const fix = searchParams.get("fix") === "true";

  if (secret !== SYNC_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (fix) {
    const results: string[] = [];

    // Add emailSent column using $executeRawUnsafe
    try {
      await db.$executeRawUnsafe('ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailSent" BOOLEAN DEFAULT false');
      results.push("emailSent: OK");
    } catch (e: any) {
      const msg = String(e);
      if (msg.includes("already exists") || msg.includes("does not exist") || msg.includes("column")) {
        results.push("emailSent: exists/skipped");
      } else {
        results.push(`emailSent: ${msg.substring(0, 120)}`);
      }
    }

    // Create CartAbandonment table
    try {
      await db.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "CartAbandonment" (
          "id" TEXT NOT NULL,
          "userId" TEXT,
          "email" TEXT,
          "phone" TEXT,
          "cartData" JSONB,
          "lastActiveAt" TIMESTAMP(3),
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
          "updatedAt" TIMESTAMP(3) NOT NULL,
          "reminderSent" BOOLEAN DEFAULT false,
          "recoveryLink" TEXT,
          PRIMARY KEY ("id")
        )
      `);
      results.push("CartAbandonment: OK");
    } catch (e: any) {
      const msg = String(e);
      if (msg.includes("already exists")) {
        results.push("CartAbandonment: exists");
      } else {
        results.push(`CartAbandonment: ${msg.substring(0, 150)}`);
      }
    }

    return NextResponse.json({ fixResults: results });
  }

  // Diagnostic mode
  try {
    const results: Record<string, string> = {};

    try {
      results.userCount = String(await db.user.count());
    } catch (e) {
      results.userError = String(e).substring(0, 200);
    }

    try {
      results.productCount = String(await db.product.count());
    } catch (e) {
      results.productError = String(e).substring(0, 200);
    }

    try {
      results.cartAbandonmentCount = String(await db.cartAbandonment.count());
    } catch (e) {
      results.cartAbandonmentError = String(e).substring(0, 200);
    }

    try {
      await db.user.findMany({ take: 1, select: { id: true, email: true, emailSent: true } });
      results.userEmailSent = "OK";
    } catch (e) {
      results.userEmailSentError = String(e).substring(0, 200);
    }

    return NextResponse.json({ diagnostic: results });
  } catch (error) {
    return NextResponse.json({
      error: "Diagnostic failed",
      detail: String(error).substring(0, 500)
    }, { status: 500 });
  }
}