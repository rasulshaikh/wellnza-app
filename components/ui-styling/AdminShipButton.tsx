"use client";

import { useState } from "react";
import { Truck, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminShipButton({ orderId, hasShipment }: { orderId: string; hasShipment: boolean }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ awbCode?: string; courierName?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (hasShipment) {
    return (
      <div className="flex items-center gap-2 text-sm" style={{ color: "#2E7D32" }}>
        <CheckCircle2 className="w-4 h-4" />
        <span style={{ fontFamily: "'DM Sans', sans-serif" }}>Shipment already created on Shiprocket</span>
      </div>
    );
  }

  async function handleCreate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/shiprocket/create-shipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setResult({ awbCode: data.awbCode, courierName: data.courierName });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create shipment");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-sm" style={{ color: "#2E7D32" }}>
          <CheckCircle2 className="w-4 h-4" />
          <span style={{ fontFamily: "'DM Sans', sans-serif" }}>Shipment created on Shiprocket</span>
        </div>
        {result.awbCode && (
          <p className="text-xs" style={{ fontFamily: "'DM Sans', sans-serif", color: "#7B9E6B" }}>
            AWB: <span style={{ color: "#1a1a1a", fontWeight: 600 }}>{result.awbCode}</span>
            {result.courierName && ` · ${result.courierName}`}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={handleCreate}
        disabled={loading}
        className="flex items-center gap-2"
        style={{ background: "#166534", color: "#fff" }}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
        {loading ? "Creating shipment…" : "Create Shiprocket Shipment"}
      </Button>
      {error && (
        <p className="text-xs text-red-600" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {error}
        </p>
      )}
    </div>
  );
}
