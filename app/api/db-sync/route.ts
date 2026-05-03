import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const SYNC_SECRET = process.env.DB_SYNC_SECRET || "wellnza-db-sync-2026";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  if (secret !== SYNC_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Test reading various models to identify schema drift
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

    // Check User table columns
    try {
      const users = await db.user.findMany({ take: 1, select: { id: true, email: true, emailSent: true } });
      results.userHasEmailSent = "true";
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
