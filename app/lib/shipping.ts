export const SHIPPING_METHODS = {
  STANDARD: { id: "standard", label: "Standard Shipping", days: "5-7 days", cost: 5000 },
  EXPRESS: { id: "express", label: "Express Shipping", days: "2-3 days", cost: 10000 },
  FREE: { id: "free", label: "Free Shipping", days: "5-7 days", cost: 0 },
} as const;

export const FREE_SHIPPING_THRESHOLD = 99900; // paise

export function calculateShipping(subtotal: number, method: keyof typeof SHIPPING_METHODS): number {
  if (method === "EXPRESS") return SHIPPING_METHODS.EXPRESS.cost;
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return SHIPPING_METHODS.STANDARD.cost;
}
