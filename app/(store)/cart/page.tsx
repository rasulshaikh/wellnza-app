"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FAF8F5" }}>
        <div className="animate-pulse text-sm tracking-widest luxury-heading" style={{ color: "#C9A84C" }}>
          Loading...
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#FAF8F5" }}>
        <div className="text-center max-w-md">
          <div
            className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ background: "rgba(201, 168, 76, 0.1)" }}
          >
            <ShoppingBag className="w-8 h-8 mx-auto" style={{ color: "#C9A84C" }} />
          </div>
          <h1
            className="text-3xl font-bold mb-3 luxury-title"
            style={{ color: "#1A1A1A" }}
          >
            Your Cart is Empty
          </h1>
          <p
            className="text-sm mb-8 luxury-body"
            style={{ color: "#6B6B6B" }}
          >
            Start your wellness journey with our premium supplements.
          </p>
          <Link href="/products">
            <button
              className="btn-gold"
            >
              Shop Supplements
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#FAF8F5", fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="flex items-center gap-5 mb-12">
          <Link
            href="/products"
            className="inline-flex items-center justify-center w-9 h-9 transition-all rounded-full"
            style={{ border: "1px solid rgba(201, 168, 76, 0.2)", color: "#6B6B6B" }}
            aria-label="Continue shopping"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1
            className="text-2xl font-bold luxury-title"
            style={{ color: "#1A1A1A" }}
          >
            Your Cart
          </h1>
          <span className="text-sm" style={{ color: "#6B6B6B" }}>
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item: import("@/store/cart-store").CartItem, index: number) => (
              <div
                key={item.id}
                className="luxury-card flex gap-5 p-4 rounded-xl"
                style={{
                  animation: `fadeSlideIn 0.4s ease-out ${0.1 + index * 0.1}s forwards`,
                  opacity: 0,
                }}
              >
                {/* Image */}
                <div
                  className="w-24 h-24 rounded-lg flex-shrink-0 relative flex items-center justify-center overflow-hidden"
                  style={{ background: "#F5F1EB" }}
                >
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <ShoppingBag className="w-8 h-8" style={{ color: "#C9A84C" }} />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <h3
                        className="font-semibold text-sm"
                        style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1A1A1A", letterSpacing: "0.02em" }}
                      >
                        {item.name}
                      </h3>
                      <p className="text-xs mt-1" style={{ color: "#6B6B6B" }}>
                        {item.flavor}
                        {item.size ? ` / ${item.size}` : ""}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 transition-all"
                      style={{ color: "#6B6B6B" }}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-end justify-between mt-4">
                    {/* Quantity Controls */}
                    <div
                      className="flex items-center rounded-md"
                      style={{ border: "1px solid rgba(201, 168, 76, 0.2)" }}
                    >
                      <button
                        onClick={() =>
                          updateQuantity(item.id, Math.max(0, item.quantity - 1))
                        }
                        className="w-9 h-9 flex items-center justify-center transition-all"
                        style={{ color: "#6B6B6B" }}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span
                        className="w-10 text-center font-medium text-sm"
                        style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#1A1A1A" }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, Math.min(10, item.quantity + 1))
                        }
                        className="w-9 h-9 flex items-center justify-center transition-all"
                        style={{ color: "#6B6B6B" }}
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Line Total */}
                    <div className="text-right">
                      <p
                        className="font-semibold text-base luxury-price"
                        style={{ color: "#1A1A1A" }}
                      >
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                      <p className="text-xs" style={{ color: "#6B6B6B" }}>
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
              className="luxury-card p-5 rounded-xl sticky top-6"
            >
              {/* Summary Header */}
              <div className="mb-5">
                <h2
                  className="text-base font-semibold tracking-wide"
                  style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1A1A1A" }}
                >
                  Order Summary
                </h2>
                <div className="mt-3 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "#6B6B6B" }}>Subtotal</span>
                    <span style={{ color: "#1A1A1A", fontWeight: 500 }}>
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "#6B6B6B" }}>Shipping</span>
                    <span style={{ color: "#1A1A1A", fontWeight: 500 }}>
                      {shipping === 0 ? (
                        <span style={{ color: "#C9A84C", fontWeight: 600 }}>FREE</span>
                      ) : (
                        formatCurrency(shipping)
                      )}
                    </span>
                  </div>

                  {subtotal < FREE_SHIPPING_THRESHOLD && (
                    <p
                      className="text-xs p-2.5 rounded-md"
                      style={{
                        background: "rgba(201, 168, 76, 0.06)",
                        color: "#6B6B6B",
                      }}
                    >
                      {formatCurrency(FREE_SHIPPING_THRESHOLD - subtotal)} away from free shipping
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t border-[rgba(201,168,76,0.12)] pt-4 mb-5">
                <div className="flex justify-between items-baseline">
                  <span
                    className="text-sm font-medium"
                    style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1A1A1A" }}
                  >
                    Total
                  </span>
                  <span
                    className="font-bold text-xl luxury-price"
                    style={{ color: "#C9A84C" }}
                  >
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              {error && (
                <p
                  className="mb-4 text-xs p-3 rounded-md"
                  style={{
                    background: "rgba(185, 28, 28, 0.06)",
                    border: "1px solid rgba(185, 28, 28, 0.12)",
                    color: "#B91C1C",
                  }}
                >
                  {error}
                </p>
              )}

              <button
                onClick={handleProceedToCheckout}
                disabled={validating}
                className="btn-gold w-full"
                aria-label={validating ? "Validating order..." : `Proceed to checkout for ${formatCurrency(total)}`}
              >
                {validating ? (
                  <span className="tracking-wider text-sm">Validating...</span>
                ) : (
                  <span className="text-sm">Proceed to Checkout</span>
                )}
              </button>

              <Link
                href="/products"
                className="block w-full mt-3 text-center text-xs py-2 transition-all"
                style={{ color: "#6B6B6B" }}
              >
                Continue Shopping
              </Link>

              {/* Trust Badges - Refined & Small */}
              <div className="mt-6 pt-4 border-t border-[rgba(201,168,76,0.10)]">
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-1.5" style={{ color: "#6B6B6B" }}>
                    <Shield className="w-3.5 h-3.5" style={{ color: "#C9A84C" }} />
                    <span className="text-xs">Authentic</span>
                  </div>
                  <div className="w-px h-3" style={{ background: "rgba(201,168,76,0.2)" }} />
                  <div className="flex items-center gap-1.5" style={{ color: "#6B6B6B" }}>
                    <Zap className="w-3.5 h-3.5" style={{ color: "#C9A84C" }} />
                    <span className="text-xs">48h Delivery</span>
                  </div>
                  <div className="w-px h-3" style={{ background: "rgba(201,168,76,0.2)" }} />
                  <div className="flex items-center gap-1.5" style={{ color: "#6B6B6B" }}>
                    <CheckCircle className="w-3.5 h-3.5" style={{ color: "#C9A84C" }} />
                    <span className="text-xs">Lab Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tagline */}
        <div
          className="mt-16 pt-6 flex items-center justify-center gap-3"
          style={{
            borderTop: "1px solid rgba(201, 168, 76, 0.12)",
            opacity: 0,
            animation: "fadeSlideIn 0.5s ease-out 0.8s forwards",
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#C9A84C" }} />
          <p className="text-xs tracking-wide" style={{ color: "#6B6B6B" }}>
            Wellness, rooted in <span style={{ color: "#C9A84C" }}>nature</span>
          </p>
        </div>
      </div>

      {/* Animations */}
      <style jsx global>{`
        @keyframes fadeSlideIn {
          0% {
            opacity: 0;
            transform: translateY(12px);
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