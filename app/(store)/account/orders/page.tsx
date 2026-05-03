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
    <div className="min-h-screen bg-[#FAFAF7] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/account">
            <Button variant="outline" size="icon" className="h-9 w-9 border-[#E5E5E0]">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#1C1C1C]">My Orders</h1>
            <p className="text-sm text-[#6B6B6B]">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white border border-[#E5E5E0] p-12 text-center">
            <Package className="w-12 h-12 text-[#CCCCCC] mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-[#1C1C1C] mb-2">No orders yet</h2>
            <p className="text-[#6B6B6B] mb-6">When you place an order, it will appear here.</p>
            <Link href="/products">
              <Button className="bg-[#1C1C1C] hover:bg-[#2D2D2D] text-white h-10">
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
                <div className="bg-white border border-[#E5E5E0] hover:border-[#CCCCCC] transition-colors">
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-semibold text-[#1C1C1C]">
                          #{order.orderNumber}
                        </span>
                        <Badge
                          className={
                            ORDER_STATUS_COLORS[order.status] ||
                            "bg-gray-100 text-gray-800"
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-[#6B6B6B]">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#1C1C1C]">
                        {formatCurrency(order.total)}
                      </p>
                      <p className="text-sm text-[#6B6B6B]">
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
