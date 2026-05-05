"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, Shield, Zap, CheckCircle } from "lucide-react";
import { calculateShipping, FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";

interface ValidatedItem {
  productVariantId: string;
  maxAvailable: number;
}

// Angular clip-path cart panel
const CART_PANEL_CLIP_PATH = "polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)";
const CART_HEADER_CLIP_PATH = "polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)";
const CTA_CLIP_PATH = "polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)";

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity } = useCartStore();
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const cartPanelRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = calculateShipping(subtotal, "standard");
  const total = subtotal + shipping;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mouse parallax effect with 16ms throttle
  useEffect(() => {
    if (!mounted) return;

    let lastMove = 0;
    const THROTTLE_MS = 16;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMove < THROTTLE_MS) return;
      lastMove = now;

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      setMousePos({
        x: (mouseX / centerX) * 5,
        y: -(mouseY / centerY) * 5,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mounted]);

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
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="animate-pulse text-[#22C55E] font-bold uppercase tracking-widest">
          Loading...
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div
            className="w-16 h-16 mx-auto mb-6"
            style={{
              background: "#166534",
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }}
          >
            <ShoppingBag className="w-8 h-8 text-[#0D0D0D] mx-auto pt-4" />
          </div>
          <h1
            className="text-4xl font-bold text-white mb-2 tracking-wider"
            style={{ fontFamily: "Bebas Neue, sans-serif" }}
          >
            YOUR STACK IS EMPTY
          </h1>
          <p className="text-[#888888] mb-8 uppercase tracking-wide text-sm">
            Time to lock in your gains
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center h-12 px-8 text-lg font-bold uppercase tracking-widest text-[#0D0D0D] hover:opacity-90 transition-opacity"
            style={{
              fontFamily: "Bebas Neue, sans-serif",
              background: "#22C55E",
              clipPath: CTA_CLIP_PATH,
            }}
          >
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  const rotateY = mousePos.x * 0.5;
  const rotateX = mousePos.y * 0.5;

  return (
    <div
      className="min-h-screen min-h-screen bg-[#0D0D0D] text-white overflow-hidden relative"
      style={{
        fontFamily: "Oswald, sans-serif",
      }}
    >
      {/* Perspective Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            repeating-linear-gradient(
              -75deg,
              transparent,
              transparent 40px,
              rgba(22, 101, 52, 0.04) 40px,
              rgba(22, 101, 52, 0.04) 42px
            )
          `,
          transform: `rotateX(${-mousePos.y * 0.2}deg) rotateY(${mousePos.x * 0.2}deg)`,
          transformOrigin: "center center",
        }}
      />

      {/* Angular Decoration */}
      <div className="fixed top-0 right-0 w-[400px] h-full overflow-hidden pointer-events-none z-0">
        <div
          className="absolute top-[-50%] right-[-100px] w-[300px] h-[200%]"
          style={{
            background: "#166534",
            transform: "skewX(-20deg)",
            opacity: 0.08,
          }}
        />
        <div
          className="absolute top-0 right-[80px] w-[4px] h-full"
          style={{
            background: "#166534",
            transform: "skewX(-10deg)",
            opacity: 0.6,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/products"
            className="inline-flex items-center justify-center w-10 h-10 border border-[rgba(173,255,47,0.3)] text-[#888888] hover:text-[#22C55E] hover:border-[#22C55E] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0D0D]"
            aria-label="Continue shopping"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1
            className="text-4xl font-bold tracking-wider"
            style={{ fontFamily: "Bebas Neue, sans-serif" }}
          >
            YOUR STACK
          </h1>
          <span className="text-[#888888] text-sm ml-2 uppercase tracking-wide">
            ({items.length} {items.length === 1 ? "item" : "items"})
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item: import("@/store/cart-store").CartItem, index: number) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 border border-[rgba(173,255,47,0.15)] bg-[rgba(26,26,26,0.8)] backdrop-blur-sm"
                style={{
                  clipPath: CART_PANEL_CLIP_PATH,
                  transform: `translateZ(${index * 10}px)`,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  animation: `fadeSlideIn 0.5s ease-out ${0.2 + index * 0.15}s forwards`,
                  opacity: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateZ(20px) rotateY(2deg) rotateX(-2deg)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.6), 0 0 20px rgba(22,101,52,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = `translateZ(${index * 10}px) rotateY(0deg) rotateX(0deg)`;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Image */}
                <div
                  className="w-24 h-24 bg-[#0D0D0D] flex-shrink-0 relative flex items-center justify-center"
                  style={{
                    transformStyle: "preserve-3d",
                    transition: "transform 0.2s ease",
                  }}
                  data-tilt
                >
                  <div
                    className="absolute top-0 left-0 w-full h-[3px]"
                    style={{ background: "#166534" }}
                  />
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <ShoppingBag className="w-10 h-10 text-[#166534]" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3
                        className="font-bold text-lg uppercase tracking-wide text-white"
                        style={{ fontFamily: "Bebas Neue, sans-serif", letterSpacing: "1px" }}
                      >
                        {item.name}
                      </h3>
                      <p className="text-[#888888] text-xs mt-1 uppercase tracking-wider">
                        {item.flavor}
                        {item.size ? ` / ${item.size}` : ""}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[#888888] hover:text-red-500 transition-colors p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0D0D]"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-end justify-between mt-4">
                    {/* Quantity Controls */}
                    <div
                      className="flex items-center border border-[rgba(173,255,47,0.3)]"
                      style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
                    >
                      <button
                        onClick={() =>
                          updateQuantity(item.id, Math.max(0, item.quantity - 1))
                        }
                        className="w-10 h-10 flex items-center justify-center text-[#888888] hover:text-[#22C55E] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-inset"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span
                        className="w-12 text-center text-base font-bold text-white"
                        style={{ fontFamily: "Bebas Neue, sans-serif", letterSpacing: "2px" }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, Math.min(10, item.quantity + 1))
                        }
                        className="w-10 h-10 flex items-center justify-center text-[#888888] hover:text-[#22C55E] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-inset"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Line Total */}
                    <div className="text-right">
                      <p
                        className="font-bold text-xl text-white"
                        style={{ fontFamily: "Bebas Neue, sans-serif", letterSpacing: "1px" }}
                      >
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                      <p className="text-[#888888] text-xs uppercase tracking-wider">
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
              ref={cartPanelRef}
              className="bg-[linear-gradient(135deg,#1A1A1A_0%,rgba(26,26,26,0.8)_100%)] border border-[rgba(173,255,47,0.2)] p-6 sticky top-4"
              style={{
                clipPath: CART_PANEL_CLIP_PATH,
                transformStyle: "preserve-3d",
                transform: `translateZ(50px) rotateY(${-rotateY}deg) rotateX(${rotateX}deg)`,
                transition: "transform 0.4s ease, box-shadow 0.4s ease",
              }}
            >
              {/* Summary Header */}
              <div
                className="bg-[#166534] p-4 -m-px"
                style={{
                  clipPath: CART_HEADER_CLIP_PATH,
                }}
              >
                <div
                  className="flex items-center justify-between"
                  style={{ fontFamily: "Bebas Neue, sans-serif" }}
                >
                  <span className="text-2xl text-[#0D0D0D] tracking-[3px]">
                    ORDER SUMMARY
                  </span>
                  <div
                    className="w-8 h-8 bg-[#0D0D0D] text-[#166534] flex items-center justify-center text-sm font-bold"
                  >
                    {items.length}
                  </div>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <div className="flex justify-between text-sm uppercase tracking-wider">
                  <span className="text-[#888888]">Subtotal</span>
                  <span className="text-white font-medium">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm uppercase tracking-wider">
                  <span className="text-[#888888]">Shipping</span>
                  <span className="text-white font-medium">
                    {shipping === 0 ? (
                      <span className="text-[#22C55E]">FREE</span>
                    ) : (
                      formatCurrency(shipping)
                    )}
                  </span>
                </div>

                {subtotal < FREE_SHIPPING_THRESHOLD && (
                  <p className="text-xs text-[#888888] bg-[rgba(22,101,52,0.15)] p-3 border border-[rgba(22,101,52,0.3)] uppercase tracking-wider">
                    Add {formatCurrency(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping
                  </p>
                )}

                <div className="border-t border-[rgba(173,255,47,0.2)] pt-4 flex justify-between">
                  <span
                    className="font-bold text-lg uppercase tracking-wider"
                    style={{ fontFamily: "Bebas Neue, sans-serif" }}
                  >
                    TOTAL
                  </span>
                  <span
                    className="font-bold text-3xl text-[#22C55E]"
                    style={{ fontFamily: "Bebas Neue, sans-serif", letterSpacing: "1px" }}
                  >
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              {error && (
                <p className="mt-4 text-xs text-red-400 bg-red-500/10 p-3 border border-red-500/30 uppercase tracking-wider">
                  {error}
                </p>
              )}

              <button
                onClick={handleProceedToCheckout}
                disabled={validating}
                className="w-full mt-6 h-16 text-xl font-bold uppercase tracking-[4px] text-[#0D0D0D] flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                style={{
                  fontFamily: "Bebas Neue, sans-serif",
                  background: "#22C55E",
                  clipPath: CTA_CLIP_PATH,
                  transform: "translateZ(30px)",
                  transformStyle: "preserve-3d",
                }}
                aria-label={validating ? "Validating order..." : `Lock in my stack for ${formatCurrency(total)}`}
              >
                {validating ? (
                  <span className="uppercase tracking-[3px]">Validating...</span>
                ) : (
                  <>
                    <span>Lock In My Stack</span>
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                    </svg>
                  </>
                )}
              </button>

              <Link
                href="/products"
                className="block w-full mt-4 text-center text-sm text-[#888888] hover:text-[#22C55E] transition-colors uppercase tracking-wider py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0D0D]"
              >
                Continue Shopping
              </Link>

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t border-[rgba(173,255,47,0.1)]">
                <div className="grid grid-cols-1 gap-3">
                  <div
                    className="flex items-center gap-3 text-xs text-[#888888] uppercase tracking-wider"
                    style={{ transform: "translateZ(15px)" }}
                  >
                    <Shield className="w-4 h-4 text-[#166534] flex-shrink-0" />
                    <span>100% Authentic - Source Direct</span>
                  </div>
                  <div
                    className="flex items-center gap-3 text-xs text-[#888888] uppercase tracking-wider"
                    style={{ transform: "translateZ(15px)" }}
                  >
                    <Zap className="w-4 h-4 text-[#166534] flex-shrink-0" />
                    <span>Speed Delivery - Within 48 Hours</span>
                  </div>
                  <div
                    className="flex items-center gap-3 text-xs text-[#888888] uppercase tracking-wider"
                    style={{ transform: "translateZ(15px)" }}
                  >
                    <CheckCircle className="w-4 h-4 text-[#166534] flex-shrink-0" />
                    <span>Every Batch Tested - Period</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tagline */}
        <div
          className="mt-12 pt-8 border-t border-[rgba(173,255,47,0.1)] flex flex-col lg:flex-row items-center justify-between gap-6"
          style={{
            fontFamily: "Oswald, sans-serif",
            opacity: 0,
            animation: "fadeSlideIn 0.6s ease-out 1.0s forwards",
          }}
        >
          <p className="text-sm uppercase tracking-[3px] text-[#888888]">
            Built For <span className="text-[#166534]">Athletes</span>. Proven By{" "}
            <span className="text-[#166534]">Gains</span>.
          </p>
          <div className="flex items-center gap-2 text-xs text-[#888888] uppercase tracking-wider">
            <div className="w-2 h-2 bg-[#22C55E] animate-pulse" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>

      {/* Keyframe Animations */}
      <style jsx global>{`
        @keyframes fadeSlideIn {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Item image tilt effect */
        [data-tilt] {
          transform-style: preserve-3d;
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
