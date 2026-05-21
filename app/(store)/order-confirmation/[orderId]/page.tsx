import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { Check, Package, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic"; // never cache — order state changes

interface OrderConfirmationPageProps {
  params: Promise<{ orderId: string }>;
}

// Order confirmation is intentionally public — the order ID is an unguessable
// CUID. This lets guests (and logged-in users) view their confirmation without
// an auth wall, which is standard e-commerce UX.
export default async function OrderConfirmationPage({
  params,
}: OrderConfirmationPageProps) {
  const { orderId } = await params;

  let order = null;
  try {
    order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            productVariant: {
              include: {
                product: true,
              },
            },
          },
        },
        shippingAddress: true,
      },
    });
  } catch (error) {
    console.error("[order-confirmation] Failed to load order:", error);
  }

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen py-8" style={{ background: "#FAFAF8" }}>
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(20, 83, 45, 0.1)" }}
          >
            <Check className="w-8 h-8" style={{ color: "#14532D" }} />
          </div>
          <h1
            className="text-2xl font-bold mb-3"
            style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a", letterSpacing: "1px" }}
          >
            Order Confirmed
          </h1>
          <p className="text-sm" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>
            Thank you for your order. We will send you a confirmation email shortly.
          </p>
        </div>

        {/* Order Details Card */}
        <div
          className="p-6 mb-6 rounded-md"
          style={{
            background: "#fff",
            border: "1px solid rgba(20, 83, 45, 0.15)",
            boxShadow: "0 2px 8px rgba(20, 83, 45, 0.06)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2
              className="font-semibold"
              style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a" }}
            >
              Order Details
            </h2>
            <span
              className="text-sm"
              style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}
            >
              #{order.orderNumber}
            </span>
          </div>

          {/* Items */}
          <div className="space-y-4 mb-6">
            {order.items.map((item: typeof order.items[number]) => (
              <div key={item.id} className="flex items-center gap-4">
                <div
                  className="w-16 h-16 bg-[#FAFAF8] flex-shrink-0 flex items-center justify-center rounded-md"
                  style={{ border: "1px solid rgba(20, 83, 45, 0.1)" }}
                >
                  <Package className="w-6 h-6" style={{ color: "#7B9E6B" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="font-medium text-sm"
                    style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#1a1a1a" }}
                  >
                    {item.productVariant.product.name}
                  </p>
                  <p
                    className="text-xs"
                    style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}
                  >
                    {item.productVariant.flavor}
                    {item.productVariant.size && ` · ${item.productVariant.size}`}
                  </p>
                  <p
                    className="text-xs"
                    style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}
                  >
                    Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                  </p>
                </div>
                <p
                  className="font-medium text-sm"
                  style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#1a1a1a" }}
                >
                  {formatCurrency(item.unitPrice * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div
            className="border-t pt-4 space-y-2"
            style={{ borderColor: "rgba(20, 83, 45, 0.15)" }}
          >
            <div className="flex justify-between text-sm">
              <span style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>Subtotal</span>
              <span style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#1a1a1a" }}>
                {formatCurrency(order.subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>Shipping</span>
              <span style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#1a1a1a" }}>
                {order.shippingCost === 0 ? (
                  <span style={{ color: "#14532D" }}>FREE</span>
                ) : (
                  formatCurrency(order.shippingCost)
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>Tax</span>
              <span style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#1a1a1a" }}>
                {formatCurrency(order.tax)}
              </span>
            </div>
            <div
              className="flex justify-between pt-2 border-t"
              style={{ borderColor: "rgba(20, 83, 45, 0.15)" }}
            >
              <span
                className="font-semibold"
                style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a" }}
              >
                Total
              </span>
              <span
                className="font-bold"
                style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#14532D" }}
              >
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div
              className="mt-6 pt-6 border-t"
              style={{ borderColor: "rgba(20, 83, 45, 0.15)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4" style={{ color: "#14532D" }} />
                <span
                  className="text-sm font-medium"
                  style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a" }}
                >
                  Shipping Address
                </span>
              </div>
              <p
                className="text-xs leading-relaxed"
                style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}
              >
                {order.shippingAddress.line1}
                {order.shippingAddress.line2 && `, ${order.shippingAddress.line2}`}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.pin}
                <br />
                {order.shippingAddress.country}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/products" className="flex-1">
            <button
              className="w-full py-3 text-sm font-medium transition-opacity"
              style={{
                fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)",
                background: "#14532D",
                color: "#fff",
                borderRadius: "6px",
              }}
            >
              Continue Shopping
            </button>
          </Link>
          <Link href="/account/orders" className="flex-1">
            <button
              className="w-full py-3 text-sm font-medium transition-colors"
              style={{
                fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)",
                background: "transparent",
                color: "#14532D",
                border: "1px solid rgba(20, 83, 45, 0.3)",
                borderRadius: "6px",
              }}
            >
              View All Orders
            </button>
          </Link>
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs transition-colors"
            style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
