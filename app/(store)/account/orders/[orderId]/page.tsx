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
    <div className="min-h-screen bg-[#FAFAF7] py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/account/orders">
            <Button variant="outline" size="icon" className="h-9 w-9 border-[#E5E5E0]">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#1C1C1C]">
              Order #{order.orderNumber}
            </h1>
            <p className="text-sm text-[#6B6B6B]">{formatDate(order.createdAt)}</p>
          </div>
          <Badge
            className={`ml-auto ${ORDER_STATUS_COLORS[order.status] || "bg-gray-100 text-gray-800"}`}
          >
            {order.status}
          </Badge>
        </div>

        {/* Items */}
        <div className="bg-white border border-[#E5E5E0] p-4 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-4 h-4 text-[#6B6B6B]" />
            <h2 className="font-semibold text-[#1C1C1C]">Items</h2>
          </div>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#F5F5F0] flex-shrink-0 flex items-center justify-center">
                  <Package className="w-6 h-6 text-[#CCCCCC]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#1C1C1C]">
                    {item.productVariant.product.name}
                  </p>
                  <p className="text-sm text-[#6B6B6B]">
                    {item.productVariant.flavor}
                    {item.productVariant.size && ` · ${item.productVariant.size}`}
                  </p>
                  <p className="text-sm text-[#6B6B6B]">
                    Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                  </p>
                </div>
                <p className="font-medium text-[#1C1C1C]">
                  {formatCurrency(item.unitPrice * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Totals */}
        <div className="bg-white border border-[#E5E5E0] p-4 mb-4">
          <h2 className="font-semibold text-[#1C1C1C] mb-4">Order Total</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#6B6B6B]">Subtotal</span>
              <span className="text-[#1C1C1C]">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B6B6B]">Shipping</span>
              <span className="text-[#1C1C1C]">
                {order.shippingCost === 0 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  formatCurrency(order.shippingCost)
                )}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-[#6B6B6B]">Discount</span>
                <span className="text-green-600">-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-semibold">
              <span className="text-[#1C1C1C]">Total</span>
              <span className="text-[#1C1C1C]">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        {order.shippingAddress && (
          <div className="bg-white border border-[#E5E5E0] p-4 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-[#6B6B6B]" />
              <h2 className="font-semibold text-[#1C1C1C]">Shipping Address</h2>
            </div>
            <div className="text-sm text-[#6B6B6B]">
              <p className="font-medium text-[#1C1C1C]">
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
        <div className="bg-white border border-[#E5E5E0] p-4 mb-4 space-y-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#6B6B6B]" />
            <h2 className="font-semibold text-[#1C1C1C]">Payment</h2>
          </div>
          <div className="text-sm space-y-1">
            <p className="text-[#6B6B6B]">
              Method: <span className="text-[#1C1C1C]">{order.paymentMethod}</span>
            </p>
            {order.razorpayPaymentId && (
              <p className="text-[#6B6B6B]">
                Payment ID: <span className="text-[#1C1C1C]">{order.razorpayPaymentId}</span>
              </p>
            )}
          </div>

          {(order.status === "SHIPPED" || order.status === "DELIVERED") && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#E5E5E0]">
              <Truck className="w-4 h-4 text-[#6B6B6B]" />
              <h2 className="font-semibold text-[#1C1C1C]">Tracking</h2>
            </div>
          )}
          {(order.status === "SHIPPED" || order.status === "DELIVERED") &&
            order.trackingNumber && (
              <div className="text-sm space-y-1">
                <p className="text-[#6B6B6B]">
                  Carrier:{" "}
                  <span className="text-[#1C1C1C]">
                    {order.trackingCarrier || "N/A"}
                  </span>
                </p>
                <p className="text-[#6B6B6B]">
                  Tracking #:{" "}
                  <span className="text-[#1C1C1C]">{order.trackingNumber}</span>
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
