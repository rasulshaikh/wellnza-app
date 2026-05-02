import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ORDER_STATUS_COLORS } from "@/lib/status-colors";
import Link from "next/link";
import {
  ShoppingCart,
  Clock,
  Package,
  TrendingUp,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Get stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalOrdersCount,
    totalOrdersRevenue,
    todayOrdersCount,
    todayOrdersRevenue,
    pendingOrdersCount,
    lowStockProducts,
  ] = await Promise.all([
    db.order.count(),
    db.order.aggregate({ _sum: { total: true } }),
    db.order.count({ where: { createdAt: { gte: today } } }),
    db.order.aggregate({
      _sum: { total: true },
      where: { createdAt: { gte: today } },
    }),
    db.order.count({ where: { status: "PENDING" } }),
    // Count products with inventory below threshold (using raw query approach via aggregation)
    db.inventory.aggregate({
      where: {
        quantity: { lt: 10 }, // Default low stock threshold
      },
      _count: true,
    }),
  ]);

  // Get recent orders
  const recentOrders = await db.order.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      items: true,
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0A0A0A]">Dashboard</h1>
        <p className="text-sm text-[#6B7280]">
          Welcome back, {session.user.name || "Admin"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Orders */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280]">Today&apos;s Orders</p>
              <p className="text-2xl font-bold text-[#0A0A0A] mt-1">
                {todayOrdersCount}
              </p>
              <p className="text-sm text-[#10B981] font-medium mt-1">
                {formatCurrency(todayOrdersRevenue._sum.total || 0)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#0055FF]/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#0055FF]" />
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280]">Total Orders</p>
              <p className="text-2xl font-bold text-[#0A0A0A] mt-1">
                {totalOrdersCount}
              </p>
              <p className="text-sm text-[#6B7280] mt-1">
                {formatCurrency(totalOrdersRevenue._sum.total || 0)} revenue
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#00C2FF]/10 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-[#00C2FF]" />
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280]">Pending Orders</p>
              <p className="text-2xl font-bold text-[#0A0A0A] mt-1">
                {pendingOrdersCount}
              </p>
              <p className="text-sm text-[#F59E0B] mt-1">Requires attention</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
            </div>
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280]">Low Stock Products</p>
              <p className="text-2xl font-bold text-[#0A0A0A] mt-1">
                {lowStockProducts._count}
              </p>
              <p className="text-sm text-[#EF4444] mt-1">Below threshold</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#EF4444]/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-[#EF4444]" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-xl">
          <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
            <h2 className="font-semibold text-[#0A0A0A]">Recent Orders</h2>
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm" className="text-[#0055FF]">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E7EB]">
                  <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {recentOrders.map((order: typeof recentOrders[number]) => (
                  <tr key={order.id} className="hover:bg-[#FAFAFA]">
                    <td className="px-5 py-3 text-sm font-medium text-[#0A0A0A]">
                      #{order.orderNumber}
                    </td>
                    <td className="px-5 py-3 text-sm text-[#6B7280]">
                      {order.user?.name || order.user?.email || "Guest"}
                    </td>
                    <td className="px-5 py-3 text-sm font-medium text-[#0A0A0A]">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-5 py-3">
                      <Badge
                        className={
                          ORDER_STATUS_COLORS[order.status] || "bg-gray-100 text-gray-800"
                        }
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-sm text-[#6B7280]">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-sm text-[#6B7280]">
                      No orders yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <h2 className="font-semibold text-[#0A0A0A] mb-4">Quick Links</h2>
          <div className="space-y-3">
            <Link href="/admin/orders" className="block">
              <div className="flex items-center justify-between p-3 rounded-lg border border-[#E5E7EB] hover:border-[#0055FF] hover:bg-[#0055FF]/5 transition-colors">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5 text-[#0055FF]" />
                  <span className="text-sm font-medium text-[#0A0A0A]">
                    Manage Orders
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#6B7280]" />
              </div>
            </Link>
            <Link href="/admin/products" className="block">
              <div className="flex items-center justify-between p-3 rounded-lg border border-[#E5E7EB] hover:border-[#0055FF] hover:bg-[#0055FF]/5 transition-colors">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-[#0055FF]" />
                  <span className="text-sm font-medium text-[#0A0A0A]">
                    Manage Products
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#6B7280]" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
