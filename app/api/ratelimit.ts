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
  // Only trust x-forwarded-for when behind a trusted proxy (Vercel/Cloudflare)
  const isVercel = !!process.env.VERCEL;
  const cfVisitor = request.headers.get("cf-visitor");
  const xScheme = request.headers.get("x-scheme");
  const isTrustedProxy = isVercel || cfVisitor || xScheme;

  if (isTrustedProxy) {
    // On Vercel, use x-vercel-forwarded-for which is more reliable
    if (isVercel) {
      const vercelForwarded = request.headers.get("x-vercel-forwarded-for");
      if (vercelForwarded) {
        return vercelForwarded.split(",")[0].trim();
      }
    }
    // Fall back to x-forwarded-for for other trusted proxies (Cloudflare)
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
      return forwarded.split(",")[0].trim();
    }
  }
  return "unknown";
}

export function rateLimitResponse(): NextResponse {
  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    { status: 429 }
  );
}
