import { NextRequest } from "next/server";
import { handlers } from "@/lib/auth";
import { checkRateLimit, getClientIP, rateLimitResponse } from "@/app/api/ratelimit";

// Wrap GET handler with rate limiting to prevent brute force on auth callbacks
async function wrappedGET(req: NextRequest) {
  const clientIP = getClientIP(req as unknown as Request);
  if (!checkRateLimit(clientIP, 5, 60000)) {
    return rateLimitResponse();
  }
  return handlers.GET(req);
}

// Wrap POST handler with rate limiting to prevent brute force on sign in
async function wrappedPOST(req: NextRequest) {
  const clientIP = getClientIP(req as unknown as Request);
  if (!checkRateLimit(clientIP, 5, 60000)) {
    return rateLimitResponse();
  }
  return handlers.POST(req);
}

export const GET = wrappedGET;
export const POST = wrappedPOST;