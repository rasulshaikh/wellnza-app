import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Truck,
} from "lucide-react";
import { TrackingTimeline } from "@/components/ui-styling/TrackingTimeline";
import { ORDER_STATUS_COLORS } from "@/lib/status-colors";

interface OrderDetailPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderId } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/account/orders/${orderId}`);
  }

  const order = await db.order.findUnique({
    where: { id: orderId, userId: session.user.id },
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

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen py-8" style={{ background: "#FAFAF8" }}>
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/account/orders">
            <Button variant="outline" size="icon" className="h-9 w-9" style={{ borderColor: "rgba(20,83,45,0.15)" }}>
              <ArrowLeft className="w-4 h-4" style={{ color: "#14532D" }} />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a" }}>
              Order #{order.orderNumber}
            </h1>
            <p className="text-sm" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>{formatDate(order.createdAt)}</p>
          </div>
          <Badge
            className={`ml-auto ${ORDER_STATUS_COLORS[order.status] || "bg-gray-100 text-gray-800"}`}
          >
            {order.status}
          </Badge>
        </div>

        {/* Items */}
        <div className="bg-white border p-4 mb-4" style={{ borderColor: "rgba(20,83,45,0.15)" }}>
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-4 h-4" style={{ color: "#14532D" }} />
            <h2 className="font-semibold" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a" }}>Items</h2>
          </div>
          <div className="space-y-4">
            {order.items.map((item: typeof order.items[number]) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center" style={{ background: "#FAFAF8", border: "1px solid rgba(20,83,45,0.15)" }}>
                  <Package className="w-6 h-6" style={{ color: "#7B9E6B" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#1a1a1a" }}>
                    {item.productVariant.product.name}
                  </p>
                  <p className="text-sm" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>
                    {item.productVariant.flavor}
                    {item.productVariant.size && ` · ${item.productVariant.size}`}
                  </p>
                  <p className="text-sm" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>
                    Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                  </p>
                </div>
                <p className="font-medium" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#1a1a1a" }}>
                  {formatCurrency(item.unitPrice * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Totals */}
        <div className="bg-white border p-4 mb-4" style={{ borderColor: "rgba(20,83,45,0.15)" }}>
          <h2 className="font-semibold mb-4" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a" }}>Order Total</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>Subtotal</span>
              <span style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#1a1a1a" }}>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>Shipping</span>
              <span style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#1a1a1a" }}>
                {order.shippingCost === 0 ? (
                  <span style={{ color: "#14532D" }}>Free</span>
                ) : (
                  formatCurrency(order.shippingCost)
                )}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between">
                <span style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>Discount</span>
                <span style={{ color: "#14532D" }}>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-semibold">
              <span style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#1a1a1a" }}>Total</span>
              <span style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#1a1a1a" }}>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        {order.shippingAddress && (
          <div className="bg-white border p-4 mb-4" style={{ borderColor: "rgba(20,83,45,0.15)" }}>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4" style={{ color: "#14532D" }} />
              <h2 className="font-semibold" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a" }}>Shipping Address</h2>
            </div>
            <div className="text-sm" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>
              <p className="font-medium" style={{ color: "#1a1a1a" }}>
                {order.shippingAddress.name}
              </p>
              <p>{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 && (
                <p>{order.shippingAddress.line2}</p>
              )}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                {order.shippingAddress.pin}
              </p>
              <p>{order.shippingAddress.phone}</p>
            </div>
          </div>
        )}

        {/* Payment & Tracking */}
        <div className="bg-white border p-4 mb-4 space-y-4" style={{ borderColor: "rgba(20,83,45,0.15)" }}>
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" style={{ color: "#14532D" }} />
            <h2 className="font-semibold" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a" }}>Payment</h2>
          </div>
          <div className="text-sm space-y-1">
            <p style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>
              Method: <span style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#1a1a1a" }}>{order.paymentMethod}</span>
            </p>
            {order.razorpayPaymentId && (
              <p style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#7B9E6B" }}>
                Payment ID: <span style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)", color: "#1a1a1a" }}>{order.razorpayPaymentId}</span>
              </p>
            )}
          </div>

          {(order.status === "SHIPPED" || order.status === "DELIVERED") && (
            <>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t" style={{ borderColor: "rgba(20,83,45,0.15)" }}>
                <Truck className="w-4 h-4" style={{ color: "#14532D" }} />
                <h2 className="font-semibold" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)", color: "#1a1a1a" }}>Live Tracking</h2>
              </div>
              <TrackingTimeline orderId={order.id} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
