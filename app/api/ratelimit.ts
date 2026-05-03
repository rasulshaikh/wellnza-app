import { NextResponse } from "next/server";

const rateLimit = new Map<string, { count: number; reset: number }>();

export function checkRateLimit(ip: string, limit = 10, window = 60000): boolean {
  const now = Date.now();
  const record = rateLimit.get(ip);
  if (!record || now > record.reset) {
    rateLimit.set(ip, { count: 1, reset: now + window });
    return true;
  }
  if (record.count >= limit) return false;
  record.count++;
  return true;
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "unknown";
}

export function rateLimitResponse(): NextResponse {
  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    { status: 429 }
  );
}
