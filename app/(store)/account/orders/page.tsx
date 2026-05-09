import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Package, ArrowLeft } from "lucide-react";
import { ORDER_STATUS_COLORS } from "@/lib/status-colors";

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/account/orders");
  }

  let orders: (import("@prisma/client").Order & { items: import("@prisma/client").OrderItem[] })[] = [];
  try {
    orders = await db.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
      },
    });
  } catch (error) {
    console.error("[orders] Failed to load orders:", error);
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/account">
            <Button variant="outline" size="icon" className="h-9 w-9 border-[rgba(46,125,50,0.15)] text-[#1a1a1a] hover:bg-[#FFFFFF]">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a1a]" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)" }}>My Orders</h1>
            <p className="text-sm text-[#7B9E6B]">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[rgba(46,125,50,0.15)] p-12 text-center rounded-lg shadow-[0_2px_8px_rgba(46,125,50,0.06)]">
            <Package className="w-12 h-12 text-[#7B9E6B] mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-[#1a1a1a] mb-2">No orders yet</h2>
            <p className="text-[#7B9E6B] mb-6">When you place an order, it will appear here.</p>
            <Link href="/products">
              <Button className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white h-10">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: typeof orders[number]) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="block"
              >
                <div className="bg-[#FFFFFF] border border-[rgba(46,125,50,0.15)] hover:border-[rgba(46,125,50,0.3)] transition-colors rounded-lg shadow-[0_2px_8px_rgba(46,125,50,0.06)]">
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-semibold text-[#1a1a1a]" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)" }}>
                          #{order.orderNumber}
                        </span>
                        <Badge
                          className={
                            ORDER_STATUS_COLORS[order.status] ||
                            "bg-[#FFFFFF] text-[#7B9E6B] border border-[rgba(46,125,50,0.15)]"
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-[#7B9E6B]">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#1a1a1a]">
                        {formatCurrency(order.total)}
                      </p>
                      <p className="text-sm text-[#7B9E6B]">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
