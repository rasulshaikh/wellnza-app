export const SHIPPING_METHODS = [
  {
    id: "standard",
    name: "Standard Shipping",
    description: "Free delivery on all orders",
    price: 0,
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

export const FREE_SHIPPING_THRESHOLD = 0; // Free shipping always

export function calculateShipping(
  subtotal: number,
  method: string = "standard"
): number {
  if (method === "express") return 10000;
  return 0; // Always free
}