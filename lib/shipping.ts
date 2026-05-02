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
  {
    id: "free",
    name: "Free Shipping",
    description: "On orders above ₹999",
    price: 0,
    days: "5-7 days",
  },
] as const;

export const FREE_SHIPPING_THRESHOLD = 99900; // paise (₹999)

export function calculateShipping(
  subtotal: number,
  method: string = "standard"
): number {
  if (method === "express") return 10000;
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return 5000;
}