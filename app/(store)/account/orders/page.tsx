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
    <div className="min-h-screen bg-[#0D0D0D] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/account">
            <Button variant="outline" size="icon" className="h-9 w-9 border-[rgba(22,101,52,0.3)] text-white hover:bg-[#1A1A1A]">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-bebas)" }}>My Orders</h1>
            <p className="text-sm text-[#888888]">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-[#1A1A1A] border border-[rgba(22,101,52,0.3)] p-12 text-center rounded-lg" style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}>
            <Package className="w-12 h-12 text-[#666666] mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-white mb-2">No orders yet</h2>
            <p className="text-[#888888] mb-6">When you place an order, it will appear here.</p>
            <Link href="/products">
              <Button className="bg-[#166534] hover:bg-[#14532D] text-white h-10" style={{ fontFamily: "var(--font-bebas)", clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}>
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
                <div className="bg-[#1A1A1A] border border-[rgba(22,101,52,0.3)] hover:border-[rgba(22,101,52,0.5)] transition-colors rounded-lg" style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-semibold text-white" style={{ fontFamily: "var(--font-bebas)" }}>
                          #{order.orderNumber}
                        </span>
                        <Badge
                          className={
                            ORDER_STATUS_COLORS[order.status] ||
                            "bg-[#1A1A1A] text-[#888888] border border-[rgba(22,101,52,0.3)]"
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-[#888888]">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">
                        {formatCurrency(order.total)}
                      </p>
                      <p className="text-sm text-[#888888]">
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
