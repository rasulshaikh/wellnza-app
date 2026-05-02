import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, Package, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface OrderConfirmationPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderConfirmationPage({
  params,
}: OrderConfirmationPageProps) {
  const { orderId } = await params;

  const order = await db.order.findUnique({
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

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#1C1C1C] mb-2">
            Order Confirmed!
          </h1>
          <p className="text-[#6B6B6B]">
            Thank you for your order. We will send you a confirmation email
            shortly.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white border border-[#E5E5E0] p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#1C1C1C]">Order Details</h2>
            <span className="text-sm text-[#6B6B6B]">
              #{order.orderNumber}
            </span>
          </div>

          {/* Items */}
          <div className="space-y-4 mb-6">
            {order.items.map((item: typeof order.items[number]) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#F5F5F0] flex-shrink-0 flex items-center justify-center">
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

          {/* Totals */}
          <div className="border-t border-[#E5E5E0] pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#6B6B6B]">Subtotal</span>
              <span className="text-[#1C1C1C]">
                {formatCurrency(order.subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
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
              <div className="flex justify-between text-sm">
                <span className="text-[#6B6B6B]">Discount</span>
                <span className="text-green-600">
                  -{formatCurrency(order.discount)}
                </span>
              </div>
            )}
            <div className="flex justify-between font-semibold pt-2 border-t border-[#E5E5E0]">
              <span className="text-[#1C1C1C]">Total Paid</span>
              <span className="text-[#1C1C1C]">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        {order.shippingAddress && (
          <div className="bg-white border border-[#E5E5E0] p-6 mb-6">
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

        {/* Order Status */}
        <div className="bg-[#F5F5F0] border border-[#E5E5E0] p-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0055FF] rounded-full flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-[#1C1C1C]">
                Order Status: {order.status}
              </p>
              <p className="text-sm text-[#6B6B6B]">
                We will notify you when your order ships.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link href="/products" className="flex-1">
            <Button className="w-full bg-[#1C1C1C] hover:bg-[#2D2D2D] text-white h-11">
              Continue Shopping
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button
              variant="outline"
              className="w-full h-11 border-[#E5E5E0]"
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
