"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, Shield, Zap, CheckCircle } from "lucide-react";
import { calculateShipping, FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";

interface ValidatedItem {
  productVariantId: string;
  maxAvailable: number;
}

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity } = useCartStore();
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = calculateShipping(subtotal, "standard");
  const total = subtotal + shipping;

  useEffect(() => {
    setMounted(true);
  }, []);

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

      const currentItems = [...items];

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

      router.push("/checkout");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setValidating(false);
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FAFAF8" }}>
        <div className="animate-pulse text-sm tracking-widest" style={{ color: "#2E7D32", fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>
          Loading...
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#FAFAF8" }}>
        <div className="text-center max-w-md">
          <div
            className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ background: "rgba(46, 125, 50, 0.1)" }}
          >
            <ShoppingBag className="w-8 h-8 mx-auto" style={{ color: "#2E7D32" }} />
          </div>
          <h1
            className="text-3xl font-bold mb-3"
            style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a", letterSpacing: "1px" }}
          >
            Your Cart is Empty
          </h1>
          <p
            className="text-sm mb-8"
            style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}
          >
            Start your wellness journey with our premium supplements.
          </p>
          <Link href="/products">
            <button
              className="px-8 py-3 text-sm font-semibold tracking-wider transition-opacity"
              style={{
                fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)",
                background: "#2E7D32",
                color: "#fff",
                borderRadius: "6px",
                letterSpacing: "1px",
              }}
            >
              Shop Supplements
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#FAFAF8", fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/products"
            className="inline-flex items-center justify-center w-10 h-10 border transition-colors"
            style={{ borderColor: "rgba(46, 125, 50, 0.2)", color: "#7B9E6B" }}
            aria-label="Continue shopping"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a", letterSpacing: "1px" }}
          >
            Your Cart
          </h1>
          <span className="text-sm ml-2" style={{ color: "#7B9E6B" }}>
            ({items.length} {items.length === 1 ? "item" : "items"})
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item: import("@/store/cart-store").CartItem, index: number) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-white rounded-md"
                style={{
                  border: "1px solid rgba(46, 125, 50, 0.15)",
                  boxShadow: "0 2px 8px rgba(46, 125, 50, 0.06)",
                  animation: `fadeSlideIn 0.4s ease-out ${0.1 + index * 0.1}s forwards`,
                  opacity: 0,
                }}
              >
                {/* Image */}
                <div
                  className="w-24 h-24 bg-[#FAFAF8] rounded-md flex-shrink-0 relative flex items-center justify-center overflow-hidden"
                >
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <ShoppingBag className="w-10 h-10" style={{ color: "#7B9E6B" }} />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3
                        className="font-semibold text-base"
                        style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a" }}
                      >
                        {item.name}
                      </h3>
                      <p className="text-xs mt-1" style={{ color: "#7B9E6B" }}>
                        {item.flavor}
                        {item.size ? ` / ${item.size}` : ""}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 transition-colors"
                      style={{ color: "#7B9E6B" }}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-end justify-between mt-4">
                    {/* Quantity Controls */}
                    <div
                      className="flex items-center rounded-md"
                      style={{ border: "1px solid rgba(46, 125, 50, 0.2)" }}
                    >
                      <button
                        onClick={() =>
                          updateQuantity(item.id, Math.max(0, item.quantity - 1))
                        }
                        className="w-10 h-10 flex items-center justify-center transition-colors"
                        style={{ color: "#7B9E6B" }}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span
                        className="w-12 text-center font-medium"
                        style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#1a1a1a" }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, Math.min(10, item.quantity + 1))
                        }
                        className="w-10 h-10 flex items-center justify-center transition-colors"
                        style={{ color: "#7B9E6B" }}
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Line Total */}
                    <div className="text-right">
                      <p
                        className="font-semibold text-lg"
                        style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a" }}
                      >
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                      <p className="text-xs" style={{ color: "#7B9E6B" }}>
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
            <div
              className="bg-white p-6 rounded-md sticky top-4"
              style={{
                border: "1px solid rgba(46, 125, 50, 0.15)",
                boxShadow: "0 2px 8px rgba(46, 125, 50, 0.06)",
              }}
            >
              {/* Summary Header */}
              <div
                className="p-4 -m-px rounded-t-md"
                style={{ background: "#2E7D32" }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-lg text-white tracking-wide"
                    style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)" }}
                  >
                    Order Summary
                  </span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                    style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}
                  >
                    {items.length}
                  </div>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#7B9E6B" }}>Subtotal</span>
                  <span style={{ color: "#1a1a1a", fontWeight: 500 }}>
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#7B9E6B" }}>Shipping</span>
                  <span style={{ color: "#1a1a1a", fontWeight: 500 }}>
                    {shipping === 0 ? (
                      <span style={{ color: "#2E7D32" }}>FREE</span>
                    ) : (
                      formatCurrency(shipping)
                    )}
                  </span>
                </div>

                {subtotal < FREE_SHIPPING_THRESHOLD && (
                  <p
                    className="text-xs p-3 rounded-md"
                    style={{
                      background: "rgba(46, 125, 50, 0.08)",
                      border: "1px solid rgba(46, 125, 50, 0.15)",
                      color: "#7B9E6B",
                    }}
                  >
                    Add {formatCurrency(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping
                  </p>
                )}

                <div className="border-t border-[rgba(46,125,50,0.1)] pt-4 flex justify-between">
                  <span
                    className="font-semibold text-base"
                    style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a" }}
                  >
                    Total
                  </span>
                  <span
                    className="font-bold text-2xl"
                    style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#2E7D32" }}
                  >
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              {error && (
                <p
                  className="mt-4 text-xs p-3 rounded-md"
                  style={{
                    background: "rgba(239, 68, 68, 0.08)",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                    color: "#dc2626",
                  }}
                >
                  {error}
                </p>
              )}

              <button
                onClick={handleProceedToCheckout}
                disabled={validating}
                className="w-full mt-6 py-4 text-sm font-semibold tracking-wider transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)",
                  background: "#2E7D32",
                  color: "#fff",
                  borderRadius: "6px",
                  letterSpacing: "1px",
                }}
                aria-label={validating ? "Validating order..." : `Proceed to checkout for ${formatCurrency(total)}`}
              >
                {validating ? (
                  <span className="tracking-wider">Validating...</span>
                ) : (
                  <span>Proceed to Checkout</span>
                )}
              </button>

              <Link
                href="/products"
                className="block w-full mt-4 text-center text-sm py-2 transition-colors"
                style={{ color: "#7B9E6B" }}
              >
                Continue Shopping
              </Link>

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t border-[rgba(46,125,50,0.1)]">
                <div className="grid grid-cols-1 gap-3">
                  <div
                    className="flex items-center gap-3 text-xs"
                    style={{ color: "#7B9E6B" }}
                  >
                    <Shield className="w-4 h-4 flex-shrink-0" style={{ color: "#2E7D32" }} />
                    <span>100% Authentic — Third-Party Tested</span>
                  </div>
                  <div
                    className="flex items-center gap-3 text-xs"
                    style={{ color: "#7B9E6B" }}
                  >
                    <Zap className="w-4 h-4 flex-shrink-0" style={{ color: "#2E7D32" }} />
                    <span>Fast Delivery — Within 48 Hours</span>
                  </div>
                  <div
                    className="flex items-center gap-3 text-xs"
                    style={{ color: "#7B9E6B" }}
                  >
                    <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#2E7D32" }} />
                    <span>Every Batch Lab Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tagline */}
        <div
          className="mt-12 pt-8 border-t flex flex-col lg:flex-row items-center justify-between gap-6"
          style={{
            borderColor: "rgba(46, 125, 50, 0.1)",
            opacity: 0,
            animation: "fadeSlideIn 0.5s ease-out 0.8s forwards",
          }}
        >
          <p className="text-sm tracking-wide" style={{ color: "#7B9E6B" }}>
            Wellness, rooted in <span style={{ color: "#2E7D32" }}>nature</span>.
          </p>
          <div className="flex items-center gap-2 text-xs" style={{ color: "#7B9E6B" }}>
            <div className="w-2 h-2 rounded-full" style={{ background: "#2E7D32" }} />
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx global>{`
        @keyframes fadeSlideIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
