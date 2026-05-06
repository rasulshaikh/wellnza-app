import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Package,
  MapPin,
  CreditCard,
  Settings,
  ChevronRight,
} from "lucide-react";
import { ORDER_STATUS_COLORS } from "@/lib/status-colors";

export default async function AccountDashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    const callbackUrl = "/account";
    // Validate callbackUrl is safe (no external redirect)
    if (callbackUrl.startsWith("/") && !callbackUrl.includes("://")) {
      redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    } else {
      redirect("/login");
    }
  }

  let user = null;
  try {
    user = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
          take: 3,
          include: {
            items: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("[account] Failed to load user:", error);
  }

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-2xl font-bold text-[#1a1a1a]"
            style={{ fontFamily: "Playfair Display, serif", letterSpacing: "1px" }}
          >
            MY ACCOUNT
          </h1>
          <p
            className="text-[#7B9E6B] mt-1"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            {user.name || user.email}
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Link href="/account/orders" className="block">
            <div
              className="bg-white border border-[rgba(46,125,50,0.15)] p-4 hover:border-[#2E7D32] transition-colors"
              style={{ boxShadow: "0 2px 8px rgba(46, 125, 50, 0.06)" }}
            >
              <Package className="w-6 h-6 text-[#2E7D32] mb-3" />
              <p className="font-medium text-[#1a1a1a]" style={{ fontFamily: "DM Sans, sans-serif" }}>
                My Orders
              </p>
              <p className="text-xs text-[#7B9E6B] mt-1" style={{ fontFamily: "DM Sans, sans-serif" }}>
                Track & view orders
              </p>
            </div>
          </Link>
          <Link href="/account/addresses" className="block">
            <div
              className="bg-white border border-[rgba(46,125,50,0.15)] p-4 hover:border-[#2E7D32] transition-colors"
              style={{ boxShadow: "0 2px 8px rgba(46, 125, 50, 0.06)" }}
            >
              <MapPin className="w-6 h-6 text-[#2E7D32] mb-3" />
              <p className="font-medium text-[#1a1a1a]" style={{ fontFamily: "DM Sans, sans-serif" }}>
                Addresses
              </p>
              <p className="text-xs text-[#7B9E6B] mt-1" style={{ fontFamily: "DM Sans, sans-serif" }}>
                Manage shipping
              </p>
            </div>
          </Link>
          <Link href="/account/subscription" className="block">
            <div
              className="bg-white border border-[rgba(46,125,50,0.15)] p-4 hover:border-[#2E7D32] transition-colors"
              style={{ boxShadow: "0 2px 8px rgba(46, 125, 50, 0.06)" }}
            >
              <CreditCard className="w-6 h-6 text-[#2E7D32] mb-3" />
              <p className="font-medium text-[#1a1a1a]" style={{ fontFamily: "DM Sans, sans-serif" }}>
                Subscription
              </p>
              <p className="text-xs text-[#7B9E6B] mt-1" style={{ fontFamily: "DM Sans, sans-serif" }}>
                Manage recurring
              </p>
            </div>
          </Link>
          <Link href="/account/settings" className="block">
            <div
              className="bg-white border border-[rgba(46,125,50,0.15)] p-4 hover:border-[#2E7D32] transition-colors"
              style={{ boxShadow: "0 2px 8px rgba(46, 125, 50, 0.06)" }}
            >
              <Settings className="w-6 h-6 text-[#7B9E6B] mb-3" />
              <p className="font-medium text-[#1a1a1a]" style={{ fontFamily: "DM Sans, sans-serif" }}>
                Settings
              </p>
              <p className="text-xs text-[#7B9E6B] mt-1" style={{ fontFamily: "DM Sans, sans-serif" }}>
                Account details
              </p>
            </div>
          </Link>
        </div>

        {/* Recent Orders */}
        <div
          className="bg-white border border-[rgba(46,125,50,0.15)]"
          style={{ boxShadow: "0 2px 8px rgba(46, 125, 50, 0.06)" }}
        >
          <div
            className="flex items-center justify-between p-4 border-b border-[rgba(46,125,50,0.15)]"
          >
            <h2
              className="font-semibold text-[#1a1a1a]"
              style={{ fontFamily: "Playfair Display, serif", letterSpacing: "1px" }}
            >
              RECENT ORDERS
            </h2>
            <Link
              href="/account/orders"
              className="text-sm text-[#2E7D32] hover:underline flex items-center gap-1"
            >
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {user.orders.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="w-10 h-10 text-[#7B9E6B] mx-auto mb-3" />
              <p className="text-[#7B9E6B] mb-4" style={{ fontFamily: "DM Sans, sans-serif" }}>
                No orders yet
              </p>
              <Link href="/products">
                <Button
                  className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white h-10"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  START SHOPPING
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[rgba(46,125,50,0.15)]">
              {user.orders.map((order: typeof user.orders[number]) => (
                <div
                  key={order.id}
                  className="p-4 flex items-center justify-between hover:bg-[#FAFAF8] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span
                        className="font-medium text-[#1a1a1a]"
                        style={{ fontFamily: "DM Sans, sans-serif" }}
                      >
                        #{order.orderNumber}
                      </span>
                      <Badge
                        className={ORDER_STATUS_COLORS[order.status] || "bg-[#2E7D32] text-white"}
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p
                      className="text-sm text-[#7B9E6B]"
                      style={{ fontFamily: "DM Sans, sans-serif" }}
                    >
                      {formatDate(order.createdAt)} · {order.items.length} item{order.items.length !== 1 ? "s" : ""} ·{" "}
                      {formatCurrency(order.total)}
                    </p>
                  </div>
                  <Link href={`/account/orders/${order.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 border-[rgba(46,125,50,0.15)] text-[#7B9E6B] hover:border-[#2E7D32]"
                      style={{ fontFamily: "DM Sans, sans-serif" }}
                    >
                      View
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
