import type { Inventory } from "@prisma/client";

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface StockInfo {
  status: StockStatus;
  label: string;
}

export function getStockStatus(inventory: Inventory[]): StockInfo {
  const total = inventory.reduce((sum, i) => sum + i.quantity, 0);
  if (total === 0) return { status: "out_of_stock", label: "Out of Stock" };
  if (total <= 5) return { status: "low_stock", label: `Low Stock (${total} left)` };
  return { status: "in_stock", label: "In Stock" };
}

export function getVariantStockStatus(
  variantId: string,
  inventory: Array<{ variantId: string; quantity: number }>
): StockStatus {
  const inv = inventory.find((i) => i.variantId === variantId);
  if (!inv || inv.quantity === 0) return "out_of_stock";
  if (inv.quantity <= 5) return "low_stock";
  return "in_stock";
}

export function getVariantStockLabel(
  variantId: string,
  inventory: Array<{ variantId: string; quantity: number }>
): string {
  const inv = inventory.find((i) => i.variantId === variantId);
  if (!inv || inv.quantity === 0) return "Out of Stock";
  if (inv.quantity <= 5) return `Low Stock (${inv.quantity} left)`;
  return "In Stock";
}