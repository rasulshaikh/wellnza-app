"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from "lucide-react";
import { calculateShipping, SHIPPING_METHODS } from "@/lib/shipping";

interface ValidatedItem {
  productVariantId: string;
  maxAvailable: number;
}

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity } = useCartStore();
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = calculateShipping(subtotal, "standard");
  const total = subtotal + shipping;

  async function handleProceedToCheckout() {
    setError(null);
    setValidating(true);

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productVariantId: i.productVariantId,
            quantity: i.quantity,
          })),
        }),
        signal: AbortSignal.timeout(10000),
      });

      if (!res.ok) throw new Error("Validation failed");

      const { items: validated, invalid } = (await res.json()) as {
        items: ValidatedItem[];
        invalid: string[];
      };

      // Copy items before mutation to avoid stale closure
      const currentItems = [...items];

      // Remove invalid items from cart
      invalid.forEach((variantId) => {
        const item = currentItems.find((i) => i.productVariantId === variantId);
        if (item) removeItem(item.id);
      });

      if (invalid.length > 0) {
        setError(
          `Some items are no longer available and have been removed from your cart.`
        );
        setValidating(false);
        return;
      }

      // Check quantity caps
      validated.forEach((v) => {
        const item = currentItems.find((i) => i.productVariantId === v.productVariantId);
        if (item && item.quantity > v.maxAvailable) {
          updateQuantity(item.id, v.maxAvailable);
          const name = currentItems.find((i) => i.productVariantId === v.productVariantId)?.name ?? v.productVariantId;
          setError(
            `Quantity for "${name}" has been updated due to limited stock.`
          );
        }
      });

      // Proceed to checkout via router to preserve middleware
      router.push("/checkout");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setValidating(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-[#1C1C1C] rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#1C1C1C] mb-2">
            Your cart is empty
          </h1>
          <p className="text-[#6B6B6B] mb-8">
            Looks like you have not added anything to your cart yet.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center h-9 px-6 bg-[#1C1C1C] hover:bg-[#2D2D2D] text-white text-sm font-medium"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/products"
            className="inline-flex items-center justify-center w-8 h-8 hover:bg-muted text-[#6B6B6B] hover:text-[#1C1C1C] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-[#1C1C1C]">Your Cart</h1>
          <span className="text-[#6B6B6B] text-sm ml-2">
            ({items.length} {items.length === 1 ? "item" : "items"})
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item: import("@/store/cart-store").CartItem) => (
              <div
                key={item.id}
                className="flex gap-4 bg-white p-4 border border-[#E5E5E0]"
              >
                {/* Image */}
                <div className="w-24 h-24 bg-[#F5F5F0] flex-shrink-0 relative">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-[#CCCCCC]" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-semibold text-[#1C1C1C] text-sm leading-tight">
                        {item.name}
                      </h3>
                      <p className="text-[#6B6B6B] text-xs mt-0.5">
                        {item.flavor}
                        {item.size ? ` · ${item.size}` : ""}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[#6B6B6B] hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-end justify-between mt-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-[#E5E5E0]">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, Math.max(0, item.quantity - 1))
                        }
                        className="w-8 h-8 flex items-center justify-center text-[#6B6B6B] hover:text-[#1C1C1C] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-10 text-center text-sm font-medium text-[#1C1C1C]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, Math.min(10, item.quantity + 1))
                        }
                        className="w-8 h-8 flex items-center justify-center text-[#6B6B6B] hover:text-[#1C1C1C] transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Line Total */}
                    <div className="text-right">
                      <p className="font-semibold text-[#1C1C1C]">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                      <p className="text-[#6B6B6B] text-xs">
                        {formatCurrency(item.price)} each
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-[#E5E5E0] p-6 sticky top-4">
              <h2 className="text-lg font-bold text-[#1C1C1C] mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6B6B6B]">Subtotal</span>
                  <span className="text-[#1C1C1C] font-medium">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B6B6B]">Shipping</span>
                  <span className="text-[#1C1C1C] font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatCurrency(shipping)
                    )}
                  </span>
                </div>

                {subtotal < FREE_SHIPPING_THRESHOLD && (
                  <p className="text-xs text-[#6B6B6B] bg-[#F5F5F0] p-2">
                    Add{" "}
                    {formatCurrency(FREE_SHIPPING_THRESHOLD - subtotal)} more for free
                    shipping
                  </p>
                )}

                <div className="border-t border-[#E5E5E0] pt-3 flex justify-between">
                  <span className="font-bold text-[#1C1C1C]">Total</span>
                  <span className="font-bold text-[#1C1C1C]">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              {error && (
                <p className="mt-3 text-xs text-red-500 bg-red-50 p-2">{error}</p>
              )}

              <Button
                onClick={handleProceedToCheckout}
                disabled={validating}
                className="w-full mt-4 bg-[#1C1C1C] hover:bg-[#2D2D2D] text-white rounded-none h-11 font-medium disabled:opacity-50"
              >
                {validating ? "Validating..." : "Proceed to Checkout"}
              </Button>

              <Link
                href="/products"
                className="block w-full mt-2 text-center text-sm text-[#6B6B6B] hover:text-[#1C1C1C] transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
