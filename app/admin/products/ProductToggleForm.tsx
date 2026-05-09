"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export function ProductToggleForm({
  productId,
  isActive,
  field,
}: {
  productId: string;
  isActive: boolean;
  field: "isActive" | "featured";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !isActive }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to toggle:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="focus:outline-none"
    >
      <Badge
        variant={isActive ? "default" : "secondary"}
        className={`cursor-pointer transition-colors ${
          isActive
            ? "bg-[#2E7D32] text-white hover:bg-[#1B5E20]"
            : "bg-[#F3F4F6] text-[#7B9E6B] hover:bg-[#E5E7EB]"
        }`}
      >
        {isActive ? "Yes" : "No"}
      </Badge>
    </button>
  );
}
