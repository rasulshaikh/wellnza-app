import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductToggleForm } from "./ProductToggleForm";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Package } from "lucide-react";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; active?: string; featured?: string; search?: string }>;
}) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1"));
  const pageSize = 20;
  const category = params.category || "ALL";
  const active = params.active || "ALL";
  const featured = params.featured || "ALL";
  const search = params.search || "";

  // Build where clause
  const where: Record<string, unknown> = {};

  if (category && category !== "ALL") {
    where.category = category;
  }

  if (active === "ACTIVE") {
    where.isActive = true;
  } else if (active === "INACTIVE") {
    where.isActive = false;
  }

  if (featured === "FEATURED") {
    where.featured = true;
  } else if (featured === "NOT_FEATURED") {
    where.featured = false;
  }

  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }

  const [products, totalCount] = await Promise.all([
    db.product.findMany({
      where,
      include: {
        variants: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.product.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0A0A0A]">Products</h1>
        <p className="text-sm text-[#6B7280]">
          {totalCount} total product{totalCount !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
        <form className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <Input
                name="search"
                placeholder="Search by name..."
                defaultValue={search}
                className="pl-9"
              />
            </div>
          </div>

          {/* Category Filter */}
          <Select name="category" defaultValue={category}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Categories</SelectItem>
              <SelectItem value="PRE_WORKOUT">Pre Workout</SelectItem>
              <SelectItem value="PROTEIN">Protein</SelectItem>
              <SelectItem value="MASS_GAINER">Mass Gainer</SelectItem>
              <SelectItem value="OMEGA_3">Omega 3</SelectItem>
              <SelectItem value="MULTIVITAMIN">Multivitamin</SelectItem>
            </SelectContent>
          </Select>

          {/* Active Filter */}
          <Select name="active" defaultValue={active}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* Featured Filter */}
          <Select name="featured" defaultValue={featured}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Featured" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="FEATURED">Featured</SelectItem>
              <SelectItem value="NOT_FEATURED">Not Featured</SelectItem>
            </SelectContent>
          </Select>

          <Button type="submit" size="sm" className="bg-[#0055FF] hover:bg-[#0044CC]">
            Filter
          </Button>
        </form>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#FAFAFA]">
                <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Product
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Category
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Variants
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Base Price
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Active
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-[#FAFAFA]">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-[#F3F4F6] flex items-center justify-center">
                          <Package className="w-6 h-6 text-[#9CA3AF]" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-[#0A0A0A]">{product.name}</p>
                        <p className="text-xs text-[#6B7280]">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-[#6B7280]">
                    {product.category.replace("_", " ")}
                  </td>
                  <td className="px-5 py-3 text-sm text-[#6B7280]">
                    {product.variants.length}
                  </td>
                  <td className="px-5 py-3 text-sm font-medium text-[#0A0A0A]">
                    {formatCurrency(product.basePrice)}
                  </td>
                  <td className="px-5 py-3">
                    <Badge
                      variant={product.featured ? "default" : "secondary"}
                      className={product.featured ? "bg-[#0055FF] text-white" : "bg-[#F3F4F6] text-[#6B7280]"}
                    >
                      {product.featured ? "Yes" : "No"}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <ProductToggleForm
                      productId={product.id}
                      isActive={product.isActive}
                      field="isActive"
                    />
                  </td>
                  <td className="px-5 py-3">
                    <Button variant="ghost" size="sm" className="text-[#0055FF]">
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-[#6B7280]">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-[#E5E7EB] flex items-center justify-between">
            <p className="text-sm text-[#6B7280]">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <a href={`?page=${page - 1}&category=${category}&active=${active}&featured=${featured}&search=${search}`}>
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                </a>
              )}
              {page < totalPages && (
                <a href={`?page=${page + 1}&category=${category}&active=${active}&featured=${featured}&search=${search}`}>
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
