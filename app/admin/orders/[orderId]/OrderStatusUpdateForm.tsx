"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ORDER_STATUS_COLORS } from "@/lib/status-colors";
import { OrderStatus } from "@prisma/client";

type Order = {
  id: string;
  status: string;
  trackingNumber: string | null;
  trackingCarrier: string | null;
};

export function OrderStatusUpdateForm({ order }: { order: Order }) {
  const router = useRouter();
  const [status, setStatus] = useState(order.status);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || "");
  const [trackingCarrier, setTrackingCarrier] = useState(order.trackingCarrier || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          trackingNumber: trackingNumber || null,
          trackingCarrier: trackingCarrier || null,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update order");
      }

      setMessage({ type: "success", text: "Order updated successfully" });
      router.refresh();
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update order" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Current Status */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#6B7280]">Current Status:</span>
        <Badge
          className={ORDER_STATUS_COLORS[order.status] || "bg-gray-100 text-gray-800"}
        >
          {order.status}
        </Badge>
      </div>

      {/* Status Select */}
      <div>
        <label className="text-sm font-medium text-[#0A0A0A] block mb-1.5">
          Update Status
        </label>
        <Select value={status} onValueChange={(value) => setStatus(value || status)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="PROCESSING">Processing</SelectItem>
            <SelectItem value="SHIPPED">Shipped</SelectItem>
            <SelectItem value="DELIVERED">Delivered</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
            <SelectItem value="REFUNDED">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tracking Info - Show when status is SHIPPED or higher */}
      {(status === "SHIPPED" || status === "DELIVERED") && (
        <div className="space-y-3 pt-3 border-t border-[#E5E7EB]">
          <p className="text-sm font-medium text-[#0A0A0A]">Tracking Information</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#6B7280] block mb-1">Carrier</label>
              <Input
                value={trackingCarrier}
                onChange={(e) => setTrackingCarrier(e.target.value)}
                placeholder="e.g., Delhivery, BlueDart"
              />
            </div>
            <div>
              <label className="text-xs text-[#6B7280] block mb-1">Tracking Number</label>
              <Input
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
              />
            </div>
          </div>
        </div>
      )}

      {/* Message */}
      {message && (
        <p
          className={`text-sm ${
            message.type === "success" ? "text-[#10B981]" : "text-[#EF4444]"
          }`}
        >
          {message.text}
        </p>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-[#0055FF] hover:bg-[#0044CC]"
      >
        {isSubmitting ? "Updating..." : "Update Status"}
      </Button>
    </form>
  );
}
