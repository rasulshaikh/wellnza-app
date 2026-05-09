"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { SlidersHorizontal, X } from "lucide-react";

const CATEGORIES = [
  { value: "PRE_WORKOUT", label: "PRE-WORKOUT" },
  { value: "PROTEIN", label: "PROTEIN" },
  { value: "MASS_GAINER", label: "MASS GAINER" },
  { value: "OMEGA_3", label: "OMEGA-3" },
  { value: "MULTIVITAMIN", label: "MULTIVITAMIN" },
];

const SORT_OPTIONS = [
  { value: "featured", label: "FEATURED" },
  { value: "price_asc", label: "PRICE: LOW TO HIGH" },
  { value: "price_desc", label: "PRICE: HIGH TO LOW" },
  { value: "newest", label: "NEWEST" },
];

interface FilterContentProps {
  sort: string;
  selectedCategories: string[];
  minPrice: string;
  maxPrice: string;
  activeFilterCount: number;
  onToggleCategory: (value: string) => void;
  onSortChange: (value: string) => void;
  onPriceChange: (field: "minPrice" | "maxPrice", value: string) => void;
  onClearAll: () => void;
}

function FilterContent({
  sort,
  selectedCategories,
  minPrice,
  maxPrice,
  activeFilterCount,
  onToggleCategory,
  onSortChange,
  onPriceChange,
  onClearAll,
}: FilterContentProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Sort */}
      <div className="flex flex-col gap-2">
        <Label
          className="text-[11px] font-medium tracking-[2px] uppercase"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "#7B9E6B" }}
        >
          SORT BY
        </Label>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="h-[44px] w-full border px-3 py-2 text-[13px] transition-colors focus:outline-none focus:ring-1"
          style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "1px", borderColor: "rgba(46,125,50,0.15)", backgroundColor: "#FAFAF8", color: "#1a1a1a" }}
          aria-label="Sort products"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div className="flex flex-col gap-3">
        <Label
          className="text-[11px] font-medium tracking-[2px] uppercase"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "#7B9E6B" }}
        >
          CATEGORY
        </Label>
        <div className="flex flex-col gap-2">
          {CATEGORIES.map((cat) => (
            <Label
              key={cat.value}
              className="flex cursor-pointer items-center gap-3 text-[13px]"
              style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "1px", color: "#1a1a1a" }}
            >
              <Checkbox
                checked={selectedCategories.includes(cat.value)}
                onCheckedChange={() => onToggleCategory(cat.value)}
                className="border"
                style={{ borderColor: "rgba(46,125,50,0.15)", backgroundColor: selectedCategories.includes(cat.value) ? "#2E7D32" : "transparent" }}
                aria-label={`Filter by ${cat.label}`}
              />
              {cat.label}
            </Label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="flex flex-col gap-3">
        <Label
          className="text-[11px] font-medium tracking-[2px] uppercase"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "#7B9E6B" }}
        >
          PRICE RANGE
        </Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="MIN"
            value={minPrice}
            onChange={(e) => onPriceChange("minPrice", e.target.value)}
            className="h-[44px] border px-3 py-2 text-[13px] transition-colors focus:outline-none focus:ring-1"
            style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "1px", borderColor: "rgba(46,125,50,0.15)", backgroundColor: "#FAFAF8", color: "#1a1a1a" }}
            min={0}
            aria-label="Minimum price"
          />
          <span style={{ color: "#7B9E6B" }}>-</span>
          <Input
            type="number"
            placeholder="MAX"
            value={maxPrice}
            onChange={(e) => onPriceChange("maxPrice", e.target.value)}
            className="h-[44px] border px-3 py-2 text-[13px] transition-colors focus:outline-none focus:ring-1"
            style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "1px", borderColor: "rgba(46,125,50,0.15)", backgroundColor: "#FAFAF8", color: "#1a1a1a" }}
            min={0}
            aria-label="Maximum price"
          />
        </div>
      </div>

      {activeFilterCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="mt-2 hover:bg-transparent w-fit"
          style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "2px", color: "#2E7D32" }}
          aria-label="Clear all filters"
        >
          CLEAR ALL FILTERS
        </Button>
      )}
    </div>
  );
}

