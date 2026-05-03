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

  const user = await db.user.findUnique({
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

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1C1C1C]">
            My Account
          </h1>
          <p className="text-[#6B6B6B] mt-1">
            {user.name || user.email}
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Link href="/account/orders" className="block">
            <div className="bg-white border border-[#E5E5E0] p-4 hover:border-[#CCCCCC] transition-colors">
              <Package className="w-6 h-6 text-[#0055FF] mb-3" />
              <p className="font-medium text-[#1C1C1C]">My Orders</p>
              <p className="text-xs text-[#6B6B6B] mt-1">Track & view orders</p>
            </div>
          </Link>
          <Link href="/account/addresses" className="block">
            <div className="bg-white border border-[#E5E5E0] p-4 hover:border-[#CCCCCC] transition-colors">
              <MapPin className="w-6 h-6 text-[#0055FF] mb-3" />
              <p className="font-medium text-[#1C1C1C]">Addresses</p>
              <p className="text-xs text-[#6B6B6B] mt-1">Manage shipping</p>
            </div>
          </Link>
          <Link href="/account/subscription" className="block">
            <div className="bg-white border border-[#E5E5E0] p-4 hover:border-[#CCCCCC] transition-colors">
              <CreditCard className="w-6 h-6 text-[#0055FF] mb-3" />
              <p className="font-medium text-[#1C1C1C]">Subscription</p>
              <p className="text-xs text-[#6B6B6B] mt-1">Manage recurring</p>
            </div>
          </Link>
          <Link href="/account/settings" className="block">
            <div className="bg-white border border-[#E5E5E0] p-4 hover:border-[#CCCCCC] transition-colors">
              <Settings className="w-6 h-6 text-[#6B6B6B] mb-3" />
              <p className="font-medium text-[#1C1C1C]">Settings</p>
              <p className="text-xs text-[#6B6B6B] mt-1">Account details</p>
            </div>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white border border-[#E5E5E0]">
          <div className="flex items-center justify-between p-4 border-b border-[#E5E5E0]">
            <h2 className="font-semibold text-[#1C1C1C]">Recent Orders</h2>
            <Link
              href="/account/orders"
              className="text-sm text-[#0055FF] hover:underline flex items-center gap-1"
            >
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {user.orders.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="w-10 h-10 text-[#CCCCCC] mx-auto mb-3" />
              <p className="text-[#6B6B6B] mb-4">No orders yet</p>
              <Link href="/products">
                <Button className="bg-[#1C1C1C] hover:bg-[#2D2D2D] text-white h-10">
                  Start Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#E5E5E0]">
              {user.orders.map((order: typeof user.orders[number]) => (
                <div
                  key={order.id}
                  className="p-4 flex items-center justify-between hover:bg-[#FAFAF7] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-medium text-[#1C1C1C]">
                        #{order.orderNumber}
                      </span>
                      <Badge
                        className={ORDER_STATUS_COLORS[order.status] || "bg-gray-100 text-gray-800"}
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-[#6B6B6B]">
                      {formatDate(order.createdAt)} · {order.items.length} item{order.items.length !== 1 ? "s" : ""} ·{" "}
                      {formatCurrency(order.total)}
                    </p>
                  </div>
                  <Link href={`/account/orders/${order.id}`}>
                    <Button variant="outline" size="sm" className="h-8 border-[#E5E5E0]">
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
