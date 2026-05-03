import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const INTERNAL_SECRET = process.env.INTERNAL_DEBUG_SECRET;

export async function GET(req: NextRequest) {
  // Require either internal secret header or valid session
  const secretHeader = req.headers.get("x-debug-secret");
  const session = await auth();

  if (!INTERNAL_SECRET && !session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (INTERNAL_SECRET && secretHeader !== INTERNAL_SECRET && !session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "NOT SET",
    AUTH_URL: process.env.AUTH_URL || "NOT SET",
    AUTH_SECRET: process.env.AUTH_SECRET ? "SET" : "NOT SET",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "SET" : "NOT SET",
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL ? "YES" : "NO",
    VERCEL_URL: process.env.VERCEL_URL || "NOT SET",
    NOW_REGION: process.env.NOW_REGION || "NOT SET",
  });
}