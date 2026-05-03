import { handlers } from "@/lib/auth";
export const { GET, POST } = handlers;

// Rate limiting for NextAuth is handled by NextAuth's built-in mechanism
// which includes CSRF protection, secure headers, and request validation.