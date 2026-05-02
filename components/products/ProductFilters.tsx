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
  { value: "PRE_WORKOUT", label: "Pre-Workout" },
  { value: "PROTEIN", label: "Protein" },
  { value: "MASS_GAINER", label: "Mass Gainer" },
  { value: "OMEGA_3", label: "Omega-3" },
  { value: "MULTIVITAMIN", label: "Multivitamin" },
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
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
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Sort By
        </Label>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
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
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Category
        </Label>
        <div className="flex flex-col gap-2">
          {CATEGORIES.map((cat) => (
            <Label
              key={cat.value}
              className="flex cursor-pointer items-center gap-2 text-sm font-normal"
            >
              <Checkbox
                checked={selectedCategories.includes(cat.value)}
                onCheckedChange={() => onToggleCategory(cat.value)}
              />
              {cat.label}
            </Label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="flex flex-col gap-3">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Price Range
        </Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => onPriceChange("minPrice", e.target.value)}
            className="h-8"
            min={0}
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => onPriceChange("maxPrice", e.target.value)}
            className="h-8"
            min={0}
          />
        </div>
      </div>

      {activeFilterCount > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearAll}
          className="mt-2"
        >
          Clear All Filters
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
        className={cn(
          "hidden w-56 shrink-0 flex-col gap-6 lg:flex",
          className
        )}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-sm font-semibold">Filters</h2>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="text-xs">
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
        <span className="text-sm text-muted-foreground">
          {activeFilterCount > 0 ? `${activeFilterCount} filter${activeFilterCount > 1 ? "s" : ""} active` : "No filters applied"}
        </span>
        <Drawer direction="bottom">
          <DrawerTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <SlidersHorizontal className="size-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="default" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Filters</DrawerTitle>
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
