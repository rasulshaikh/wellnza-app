import { NextResponse } from "next/server";
import { checkRateLimit, getClientIP, rateLimitResponse } from "../ratelimit";

export async function POST(request: Request) {
  // Rate limit: 5 subscriptions per minute per IP
  const ip = getClientIP(request);
  if (!checkRateLimit(ip, 5, 60 * 1000)) {
    return rateLimitResponse();
  }

  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Log for now — connect to email provider later
    console.log("[newsletter] new subscriber:", email);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
