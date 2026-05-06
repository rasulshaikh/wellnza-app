import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, Package, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";

interface OrderConfirmationPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderConfirmationPage({
  params,
}: OrderConfirmationPageProps) {
  const { orderId } = await params;
  const session = await auth();

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
        user: { select: { id: true } },
      },
    });
  } catch (error) {
    console.error("[order-confirmation] Failed to load order:", error);
  }

  if (!order || (order.userId && session?.user?.id && order.userId !== session.user.id)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#22C55E] rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-bebas)" }}>
            ORDER LOCKED IN
          </h1>
          <p className="text-[#888888]">
            Thank you for your order. We will send you a confirmation email
            shortly.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-[#1A1A1A] border border-[rgba(22,101,52,0.3)] p-6 mb-6 rounded-lg" style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white" style={{ fontFamily: "var(--font-bebas)" }}>Order Details</h2>
            <span className="text-sm text-[#888888]" style={{ fontFamily: "var(--font-bebas)" }}>
              #{order.orderNumber}
            </span>
          </div>

          {/* Items */}
          <div className="space-y-4 mb-6">
            {order.items.map((item: typeof order.items[number]) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#0D0D0D] flex-shrink-0 flex items-center justify-center rounded-lg">
                  <Package className="w-6 h-6 text-[#888888]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white">
                    {item.productVariant.product.name}
                  </p>
                  <p className="text-sm text-[#888888]">
                    {item.productVariant.flavor}
                    {item.productVariant.size && ` · ${item.productVariant.size}`}
                  </p>
                  <p className="text-sm text-[#888888]">
                    Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                  </p>
                </div>
                <p className="font-medium text-white">
                  {formatCurrency(item.unitPrice * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-[rgba(22,101,52,0.3)] pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#888888]">Subtotal</span>
              <span className="text-white">
                {formatCurrency(order.subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#888888]">Shipping</span>
              <span className="text-white">
                {order.shippingCost === 0 ? (
                  <span className="text-[#22C55E]">Free</span>
                ) : (
                  formatCurrency(order.shippingCost)
                )}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-[#888888]">Discount</span>
                <span className="text-[#22C55E]">
                  -{formatCurrency(order.discount)}
                </span>
              </div>
            )}
            <div className="flex justify-between font-semibold pt-2 border-t border-[rgba(22,101,52,0.3)]">
              <span className="text-white">Total Paid</span>
              <span className="text-white">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        {order.shippingAddress && (
          <div className="bg-[#1A1A1A] border border-[rgba(22,101,52,0.3)] p-6 mb-6 rounded-lg" style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-[#888888]" />
              <h2 className="font-semibold text-white" style={{ fontFamily: "var(--font-bebas)" }}>Shipping Address</h2>
            </div>
            <div className="text-sm text-[#888888]">
              <p className="font-medium text-white">
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

        {/* Order Status */}
        <div className="bg-[#1A1A1A] border border-[rgba(22,101,52,0.3)] p-6 mb-8 rounded-lg" style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#166534] rounded-full flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-white">
                Order Status: {order.status}
              </p>
              <p className="text-sm text-[#888888]">
                We will notify you when your order ships.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link href="/products" className="flex-1">
            <Button className="w-full bg-[#166534] hover:bg-[#14532D] text-white h-11" style={{ fontFamily: "var(--font-bebas)", clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}>
              Continue Shopping
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button
              variant="outline"
              className="w-full h-11 border-[rgba(22,101,52,0.3)] text-white hover:bg-[#1A1A1A]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
