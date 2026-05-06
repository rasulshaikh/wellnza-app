export const SHIPPING_METHODS = [
  {
    id: "standard",
    name: "Standard Shipping",
    description: "Regular delivery",
    price: 5000,
    days: "5-7 days",
  },
  {
    id: "express",
    name: "Express Shipping",
    description: "Fast delivery",
    price: 10000,
    days: "2-3 days",
  },
] as const;

export const FREE_SHIPPING_THRESHOLD = 0;

export function calculateShipping(
  subtotal: number,
  method: string = "standard"
): number {
  return 0; // Always free shipping
}