import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const SYNC_SECRET = process.env.DB_SYNC_SECRET || "wellnza-db-sync-2026";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  if (secret !== SYNC_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: string[] = [];

  try {
    // Add emailSent to User table if missing
    try {
      await db.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailSent" BOOLEAN DEFAULT false;`;
      results.push("emailSent: OK");
    } catch (e: any) {
      if (String(e).includes("does not exist")) {
        // Try without IF NOT EXISTS for older Postgres
        try {
          await db.$executeRaw`ALTER TABLE "User" ADD COLUMN "emailSent" BOOLEAN DEFAULT false;`;
          results.push("emailSent: added (no IF NOT EXISTS)");
        } catch (e2: any) {
          results.push(`emailSent: ${String(e2).substring(0, 100)}`);
        }
      } else {
        results.push(`emailSent: ${String(e).substring(0, 100)}`);
      }
    }

    // Create CartAbandonment table if missing
    try {
      await db.$executeRaw`
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
        );
      `;
      results.push("CartAbandonment: OK");
    } catch (e: any) {
      if (String(e).includes("already exists")) {
        results.push("CartAbandonment: already exists");
      } else {
        results.push(`CartAbandonment: ${String(e).substring(0, 150)}`);
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json({
      error: "Schema sync failed",
      detail: String(error).substring(0, 500),
    }, { status: 500 });
  }
}

// Also expose GET for diagnostics
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  const fix = searchParams.get("fix") === "true";

  if (secret !== SYNC_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (fix) {
    const results: string[] = [];

    try {
      await db.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailSent" BOOLEAN DEFAULT false;`;
      results.push("emailSent: OK");
    } catch (e: any) {
      const msg = String(e);
      results.push(msg.includes("already exists") || msg.includes("does not exist") ? "emailSent: already exists/skipped" : `emailSent: ${msg.substring(0, 100)}`);
    }

    try {
      await db.$executeRaw`
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
        );
      `;
      results.push("CartAbandonment: OK");
    } catch (e: any) {
      const msg = String(e);
      results.push(msg.includes("already exists") ? "CartAbandonment: already exists" : `CartAbandonment: ${msg.substring(0, 150)}`);
    }

    return NextResponse.json({ fixResults: results });
  }

  const results: Record<string, string> = {};

    // Test User table
    try {
      results.userCount = String(await db.user.count());
    } catch (e) {
      results.userError = String(e).substring(0, 200);
    }

    // Test Product table
    try {
      results.productCount = String(await db.product.count());
    } catch (e) {
      results.productError = String(e).substring(0, 200);
    }

    // Test CartAbandonment
    try {
      results.cartAbandonmentCount = String(await db.cartAbandonment.count());
    } catch (e) {
      results.cartAbandonmentError = String(e).substring(0, 200);
    }

    // Test emailSent column
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