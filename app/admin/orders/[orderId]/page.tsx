import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ORDER_STATUS_COLORS } from "@/lib/status-colors";
import { OrderStatusUpdateForm } from "./OrderStatusUpdateForm";
import { AdminShipButton } from "@/components/ui-styling/AdminShipButton";
import { ArrowLeft, MapPin, User, Mail, Phone, Package } from "lucide-react";
import Link from "next/link";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const { orderId } = await params;

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      shippingAddress: true,
      items: {
        include: {
          productVariant: {
            include: {
              product: { select: { name: true, images: true } },
            },
          },
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/orders">
          <Button variant="outline" size="icon" className="h-9 w-9 border-[rgba(46,125,50,0.15)]">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)" }}>
            Order #{order.orderNumber}
          </h1>
          <p className="text-sm text-[#7B9E6B]" style={{ fontFamily: "var(--font-jakarta,'Plus Jakarta Sans',sans-serif)" }}>{formatDate(order.createdAt)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status & Update */}
          <div className="bg-white border border-[rgba(46,125,50,0.15)] rounded-xl p-5">
            <h2 className="font-semibold text-[#1a1a1a] mb-4" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)" }}>Order Status</h2>
            <OrderStatusUpdateForm order={order} />
          </div>

          {/* Order Items */}
          <div className="bg-white border border-[rgba(46,125,50,0.15)] rounded-xl p-5">
            <h2 className="font-semibold text-[#1a1a1a] mb-4" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)" }}>Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item: typeof order.items[number]) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 rounded-lg border border-[rgba(46,125,50,0.15)]"
                >
                  {item.productVariant.product.images?.[0] && (
                    <img
                      src={item.productVariant.product.images[0]}
                      alt={item.productVariant.product.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-[#1a1a1a]">
                      {item.productVariant.product.name}
                    </p>
                    <p className="text-sm text-[#7B9E6B]">
                      {item.productVariant.flavor}
                      {item.productVariant.size && ` • ${item.productVariant.size}`}
                    </p>
                    <p className="text-sm text-[#7B9E6B]">
                      Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                  <p className="font-medium text-[#1a1a1a]">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-4 pt-4 border-t border-[rgba(46,125,50,0.15)] space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#7B9E6B]">Subtotal</span>
                <span className="text-[#1a1a1a]">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#7B9E6B]">Shipping</span>
                <span className="text-[#1a1a1a]">
                  {order.shippingCost === 0 ? "Free" : formatCurrency(order.shippingCost)}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-[#2E7D32]">
                  <span>Discount</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold pt-2 border-t border-[rgba(46,125,50,0.15)]">
                <span className="text-[#1a1a1a]">Total</span>
                <span className="text-[#1a1a1a]">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white border border-[rgba(46,125,50,0.15)] rounded-xl p-5">
            <h2 className="font-semibold text-[#1a1a1a] mb-4" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)" }}>Customer</h2>
            <div className="space-y-3">
              {order.user ? (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-[#7B9E6B]" />
                    <span className="text-[#1a1a1a]">{order.user.name || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-[#7B9E6B]" />
                    <span className="text-[#1a1a1a]">{order.user.email}</span>
                  </div>
                  {order.user.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-[#7B9E6B]" />
                      <span className="text-[#1a1a1a]">{order.user.phone}</span>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-[#7B9E6B]">Guest checkout</p>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white border border-[rgba(46,125,50,0.15)] rounded-xl p-5">
            <h2 className="font-semibold text-[#1a1a1a] mb-4" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)" }}>Shipping Address</h2>
            {order.shippingAddress ? (
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-[#7B9E6B] mt-0.5" />
                <div>
                  <p className="text-[#1a1a1a]">{order.shippingAddress.name}</p>
                  <p className="text-[#7B9E6B]">{order.shippingAddress.phone}</p>
                  <p className="text-[#7B9E6B] mt-1">
                    {order.shippingAddress.line1}
                    {order.shippingAddress.line2 && `, ${order.shippingAddress.line2}`}
                  </p>
                  <p className="text-[#7B9E6B]">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pin}
                  </p>
                  <p className="text-[#7B9E6B]">{order.shippingAddress.country}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#7B9E6B]">No shipping address</p>
            )}
          </div>

          {/* Shiprocket Shipment */}
          <div className="bg-white border border-[rgba(46,125,50,0.15)] rounded-xl p-5 space-y-3">
            <h2 className="font-semibold text-[#1a1a1a]" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)" }}>Shiprocket</h2>
            {(order.trackingNumber || order.trackingCarrier) && (
              <div className="space-y-1 text-sm">
                {order.trackingCarrier && (
                  <p className="text-[#7B9E6B]">
                    Courier: <span className="text-[#1a1a1a]">{order.trackingCarrier}</span>
                  </p>
                )}
                {order.trackingNumber && (
                  <p className="text-[#7B9E6B]">
                    AWB: <span className="text-[#1a1a1a] font-semibold">{order.trackingNumber}</span>
                  </p>
                )}
                {order.shiprocketOrderId && (
                  <p className="text-[#7B9E6B]">
                    SR Order ID: <span className="text-[#1a1a1a]">{order.shiprocketOrderId}</span>
                  </p>
                )}
              </div>
            )}
            <AdminShipButton
              orderId={order.id}
              hasShipment={!!order.shiprocketOrderId}
            />
          </div>

          {/* Payment Info */}
          <div className="bg-white border border-[rgba(46,125,50,0.15)] rounded-xl p-5">
            <h2 className="font-semibold text-[#1a1a1a] mb-4" style={{ fontFamily: "var(--font-rajdhani,'Rajdhani',sans-serif)" }}>Payment</h2>
            <div className="space-y-2 text-sm">
              <p className="text-[#7B9E6B]">
                Method: <span className="text-[#1a1a1a]">{order.paymentMethod}</span>
              </p>
              {order.razorpayOrderId && (
                <p className="text-[#7B9E6B]">
                  Razorpay: <span className="text-[#1a1a1a] text-xs">{order.razorpayOrderId}</span>
                </p>
              )}
              {order.stripePaymentIntent && (
                <p className="text-[#7B9E6B]">
                  Stripe: <span className="text-[#1a1a1a] text-xs">{order.stripePaymentIntent}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
