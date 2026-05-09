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
        <h1 className="text-2xl font-bold text-[#1a1a1a]" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)" }}>Dashboard</h1>
        <p className="text-sm text-[#7B9E6B]" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>
          Welcome back, {session.user.name || "Admin"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Orders */}
        <div className="bg-white border border-[rgba(46,125,50,0.15)] rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#7B9E6B]" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>Today&apos;s Orders</p>
              <p className="text-2xl font-bold text-[#1a1a1a] mt-1" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)" }}>
                {todayOrdersCount}
              </p>
              <p className="text-sm text-[#2E7D32] font-medium mt-1" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>
                {formatCurrency(todayOrdersRevenue._sum.total || 0)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#2E7D32]/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#2E7D32]" />
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white border border-[rgba(46,125,50,0.15)] rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#7B9E6B]" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>Total Orders</p>
              <p className="text-2xl font-bold text-[#1a1a1a] mt-1" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)" }}>
                {totalOrdersCount}
              </p>
              <p className="text-sm text-[#7B9E6B] mt-1" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>
                {formatCurrency(totalOrdersRevenue._sum.total || 0)} revenue
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#2E7D32]/10 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-[#2E7D32]" />
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white border border-[rgba(46,125,50,0.15)] rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#7B9E6B]" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>Pending Orders</p>
              <p className="text-2xl font-bold text-[#1a1a1a] mt-1" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)" }}>
                {pendingOrdersCount}
              </p>
              <p className="text-sm text-[#7B9E6B] mt-1" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>Requires attention</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#7B9E6B]/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-[#7B9E6B]" />
            </div>
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white border border-[rgba(46,125,50,0.15)] rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#7B9E6B]" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>Low Stock Products</p>
              <p className="text-2xl font-bold text-[#1a1a1a] mt-1" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)" }}>
                {lowStockProducts._count}
              </p>
              <p className="text-sm text-[#EF4444] mt-1" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>Below threshold</p>
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
        <div className="lg:col-span-2 bg-white border border-[rgba(46,125,50,0.15)] rounded-xl">
          <div className="p-5 border-b border-[rgba(46,125,50,0.15)] flex items-center justify-between">
            <h2 className="font-semibold text-[#1a1a1a]" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)" }}>Recent Orders</h2>
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm" className="text-[#2E7D32]">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(46,125,50,0.15)]">
                  <th className="px-5 py-3 text-left text-xs font-medium text-[#7B9E6B] uppercase tracking-wider" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>
                    Order
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-[#7B9E6B] uppercase tracking-wider" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>
                    Customer
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-[#7B9E6B] uppercase tracking-wider" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>
                    Total
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-[#7B9E6B] uppercase tracking-wider" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>
                    Status
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-[#7B9E6B] uppercase tracking-wider" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(46,125,50,0.15)]">
                {recentOrders.map((order: typeof recentOrders[number]) => (
                  <tr key={order.id} className="hover:bg-[#FAFAF8]">
                    <td className="px-5 py-3 text-sm font-medium text-[#1a1a1a]">
                      #{order.orderNumber}
                    </td>
                    <td className="px-5 py-3 text-sm text-[#7B9E6B]">
                      {order.user?.name || order.user?.email || "Guest"}
                    </td>
                    <td className="px-5 py-3 text-sm font-medium text-[#1a1a1a]">
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
                    <td className="px-5 py-3 text-sm text-[#7B9E6B]">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-sm text-[#7B9E6B]">
                      No orders yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white border border-[rgba(46,125,50,0.15)] rounded-xl p-5">
          <h2 className="font-semibold text-[#1a1a1a] mb-4" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)" }}>Quick Links</h2>
          <div className="space-y-3">
            <Link href="/admin/orders" className="block">
              <div className="flex items-center justify-between p-3 rounded-lg border border-[rgba(46,125,50,0.15)] hover:border-[#2E7D32] hover:bg-[#2E7D32]/5 transition-colors">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5 text-[#2E7D32]" />
                  <span className="text-sm font-medium text-[#1a1a1a]">
                    Manage Orders
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#7B9E6B]" />
              </div>
            </Link>
            <Link href="/admin/products" className="block">
              <div className="flex items-center justify-between p-3 rounded-lg border border-[rgba(46,125,50,0.15)] hover:border-[#2E7D32] hover:bg-[#2E7D32]/5 transition-colors">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-[#2E7D32]" />
                  <span className="text-sm font-medium text-[#1a1a1a]">
                    Manage Products
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#7B9E6B]" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
