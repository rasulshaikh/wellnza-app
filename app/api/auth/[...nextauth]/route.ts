import { NextRequest } from "next/server";
import { handlers } from "@/lib/auth";
import { checkRateLimit, getClientIP, rateLimitResponse } from "@/app/api/ratelimit";

// GET: session/csrf/providers checks — NextAuth fires 3-4 of these per page load.
// Rate limit is permissive (60/min) so normal browsing never triggers it.
async function wrappedGET(req: NextRequest) {
  const clientIP = getClientIP(req as unknown as Request);
  if (!checkRateLimit(`auth_get:${clientIP}`, 60, 60000)) {
    return rateLimitResponse();
  }
  return handlers.GET(req);
}

// POST: actual sign-in attempts — kept strict (10/min) to prevent brute force.
async function wrappedPOST(req: NextRequest) {
  const clientIP = getClientIP(req as unknown as Request);
  if (!checkRateLimit(`auth_post:${clientIP}`, 10, 60000)) {
    return rateLimitResponse();
  }
  // DEBUG: log environment to diagnose CSRF mismatch
  console.log("[DEBUG auth POST] AUTH_URL:", process.env.AUTH_URL, "NODE_ENV:", process.env.NODE_ENV);
  console.log("[DEBUG auth POST] origin:", req.headers.get("origin"), "host:", req.headers.get("host"));
  return handlers.POST(req);
}

export const GET = wrappedGET;
export const POST = wrappedPOST;