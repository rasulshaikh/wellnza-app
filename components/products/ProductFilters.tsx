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

const DIETARY_OPTIONS = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "non-vegetarian", label: "Non-Vegetarian" },
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

interface ProductFiltersProps {
  className?: string;
}

export function ProductFilters({ className }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedCategories = searchParams.getAll("category");
  const selectedDietary = searchParams.getAll("dietary");
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const sort = searchParams.get("sort") ?? "featured";
  const search = searchParams.get("search") ?? "";

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

  const toggleDietary = (value: string) => {
    const current = searchParams.getAll("dietary");
    const next = current.includes(value)
      ? current.filter((d) => d !== value)
      : [...current, value];
    updateParams({ dietary: next });
  };

  const handlePriceChange = (field: "minPrice" | "maxPrice", value: string) => {
    updateParams({ [field]: value || null });
  };

  const handleSortChange = (value: string) => {
    updateParams({ sort: value });
  };

  const handleSearchChange = (value: string) => {
    updateParams({ search: value || null });
  };

  const clearAllFilters = () => {
    router.push(pathname, { scroll: false });
  };

  const activeFilterCount =
    selectedCategories.length +
    selectedDietary.length +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0) +
    (sort !== "featured" ? 1 : 0);

  const FilterContent = () => (
    <div className="flex flex-col gap-6">
      {/* Sort */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Sort By
        </Label>
        <select
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
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
                onCheckedChange={() => toggleCategory(cat.value)}
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
            onChange={(e) => handlePriceChange("minPrice", e.target.value)}
            className="h-8"
            min={0}
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
            className="h-8"
            min={0}
          />
        </div>
      </div>

      {/* Dietary */}
      <div className="flex flex-col gap-3">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Dietary
        </Label>
        <div className="flex flex-col gap-2">
          {DIETARY_OPTIONS.map((opt) => (
            <Label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2 text-sm font-normal"
            >
              <Checkbox
                checked={selectedDietary.includes(opt.value)}
                onCheckedChange={() => toggleDietary(opt.value)}
              />
              {opt.label}
            </Label>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearAllFilters}
          className="mt-2"
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );

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
          <FilterContent />
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
              <FilterContent />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}
