import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ORDER_STATUS_COLORS } from "@/lib/status-colors";
import Link from "next/link";
import { Eye, Search, ChevronLeft, ChevronRight } from "lucide-react";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; search?: string; from?: string; to?: string }>;
}) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1"));
  const pageSize = 20;
  const status = params.status || "ALL";
  const search = params.search || "";
  const from = params.from;
  const to = params.to;

  // Build where clause
  const where: Record<string, unknown> = {};

  if (status && status !== "ALL") {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: "insensitive" } },
      { user: { email: { contains: search, mode: "insensitive" } } },
    ];
  }

  if (from || to) {
    where.createdAt = {};
    if (from) (where.createdAt as Record<string, unknown>).gte = new Date(from);
    if (to) (where.createdAt as Record<string, unknown>).lte = new Date(to + "T23:59:59.999Z");
  }

  const [orders, totalCount] = await Promise.all([
    db.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        items: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.order.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)" }}>Orders</h1>
        <p className="text-sm text-[#7B9E6B]" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>
          {totalCount} total order{totalCount !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[rgba(46,125,50,0.15)] rounded-xl p-4">
        <form className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B9E6B]" />
              <Input
                name="search"
                placeholder="Search by order # or email..."
                defaultValue={search}
                className="pl-9"
              />
            </div>
          </div>

          {/* Status Filter */}
          <Select name="status" defaultValue={status}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="SHIPPED">Shipped</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="REFUNDED">Refunded</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Range */}
          <Input
            type="date"
            name="from"
            defaultValue={from}
            placeholder="From"
            className="w-[150px]"
          />
          <Input
            type="date"
            name="to"
            defaultValue={to}
            placeholder="To"
            className="w-[150px]"
          />

          <Button type="submit" size="sm" className="bg-[#2E7D32] hover:bg-[#1B5E20]">
            Filter
          </Button>
        </form>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[rgba(46,125,50,0.15)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(46,125,50,0.15)] bg-[#FAFAF8]">
                <th className="px-5 py-3 text-left text-xs font-medium text-[#7B9E6B] uppercase tracking-wider" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>
                  Order #
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-[#7B9E6B] uppercase tracking-wider" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>
                  Customer
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-[#7B9E6B] uppercase tracking-wider" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>
                  Date
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-[#7B9E6B] uppercase tracking-wider" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>
                  Items
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-[#7B9E6B] uppercase tracking-wider" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>
                  Total
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-[#7B9E6B] uppercase tracking-wider" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>
                  Status
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-[#7B9E6B] uppercase tracking-wider" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(46,125,50,0.15)]">
              {orders.map((order: typeof orders[number]) => (
                <tr key={order.id} className="hover:bg-[#FAFAF8]">
                  <td className="px-5 py-3 text-sm font-medium text-[#1a1a1a]">
                    #{order.orderNumber}
                  </td>
                  <td className="px-5 py-3 text-sm text-[#7B9E6B]">
                    <div>
                      <p className="text-[#1a1a1a]">{order.user?.name || "Guest"}</p>
                      <p className="text-xs">{order.user?.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-[#7B9E6B]">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-5 py-3 text-sm text-[#7B9E6B]">
                    {order.items.length}
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
                  <td className="px-5 py-3">
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button variant="ghost" size="icon-sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-[#7B9E6B]">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-[rgba(46,125,50,0.15)] flex items-center justify-between">
            <p className="text-sm text-[#7B9E6B]" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link href={`?page=${page - 1}&status=${status}&search=${search}`}>
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                </Link>
              )}
              {page < totalPages && (
                <Link href={`?page=${page + 1}&status=${status}&search=${search}`}>
                  <Button variant="outline" size="sm">
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
