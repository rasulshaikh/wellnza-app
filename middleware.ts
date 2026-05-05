export { auth as middleware } from "./lib/auth"

export const config = {
  matcher: ["/checkout", "/order-confirmation/:path*", "/admin/:path*", "/account/:path*"]
}