interface ProductFiltersProps {
  className?: string;
}

export function ProductFilters({ className }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedCategories = searchParams.getAll("category");
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const sort = searchParams.get("sort") ?? "featured";

  const updateParams = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
          params.delete(key);
        } else if (Array.isArray(value)) {
          params.delete(key);
          value.forEach((v) => params.append(key, v));
        } else {
          params.set(key, value);
        }
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const toggleCategory = (value: string) => {
    const current = searchParams.getAll("category");
    const next = current.includes(value)
      ? current.filter((c) => c !== value)
      : [...current, value];
    updateParams({ category: next });
  };

  const handlePriceChange = (field: "minPrice" | "maxPrice", value: string) => {
    updateParams({ [field]: value || null });
  };

  const handleSortChange = (value: string) => {
    updateParams({ sort: value });
  };

  const clearAllFilters = () => {
    const currentSearch = searchParams.get("search") ?? "";
    router.push(`${pathname}?search=${currentSearch}`, { scroll: false });
  };

  const activeFilterCount =
    selectedCategories.length +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0) +
    (sort !== "featured" ? 1 : 0);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn("flex flex-col gap-6", className)}
        aria-label="Product filters"
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2
              className="text-[14px] font-semibold tracking-[2px]"
              style={{ fontFamily: "'Playfair Display', serif", color: "#1a1a1a" }}
            >
              FILTERS
            </h2>
            {activeFilterCount > 0 && (
              <Badge
                variant="secondary"
                className="text-[11px] px-2 py-0.5 border-0"
                style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "1px", background: "#2E7D32", color: "#fff" }}
              >
                {activeFilterCount}
              </Badge>
            )}
          </div>
          <FilterContent
            sort={sort}
            selectedCategories={selectedCategories}
            minPrice={minPrice}
            maxPrice={maxPrice}
            activeFilterCount={activeFilterCount}
            onToggleCategory={toggleCategory}
            onSortChange={handleSortChange}
            onPriceChange={handlePriceChange}
            onClearAll={clearAllFilters}
          />
        </div>
      </aside>

      {/* Mobile drawer */}
      <div className="flex items-center justify-between px-4 py-3 lg:hidden">
        <span
          className="text-[13px]"
          style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "1px", color: "#7B9E6B" }}
        >
          {activeFilterCount > 0 ? `${activeFilterCount} FILTER${activeFilterCount > 1 ? "S" : ""} ACTIVE` : "NO FILTERS APPLIED"}
        </span>
        <Drawer direction="bottom">
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "1px", borderColor: "rgba(46,125,50,0.15)", color: "#1a1a1a" }}
              aria-label="Open filters"
            >
              <SlidersHorizontal className="size-4" aria-hidden="true" />
              FILTERS
              {activeFilterCount > 0 && (
                <Badge
                  variant="default"
                  className="ml-1 h-5 w-5 rounded-full p-0 text-[10px] border-0"
                  style={{ background: "#2E7D32", color: "#fff" }}
                >
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </DrawerTrigger>
          <DrawerContent style={{ background: "#FAFAF8" }}>
            <DrawerHeader>
              <DrawerTitle
                className="text-left"
                style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "2px", color: "#1a1a1a" }}
              >
                FILTERS
              </DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-6">
              <FilterContent
                sort={sort}
                selectedCategories={selectedCategories}
                minPrice={minPrice}
                maxPrice={maxPrice}
                activeFilterCount={activeFilterCount}
                onToggleCategory={toggleCategory}
                onSortChange={handleSortChange}
                onPriceChange={handlePriceChange}
                onClearAll={clearAllFilters}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}
