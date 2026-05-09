import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ChevronLeft, ChevronRight, User } from "lucide-react";

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; role?: string; search?: string }>;
}) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1"));
  const pageSize = 20;
  const role = params.role || "ALL";
  const search = params.search || "";

  // Build where clause
  const where: Record<string, unknown> = {};

  if (role && role !== "ALL") {
    where.role = role;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const [users, totalCount] = await Promise.all([
    db.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: { orders: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.user.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)" }}>Customers</h1>
        <p className="text-sm text-[#7B9E6B]" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>
          {totalCount} total customer{totalCount !== 1 ? "s" : ""}
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
                placeholder="Search by name or email..."
                defaultValue={search}
                className="pl-9"
              />
            </div>
          </div>

          {/* Role Filter */}
          <Select name="role" defaultValue={role}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Roles</SelectItem>
              <SelectItem value="CUSTOMER">Customer</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
          </Select>

          <Button type="submit" size="sm" className="bg-[#2E7D32] hover:bg-[#1B5E20]">
            Filter
          </Button>
        </form>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-[rgba(46,125,50,0.15)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(46,125,50,0.15)] bg-[#FAFAF8]">
                <th className="px-5 py-3 text-left text-xs font-medium text-[#7B9E6B] uppercase tracking-wider" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>
                  Customer
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-[#7B9E6B] uppercase tracking-wider" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>
                  Email
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-[#7B9E6B] uppercase tracking-wider" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>
                  Role
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-[#7B9E6B] uppercase tracking-wider" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>
                  Orders
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-[#7B9E6B] uppercase tracking-wider" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(46,125,50,0.15)]">
              {users.map((user: { id: string; name: string | null; email: string; role: string; createdAt: Date; _count: { orders: number } }) => (
                <tr key={user.id} className="hover:bg-[#FAFAF8]">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#2E7D32] flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.name?.[0] || user.email[0].toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium text-[#1a1a1a]">
                        {user.name || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-[#7B9E6B]">
                    {user.email}
                  </td>
                  <td className="px-5 py-3">
                    <Badge
                      variant={user.role === "ADMIN" ? "default" : "secondary"}
                      className={
                        user.role === "ADMIN"
                          ? "bg-[#2E7D32] text-white"
                          : "bg-[#F3F4F6] text-[#7B9E6B]"
                      }
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-sm text-[#7B9E6B]">
                    {user._count.orders}
                  </td>
                  <td className="px-5 py-3 text-sm text-[#7B9E6B]">
                    {formatDate(user.createdAt)}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-sm text-[#7B9E6B]">
                    No customers found
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
                <a href={`?page=${page - 1}&role=${role}&search=${search}`}>
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                </a>
              )}
              {page < totalPages && (
                <a href={`?page=${page + 1}&role=${role}&search=${search}`}>
                  <Button variant="outline" size="sm">
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
